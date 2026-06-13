from typing import Any



# THRESHOLDS

STRONG_ADHERENCE_THRESHOLD = 0.75
ADHERENCE_STABILITY_THRESHOLD = 0.15

STRONG_WEIGHTED_SCORE_THRESHOLD = 0.75

MINOR_POSITIVE_MOMENTUM_THRESHOLD = 0.0
STABLE_MOMENTUM_THRESHOLD = 0.3

MOMENTUM_PLATEAU_THRESHOLD = 0.1

LOW_TRANSITION_THRESHOLD = 0.1
MODERATE_TRANSITION_THRESHOLD = 0.4

POSITIVE_RUN_THRESHOLD = 3
NEGATIVE_RUN_THRESHOLD = 2

ACTIVE_STREAK_THRESHOLD = 3
SUSTAINED_CAPACITY_THRESHOLD = 3

STREAK_PROXIMITY_THRESHOLD = 3

MAX_STREAK_BREAKS_THRESHOLD = 5



# INTERPRETATION

def score_sustainable_performer(signals: dict[str, Any]) -> dict[str, Any]:

    streak = signals["streak"]
    adherence = signals["adherence"]
    momentum = signals["momentum"]
    consistency = signals["consistency"]

    score = 0
    total = 32

    evidence: list[str] = []

   
    # ADHERENCE

    if (
        adherence["overall_adherence"]
        > STRONG_ADHERENCE_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Strong historical adherence detected"
        )

    if (
        adherence["recent_adherence"]
        > STRONG_ADHERENCE_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Strong recent adherence detected"
        )

    if (
        abs(
            adherence["recent_adherence"]
            - adherence["overall_adherence"]
        )
        < ADHERENCE_STABILITY_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Adherence remains stable across time"
        )

    temporal = adherence["temporal_adherence_profile"]

    initial = temporal["initial_profile"]
    middle = temporal["middle_profile"]
    recent = temporal["recent_profile"]

    if (
        abs(initial - middle)
        < ADHERENCE_STABILITY_THRESHOLD
        and
        abs(middle - recent)
        < ADHERENCE_STABILITY_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Temporal adherence profile is stable"
        )

    
    # MOMENTUM

    if (
        momentum["weighted_score"]
        > STRONG_WEIGHTED_SCORE_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Strong recent execution intensity detected"
        )

    if (
        MINOR_POSITIVE_MOMENTUM_THRESHOLD
        < momentum["momentum_direction"]
        < STABLE_MOMENTUM_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Momentum indicates gradual improvement"
        )

    if (
        abs(momentum["momentum_acceleration"])
        < MOMENTUM_PLATEAU_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Behavior appears to be stabilizing"
        )

   
    # CONSISTENCY

    if (
        LOW_TRANSITION_THRESHOLD
        < consistency["transition_rate"]
        < MODERATE_TRANSITION_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Behavior shows healthy flexibility"
        )

    if (
        consistency["positive_average_run"]
        > POSITIVE_RUN_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Execution blocks are sustained"
        )

    if (
        consistency["negative_average_run"]
        < NEGATIVE_RUN_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Failure blocks are short-lived"
        )

   
    # STREAK

    if (
        streak["current streak"]
        > ACTIVE_STREAK_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Currently executing consistently"
        )

    if (
        streak["longest streak"]
        > SUSTAINED_CAPACITY_THRESHOLD
    ):
        score += 1
        evidence.append(
            "Historical execution capacity detected"
        )

    if (
        abs(
            streak["current streak"]
            - streak["longest streak"]
        )
        < STREAK_PROXIMITY_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Current performance is near historical best"
        )

    if (
        len(streak["streak_breaks"])
        < MAX_STREAK_BREAKS_THRESHOLD
    ):
        score += 1
        evidence.append(
            "Failures are infrequent"
        )

    if (
        streak["streak_distribution"]
        == "even_spread"
    ):
        score += 1
        evidence.append(
            "Failures are not concentrated in a single period"
        )

    confidence = score / total

    return {
        "profile": "sustainable_performer",
        "score": score,
        "total": total,
        "confidence": confidence,
        "evidence": evidence,
    }