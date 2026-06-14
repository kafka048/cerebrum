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