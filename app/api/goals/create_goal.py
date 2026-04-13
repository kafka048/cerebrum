from app.schemas.goal import GoalCreate
from sqlalchemy.orm import Session
from app.models import Goal, User


def create_goal(goal: GoalCreate, db: Session, current_user: User):
    new_goal = Goal(
        goal_name=goal.goal_name,
        description=goal.description,
        priority=goal.priority,
        start_date=goal.start_date,
        end_date=goal.end_date,
        status=goal.status,
        user_id=current_user.user_id
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal

