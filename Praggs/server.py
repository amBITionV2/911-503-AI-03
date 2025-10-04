from fastapi import FastAPI, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

# ... your existing imports (read_resume or inline), and analyze import ...

app = FastAPI(title="NLP Resume Analyzer", version="2.0")
@app.get("/analyze")
def analyze_help():
    return {"ok": False, "use": "POST /analyze with multipart form-data fields: resume (file), jd (text)."}

# (NEW) make /analyze and /analyze/ behave the same
app.router.redirect_slashes = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],          # must include OPTIONS
    allow_headers=["*"],
)

# (NEW) Handle preflight cleanly if the browser sends it
@app.options("/analyze")
def options_analyze():
    return Response(status_code=204)

# (optional) also handle trailing slash explicitly
@app.options("/analyze/")
def options_analyze_slash():
    return Response(status_code=204)

# ---------------- your existing routes ----------------

class AnalysisResponse(BaseModel):
    score: int
    matched_keywords: List[str]
    missing_keywords: List[str]
    recommendations: List[str]
    ats_checks: Dict[str, Any]
    highlights: Dict[str, Any]
    semantic_matches: List[Dict[str, Any]]
    rewritten_examples: List[str]

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    jd: str = Form(...)
):
    resume_text = read_resume(resume)
    result = analyze(resume_text, jd)
    return AnalysisResponse(**result)

# (optional) mirror POST on slash route to be extra-forgiving
@app.post("/analyze/")
async def analyze_resume_slash(
    resume: UploadFile = File(...),
    jd: str = Form(...)
):
    resume_text = read_resume(resume)
    result = analyze(resume_text, jd)
    return result

@app.get("/")
def root():
    return {"ok": True, "message": "NLP Resume Analyzer API. POST /analyze with resume + jd."}