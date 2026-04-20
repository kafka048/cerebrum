from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.models import TaskLog, User

def calculate_streak(task_id: int, db: Session, current_user: User) -> int:
    logs = db.query(TaskLog.log_date, TaskLog.status).filter(
        TaskLog.task_id == task_id,
        TaskLog.user_id == current_user.user_id
    ).all()

    log_map = {log.log_date : log.status for log in logs}

    
    if date.today() not in log_map:
        current_day = date.today() - timedelta(days=1)
    else:
        current_day = date.today()

    streak = 0

    while True:
        status = log_map.get(current_day)
        if status != "completed":
            break
        else:
            streak += 1
            current_day -= timedelta(days=1)

    
    return streak



