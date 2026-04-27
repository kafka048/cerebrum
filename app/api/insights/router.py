from datetime import date
from fastapi import HTTPException, APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.schemas.insights.insights import CompletionRateResponse, SummaryInsightResponse
from app.models import User
from app.db.database import get_db
from app.api.auth.dependency import get_current_user
from app.api.insights.completion_rate import calculate_completion_rate
from app.api.insights.missed_days import count_missed_days
from app.api.insights.streak_logic import calculate_streak
from app.api.insights.total_insights import compile_insights


from typing import List


router = APIRouter(prefix="/insight")

@router.get("/completion_rate", response_model=CompletionRateResponse)
def get_completion_rate(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> CompletionRateResponse:
    completion_rate = calculate_completion_rate(task_id, db, current_user)
    if completion_rate is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or access was denied")
    return CompletionRateResponse(**completion_rate)

@router.get("/missed-days")
def get_missed_days(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> List[date]:
    missed_days = count_missed_days(task_id, db, current_user)
    if missed_days is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or access was denied")
    return missed_days

@router.get("/streak")
def get_streak(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> int:
    streak = calculate_streak(task_id, db, current_user)
    if streak is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or access was denied")
    return streak

@router.get("/summary", response_model=SummaryInsightResponse)
def get_insight_summary(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> SummaryInsightResponse:
    insight_summary = compile_insights(task_id, db, current_user)
    if insight_summary is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or access was denied")
    return SummaryInsightResponse(**insight_summary)
