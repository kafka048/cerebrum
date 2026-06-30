from typing import Any
from pydantic import BaseModel

class StreakResult(BaseModel):
    current_streak: int
    longest_streak: int
    streak_breaks: list[str]
    streak_distribution: dict[str, Any]


class AdherenceResult(BaseModel):
    overall_adherence: float
    recent_adherence: float
    temporal_adherence_profile: dict[str, float]

class MomentumResult(BaseModel):
    weighted_score: float
    momentum_direction: float
    momentum_acceleration: float

class ConsistencyResult(BaseModel):
    transition_rate: float
    average_run: float
    average_positive_run: float
    average_negative_run: float

class SignalResult(BaseModel):
    streak: StreakResult
    adherence: AdherenceResult
    momentum: MomentumResult
    consistency: ConsistencyResult
    most_recent_date: str
