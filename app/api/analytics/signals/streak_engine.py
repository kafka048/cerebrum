from datetime import timedelta, date
from schemas.task_log import TaskStatus, TaskLogCreate
from typing import List, Any

def calculate_streak(task_logs: List[TaskLogCreate]) -> int:
    streak = 0

    for log in reversed(task_logs):
        if log.status == TaskStatus.completed:
            streak += 1
        else: 
            break

    return streak

def calculate_longest_streak(task_logs: List[TaskLogCreate]) -> int:
    max_streak = 0
    streak = 0

    for log in reversed(task_logs):
        if log.status == TaskStatus.completed:
            streak += 1
            if max_streak < streak:
                max_streak = streak
        else: 
            streak = 0

    return max_streak

def find_streak_breaks(task_logs: List[TaskLogCreate]) -> List[str]:
    streak_breaks: List[str] = []
    for log in reversed(task_logs):
        if log.status != TaskStatus.completed:
            streak_breaks.append(log.log_date.strftime("%d/%m/%Y"))
        else: continue
    
    return streak_breaks

def calculate_break_distribution(task_logs: list[TaskLogCreate]) -> str:    
    SIGNIFICANT_BREAK_THRESHOLD = 0.4

    if len(task_logs) < 3:
        return "insufficient_data"

    earliest_date: date = min(log.log_date for log in task_logs)
    latest_date: date = max(log.log_date for log in task_logs)

    total_breaks: int = len(find_streak_breaks(task_logs))
    if total_breaks == 0:
        return "no_breaks"


    # SPLITTING THE TOTAL LOG INTO 3 PARTS

    total_days: int = (latest_date - earliest_date).days
    third: int = total_days // 3 # Integer division

    early_cutoff: date = earliest_date + timedelta(days=third)
    mid_cutoff: date = earliest_date + timedelta(days=third * 2)

    early_window: list[TaskLogCreate] = [log for log in task_logs if log.log_date <= early_cutoff]
    middle_window: list[TaskLogCreate] = [log for log in task_logs if log.log_date > early_cutoff and log.log_date <= mid_cutoff]
    recent_window: list[TaskLogCreate] = [log for log in task_logs if log.log_date > mid_cutoff and log.log_date <= latest_date]

    early_break_count: int = len(find_streak_breaks(early_window))
    middle_break_count: int = len(find_streak_breaks(middle_window))
    recent_break_count: int = len(find_streak_breaks(recent_window))

    early_ratio: float = early_break_count / total_breaks
    middle_ratio: float = middle_break_count / total_breaks
    recent_ratio: float = recent_break_count / total_breaks

    if(early_ratio > SIGNIFICANT_BREAK_THRESHOLD):
        return "early_clustered"
    if(middle_ratio > SIGNIFICANT_BREAK_THRESHOLD):
        return "middle_clustered"
    if(recent_ratio > SIGNIFICANT_BREAK_THRESHOLD):
        return "recent_clustered"
    
    if (
    early_ratio < SIGNIFICANT_BREAK_THRESHOLD and early_break_count > 0 and
    middle_ratio < SIGNIFICANT_BREAK_THRESHOLD and middle_break_count > 0 and
    recent_ratio < SIGNIFICANT_BREAK_THRESHOLD and recent_break_count > 0
    ):
        return "even_spread"
    
    return "none"


def calculate_streak_statistics(task_logs: List[TaskLogCreate]) -> dict[str, Any]:
    streak: int = calculate_streak(task_logs)
    max_streak: int = calculate_longest_streak(task_logs)
    streak_breaks: List[str] = find_streak_breaks(task_logs)
    streak_distribution: str = calculate_break_distribution(task_logs)

    return {
        'current streak' : streak,
        'longest streak' : max_streak,
        'streak breaks' : streak_breaks,        
        'streak_distribution' : streak_distribution
    }


    






    








        


