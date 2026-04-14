from app.models import User, TaskLog
from sqlalchemy.orm import Session
from typing import List

def get_tasklog(tasklog_id: int, db: Session, current_user: User) -> TaskLog | None:
    tasklog = db.query(TaskLog).filter(
        TaskLog.tasklog_id == tasklog_id,
        TaskLog.user_id == current_user.user_id
    ).first()

    if tasklog is None:
        return None
    
    return tasklog

def get_all_tasklogs(task_id: int, db:Session, current_user: User) -> List[TaskLog]:
    tasklogs = db.query(TaskLog).filter(
        TaskLog.task_id == task_id,
        TaskLog.user_id == current_user.user_id
    ).all()

    return tasklogs


    
