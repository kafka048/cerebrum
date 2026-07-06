from app.models import User, TaskLog
from sqlalchemy.orm import Session
from app.schemas.signal import SignalResult
from app.schemas.task_log import TaskLogCreate
from app.schemas.insights.insights import InterpretationResponse, SnapshotResult, TechnicalResult
from app.api.analytics.signals.signals_aggregator import signals_aggregator
from app.api.analytics.interpretation.interpret import interpret

"""
Behavioral Intelligence Service

This module constructs the complete behavioral intelligence response
consumed by Cerebrum's frontend analytics page.

It orchestrates the analytics pipeline by retrieving a task's behavioral
history, generating deterministic behavioral signals, interpreting those
signals into behavioral profiles, and assembling a presentation-ready
response for the frontend.

The service returns a consistent InterpretationResponse regardless of
behavioral maturity. Tasks with insufficient observations remain in the
'learning' state, while mature tasks receive the complete behavioral
intelligence package.
"""

MINIMUM_ANALYTICS_THRESHOLD = 7

def create_snapshot(signals: SignalResult) -> SnapshotResult:
    """
    Builds the condensed behavioral snapshot for the intelligence display once maturity is reached.
    The snapshot surfaces the most important behavioral indicators in human friendly language while
    intentionally hiding lower-level analytical detail and implementation.
    """ 
    return SnapshotResult(
        reliability=signals.adherence.overall_adherence,
        follow_through=signals.adherence.recent_adherence,
        direction=signals.momentum.momentum_direction,
        current_streak=signals.streak.current_streak,
        strongest_run=signals.streak.longest_streak,
    )

def create_technical(signals: SignalResult) -> TechnicalResult:
    """
    Builds the technical analytics section of the intelligence page.
    The returned metrics expose all the underlying deterministic behavioral
    signals.
    """
    return TechnicalResult(
        overall_adherence=signals.adherence.overall_adherence,
        recent_adherence=signals.adherence.recent_adherence,
        transition_rate=signals.consistency.transition_rate,
        average_run=signals.consistency.average_run,
        weighted_score=signals.momentum.weighted_score,
        momentum_direction=signals.momentum.momentum_direction,
        momentum_acceleration=signals.momentum.momentum_acceleration,
        current_streak=signals.streak.current_streak,
        longest_streak=signals.streak.longest_streak
    )
    


def get_interpretation(task_id: int, db: Session, current_user: User) -> InterpretationResponse |  None:

    """
    Produces the complete behavioral intelligence response for A TASK.

    The service retrieves the task's behavioral historical logs, evaluates whether
    sufficient evidence exists for reliable analysis, and executes the
    analytics pipeline when the minimum observation threshold is met.

    Returns a consistent InterpretationResponse for both learning and
    ready states, allowing the frontend to consume a single response
    contract regardless of behavioral maturity.
    """

    logs = db.query(TaskLog).filter(
        TaskLog.task_id == task_id,
        TaskLog.user_id == current_user.user_id
    ).order_by(TaskLog.log_date).all()

    if len(logs) < MINIMUM_ANALYTICS_THRESHOLD:
        return InterpretationResponse(
            status="learning",
            logs_observed=len(logs),
            minimum_logs_required=MINIMUM_ANALYTICS_THRESHOLD            
        )

    # Convert ORM models into Analytical Schemas    
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
        interpretation=interpretation,
        snapshot=create_snapshot(signals),
        technical=create_technical(signals)
    )
