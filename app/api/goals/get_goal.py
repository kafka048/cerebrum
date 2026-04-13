from sqlalchemy.orm import Session
from app.models import Goal, User
from typing import List


def get_goal(goal_id: int, db: Session, current_user: User) -> Goal | None:

    goal = db.query(Goal).filter(
        Goal.goal_id == goal_id,
        Goal.user_id == current_user.user_id
    ).first()      
    
    return goal
    

def get_all_goals(db: Session, current_user: User) -> List[Goal] | None:

    goals = db.query(Goal).filter(
        Goal.user_id == current_user.user_id
    ).all()

    return goals