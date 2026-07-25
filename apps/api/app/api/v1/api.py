from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, projects, websockets, health

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(websockets.router, tags=["websockets"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
