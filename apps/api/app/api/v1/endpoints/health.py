import time
import urllib.request
import asyncio
from fastapi import APIRouter, Depends
from sqlalchemy.sql import text

from app.core.config import settings
from app.db.session import AsyncSessionLocal

router = APIRouter()

# Records when the module is first loaded at application startup
START_TIME = time.time()

async def check_database() -> dict:
    try:
        async with AsyncSessionLocal() as session:
            # Executes SELECT 1 to verify connectivity
            await session.execute(text("SELECT 1"))
        return {"status": "healthy", "error": None}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

async def check_ollama() -> dict:
    try:
        # Pings Ollama base url
        # Use urllib wrapped in asyncio.to_thread to prevent blocking the event loop
        def ping():
            with urllib.request.urlopen(settings.OLLAMA_BASE_URL, timeout=2.0) as conn:
                return conn.getcode()
                
        status_code = await asyncio.to_thread(ping)
        if status_code == 200:
            return {"status": "healthy", "error": None}
        return {"status": "unhealthy", "error": f"Ollama returned status code {status_code}"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@router.get("")
async def get_health():
    db_check, ollama_check = await asyncio.gather(
        check_database(),
        check_ollama()
    )
    
    uptime = time.time() - START_TIME
    
    # Determine overall status
    overall_healthy = (
        db_check["status"] == "healthy" and 
        ollama_check["status"] == "healthy"
    )
    
    return {
        "status": "healthy" if overall_healthy else "degraded",
        "version": settings.VERSION,
        "uptime_seconds": round(uptime, 2),
        "checks": {
            "database": db_check,
            "ollama": ollama_check
        }
    }
