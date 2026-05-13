from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class CategoryBase(BaseModel):
    name: str

    @validator('name')
    def validate_name(cls, v):
        if not all('\u0590' <= char <= '\u05FF' or char.isspace() for char in v):
            raise ValueError('שם חייב להכיל רק אותיות עבריות ורווחים')
        return v

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    name: Optional[str] = None

class Category(CategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True