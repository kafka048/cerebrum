from typing import Any
from datetime import datetime, timedelta

# THRESHOLDS 

OVERALL_ADHERENCE_THRESHOLD = 0.6
RECENT_ADHERENCE_THRESHOLD = 0.3
HISTORICAL_STRENGTH_THRESHOLD = 0.8
RECENT_COLLAPSE_THRESHOLD = 0.2

WEIGHTED_SCORE_THRESHOLD = 0.6
MOMENTUM_DIRECTION_THRESHOLD = -0.5
MOMENTUM_ACCELERATION_THRESHOLD = -0.5

TRANSITION_RATE_THRESHOLD = 0.2
POSITIVE_RUN_THRESHOLD = 5
NEGATIVE_RUN_THRESHOLD = 3

LONGEST_STREAK_THRESHOLD = 7
RECENT_BREAK_COUNT_THRESHOLD = 3

# INTERPRETATION

def score_burnout(signals: dict[str, Any]) -> dict[str, Any]:
    streak = signals["streak"]
    adherence = signals["adherence"]
    momentum = signals["momentum"]
    consistency = signals["consistency"]

    score = 0
    total = 28

    evidence: list[str] = []

    # ADHERENCE
    if adherence["overall_adherence"] > OVERALL_ADHERENCE_THRESHOLD:
        score += 3
        evidence.append("Strong historical execution detected")
    
    if adherence["recent_adherence"] < RECENT_ADHERENCE_THRESHOLD:
        score += 3
        evidence.append("Execution drop in recent days detected")

    temporal = adherence["temporal_adherence_profile"]

    if(
        temporal["initial_profile"] > HISTORICAL_STRENGTH_THRESHOLD and 
        temporal["middle_profile"] > HISTORICAL_STRENGTH_THRESHOLD and
        temporal["recent_profile"] < RECENT_COLLAPSE_THRESHOLD
    ):
        score += 3
        evidence.append("Sudden collapse in execution detected")
    
    # MOMENTUM
    if momentum["weighted_score"] < WEIGHTED_SCORE_THRESHOLD:
        score += 2
        evidence.append("Recent intensity is low")
    
    if momentum["momentum_direction"] < MOMENTUM_DIRECTION_THRESHOLD:
        score += 3
        evidence.append("A sharp decline detected")

    if momentum["momentum_acceleration"] < MOMENTUM_ACCELERATION_THRESHOLD:
        score += 3
        evidence.append("Rate of decline is accelerating")

    # CONSISTENCY
    if consistency["transition_rate"] < TRANSITION_RATE_THRESHOLD:
        score += 2
        evidence.append("Stability across execution detected")
    
    if consistency["positive_average_run"] > POSITIVE_RUN_THRESHOLD:
        score += 2
        evidence.append("Long execution blocks confirmed")

    if consistency["negative_average_run"] > NEGATIVE_RUN_THRESHOLD:
        score += 1
        evidence.append("Failure blocks also confirmed")
    
    # STREAK
    if streak["current streak"] == 0:
        score += 2
        evidence.append(
            "No active execution streak"
        )

    if streak["longest streak"] > LONGEST_STREAK_THRESHOLD:
        score += 1
        evidence.append(
            "Strong historical execution capacity detected"
        )

    most_recent_log = datetime.strptime(signals["most_recent_date"], "%d/%m/%Y"
    ).date()

    cut_off = most_recent_log - timedelta(days=10)

    recent_breaks = [
        break_date for break_date in streak["streak_breaks"] 
        if datetime.strptime(break_date, "%d/%m/%Y").date() >= cut_off
    ]

    if len(recent_breaks) >= RECENT_BREAK_COUNT_THRESHOLD:
        score += 3
        evidence.append(
            "Streak breaks are heavily clustered in recent days"
        )

    confidence = score / total

    return {
        "profile": "burnout_risk",
        "score": score,
        "total": total,
        "confidence": confidence,
        "evidence": evidence,
    }
