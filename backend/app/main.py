import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .routes.user_router import router as user_router
from .routes.prompt_router import router as prompt_router
from .routes.category_router import router as category_router
from .routes.subcategory_router import router as subcategory_router
from .routes.auth_router import router as auth_router
from .crud.user_crud import get_user_by_phone, create_user
from .schemas.user import UserCreate


app = FastAPI(title="Learning Platform API", version="1.0.0")

# הוספת CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # בייצור, הגדר דומיינים ספציפיים
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# רישום הראוטרים
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(prompt_router, prefix="/prompts", tags=["prompts"])
app.include_router(category_router, prefix="/categories", tags=["categories"])
app.include_router(subcategory_router, prefix="/subcategories", tags=["subcategories"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.on_event("startup")
def startup_event():
    admin_name = os.getenv("FIRST_ADMIN_NAME")
    admin_last_name = os.getenv("FIRST_ADMIN_LAST_NAME")
    admin_phone = os.getenv("FIRST_ADMIN_PHONE")
    admin_password = os.getenv("FIRST_ADMIN_PASSWORD")
    if admin_name and admin_phone and admin_password:
        if not admin_last_name:
            parts = admin_name.strip().split()
            if len(parts) > 1:
                admin_last_name = " ".join(parts[1:])
                admin_name = parts[0]
            else:
                admin_last_name = "מנהל"
        db = SessionLocal()
        try:
            existing_admin = get_user_by_phone(db, admin_phone)
            if existing_admin is None:
                # Create new admin
                create_user(db, UserCreate(name=admin_name, last_name=admin_last_name, phone=admin_phone, password=admin_password), role="admin")
            else:
                # Update existing admin password and details
                from .security import get_password_hash
                existing_admin.name = admin_name
                existing_admin.last_name = admin_last_name
                existing_admin.hashed_password = get_password_hash(admin_password)
                db.commit()
        except Exception as e:
            print(f"Admin setup error: {e}")
        finally:
            db.close()

@app.get("/")
async def root():
    return {"message": "ברוכים הבאים לפלטפורמת הלמידה"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)