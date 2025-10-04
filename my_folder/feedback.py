# feedback.py
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

RATINGS_FILE = "ratings.csv"

class FeedbackRequest(BaseModel):
    user_id: str
    course_link: str
    rating: int  # 1-5

app = FastAPI()

@app.post("/feedback")
def submit_feedback(feedback: FeedbackRequest):
    # Load existing ratings
    try:
        df = pd.read_csv(RATINGS_FILE)
    except FileNotFoundError:
        df = pd.DataFrame(columns=["user_id", "course_link", "rating"])
    
    # Append new rating
    df = pd.concat([df, pd.DataFrame([feedback.dict()])], ignore_index=True)
    df.to_csv(RATINGS_FILE, index=False)
    
    return {"status": "success", "message": "Feedback saved"}
