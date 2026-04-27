from typing import List
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.models import User, TaskLog, Task, Goal

def count_missed_days(task_id: int, db: Session, current_user: User) -> List[date] | None:

    task = db.query(Task).join(Goal).filter(
        Task.task_id == task_id,
        Goal.user_id == current_user.user_id
    ).first()

    if task is None:
        return None 
    
    logs = db.query(TaskLog.log_date, TaskLog.status).filter(
        TaskLog.task_id == task_id,
        TaskLog.user_id == current_user.user_id
    ).all()

    task = db.query(Task).join(Goal).filter(
        Task.task_id == task_id,
        Goal.user_id == current_user.user_id
        ).first()
    
    if task is None:
        return []
    
    log_maps = {log.log_date: log.status for log in logs}

    start_date = task.created_at.date()
    current_day = date.today()

    missed_days = []

    while current_day>=start_date:
        status = log_maps.get(current_day)

        if status != "completed":
            missed_days.append(current_day) # type: ignore
        
        current_day -= timedelta(days=1)
    

    return missed_days # type: ignore
        
        
        



    

    