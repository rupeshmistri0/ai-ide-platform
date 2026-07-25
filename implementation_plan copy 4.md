# JWT Authentication with Refresh Tokens & Protected Routes Implementation Plan

This plan implements secure JWT Authentication for the FastAPI backend (`apps/api`) with Access Tokens, Refresh Tokens, Passlib Bcrypt password hashing, Pydantic v2 DTOs, SQLAlchemy 2.0 Async database integration, and protected route dependencies.

## User Review Required

> [!IMPORTANT]
> - **Dual Token Architecture**: Separate Short-Lived Access Tokens (60 mins) and Long-Lived Refresh Tokens (30 days) signed with HS256 JWT.
> - **Session Revocation Tracking**: Refresh tokens are stored and tracked in the `user_sessions` PostgreSQL database table to support remote logout and token revocation.
> - **Automatic User Preferences Initialization**: New user registrations automatically initialize a 1:1 `UserSetting` default preference record.

---

## 🔐 Authentication & Token Lifecycle Layout

```
                        ┌────────────────────────┐
                        │   POST /auth/register  │
                        └───────────┬────────────┘
                                    │
                                    ▼
┌──────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐
│  User Created    ├───►│ Default UserSettings   ├───►│   Returns UserRead     │
└──────────────────┘    └────────────────────────┘    └────────────────────────┘

                        ┌────────────────────────┐
                        │    POST /auth/login    │
                        └───────────┬────────────┘
                                    │
                                    ▼
┌──────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐
│ Verify Password  ├───►│ Create UserSession DB  ├───►│  Returns Access Token  │
└──────────────────┘    └────────────────────────┘    │    + Refresh Token     │
                                                      └────────────────────────┘

                        ┌────────────────────────┐
                        │   POST /auth/refresh   │
                        └───────────┬────────────┘
                                    │
                                    ▼
┌──────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐
│ Validate Refresh ├───►│ Check UserSession in DB├───►│  Returns New Tokens    │
└──────────────────┘    └────────────────────────┘    └────────────────────────┘
```

---

## ⚡ Core Component Changes

### 1. Security & Token Utilities (`app/core/security.py` & `app/core/config.py`)
- Config parameters: `ACCESS_TOKEN_EXPIRE_MINUTES = 60`, `REFRESH_TOKEN_EXPIRE_DAYS = 30`.
- Functions: `create_access_token(subject, expires_delta)`, `create_refresh_token(subject, expires_delta)`, `verify_token(token, token_type)`.

### 2. Pydantic v2 DTO Schemas (`app/schemas/auth.py` & `app/schemas/user.py`)
- `Token`: `access_token: str`, `refresh_token: str`, `token_type: str = "bearer"`, `expires_in: int`.
- `RefreshTokenRequest`: `refresh_token: str`.
- `UserCreate`: `email: EmailStr`, `password: str`, `full_name: Optional[str]`.
- `UserRead`: `id: uuid.UUID`, `email: EmailStr`, `full_name: Optional[str]`, `role: str`, `is_active: bool`, `email_verified: bool`, `created_at: datetime`.

### 3. Auth Service Business Logic (`app/services/auth_service.py`)
- `register_user(db, user_in)`: Creates user with hashed password + initializes default `UserSetting`.
- `authenticate_user(db, email, password)`: Verifies bcrypt password hash against stored DB record.
- `create_user_session(db, user_id, ip_address, user_agent)`: Generates access/refresh tokens and persists session in `user_sessions` table.
- `refresh_tokens(db, refresh_token)`: Validates JWT signature, checks active session in `user_sessions`, and issues new access/refresh tokens.
- `revoke_session(db, refresh_token)`: Marks `is_revoked = True` in `user_sessions`.

### 4. API Endpoints (`app/api/v1/endpoints/auth.py` & `users.py`)
- `POST /api/v1/auth/register`: Register new user.
- `POST /api/v1/auth/login`: Authenticate user & receive tokens.
- `POST /api/v1/auth/refresh`: Exchange refresh token for new access token.
- `POST /api/v1/auth/logout`: Revoke active session.
- `GET /api/v1/users/me`: Protected route returning current authenticated user profile.
- `PUT /api/v1/users/me`: Protected route updating current user profile.

---

## 📋 Proposed Changes

### Core Security & Schemas
#### [MODIFY] [apps/api/app/core/config.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/core/config.py)
#### [MODIFY] [apps/api/app/core/security.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/core/security.py)
#### [MODIFY] [apps/api/app/schemas/auth.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/schemas/auth.py)
#### [MODIFY] [apps/api/app/schemas/user.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/schemas/user.py)

### Dependencies & Services
#### [MODIFY] [apps/api/app/dependencies/auth.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/dependencies/auth.py)
#### [NEW] [apps/api/app/services/auth_service.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/services/auth_service.py)

### API Endpoints
#### [MODIFY] [apps/api/app/api/v1/endpoints/auth.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/api/v1/endpoints/auth.py)
#### [MODIFY] [apps/api/app/api/v1/endpoints/users.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/api/v1/endpoints/users.py)

---

## 🔍 Verification Plan

### Automated Checks
- Run Python syntax compilation: `python -m py_compile app/api/v1/endpoints/auth.py`.

### Manual Verification
- Test Registration (`/api/v1/auth/register`), Login (`/api/v1/auth/login`), Refresh (`/api/v1/auth/refresh`), and Protected User Profile (`/api/v1/users/me`).
