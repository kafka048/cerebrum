from app.models import User, TaskLog
from sqlalchemy.orm import Session
from app.schemas.signal import SignalResult
from app.schemas.task_log import TaskLogCreate
from app.schemas.insights.insights import InterpretationResponse, SnapshotResult
from app.api.analytics.signals.signals_aggregator import signals_aggregator
from app.api.analytics.interpretation.interpret import interpret

MINIMUM_ANALYTICS_THRESHOLD = 7

def create_snapshot(signals: SignalResult) -> SnapshotResult:
    return SnapshotResult(
        reliability=signals.adherence.overall_adherence,
        follow_through=signals.adherence.recent_adherence,
        direction=signals.momentum.momentum_direction,
        current_streak=signals.streak.current_streak,
        strongest_run=signals.streak.longest_streak,
    )
    


def get_interpretation(task_id: int, db: Session, current_user: User) -> InterpretationResponse |  None:

    logs = db.query(TaskLog).filter(
        TaskLog.task_id == task_id,
        TaskLog.user_id == current_user.user_id
    ).order_by(TaskLog.log_date).all()

    if len(logs) < MINIMUM_ANALYTICS_THRESHOLD:
        return InterpretationResponse(
            status="learning",
            logs_observed=len(logs),
            minimum_logs_required=MINIMUM_ANALYTICS_THRESHOLD,
            interpretation=None,
            snapshot=None,
            technical=None
        )

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
    interpretation = interpret(signals)
    

    return InterpretationResponse(
        status="ready",
        logs_observed=len(logs),
        minimum_logs_required=MINIMUM_ANALYTICS_THRESHOLD,
        interpretation=interpretation
    )
