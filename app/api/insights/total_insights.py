from typing import Any
from sqlalchemy.orm import Session
from app.models import User
from app.api.insights.completion_rate import calculate_completion_rate
from app.api.insights.missed_days import count_missed_days
from app.api.insights.streak_logic import calculate_streak

def compile_insights(task_id: int, db: Session, current_user: User) -> dict[str, Any]:
    completion_rate = calculate_completion_rate(task_id, db, current_user)    
    missed_days = len(count_missed_days(task_id, db, current_user))
    current_streak = calculate_streak(task_id, db, current_user)

    return {
        'completion_rate': completion_rate['completion_rate'],
        'missed_days' : missed_days,
        'current_streak' : current_streak
    }



