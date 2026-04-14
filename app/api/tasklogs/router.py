from fastapi import HTTPException, APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.schemas.task_log import TaskLogCreate, TaskLogRead
from app.models import User
from app.db.database import get_db
from app.api.auth.dependency import get_current_user
from app.api.tasklogs.create_tasklog import create_tasklog
from app.api.tasklogs.get_tasklogs import get_all_tasklogs, get_tasklog

from typing import List

router = APIRouter()

@router.post("/", response_model=TaskLogRead)
def create(tasklog: TaskLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    created_tasklog = create_tasklog(tasklog, db, current_user)

    if created_tasklog == "duplicate":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Log already exists")

    if created_tasklog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
      
    
    return created_tasklog

@router.get("/{tasklog_id}", response_model=TaskLogRead)
def fetch(tasklog_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasklog = get_tasklog(tasklog_id, db, current_user)

    if tasklog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tasklog not found")
    
    return tasklog

@router.get("/task/{task_id}", response_model=List[TaskLogRead])
def fetch_all(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_all_tasklogs(task_id, db, current_user)

    