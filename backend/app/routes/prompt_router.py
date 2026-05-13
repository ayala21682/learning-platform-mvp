from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..crud import prompt_crud
from ..schemas.prompt import Prompt, PromptCreate, PromptUpdate
from ..services.ai_service import get_ai_response
from ..crud.category_crud import get_category
from ..crud.subcategory_crud import get_subcategory
from ..auth import get_current_user

router = APIRouter()

@router.get("/", response_model=list[Prompt])
def read_user_prompts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return prompt_crud.get_prompts_by_user(db, user_id=current_user.id, skip=skip, limit=limit)

@router.get("/all", response_model=list[Prompt])
def read_all_prompts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return prompt_crud.get_prompts(db, skip=skip, limit=limit)

@router.get("/{prompt_id}", response_model=Prompt)
def read_prompt(prompt_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_prompt = prompt_crud.get_prompt(db, prompt_id=prompt_id)
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    if current_user.role != "admin" and db_prompt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return db_prompt

@router.post("/", response_model=Prompt)
def create_prompt(prompt: PromptCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    category = get_category(db, prompt.category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    subcategory = get_subcategory(db, prompt.subcategory_id)
    if subcategory is None:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    ai_response = get_ai_response(prompt.prompt, category.name, subcategory.name)
    return prompt_crud.create_prompt(db=db, prompt=prompt, user_id=current_user.id, response=ai_response)

@router.delete("/{prompt_id}")
def delete_prompt(prompt_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_prompt = prompt_crud.get_prompt(db, prompt_id=prompt_id)
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    if current_user.role != "admin" and db_prompt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    prompt_crud.delete_prompt(db, prompt_id=prompt_id)
    return {"message": "Prompt deleted successfully"}
