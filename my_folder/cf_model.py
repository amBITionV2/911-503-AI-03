# cf_model.py
from surprise import Dataset, Reader, SVD
import pandas as pd

def train_cf_model():
    """
    Example: trains a simple collaborative filtering model.
    Replace with real user-item ratings for production.
    """
    # Dummy data: user-item ratings
    ratings = [
        ("user1", "course1", 5),
        ("user1", "course2", 4),
        ("user2", "course1", 3),
        ("user2", "course3", 4),
    ]
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(pd.DataFrame(ratings, columns=["user", "item", "rating"]), reader)
    trainset = data.build_full_trainset()
    model = SVD()
    model.fit(trainset)
    return model

def predict_rating(model, user_id, course_link):
    if model is None:
        return 3.0  # default rating if no model yet
    return model.predict(user_id, course_link).est