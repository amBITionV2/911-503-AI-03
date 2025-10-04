import re, string
import spacy
from sentence_transformers import SentenceTransformer, util
from keybert import KeyBERT
from rapidfuzz import fuzz

SPACY_MODEL = "en_core_web_sm"
nlp = spacy.load(SPACY_MODEL)
st_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
kw_model = KeyBERT(model=st_model)

STOPWORDS = set("""
a an the and or to of in for on with at from by as is are was were be been being
this that those these your you we they he she it their our my i me us them
about into over under out up down off than then so such very more most less least
""".split())

CANON_SKILLS = [
    "python","java","c++","javascript","typescript","react","node","express","spring",
    "django","fastapi","flask","sql","mysql","postgres","mongodb","redis",
    "aws","gcp","azure","docker","kubernetes","git","github","ci/cd","jenkins",
    "pandas","numpy","scikit-learn","xgboost","pytorch","tensorflow",
    "nlp","computer vision","rest api","graphql","microservices"
]

def normalize(text: str) -> str:
    text = text.lower()
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def split_sentences(text: str):
    doc = nlp(text)
    s = [t.text.strip() for t in doc.sents if t.text.strip()]
    return s or re.split(r"(?<=[\.\!\?])\s+", text.strip())

def keyphrases(text: str, top_k: int = 25):
    kp = kw_model.extract_keywords(text, keyphrase_ngram_range=(1,3), stop_words="english", top_n=top_k)
    return [k for k,_ in kp]

def fuzzy_contains(hay: str, needle: str, threshold: int = 88) -> bool:
    return fuzz.token_set_ratio(hay, needle) >= threshold

def detect_skills(text: str):
    tnorm = normalize(text)
    found = [s for s in CANON_SKILLS if fuzzy_contains(tnorm, s)]
    return sorted(set(found), key=lambda x: x.lower())

def best_sentence_matches(jd_phrases, resume_sents, threshold=0.56):
    if not jd_phrases or not resume_sents:
        return [], jd_phrases
    jd_emb = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2").encode(jd_phrases, convert_to_tensor=True, normalize_embeddings=True)
    rs_emb = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2").encode(resume_sents, convert_to_tensor=True, normalize_embeddings=True)
    sim = util.cos_sim(jd_emb, rs_emb)
    matches, missing = [], []
    for i, phrase in enumerate(jd_phrases):
        row = sim[i]
        best_idx = int(row.argmax())
        best_score = float(row[best_idx])
        if best_score >= threshold:
            matches.append({"jd_phrase": phrase, "resume_sentence": resume_sents[best_idx], "similarity": round(best_score, 3)})
        else:
            missing.append(phrase)
    return matches, missing
