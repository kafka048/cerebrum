from app.models import User, TaskLog
from sqlalchemy.orm import Session
from app.schemas.task_log import TaskLogCreate
from app.schemas.insights.insights import InterpretationResult
from app.api.analytics.signals.signals_aggregator import signals_aggregator
from app.api.analytics.interpretation.interpret import interpret

def get_interpretation(task_id: int, db: Session, current_user: User) -> InterpretationResult | None:

    logs = db.query(TaskLog).filter(
        TaskLog.task_id == task_id,
        TaskLog.user_id == current_user.user_id
    ).all()

    if not logs:
        return None
    
    task_logs = [
        TaskLogCreate(
            task_id=log.task_id, # type: ignore
            log_date=log.log_date, # type: ignore
            status=log.status # type: ignore
        ) 
        for log in logs
    ]

    signals = signals_aggregator(task_logs)
    intepretation = interpret(signals)

    return InterpretationResult(**intepretation)
