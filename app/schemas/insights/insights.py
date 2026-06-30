from typing import Literal
from pydantic import BaseModel

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
    