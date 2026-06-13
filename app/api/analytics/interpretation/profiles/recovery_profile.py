from typing import Any


# THRESHOLDS

OVERALL_ADHERENCE_THRESHOLD = 0.5
RECENT_ADHERENCE_THRESHOLD = 0.8

TEMPORAL_IMPROVEMENT_THRESHOLD = 0.1

WEIGHTED_SCORE_THRESHOLD = 0.7

POSITIVE_MOMENTUM_THRESHOLD = 0.2

TRANSITION_RATE_THRESHOLD = 0.6

CURRENT_STREAK_THRESHOLD = 5
STREAK_PROXIMITY_THRESHOLD = 3


# INTERPRETATION

def score_recovery_pattern(
    signals: dict[str, Any]
) -> dict[str, Any]:

    streak = signals["streak"]
    adherence = signals["adherence"]
    momentum = signals["momentum"]
    consistency = signals["consistency"]

    score = 0
    total = 25

    evidence: list[str] = []

    # ADHERENCE

    if (
        adherence["overall_adherence"]
        > OVERALL_ADHERENCE_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Execution history is reasonably strong"
        )

    if (
        adherence["recent_adherence"]
        > RECENT_ADHERENCE_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Recent execution is exceptionally strong"
        )

    temporal = adherence["temporal_adherence_profile"]

    initial = temporal["initial_profile"]
    middle = temporal["middle_profile"]
    recent = temporal["recent_profile"]

    if (
        middle - initial
        > TEMPORAL_IMPROVEMENT_THRESHOLD
        and
        recent - middle
        > TEMPORAL_IMPROVEMENT_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Execution quality has improved steadily across all periods"
        )

    # MOMENTUM

    if (
        momentum["weighted_score"]
        > WEIGHTED_SCORE_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Recent activity intensity is high"
        )

    if (
        momentum["momentum_direction"]
        > POSITIVE_MOMENTUM_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Behavioral momentum is strongly positive"
        )

    if (
        momentum["momentum_acceleration"]
        < 0
    ):
        score += 1
        evidence.append(
            "Improvement is beginning to stabilize"
        )

    # CONSISTENCY

    if (
        consistency["transition_rate"]
        < TRANSITION_RATE_THRESHOLD
    ):
        score += 1
        evidence.append(
            "Behavior remains relatively stable"
        )

    if (
        consistency["positive_average_run"]
        >
        consistency["negative_average_run"]
    ):
        score += 1
        evidence.append(
            "Execution blocks dominate failure blocks"
        )

    # STREAK

    if (
        streak["current streak"]
        > CURRENT_STREAK_THRESHOLD
    ):
        score += 3
        evidence.append(
            "A strong active streak is currently underway"
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
            "Current performance is near historical best levels"
        )

    if (
        streak["streak_distribution"]
        == "early_clustered"
    ):
        score += 3
        evidence.append(
            "Most interruptions occurred earlier in the execution history"
        )

    confidence = score / total

    return {
        "profile": "recovery_pattern",
        "score": score,
        "total": total,
        "confidence": confidence,
        "evidence": evidence,
    }