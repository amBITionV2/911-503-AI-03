import re
from embedding_model import compute_similarity

def extract_metadata_with_branches(courses, goal_topics, optional_courses=[], top_n_optional=5):
    enriched = []
    
    # Enrich main courses
    for course in courses:
        text = (course.get("title","") + " " + course.get("snippet","")).lower()
        words = re.findall(r'\b\w+\b', text)
        topics = [w.capitalize() for w in words if len(w) > 3]
        difficulty = "beginner"
        if any(k in text for k in ["intermediate","practice"]):
            difficulty = "intermediate"
        elif any(k in text for k in ["advanced","masterclass","deep dive"]):
            difficulty = "advanced"
        
        enriched.append({
            **course,
            "topics": topics,
            "difficulty": difficulty,
            "path_type": "main_path",
            "category": topics[0] if topics else "General"
        })
    
    # Enrich optional courses (fundamentals)
    if optional_courses:
        # Compute similarity with goal_topics to prioritize relevant fundamentals
        similarity_scores = compute_similarity(" ".join(goal_topics), optional_courses)
        # Sort by similarity and take top N
        top_indices = sorted(range(len(optional_courses)), key=lambda i: similarity_scores[i][1], reverse=True)[:top_n_optional]
        
        for i in top_indices:
            course = optional_courses[i]
            text = (course.get("title","") + " " + course.get("snippet","")).lower()
            words = re.findall(r'\b\w+\b', text)
            topics = [w.capitalize() for w in words if len(w) > 3]
            difficulty = "beginner"
            if any(k in text for k in ["intermediate","practice"]):
                difficulty = "intermediate"
            elif any(k in text for k in ["advanced","masterclass","deep dive"]):
                difficulty = "advanced"
            enriched.append({
                **course,
                "topics": topics,
                "difficulty": difficulty,
                "path_type": "optional_branch",
                "category": topics[0] if topics else "General"
            })
    
    return enriched
