from app.models import User, Goal, Task
from sqlalchemy.orm import Session
from app.schemas.task import TaskCreate



def create_task(task: TaskCreate, db: Session, current_user: User) -> Task | None:
    goal = db.query(Goal).filter(
        Goal.goal_id == task.goal_id,
        Goal.user_id == current_user.user_id
    ).first()

    if goal is None:
        return None
    
    new_task = Task(
        task_name = task.task_name,
        goal_id = task.goal_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task




