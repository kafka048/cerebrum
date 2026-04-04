from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class GoalCreate(BaseModel):
    goal_name: str
    description: Optional[str] = None
    priority: int
    start_date: datetime
    end_date: Optional[datetime] = None
    status: str

class GoalRead(BaseModel):
    goal_id: int
    goal_name: str
    description: Optional[str] = None
    priority: int
    start_date: datetime
    end_date: Optional[datetime] = None
    status: str
    user_id: int

    class Config:
        from_attributes=True