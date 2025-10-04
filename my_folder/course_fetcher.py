# course_fetcher.py
from serpapi import GoogleSearch
from typing import List, Dict
import os

SERPAPI_KEY = "b65c1d77a716733c37cce04f4ee74bfe07c116d76ebe2c57b0b2c444f4d926a0"

def fetch_courses(topic: str, num_results: int = 10) -> List[Dict]:
    """
    Fetch candidate courses/resources from Google SERP for a given topic.
    """
    params = {
        "engine": "google",
        "q": topic + " course tutorial",
        "api_key": SERPAPI_KEY,
        "num": num_results,
    }
    
    search = GoogleSearch(params)
    results = search.get_dict()
    
    courses = []
    for result in results.get("organic_results", []):
        title = result.get("title")
        link = result.get("link")
        snippet = result.get("snippet")
        if title and link:
            courses.append({
                "title": title,
                "link": link,
                "snippet": snippet
            })
    
    return courses
