from fastapi import HTTPException, APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.schemas.task import TaskRead, TaskCreate
from app.models import User
from app.db.database import get_db
from app.api.auth.dependency import get_current_user
from app.api.tasks.create_task import create_task
from app.api.tasks.get_tasks import get_task, get_all_tasks

from typing import List

router = APIRouter()

@router.post("/", response_model=TaskRead)
def create(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    created_task = create_task(task, db, current_user)
    if created_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal Not Found")
    
    return created_task

@router.get("/{task_id}", response_model=TaskRead)
def fetch(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = get_task(task_id, db, current_user)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task Not Found")
    
    return task

@router.get("/goal/{goal_id}", response_model=List[TaskRead])
def fetch_all(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_all_tasks(goal_id, db, current_user)

