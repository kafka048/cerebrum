from typing import Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import TaskLog, User, Task, Goal


def calculate_completion_rate(task_id: int, db: Session, current_user: User) -> dict[str, Any] | None:
    task = db.query(Task).join(Goal).filter(
        Task.task_id == task_id,
        Goal.user_id == current_user.user_id
    ).first()

    if task is None:
        return None
    
    total_logs = db.query(func.count(TaskLog.tasklog_id)).filter(
        TaskLog.task_id == task_id,
        TaskLog.user_id == current_user.user_id
        ).scalar()

    completed_logs = db.query(func.count(TaskLog.tasklog_id)).filter(
        TaskLog.task_id == task_id,
        TaskLog.user_id == current_user.user_id,
        TaskLog.status == "completed"
        ).scalar()
    
    if total_logs == 0:
        completion_rate = 0.0
    else:
        completion_rate = (completed_logs/total_logs) * 100

    return {
        'total_logs' : total_logs,
        'completed_logs' : completed_logs,
        'completion_rate' : round(completion_rate, 2)
    }