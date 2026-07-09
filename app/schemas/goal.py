from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from enum import Enum



class GoalStatus(str, Enum):
    completed = "completed"
    active = "active"
    abandoned = "abandoned"

class GoalCreate(BaseModel):
    goal_name: str
    description: Optional[str] = None
    priority: int
    start_date: datetime
    end_date: Optional[datetime] = None
    status: GoalStatus

class GoalUpdate(BaseModel):
    goal_name: str | None = None
    description: str | None = None
    priority: int | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    status: GoalStatus | None = None

class GoalRead(BaseModel):
    goal_id: int
    goal_name: str
    description: Optional[str] = None
    priority: int
    start_date: datetime
    end_date: Optional[datetime] = None
    created_at: datetime
    status: GoalStatus
    user_id: int

    model_config = ConfigDict(from_attributes=True)