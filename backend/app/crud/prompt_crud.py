from sqlalchemy.orm import Session, joinedload
from ..models.prompt import Prompt
from ..schemas.prompt import PromptCreate, PromptUpdate

def get_prompts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Prompt).options(joinedload(Prompt.user), joinedload(Prompt.category), joinedload(Prompt.subcategory)).offset(skip).limit(limit).all()

def get_prompts_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Prompt).filter(Prompt.user_id == user_id).options(joinedload(Prompt.user), joinedload(Prompt.category), joinedload(Prompt.subcategory)).offset(skip).limit(limit).all()

def get_prompt(db: Session, prompt_id: int):
    return db.query(Prompt).options(joinedload(Prompt.user), joinedload(Prompt.category), joinedload(Prompt.subcategory)).filter(Prompt.id == prompt_id).first()

def create_prompt(db: Session, prompt: PromptCreate, user_id: int, response: dict):
    db_prompt = Prompt(
        user_id=user_id,
        category_id=prompt.category_id,
        subcategory_id=prompt.subcategory_id,
        prompt=prompt.prompt,
        response=response
    )
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt

def update_prompt(db: Session, prompt_id: int, prompt_update: PromptUpdate):
    db_prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if db_prompt:
        update_data = prompt_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_prompt, field, value)
        db.commit()
        db.refresh(db_prompt)
    return db_prompt

def delete_prompt(db: Session, prompt_id: int):
    db_prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if db_prompt:
        db.delete(db_prompt)
        db.commit()
    return db_prompt