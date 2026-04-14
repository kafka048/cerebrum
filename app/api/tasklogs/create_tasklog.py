from typing import Literal
from app.schemas.task_log import TaskLogCreate
from app.models import User, TaskLog
from sqlalchemy.orm import Session


def create_tasklog(tasklog_data: TaskLogCreate, db: Session, current_user: User) -> TaskLog | None | Literal["duplicate"]:
    existing_tasklog = db.query(TaskLog).filter(
        TaskLog.task_id == tasklog_data.task_id,
        TaskLog.log_date == tasklog_data.log_date,
        TaskLog.user_id == current_user.user_id
    ).first()

    if existing_tasklog:
        return "duplicate"
    
    tasklog = TaskLog(
        task_id=tasklog_data.task_id,
        log_date=tasklog_data.log_date,
        status=tasklog_data.status,
        reason=tasklog_data.reason,
        user_id=current_user.user_id
    )

    db.add(tasklog)
    db.commit()
    db.refresh(tasklog)

    return tasklog
   
    

   