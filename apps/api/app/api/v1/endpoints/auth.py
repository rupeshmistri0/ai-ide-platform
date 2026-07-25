from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_async_db
from app.schemas.auth import Token, RefreshTokenRequest, LoginRequest
from app.schemas.user import UserCreate, UserRead
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_async_db)):
    return await AuthService.register_user(db, user_in=user_in)

@router.post("/login", response_model=Token)
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_async_db)
):
    user = await AuthService.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email address or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="User account is inactive")

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    return await AuthService.create_user_session(db, user=user, ip_address=client_ip, user_agent=user_agent)

@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_in: RefreshTokenRequest,
    db: AsyncSession = Depends(get_async_db)
):
    return await AuthService.refresh_tokens(db, refresh_token_str=refresh_in.refresh_token)

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    refresh_in: RefreshTokenRequest,
    db: AsyncSession = Depends(get_async_db)
):
    success = await AuthService.revoke_session(db, refresh_token_str=refresh_in.refresh_token)
    return {"message": "Session successfully revoked" if success else "Session already expired or invalid"}
