from sqlalchemy.orm import Session
from app.models import Goal, User

def delete_goal(goal_id: int, db: Session, current_user: User) -> Goal | None:
    requested_goal = db.query(Goal).filter(
        Goal.goal_id == goal_id,
        Goal.user_id == current_user.user_id
    ).first()

    if not requested_goal:
        return None
    
    db.delete(requested_goal)
    db.commit()

    return requested_goal
    

    