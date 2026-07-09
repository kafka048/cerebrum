from sqlalchemy.orm import Session
from app.models import Goal, User

from app.schemas.goal import GoalUpdate

def update_goal(goal_id: int, goal: GoalUpdate, db: Session, current_user: User) -> Goal | None:

    requested_goal = db.query(Goal).filter(
        Goal.goal_id == goal_id,
        Goal.user_id == current_user.user_id
    ).first()

    if not requested_goal:
        return None
    
    updated_goal = goal.model_dump(exclude_unset=True)

    for field, value in updated_goal.items():
        setattr(requested_goal, field, value)

    db.commit()
    db.refresh(requested_goal)

    return requested_goal



    
