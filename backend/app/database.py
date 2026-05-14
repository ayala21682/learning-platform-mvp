from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# קריאת משתני סביבה או ערכי ברירת מחדל
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/learning_platform")

engine = create_engine(DATABASE_URL)

# Set UTF-8 encoding for all connections
@event.listens_for(engine, "connect")
def set_utf8(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("SET client_encoding TO 'UTF8'")
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# פונקציה לקבלת session של מסד הנתונים
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()