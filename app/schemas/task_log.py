from pydantic import BaseModel, ConfigDict
from datetime import datetime, date
from typing import Optional
from enum import Enum

class TaskStatus(str, Enum):
    completed = "completed"
    failed = "failed"
    skipped = "skipped"

class TaskLogCreate(BaseModel):   
    task_id: int
    user_id: int
    log_date: date
    status: TaskStatus
    reason: Optional[str] = None

class TaskLogRead(BaseModel):
    tasklog_id: int
    task_id: int
    user_id: int
    log_date: date
    status: TaskStatus
    reason: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)