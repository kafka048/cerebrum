from app.models import User, Goal, Task
from sqlalchemy.orm import Session
from typing import List

def get_task(task_id: int, db: Session, current_user: User) -> Task | None:
    task = db.query(Task).join(Goal).filter(
        Goal.user_id == current_user.user_id,
        Task.task_id == task_id
    ).first()

    
    return task

def get_all_tasks(goal_id: int, db: Session, current_user: User) -> List[Task]:
    tasks = db.query(Task).join(Goal).filter(
        Task.goal_id == goal_id,
        Goal.user_id == current_user.user_id
    ).all()

    return tasks
    