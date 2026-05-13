from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..auth import get_current_admin_user
from ..database import get_db
from ..crud import subcategory_crud
from ..schemas.subcategory import Subcategory, SubcategoryCreate, SubcategoryUpdate

router = APIRouter()

@router.get("/", response_model=list[Subcategory])
def read_subcategories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    subcategories = subcategory_crud.get_subcategories(db, skip=skip, limit=limit)
    return subcategories

@router.get("/{subcategory_id}", response_model=Subcategory)
def read_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    db_subcategory = subcategory_crud.get_subcategory(db, subcategory_id=subcategory_id)
    if db_subcategory is None:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return db_subcategory

@router.get("/category/{category_id}", response_model=list[Subcategory])
def read_subcategories_by_category(category_id: int, db: Session = Depends(get_db)):
    subcategories = subcategory_crud.get_subcategories_by_category(db, category_id=category_id)
    return subcategories

@router.post("/", response_model=Subcategory)
def create_subcategory(subcategory: SubcategoryCreate, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    return subcategory_crud.create_subcategory(db=db, subcategory=subcategory)

@router.put("/{subcategory_id}", response_model=Subcategory)
def update_subcategory(subcategory_id: int, subcategory: SubcategoryUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    db_subcategory = subcategory_crud.update_subcategory(db, subcategory_id=subcategory_id, subcategory_update=subcategory)
    if db_subcategory is None:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return db_subcategory

@router.delete("/{subcategory_id}")
def delete_subcategory(subcategory_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    db_subcategory = subcategory_crud.delete_subcategory(db, subcategory_id=subcategory_id)
    if db_subcategory is None:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return {"message": "Subcategory deleted successfully"}