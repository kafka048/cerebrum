from app.models import User, Goal, Task
from sqlalchemy.orm import Session

from app.schemas.task import TaskUpdate

def update_task(task_id: int, task: TaskUpdate, db: Session, current_user: User) -> Task | None:
    requested_task = db.query(Task).join(Goal).filter(
        Task.task_id == task_id,
        Goal.user_id == current_user.user_id
    ).first()

    if not requested_task:
        return None
    
    updated_task = task.model_dump(exclude_unset=True)
    for field, value in updated_task.items():
        setattr(requested_task, field, value)

    db.commit()
    db.refresh(requested_task)

    return requested_task