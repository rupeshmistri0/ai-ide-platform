from pydantic import BaseModel, ConfigDict, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    model_config = ConfigDict(from_attributes=True)

class TokenPayload(BaseModel):
    sub: str | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
