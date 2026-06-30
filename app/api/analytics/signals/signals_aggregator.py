from app.api.analytics.signals.consistency_engine import calculate_consistency_statistics
from app.api.analytics.signals.adherence_engine import calculate_adherence_statistics
from app.api.analytics.signals.streak_engine import calculate_streak_statistics
from app.api.analytics.signals.momentum_engine import calculate_momentum_statistics

from typing import List
from app.schemas.signal import SignalResult
from app.schemas.task_log import TaskLogCreate

def signals_aggregator(task_logs: List[TaskLogCreate]) -> SignalResult:    

    streak = calculate_streak_statistics(task_logs)
    adherence = calculate_adherence_statistics(task_logs)
    momentum = calculate_momentum_statistics(task_logs)
    consistency = calculate_consistency_statistics(task_logs)

    return SignalResult(
        streak=streak,
        adherence=adherence,
        momentum=momentum,
        consistency=consistency,
        most_recent_date=max(log.log_date for log in task_logs).strftime("%d/%m/%Y")
    )



