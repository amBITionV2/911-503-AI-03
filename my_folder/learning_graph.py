# learning_graph.py
import networkx as nx
from typing import List, Dict

def build_learning_graph(courses: List[Dict], topic_prereqs: Dict[str, List[str]]) -> nx.DiGraph:
    """
    Build a directed graph of courses based on topics and prerequisites.
    """
    G = nx.DiGraph()
    
    # Add courses as nodes
    for idx, course in enumerate(courses):
        course_id = idx  # unique node ID
        G.add_node(course_id, **course)
    
    # Add edges based on topic prerequisites
    for src_id, src_course in G.nodes(data=True):
        src_topics = src_course["topics"]
        for tgt_id, tgt_course in G.nodes(data=True):
            if src_id == tgt_id:
                continue
            tgt_topics = tgt_course["topics"]
            
            # If any target topic has prerequisites that match source topic, add edge
            for tgt_topic in tgt_topics:
                prereqs = topic_prereqs.get(tgt_topic, [])
                if any(pr in src_topics for pr in prereqs):
                    G.add_edge(src_id, tgt_id)
    
    return G
