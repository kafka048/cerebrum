from fastapi import HTTPException, APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.models import User
from app.db.database import get_db
from app.api.auth.dependency import get_current_user
from app.schemas.insights.insights import InterpretationResult
from app.api.analytics.service import get_interpretation

router = APIRouter()

@router.get("/analytics/{task_id}", response_model=InterpretationResult)
def get_analytics(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    interpretation = get_interpretation(task_id, db, current_user)

    if not interpretation:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="No logs found for this task")
    
    return interpretation
