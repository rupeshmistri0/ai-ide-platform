from pydantic import BaseModel, ConfigDict, EmailStr

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    model_config = ConfigDict(from_attributes=True)

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenPayload(BaseModel):
    sub: str | None = None
    type: str | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
