from fastapi import HTTPException, APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.goal import GoalCreate, GoalRead
from app.models.goal import Goal
from app.models.user import User
from app.api.auth.dependency import get_current_user

router = APIRouter()

@router.post("/", response_model=GoalRead)
def create_goal(
    goal: GoalCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)):    
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

@router.get("/{goal_id}", response_model=GoalRead)
def get_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.goal_id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="This goal does not exist. Please create one.")
    
    return goal

