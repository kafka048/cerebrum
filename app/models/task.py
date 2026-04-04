from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base import Base

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True)
    task_name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    goal_id = Column(Integer, ForeignKey("goals.goal_id"), nullable=False, index=True)

    goal = relationship("Goal", back_populates="tasks")
    task_logs = relationship("TaskLog", back_populates="task")
    
