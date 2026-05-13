from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"), nullable=False)
    prompt = Column(Text, nullable=False)
    response = Column(JSON, nullable=True)  # אובייקט JSON לתגובה
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # קשרים
    user = relationship("User")
    category = relationship("Category")
    subcategory = relationship("Subcategory")

    @property
    def user_name(self):
        return self.user.name if self.user else None

    @property
    def user_last_name(self):
        return self.user.last_name if self.user else None

    @property
    def category_name(self):
        return self.category.name if self.category else None

    @property
    def subcategory_name(self):
        return self.subcategory.name if self.subcategory else None