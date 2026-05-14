from pydantic import BaseModel, validator, field_validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    last_name: str
    phone: str

class UserCreate(UserBase):
    password: str
    
    @field_validator('name', 'last_name', mode='before')
    @classmethod
    def validate_hebrew_or_allow_empty(cls, v):
        """Allow empty strings, Hebrew letters, English letters, spaces, and common characters"""
        if not v or not str(v).strip():
            return ""
        
        v_str = str(v).strip()
        # Allow Hebrew, English, spaces, and hyphens
        allowed_chars = set('אבגדהוזחטיכלמנסעפצקרשתABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz- ')
        
        if all(char in allowed_chars for char in v_str):
            return v_str
        
        raise ValueError('שם חייב להכיל רק אותיות עבריות, אנגליות, רווחים או מקפים')

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