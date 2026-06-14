from typing import Any


# THRESHOLDS

LOW_ADHERENCE_THRESHOLD = 0.4
ADHERENCE_STABILITY_THRESHOLD = 0.15

LOW_TEMPORAL_THRESHOLD = 0.4

WEIGHTED_SCORE_THRESHOLD = 0.4

NEGATIVE_MOMENTUM_THRESHOLD = -0.3
POSITIVE_MOMENTUM_THRESHOLD = 0.1

MOMENTUM_ACCELERATION_THRESHOLD = 0.1

LOW_TRANSITION_THRESHOLD = 0.2
HIGH_TRANSITION_THRESHOLD = 0.5

POSITIVE_RUN_THRESHOLD = 3
NEGATIVE_RUN_THRESHOLD = 3

LONGEST_STREAK_THRESHOLD = 3


# INTERPRETATION

def score_weekend_warrior(
    signals: dict[str, Any]
) -> dict[str, Any]:

    streak = signals["streak"]
    adherence = signals["adherence"]
    momentum = signals["momentum"]
    consistency = signals["consistency"]

    score = 0
    total = 38

    evidence: list[str] = []

    # ADHERENCE

    if (
        adherence["overall_adherence"]
        < LOW_ADHERENCE_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Execution history is chronically weak"
        )

    if (
        adherence["recent_adherence"]
        < LOW_ADHERENCE_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Recent execution remains weak"
        )

    if (
        abs(
            adherence["recent_adherence"]
            -
            adherence["overall_adherence"]
        )
        <
        ADHERENCE_STABILITY_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Execution behavior remains unchanged over time"
        )

    temporal = adherence["temporal_adherence_profile"]

    initial = temporal["initial_profile"]
    middle = temporal["middle_profile"]
    recent = temporal["recent_profile"]

    if (
        initial < LOW_TEMPORAL_THRESHOLD
        and
        middle < LOW_TEMPORAL_THRESHOLD
        and
        recent < LOW_TEMPORAL_THRESHOLD
        and
        abs(initial - middle)
        < ADHERENCE_STABILITY_THRESHOLD
        and
        abs(middle - recent)
        < ADHERENCE_STABILITY_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Temporal adherence remains consistently low across all periods"
        )

    # MOMENTUM

    if (
        momentum["weighted_score"]
        < WEIGHTED_SCORE_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Recent activity intensity is weak"
        )

    if (
        NEGATIVE_MOMENTUM_THRESHOLD
        <
        momentum["momentum_direction"]
        <
        POSITIVE_MOMENTUM_THRESHOLD
    ):
        score += 1
        evidence.append(
            "No strong behavioral direction is present"
        )

    if (
        abs(
            momentum["momentum_acceleration"]
        )
        <
        MOMENTUM_ACCELERATION_THRESHOLD
    ):
        score += 1
        evidence.append(
            "Behavior appears stagnant"
        )

    # CONSISTENCY

    if (
        LOW_TRANSITION_THRESHOLD
        <
        consistency["transition_rate"]
        <
        HIGH_TRANSITION_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Behavior shows moderate state switching"
        )

    if (
        consistency["negative_average_run"]
        >
        consistency["positive_average_run"]
    ):
        score += 4
        evidence.append(
            "Inactivity blocks dominate execution blocks"
        )

    if (
        consistency["positive_average_run"]
        <
        POSITIVE_RUN_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Execution bursts are short-lived"
        )

    if (
        consistency["negative_average_run"]
        >
        NEGATIVE_RUN_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Inactivity blocks are sustained"
        )

    # STREAK

    if (
        streak["current streak"]
        == 0
    ):
        score += 2
        evidence.append(
            "No active execution streak exists"
        )

    if (
        streak["longest streak"]
        <
        LONGEST_STREAK_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Meaningful continuity never emerges"
        )

    if (
        streak["streak_distribution"]["distribution"]
        ==
        "even_spread"
    ):
        score += 3
        evidence.append(
            "Interruptions are distributed throughout the entire history"
        )

    confidence = score / total

    return {
        "profile": "weekend_warrior",
        "score": score,
        "total": total,
        "confidence": confidence,
        "evidence": evidence,
    }