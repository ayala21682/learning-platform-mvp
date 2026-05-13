from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    last_name: str
    phone: str

    @validator('name', 'last_name')
    def validate_name(cls, v):
        if not all('\u0590' <= char <= '\u05FF' or char.isspace() for char in v):
            raise ValueError('שם חייב להכיל רק אותיות עבריות ורווחים')
        return v

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    role: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True