from typing import Literal
from pydantic import BaseModel

class SnapshotResult(BaseModel):
    reliability: float
    follow_through: float
    direction: float
    current_streak: int
    strongest_run: int

class TechnicalResult(BaseModel):
    overall_adherence: float
    recent_adherence: float
    transition_rate: float
    average_run: float  
    weighted_score: float  
    momentum_direction: float
    momentum_acceleration: float
    current_streak: int
    longest_streak: int
    

class ProfileResult(BaseModel):
    profile: str
    score: int
    total: int
    confidence: float
    evidence: list[str]

class InterpretationResult(BaseModel):
    primary_profile: ProfileResult
    all_profiles: list[ProfileResult]

class InterpretationResponse(BaseModel):
    status: Literal["learning", "ready"]

    logs_observed: int
    minimum_logs_required: int

    interpretation: InterpretationResult | None = None
    snapshot: SnapshotResult | None = None
    technical: TechnicalResult | None = None

    