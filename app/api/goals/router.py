from fastapi import HTTPException, APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.schemas.goal import GoalRead, GoalCreate
from app.models import User
from app.db.database import get_db
from app.api.auth.dependency import get_current_user
from app.api.goals.create_goal import create_goal
from app.api.goals.get_goal import get_goal
from app.api.goals.get_goal import get_all_goals

from typing import List


router = APIRouter()

@router.post("/", response_model=GoalRead)
def create(goal: GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_goal = create_goal(goal, db, current_user)
    return new_goal


@router.get("/{goal_id}", response_model=GoalRead)
def fetch_goal(goal_id:int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = get_goal(goal_id, db, current_user)
    if goal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    
    return goal

@router.get("/", response_model=List[GoalRead])
def fetch_all_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_all_goals(db, current_user)    
   

