from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class SubcategoryBase(BaseModel):
    name: str
    category_id: int

    @validator('name')
    def validate_name(cls, v):
        if not all('\u0590' <= char <= '\u05FF' or char.isspace() for char in v):
            raise ValueError('שם חייב להכיל רק אותיות עבריות ורווחים')
        return v

class SubcategoryCreate(SubcategoryBase):
    pass

class SubcategoryUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None

class Subcategory(SubcategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True