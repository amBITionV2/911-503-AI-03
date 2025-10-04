import io
from fastapi import UploadFile
import PyPDF2
import docx2txt

def read_resume(file: UploadFile) -> str:
    """
    Read resume content from PDF/DOCX/TXT-like uploads and return plain text.
    """
    content = file.file.read()
    file.file.seek(0)

    filename = (file.filename or "").lower()

    if filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        pages = []
        for p in reader.pages:
            pages.append(p.extract_text() or "")
        return "\n".join(pages)

    if filename.endswith(".docx"):
        tmp_path = "/tmp/_resume.docx"
        with open(tmp_path, "wb") as f:
            f.write(content)
        return docx2txt.process(tmp_path) or ""

    # Fallback: treat as text
    try:
        return content.decode("utf-8", errors="ignore")
    except Exception:
        return ""
