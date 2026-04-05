from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.goal import Goal
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskRead

router = APIRouter()

@router.post("/", response_model=TaskRead)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    # check if goal exists
    goal = db.query(Goal).filter(Goal.goal_id == task.goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="No goal exists. please create a goal to add tasks to it.")
    
    new_task = Task(
        task_name=task.task_name,
        goal_id=task.goal_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="No task exists. Please create one.")
    
    return task
