from schemas.task_log import TaskStatus, TaskLogCreate
from typing import List

DIRECTION_WINDOW_SIZE = 10
ACCELERATION_WINDOW_SIZE = 6

def calculate_weighted_score(task_logs: List[TaskLogCreate]) -> float:
    
    sum_num = 0
    sum_den = 0

    if (len(task_logs) == 0):
        return 0.0
    
    for index, log in enumerate(task_logs, start=1):
        value = 1 if log.status == TaskStatus.completed else 0
        sum_num += (value * index)
        sum_den += index              
        

    weighted_score: float = sum_num/sum_den
    return weighted_score


def calculate_momentum_direction(task_logs: List[TaskLogCreate]) -> float:

       
    initial_logs: List[TaskLogCreate] = task_logs[:DIRECTION_WINDOW_SIZE]
    recent_logs: List[TaskLogCreate] = task_logs[-DIRECTION_WINDOW_SIZE:]

    initial_score = calculate_weighted_score(initial_logs)
    recent_score = calculate_weighted_score(recent_logs)

    mom_dirn = recent_score - initial_score
    return mom_dirn

def calculate_momentum_acceleration(task_logs: List[TaskLogCreate]) -> float:
   

    middle_start = len(task_logs) // 2 - ACCELERATION_WINDOW_SIZE // 2
    middle_end = middle_start + ACCELERATION_WINDOW_SIZE

    initial_logs: List[TaskLogCreate] = task_logs[:ACCELERATION_WINDOW_SIZE]
    middle_logs: List[TaskLogCreate] = task_logs[middle_start:middle_end]   
    recent_logs: List[TaskLogCreate] = task_logs[-ACCELERATION_WINDOW_SIZE:]

    initial_score: float = calculate_weighted_score(initial_logs)
    middle_score: float = calculate_weighted_score(middle_logs)
    recent_score: float = calculate_weighted_score(recent_logs)

    delta_1: float = middle_score - initial_score
    delta_2: float = recent_score - middle_score

    mom_acc: float = delta_2 - delta_1
    return mom_acc
     
    
def calculate_momentum_statistics(task_logs: List[TaskLogCreate]) -> dict[str, float]:
    weighted_score = calculate_weighted_score(task_logs)
    momentum_direction = calculate_momentum_direction(task_logs)
    momentum_acceleration = calculate_momentum_acceleration(task_logs)

    return {
         "weighted_score" : weighted_score,
         "momentum_direction" : momentum_direction,
         "momentum_acceleration": momentum_acceleration
    }



    



