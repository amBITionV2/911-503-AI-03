# embedding_model.py
from sentence_transformers import SentenceTransformer, util
import torch

model = SentenceTransformer('all-MiniLM-L6-v2')

def embed_texts(texts):
    return model.encode(texts, convert_to_tensor=True)

def compute_similarity(query_text, courses):
    course_texts = [c['title'] + " " + c.get('snippet', '') for c in courses]
    course_embeddings = embed_texts(course_texts)
    query_embedding = embed_texts([query_text])
    
    similarity_scores = util.cos_sim(query_embedding, course_embeddings)[0]
    # Returns list of (course_index, score)
    return list(enumerate(similarity_scores.tolist()))
