from schemas.task_log import TaskStatus, TaskLogCreate
from typing import List, Tuple, Dict

def convert_tasklogs_binary(task_logs: List[TaskLogCreate]) -> List[int]:
    values: List[int] = []

    for logs in task_logs:
        value: int = (
            1
            if logs.status == TaskStatus.completed
            else
            0
        )
        values.append(value)

    return values


def calculate_transition_rate(task_logs: List[TaskLogCreate]) -> float:

    transition_count = 0

    if(len(task_logs) < 2):
        return 0.0

    values = convert_tasklogs_binary(task_logs)
    
    for i in range(len(values) - 1):
        if(values[i] != values[i+1]):
            transition_count += 1
    
    transition_rate = transition_count/(len(values) - 1)
    return transition_rate

def calculate_average_run(task_logs: List[TaskLogCreate]) -> float:
    
    if(len(task_logs) == 0):
        return 0.0
    
    current_run: int = 1

    values = convert_tasklogs_binary(task_logs)

    runs: List[int] = []

    for i in range(len(values) - 1):
        if(values[i] != values[i+1]):
            runs.append(current_run)
            current_run = 1
        else: 
            current_run += 1
    runs.append(current_run) # append the final tracked run 
    
    average_run = sum(runs)/len(runs)
    return average_run

def calculate_behavioural_run_profile(task_logs: List[TaskLogCreate]) -> Tuple[float, float]:

    if len(task_logs) == 0:
        return (0.0, 0.0)
    
    current_state = 1 if task_logs[0].status == TaskStatus.completed else 0
    current_run = 1

    positive_runs: List[int] = []
    negative_runs: List[int] = []

    values = convert_tasklogs_binary(task_logs)

    for i in range(len(values)- 1):
        if(current_state == 1):
            if(values[i] != values[i+1]):
                positive_runs.append(current_run)
                current_run = 1
                current_state = values[i+1]
            else:
                current_run += 1
        else:
            if(values[i] != values[i+1]):
                negative_runs.append(current_run)
                current_run = 1
                current_state = values[i+1]
            else:
                current_run += 1   

    if current_state == 1:
        positive_runs.append(current_run)
    else:
        negative_runs.append(current_run)      
   

    average_positive_run = sum(positive_runs)/len(positive_runs) if len(positive_runs) != 0  else  0
    average_negative_run = sum(negative_runs)/len(negative_runs) if len(negative_runs) != 0 else 0

    return average_positive_run, average_negative_run

def calculate_consistency_statistics(task_logs: List[TaskLogCreate]) -> Dict[str, float]:
    transition_rate = calculate_transition_rate(task_logs)
    average_run = calculate_average_run(task_logs)
    positive_average_run, negative_average_run = calculate_behavioural_run_profile(task_logs)

    return {
        "transition_rate" : transition_rate,
        "average_run": average_run,
        "positive_average_run": positive_average_run,
        "negative_average_run": negative_average_run
    }









    


