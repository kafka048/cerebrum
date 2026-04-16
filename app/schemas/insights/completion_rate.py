from pydantic import BaseModel

class CompletionRateResponse(BaseModel):
    task_id: int
    total_logs: int
    completed_logs: int
    completion_rate: float

    
