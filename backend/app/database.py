import os
from supabase import create_client, Client
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

# Initialize Supabase client
# We use the Service Role Key for backend administrative bypass of RLS (Row Level Security)
supabase_url: str = os.getenv("SUPABASE_URL", "")
supabase_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Initialize an empty client if variables aren't provided yet
supabase: Client | None = None
if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
        logger.info("Supabase client initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")

class ImpactStats(BaseModel):
    total_donations: float
    active_campaigns: int
    volunteers_engaged: int
    lives_impacted: int

def init_supabase_database():
    """
    Helper function to seed the database table 'stats' if it doesn't exist or is empty.
    Creates basic mocked baseline stats directly into the managed Supabase instance.
    """
    if not supabase:
        return {"status": "error", "message": "Supabase client not configured. Check environment variables."}
        
    try:
        # Check if we have an existing row
        response = supabase.table("stats").select("*").limit(1).execute()
        
        if not response.data:
             # Insert baseline statistical data
             baseline_data = {
                 "total_donations": 125000,
                 "active_campaigns": 42,
                 "volunteers_engaged": 1205,
                 "lives_impacted": 8500
             }
             supabase.table("stats").insert(baseline_data).execute()
             return {"status": "success", "message": "Initialized stats table with baseline data."}
             
        return {"status": "success", "message": "Database already contains data."}
    except Exception as e:
        logger.error(f"Error accessing Supabase: {str(e)}")
        return {
            "status": "error", 
            "message": f"Could not query Supabase. Make sure the 'stats' table exists in your project. Error: {str(e)}"
        }

def get_current_stats() -> dict:
    """Fetch real-time stats from Supabase, fallback to hardcoded if not configured"""
    if supabase:
        try:
            response = supabase.table("stats").select("*").limit(1).execute()
            if response.data:
                # Return the first row since it's a global metrics table
                return response.data[0]
        except Exception as e:
            logger.error(f"Failed to fetch stats: {e}")
            
    # Fallback response if Supabase isn't integrated yet or fails
    return {
        "total_donations": 125000,
        "active_campaigns": 42,
        "volunteers_engaged": 1205,
        "lives_impacted": 8500
    }
