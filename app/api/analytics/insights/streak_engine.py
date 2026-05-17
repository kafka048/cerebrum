
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

def find_streak_breaks(task_logs: List[TaskLogCreate]) -> List[TaskLogCreate]:
    streak_breaks: List[TaskLogCreate] = []
    for log in reversed(task_logs):
        if log.status != TaskStatus.completed:
            streak_breaks.append(log)
        else: continue
    
    return streak_breaks

def calculate_streak_statistics(task_logs: List[TaskLogCreate]) -> dict[str, Any]:
    streak: int = calculate_streak(task_logs)
    max_streak: int = calculate_longest_streak(task_logs)
    streak_breaks: List[TaskLogCreate] = find_streak_breaks(task_logs)

    return {
        'current streak' : streak,
        'longest streak' : max_streak,
        'streak breaks' : streak_breaks
    }
        


