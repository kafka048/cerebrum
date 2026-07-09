from app.models import User, Goal, Task
from sqlalchemy.orm import Session

def delete_task(task_id: int, db: Session, current_user: User) -> Task | None:
    requested_task = db.query(Task).join(Goal).filter(
        Task.task_id == task_id,
        Goal.user_id == current_user.user_id
    ).first()

    if not requested_task: 
        return None
    
    db.delete(requested_task)
    db.commit()

    return requested_task