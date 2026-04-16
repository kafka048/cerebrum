from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


from app.db.base import Base

class Goal(Base):
    __tablename__ = 'goals'
    __table_args__ = (
    CheckConstraint(
        "status IN ('active', 'completed', 'abandoned')",
        name="goal_status_check"
    ),
    CheckConstraint(
        "priority IN (1, 2, 3)",
        name="goal_priority_check"
    )
   )
    
    goal_id = Column(Integer, primary_key=True)
    goal_name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    priority = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    status = Column(String(25), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), index=True, nullable=False)

    user = relationship("User", back_populates="goals")
    tasks = relationship("Task", back_populates="goal", cascade="all, delete")

