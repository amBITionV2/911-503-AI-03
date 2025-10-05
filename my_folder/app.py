from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import random

from course_fetcher import fetch_courses
from metadata_extractor import extract_metadata_with_branches
from path_generator import generate_learning_path_with_cf
from cf_model import train_cf_model

app = FastAPI()

# CORS (relax for dev; restrict in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache CF model
cf_model = train_cf_model()


class LearningPathRequest(BaseModel):
    topic: str
    level: str                # IGNORED deliberately
    known_topics: List[str]
    max_courses: int = 10
    user_id: str = "anon"


# -------------------------
# Relevance helpers
# -------------------------
def _norm(s: Any) -> str:
    return str(s or "").strip().lower()

def _string_title(c: Dict[str, Any]) -> str:
    title = c.get("title") or c.get("name") or c.get("course") or c.get("id") or "Untitled"
    link  = c.get("link")
    label = f"{title}"
    if link:
        label += f" ({link})"
    return label

def _collect_text_fields(c: Dict[str, Any]) -> str:
    fields = []
    for k in ("title", "name", "description", "summary", "category"):
        if c.get(k):
            fields.append(_norm(c.get(k)))
    for k in ("topics", "tags", "skills", "keywords", "prereqs", "prerequisites"):
        v = c.get(k)
        if isinstance(v, list):
            fields.extend([_norm(x) for x in v])
        elif isinstance(v, str):
            fields.append(_norm(v))
    return " ".join(fields)

def _topic_keywords(topic: str) -> List[str]:
    t = _norm(topic)
    # very light synonyms/expansions; you can extend this list per domain
    expansions = {
        "deep learning": ["deep learning", "neural network", "neural networks", "cnn", "rnn", "lstm",
                          "transformer", "pytorch", "tensorflow", "backpropagation", "autoencoder"],
        "machine learning": ["machine learning", "ml", "supervised", "unsupervised", "regression", "classification"],
        "data science": ["data science", "data analysis", "pandas", "numpy", "visualization", "eda"],
    }
    keys = [t]
    for k, vals in expansions.items():
        if k in t:
            keys.extend(vals)
    return list(dict.fromkeys(keys))  # dedupe, keep order

def _is_relevant(course: Dict[str, Any], topic: str) -> bool:
    """Keyword guard: course must include at least one topic keyword."""
    text = _collect_text_fields(course)
    if not text:
        return False
    for kw in _topic_keywords(topic):
        if kw in text:
            return True
    return False

def _deprioritize_known(courses: List[Dict[str, Any]], known: List[str]) -> List[Dict[str, Any]]:
    known_set = {_norm(k) for k in (known or []) if k}
    if not known_set:
        return courses

    def mostly_known(c: Dict[str, Any]) -> bool:
        text = _collect_text_fields(c)
        if not text:
            return False
        # simple heuristic: if every token from a small topic list is present, treat as mostly-known
        hits = sum(1 for k in known_set if k and k in text)
        return hits >= max(1, min(3, len(known_set)))

    front, back = [], []
    for c in courses:
        (back if mostly_known(c) else front).append(c)
    return front + back

def _ensure_min_pool(courses: List[Dict[str, Any]], target: int, topic: str) -> List[Dict[str, Any]]:
    """Ensure at least `target` items; fetch more for the same topic if needed; keep only relevant."""
    rel = [c for c in courses if _is_relevant(c, topic)]
    if len(rel) >= target:
        return rel
    need = target - len(rel)
    more = fetch_courses(topic, max(need * 3, 15))
    # relevance filter + de-dup by (link, title)
    seen = set((c.get("link"), c.get("title")) for c in rel)
    for c in more:
        if not _is_relevant(c, topic):
            continue
        key = (c.get("link"), c.get("title"))
        if key not in seen:
            rel.append(c)
            seen.add(key)
        if len(rel) >= target:
            break
    return rel

def _sequential_levels(main_courses: List[Dict[str, Any]], desired_levels: int) -> List[Dict[str, Any]]:
    """Chunk courses sequentially into N levels (N in [3..5])."""
    desired_levels = max(3, min(5, desired_levels))
    n = len(main_courses)
    if n == 0:
        return []

    base = max(1, n // desired_levels)
    remainder = n - base * desired_levels
    sizes = [base] * desired_levels
    for i in range(remainder):
        sizes[i] += 1

    blocks = []
    idx = 0
    for level_idx, size in enumerate(sizes, start=1):
        slice_courses = main_courses[idx: idx + size]
        idx += size
        if not slice_courses:
            continue
        blocks.append({
            "level": level_idx,
            "courses": [_string_title(c) for c in slice_courses]
        })
    return [b for b in blocks if b["courses"]]

def _pick_optionals(enriched: List[Dict[str, Any]], topic: str, max_optional: int = 3) -> List[str]:
    """Pick 1–3 relevant optional courses; skip entirely if none are relevant."""
    optionals = [c for c in enriched if _norm(c.get("path_type")) != "main_path"]
    optionals = [c for c in optionals if _is_relevant(c, topic)]
    if not optionals:
        return []
    random.shuffle(optionals)
    k = min(max(1, max_optional), 3)
    return [_string_title(c) for c in optionals[:k]]


# Explicit OPTIONS (defensive)
@app.options("/learning_path")
def options_learning_path():
    resp = PlainTextResponse("")
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return resp


@app.post("/learning_path")
def get_learning_path(req: LearningPathRequest):
    # 1) Fetch a bigger, TOPIC-SCOPED pool for both main and optional results
    topic_pool_size = max(60, req.max_courses * 6)
    # Optional pool now derived from the actual topic instead of generic "core fundamentals"
    optional_queries = [
        f"{req.topic} fundamentals",
        f"{req.topic} essentials",
        f"introduction to {req.topic}",
        f"{req.topic} basics",
    ]

    main_pool = fetch_courses(req.topic, topic_pool_size)
    optional_pool = []
    for q in optional_queries:
        optional_pool += fetch_courses(q, 12)  # small batches per query

    # 2) Extract metadata / branching
    goal_topics = [req.topic] + (req.known_topics or [])
    enriched = extract_metadata_with_branches(
        main_pool,
        goal_topics,
        optional_pool,
        5,  # top_n_optional
    )

    # 3) Generate ordered list (IGNORE req.level)
    path_courses = generate_learning_path_with_cf(
        enriched,
        req.topic,
        req.known_topics or [],
        "beginner",                  # neutral placeholder; we ignore user 'level'
        max(req.max_courses, 12),    # ensure enough for 3–5 levels
        cf_model,
        0.35,
    )

    # 4) Relevance filter & deprioritize known
    path_courses = [c for c in path_courses if _is_relevant(c, req.topic)]
    path_courses = _deprioritize_known(path_courses, req.known_topics or [])

    # 5) Ensure we have enough items to form 3–5 levels
    target_items = max(12, req.max_courses)
    path_courses = _ensure_min_pool(path_courses, target_items, req.topic)

    # 6) Decide levels (3..5) based on pool size
    n = len(path_courses)
    desired_levels = 5 if n >= 20 else 4 if n >= 15 else 3
    blocks = _sequential_levels(path_courses, desired_levels)

    # 7) Build Optional block from relevant optionals; omit if none relevant
    optional_block = _pick_optionals(enriched, req.topic, max_optional=3)
    if optional_block:
        blocks.append({"level": "Optional", "courses": optional_block})

    return {"learning_path": blocks}


@app.get("/health")
def health():
    return {"status": "ok"}




#resume

