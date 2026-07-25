from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_db
from app.dependencies.auth import get_current_user
from app.db.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.core.security import get_password_hash

router = APIRouter()

@router.get("/me", response_model=UserRead)
async def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserRead)
async def update_user_me(
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.avatar_url is not None:
        current_user.avatar_url = user_in.avatar_url
    if user_in.email is not None:
        current_user.email = user_in.email
    if user_in.password is not None:
        current_user.hashed_password = get_password_hash(user_in.password)

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user
