from typing import Any
from sqlalchemy.orm import Session
from app.models import User
from app.api.insights.completion_rate import calculate_completion_rate
from app.api.insights.missed_days import count_missed_days
from app.api.insights.streak_logic import calculate_streak

def compile_insights(task_id: int, db: Session, current_user: User) -> dict[str, Any] | None:
    
    completion_rate = calculate_completion_rate(task_id, db, current_user)  
    if completion_rate is None:
        return None  
    
    missed_days_list = count_missed_days(task_id, db, current_user)
    if missed_days_list is None: 
        return None
    else:
        missed_days = len(missed_days_list)
    
    current_streak = calculate_streak(task_id, db, current_user)
    if current_streak is None:
        return None
    

    return {
        'completion_rate': completion_rate['completion_rate'],
        'missed_days' : missed_days,
        'current_streak' : current_streak
    }



