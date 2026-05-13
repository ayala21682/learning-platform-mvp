from sqlalchemy.orm import Session
from ..models.subcategory import Subcategory
from ..schemas.subcategory import SubcategoryCreate, SubcategoryUpdate

def get_subcategories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Subcategory).offset(skip).limit(limit).all()

def get_subcategory(db: Session, subcategory_id: int):
    return db.query(Subcategory).filter(Subcategory.id == subcategory_id).first()

def get_subcategories_by_category(db: Session, category_id: int):
    return db.query(Subcategory).filter(Subcategory.category_id == category_id).all()

def create_subcategory(db: Session, subcategory: SubcategoryCreate):
    db_subcategory = Subcategory(**subcategory.dict())
    db.add(db_subcategory)
    db.commit()
    db.refresh(db_subcategory)
    return db_subcategory

def update_subcategory(db: Session, subcategory_id: int, subcategory_update: SubcategoryUpdate):
    db_subcategory = db.query(Subcategory).filter(Subcategory.id == subcategory_id).first()
    if db_subcategory:
        update_data = subcategory_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_subcategory, field, value)
        db.commit()
        db.refresh(db_subcategory)
    return db_subcategory

def delete_subcategory(db: Session, subcategory_id: int):
    db_subcategory = db.query(Subcategory).filter(Subcategory.id == subcategory_id).first()
    if db_subcategory:
        db.delete(db_subcategory)
        db.commit()
    return db_subcategory