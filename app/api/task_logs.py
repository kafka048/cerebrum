from fastapi import APIRouter, HTTPException, Depends 
from sqlalchemy.orm import Session

from app.db.database import get_db 
from app.models import TaskLog, Task, User
from app.schemas.task_log import TaskLogCreate, TaskLogRead 


router = APIRouter()

@router.post("/", response_model=TaskLogRead)
def create_tasklog(tasklog: TaskLogCreate, db: Session = Depends(get_db)):
    # ensure the associated user and tasks exists 
    
    task = db.query(Task).filter(Task.task_id == tasklog.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    user = db.query(User).filter(User.user_id == tasklog.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # enforced rule: 1 log per day
    existing_log = db.query(TaskLog).filter(
        TaskLog.task_id == tasklog.task_id,
        TaskLog.log_date == tasklog.log_date
    ).first()

    if existing_log:
        raise HTTPException(status_code=400, detail="A log already exists")

    new_tasklog = TaskLog(
    task_id=tasklog.task_id,
    user_id=tasklog.user_id,
    log_date=tasklog.log_date,
    status=tasklog.status,
    reason=tasklog.reason
    )

    db.add(new_tasklog)
    db.commit()
    db.refresh(new_tasklog)

    return new_tasklog

@router.get("/{tasklog_id}", response_model=TaskLogRead)
def get_tasklog(tasklog_id: int, db: Session = Depends(get_db)):
    tasklog = db.query(TaskLog).filter(TaskLog.tasklog_id == tasklog_id).first()
    if not tasklog:
        raise HTTPException(status_code=404, detail="Tasklog not found")
    
    return tasklog
