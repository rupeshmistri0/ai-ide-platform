import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
    hash_token
)
from app.db.models.user import User
from app.db.models.setting import UserSetting
from app.db.models.session import UserSession
from app.schemas.user import UserCreate, UserUpdate
from app.schemas.auth import Token

class AuthService:
    @staticmethod
    async def register_user(db: AsyncSession, user_in: UserCreate) -> User:
        # Check if email exists
        result = await db.execute(select(User).where(User.email == user_in.email))
        if result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )

        db_user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name,
            avatar_url=user_in.avatar_url,
            role=user_in.role,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)

        # Initialize default UserSetting record
        default_setting = UserSetting(user_id=db_user.id)
        db.add(default_setting)
        await db.commit()

        return db_user

    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    async def create_user_session(
        db: AsyncSession,
        user: User,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Token:
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        
        token_hash_val = hash_token(refresh_token)
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        session = UserSession(
            user_id=user.id,
            token_hash=token_hash_val,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=expires_at,
            is_revoked=False
        )
        db.add(session)
        await db.commit()

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

    @staticmethod
    async def refresh_tokens(db: AsyncSession, refresh_token_str: str) -> Token:
        payload = verify_token(refresh_token_str, expected_type="refresh")
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token"
            )

        user_id_str = payload.get("sub")
        try:
            user_id = uuid.UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(status_code=401, detail="Invalid token payload")

        token_hash_val = hash_token(refresh_token_str)
        result = await db.execute(
            select(UserSession).where(
                UserSession.user_id == user_id,
                UserSession.token_hash == token_hash_val,
                UserSession.is_revoked == False
            )
        )
        session = result.scalars().first()
        if not session or session.expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=401, detail="Refresh token session revoked or expired")

        # Revoke old session
        session.is_revoked = True
        await db.commit()

        # Get user
        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalars().first()
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User account disabled or deleted")

        # Issue new tokens and session
        return await AuthService.create_user_session(db, user, session.ip_address, session.user_agent)

    @staticmethod
    async def revoke_session(db: AsyncSession, refresh_token_str: str) -> bool:
        payload = verify_token(refresh_token_str, expected_type="refresh")
        if not payload:
            return False

        token_hash_val = hash_token(refresh_token_str)
        result = await db.execute(
            select(UserSession).where(UserSession.token_hash == token_hash_val)
        )
        session = result.scalars().first()
        if session:
            session.is_revoked = True
            await db.commit()
            return True
        return False
