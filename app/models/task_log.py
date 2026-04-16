from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint, Date, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base import Base

class TaskLog(Base):
    __tablename__="task_logs"
    __table_args__ = (
        CheckConstraint(
        "status IN ('failed', 'completed', 'skipped')",
        name="task_log_status_check"
    ),
    UniqueConstraint("task_id", "log_date", name="uq_task_log_per_day")
    )

    tasklog_id = Column(Integer, primary_key=True)
    log_date = Column(Date, nullable=False)
    status = Column(String(25), nullable=False)
    reason = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.task_id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)

    task = relationship("Task", back_populates="task_logs")
    user = relationship("User", back_populates="task_logs")