from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="Social Impact Platform API",
    description="Backend API for the Social Impact Platform",
    version="1.0.0"
)

# Configure CORS for the frontend
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Social Impact Platform API!",
        "status": "online",
        "frontend_connected": frontend_url
    }

@app.get("/health")
def health_check():
    """
    Healthcheck endpoint used by Docker Compose.
    """
    return {"status": "healthy"}

from app.database import get_current_stats, init_supabase_database

@app.get("/api/impact-stats")
def get_impact_stats():
    """
    Fetch data endpoint for the frontend dashboard via Supabase.
    """
    return get_current_stats()

@app.post("/api/setup-database")
def setup_database():
    """
    Convenience endpoint to initialize the Supabase table with sample data.
    """
    return init_supabase_database()
