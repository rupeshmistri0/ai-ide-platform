import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str = "member"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    password: Optional[str] = None

class UserRead(UserBase):
    id: uuid.UUID
    is_superuser: bool
    email_verified: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
