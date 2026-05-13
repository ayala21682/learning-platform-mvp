from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..auth import get_current_admin_user
from ..database import get_db
from ..crud import category_crud
from ..schemas.category import Category, CategoryCreate, CategoryUpdate

router = APIRouter()

@router.get("/", response_model=list[Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = category_crud.get_categories(db, skip=skip, limit=limit)
    return categories

@router.get("/{category_id}", response_model=Category)
def read_category(category_id: int, db: Session = Depends(get_db)):
    db_category = category_crud.get_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.post("/", response_model=Category)
def create_category(category: CategoryCreate, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    return category_crud.create_category(db=db, category=category)

@router.put("/{category_id}", response_model=Category)
def update_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    db_category = category_crud.update_category(db, category_id=category_id, category_update=category)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    db_category = category_crud.delete_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}