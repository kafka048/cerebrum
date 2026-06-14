from typing import Any

# THRESHOLDS

OVERALL_ADHERENCE_THRESHOLD = 0.5
RECENT_ADHERENCE_THRESHOLD = 0.3
TEMPORAL_DECLINE_THRESHOLD = 0.1
WEIGHTED_SCORE_THRESHOLD = 0.5
NEGATIVE_MOMENTUM_THRESHOLD = -0.4
MOMENTUM_ACCELERATION_THRESHOLD = -0.1
LOW_TRANSITION_THRESHOLD = 0.2
HIGH_TRANSITION_THRESHOLD = 0.6
MIN_AVERAGE_RUN_THRESHOLD = 2
MAX_AVERAGE_RUN_THRESHOLD = 4
LONGEST_STREAK_THRESHOLD = 5

# INTERPRETATION

def score_declining(
    signals: dict[str, Any]
) -> dict[str, Any]:
    streak = signals["streak"]
    adherence = signals["adherence"]
    momentum = signals["momentum"]
    consistency = signals["consistency"]
    score = 0
    total = 22
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
        < RECENT_ADHERENCE_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Recent execution quality is poor"
        )
    temporal = adherence["temporal_adherence_profile"]
    initial = temporal["initial_profile"]
    middle = temporal["middle_profile"]
    recent = temporal["recent_profile"]
    if (
        initial - middle
        > TEMPORAL_DECLINE_THRESHOLD
        and
        middle - recent
        > TEMPORAL_DECLINE_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Execution quality has declined steadily across all periods"
        )

    # MOMENTUM

    if (
        momentum["weighted_score"]
        < WEIGHTED_SCORE_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Recent activity intensity is low"
        )
    if (
        momentum["momentum_direction"]
        < NEGATIVE_MOMENTUM_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Behavioral momentum is strongly negative"
        )
    if (
        momentum["momentum_acceleration"]
        < MOMENTUM_ACCELERATION_THRESHOLD
    ):
        score += 1
        evidence.append(
            "The decline continues to gather momentum"
        )

    # CONSISTENCY

    if (
        LOW_TRANSITION_THRESHOLD
        < consistency["transition_rate"]
        < HIGH_TRANSITION_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Behavior shows moderate oscillation"
        )
    if (
        MIN_AVERAGE_RUN_THRESHOLD
        < consistency["average_run"]
        < MAX_AVERAGE_RUN_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Behavioral runs are moderate rather than sustained"
        )
    # STREAK
    if (
        streak["current streak"]
        == 0
    ):
        score += 1
        evidence.append(
            "No active execution streak is present"
        )
    if (
        streak["longest streak"]
        > LONGEST_STREAK_THRESHOLD
    ):
        score += 1
        evidence.append(
            "Historical execution capacity is evident"
        )
    break_profile = streak["streak_distribution"]
    if(
        break_profile["distribution"]
        == "recent_clustered"
        and
        break_profile["early_break_count"]
        <
        break_profile["middle_break_count"]
        <
        break_profile["recent_break_count"]
    ):
        score += 2
        evidence.append(
            "Interruptions increased progressively and are now concentrated in recent history"
        )
    confidence = score / total

    return {
        "profile": "declining",
        "score": score,
        "total": total,
        "confidence": confidence,
        "evidence": evidence,
    }