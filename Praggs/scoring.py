import re
from .nlp_processing import (
    normalize, split_sentences, keyphrases,
    detect_skills, best_sentence_matches
)

def analyze(resume_text: str, jd_text: str):
    resume_text = (resume_text or "").strip()
    jd_text = (jd_text or "").strip()

    R_norm = normalize(resume_text)
    resume_sents = split_sentences(resume_text)
    jd_targets = list(dict.fromkeys(keyphrases(jd_text, top_k=25)))[:30]

    # semantic matches + missing phrases
    sem_matches, sem_missing = best_sentence_matches(jd_targets, resume_sents, threshold=0.56)

    # keyword coverage (simple)
    matched_kw = [kw for kw in jd_targets if kw in R_norm]
    missing_kw = [kw for kw in jd_targets if kw not in R_norm]

    resume_skills = detect_skills(resume_text)

    ats = {
        "contact_info_present": bool(re.search(r"(\+?\d[\d\-\s]{7,}\d)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})", resume_text)),
        "pdf_text_extractable": len(resume_text.split()) > 40,
        "has_core_sections": any(k in R_norm for k in ["experience","projects","education","skills"]),
        "length_okay_words": 250 <= len(resume_text.split()) <= 900,
    }

    sem_cover = len(sem_matches) / max(1, len(jd_targets))
    kw_cover  = len(matched_kw)  / max(1, len(jd_targets))
    score = int(60 * sem_cover + 40 * kw_cover)

    recs = []
    for s in sem_missing[:5]:
        recs.append(f"Add evidence for **{s}** (project/experience) with metrics.")
    if not ats["contact_info_present"]:
        recs.append("Add a professional email and phone in the header.")
    if not ats["has_core_sections"]:
        recs.append("Add sections: Summary, Skills, Experience, Projects, Education.")
    if not ats["length_okay_words"]:
        recs.append("Keep resume ~1–2 pages (≈350–750 words).")

    highlights = {
        "top_matched": matched_kw[:10],
        "top_missing": missing_kw[:10],
        "resume_skills_detected": resume_skills[:20],
        "jd_targets": jd_targets
    }

    # simple “rewrites” suggestion placeholders
    rewrites = [f"Start a bullet with a strong verb and mention **{s}** with a quantified outcome." for s in sem_missing[:3]]

    return {
        "score": score,
        "matched_keywords": matched_kw,
        "missing_keywords": missing_kw,
        "recommendations": recs,
        "ats_checks": ats,
        "highlights": highlights,
        "semantic_matches": sem_matches,
        "rewritten_examples": rewrites
    }
