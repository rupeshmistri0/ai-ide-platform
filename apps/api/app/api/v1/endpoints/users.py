from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user
from app.db.models.user import User
from app.schemas.user import UserRead

router = APIRouter()

@router.get("/me", response_model=UserRead)
async def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user
