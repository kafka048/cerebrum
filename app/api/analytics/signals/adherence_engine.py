from schemas.task_log import TaskStatus, TaskLogCreate
from typing import List, Any


def calculate_adherence_rate(task_logs: List[TaskLogCreate]) -> float:
    total_logs: int = len(task_logs)
    completed_logs: int = 0

    for log in task_logs:
        if log.status == TaskStatus.completed:
            completed_logs += 1
        else: 
            continue
        
    adherence: float = completed_logs/total_logs
    return adherence

def calculate_recent_adherence(task_logs: List[TaskLogCreate]) -> float:

    recent_logs: List[TaskLogCreate] = task_logs[-7:]  

    recent_adherence: float = calculate_adherence_rate(recent_logs)
    return recent_adherence


def calculate_temporal_adherence_profile(task_logs: List[TaskLogCreate]) -> dict[str, float]:

    WINDOW_SIZE = 5

    initial_logs: list[TaskLogCreate] = task_logs[:WINDOW_SIZE]
    initial_adherence = calculate_adherence_rate(initial_logs)

    recent_logs: list[TaskLogCreate] = task_logs[-WINDOW_SIZE:]
    recent_adherence = calculate_adherence_rate(recent_logs)

    middle_start = len(task_logs) // 2 - WINDOW_SIZE // 2
    middle_end = middle_start + WINDOW_SIZE
    middle_logs: list[TaskLogCreate] = task_logs[middle_start:middle_end]
    middle_adherence = calculate_adherence_rate(middle_logs)    

    return {
        "initial_adherence" : initial_adherence,
        "middle_adherence" : middle_adherence,
        "recent_adherence" : recent_adherence
    }
    

def calculate_adherence_statistics(task_logs: List[TaskLogCreate]) -> dict[str, Any]:
    overall_adherence: float = calculate_adherence_rate(task_logs)
    recent_adherence: float = calculate_recent_adherence(task_logs)
    adherence_temporal_profile: dict[str, float] = calculate_temporal_adherence_profile(task_logs)

    return {
        "overall_adherence" : overall_adherence,
        "recent_adherence" : recent_adherence,
        "temporal_adherence_profile" : {
            "initial_profile" : adherence_temporal_profile["initial_adherence"],
            "middle_profile" : adherence_temporal_profile["middle_adherence"],
            "recent_profile" : adherence_temporal_profile["recent_adherence"]
        }    
    }
    
    
    




    



