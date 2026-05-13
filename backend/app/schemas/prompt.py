from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class PromptBase(BaseModel):
    user_id: int
    category_id: int
    subcategory_id: int
    prompt: str
    response: Optional[Dict[str, Any]] = None

class PromptCreate(BaseModel):
    category_id: int
    subcategory_id: int
    prompt: str

class PromptUpdate(BaseModel):
    prompt: Optional[str] = None
    response: Optional[Dict[str, Any]] = None

class Prompt(PromptBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    user_name: Optional[str] = None
    user_last_name: Optional[str] = None
    category_name: Optional[str] = None
    subcategory_name: Optional[str] = None

    class Config:
        from_attributes = True