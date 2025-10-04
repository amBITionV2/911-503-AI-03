# path_generator.py
import networkx as nx
from typing import List, Dict

LEVEL_ORDER = {"beginner": 0, "intermediate": 1, "advanced": 2}

# path_generator.py
import networkx as nx
from typing import List, Dict
from cf_model import predict_rating

LEVEL_ORDER = {"beginner": 0, "intermediate": 1, "advanced": 2}


# path_generator.py
def generate_learning_path_with_cf(courses, query, known_topics, level="beginner", max_courses=10, cf_model=None, cf_weight=1.0):
    """
    Generate learning path dynamically with optional branches and CF personalization.
    """
    LEVEL_ORDER = {"beginner":0,"intermediate":1,"advanced":2}
    threshold = LEVEL_ORDER.get(level, 0)
    filtered = [c for c in courses if LEVEL_ORDER.get(c["difficulty"],0) <= threshold]

    from embedding_model import compute_similarity
    sim_scores = compute_similarity(query + " " + " ".join(known_topics), filtered)
    
    # Compute combined score (similarity + CF)
    course_scores = []
    for idx, c in enumerate(filtered):
        sim_score = sim_scores[idx][1]
        cf_score = cf_model.predict("anon", c["link"]).est if cf_model else 3.0
        # Weight CF influence
        total_score = sim_score + cf_weight * cf_score
        # Boost main_path courses
        if c["path_type"] == "main_path":
            total_score += 1.0
        course_scores.append((c, total_score))
    
    # Sort and take top max_courses
    sorted_courses = [c for c, s in sorted(course_scores, key=lambda x: x[1], reverse=True)][:max_courses]
    
    return sorted_courses
