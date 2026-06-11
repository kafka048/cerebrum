from api.analytics.signals.consistency_engine import calculate_consistency_statistics
from api.analytics.signals.adherence_engine import calculate_adherence_statistics
from api.analytics.signals.streak_engine import calculate_streak_statistics
from api.analytics.signals.momentum_engine import calculate_momentum_statistics

from typing import List, Dict, Any
from schemas.task_log import TaskLogCreate

def signals_aggregator(task_logs: List[TaskLogCreate]) -> Dict[str, Any]:

    streak = calculate_streak_statistics(task_logs)
    adherence = calculate_adherence_statistics(task_logs)
    momentum = calculate_momentum_statistics(task_logs)
    consistency = calculate_consistency_statistics(task_logs)

    return {
        "streak" : streak,
        "adherence" : adherence,
        "momentum" : momentum,
        "consistency" : consistency
    }



