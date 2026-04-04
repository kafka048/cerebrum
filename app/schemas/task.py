from pydantic import BaseModel
from datetime import datetime

class TaskCreate(BaseModel):
    task_name: str
    goal_id: int

class TaskRead(BaseModel):
    task_id: int
    task_name: str
    created_at: datetime
    goal_id: int

    class Config:
        from_attributes=True