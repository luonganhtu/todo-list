from sqlalchemy import Column, Integer, String, Boolean
from src.db.base import Base
from datetime import datetime
from sqlalchemy.types import DateTime
from sqlalchemy import ForeignKey
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), unique=True, nullable=False)
    description = Column(String(120), nullable=False)
    completed = Column(Boolean, default=False)
    due_date = Column(DateTime, nullable=False)
    priority = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)