from app.schemas.task_log import TaskStatus, TaskLogCreate
from typing import List, Any
from datetime import timedelta


def calculate_adherence_rate(task_logs: List[TaskLogCreate]) -> float:

    if len(task_logs) == 0:
        return 0.00
    
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
    
    RECENT_ADHERENCE_WINDOW = 7
    recent_logs: List[TaskLogCreate] = task_logs[-RECENT_ADHERENCE_WINDOW:]  

    recent_adherence = calculate_adherence_rate(recent_logs)
    return recent_adherence


def calculate_temporal_adherence_profile(task_logs: List[TaskLogCreate]) -> dict[str, float]:
    
    earliest_date = min(log.log_date for log in task_logs)
    latest_date = max(log.log_date for log in task_logs)

    total_days = (latest_date - earliest_date).days
    third = total_days // 3

    early_cutoff = earliest_date + timedelta(days=third)
    middle_cutoff = earliest_date + timedelta(days=third * 2)
    

    initial_logs: list[TaskLogCreate] = [log for log in task_logs if log.log_date <= early_cutoff]
    initial_adherence = calculate_adherence_rate(initial_logs)

    middle_logs: list[TaskLogCreate] = [log for log in task_logs if log.log_date > early_cutoff and log.log_date <= middle_cutoff]
    middle_adherence = calculate_adherence_rate(middle_logs)    

    recent_logs: list[TaskLogCreate] = [log for log in task_logs if log.log_date > middle_cutoff]
    recent_adherence = calculate_adherence_rate(recent_logs)     
   

    return {
        "initial_adherence" : initial_adherence,
        "middle_adherence" : middle_adherence,
        "recent_adherence" : recent_adherence
    }
    

def calculate_adherence_statistics(task_logs: List[TaskLogCreate]) -> dict[str, Any]:
    overall_adherence = calculate_adherence_rate(task_logs)
    recent_adherence = calculate_recent_adherence(task_logs)
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
    
    
    




    



