from typing import Any


# THRESHOLDS

LOW_ADHERENCE_THRESHOLD = 0.3
HIGH_ADHERENCE_THRESHOLD = 0.7

ADHERENCE_STABILITY_THRESHOLD = 0.2
TEMPORAL_VARIATION_THRESHOLD = 0.2

NEGATIVE_MOMENTUM_THRESHOLD = -0.2
POSITIVE_MOMENTUM_THRESHOLD = 0.2

LOW_WEIGHTED_SCORE_THRESHOLD = 0.4
HIGH_WEIGHTED_SCORE_THRESHOLD = 0.6

MOMENTUM_ACCELERATION_THRESHOLD = 0.1

TRANSITION_RATE_THRESHOLD = 0.7

AVERAGE_RUN_THRESHOLD = 2

RUN_SYMMETRY_THRESHOLD = 0.5

LONGEST_STREAK_THRESHOLD = 3
CURRENT_STREAK_THRESHOLD = 2


# INTERPRETATION

def score_chaotic_behavior(
    signals: dict[str, Any]
) -> dict[str, Any]:

    streak = signals["streak"]
    adherence = signals["adherence"]
    momentum = signals["momentum"]
    consistency = signals["consistency"]

    score = 0
    total = 33

    evidence: list[str] = []

    # ADHERENCE

    if (
        LOW_ADHERENCE_THRESHOLD
        <
        adherence["overall_adherence"]
        <
        HIGH_ADHERENCE_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Execution history is mixed"
        )

    if (
        abs(
            adherence["overall_adherence"]
            -
            adherence["recent_adherence"]
        )
        <
        ADHERENCE_STABILITY_THRESHOLD
    ):
        score += 2
        evidence.append(
            "Instability appears persistent rather than recent"
        )

    temporal = adherence["temporal_adherence_profile"]

    initial = temporal["initial_profile"]
    middle = temporal["middle_profile"]
    recent = temporal["recent_profile"]

    if (
        abs(initial - middle)
        < TEMPORAL_VARIATION_THRESHOLD
        and
        abs(middle - recent)
        < TEMPORAL_VARIATION_THRESHOLD
    ):
        score += 2
        evidence.append(
            "No strong temporal trend is present"
        )

    # MOMENTUM

    if (
        NEGATIVE_MOMENTUM_THRESHOLD
        <
        momentum["momentum_direction"]
        <
        POSITIVE_MOMENTUM_THRESHOLD
    ):
        score += 2
        evidence.append(
            "No strong behavioral direction is present"
        )

    if (
        LOW_WEIGHTED_SCORE_THRESHOLD
        <
        momentum["weighted_score"]
        <
        HIGH_WEIGHTED_SCORE_THRESHOLD
    ):
        score += 1
        evidence.append(
            "Activity levels are moderate"
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
            "Behavior shows no meaningful acceleration"
        )

    # CONSISTENCY

    if (
        consistency["transition_rate"]
        >
        TRANSITION_RATE_THRESHOLD
    ):
        score += 4
        evidence.append(
            "Frequent state switching is detected"
        )

    if (
        consistency["average_run"]
        <
        AVERAGE_RUN_THRESHOLD
    ):
        score += 4
        evidence.append(
            "Behavioral states rarely persist"
        )

    if (
        consistency["positive_average_run"]
        <
        AVERAGE_RUN_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Execution blocks collapse quickly"
        )

    if (
        consistency["negative_average_run"]
        <
        AVERAGE_RUN_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Failure blocks collapse quickly"
        )

    if (
        abs(
            consistency["positive_average_run"]
            -
            consistency["negative_average_run"]
        )
        <
        RUN_SYMMETRY_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Execution and failure runs are highly symmetrical"
        )

    # STREAK

    if (
        streak["longest streak"]
        <
        LONGEST_STREAK_THRESHOLD
    ):
        score += 3
        evidence.append(
            "Sustained continuity never emerges"
        )

    if (
        streak["current streak"]
        <=
        CURRENT_STREAK_THRESHOLD
    ):
        score += 1
        evidence.append(
            "No meaningful active streak exists"
        )

    if (
        streak["streak_distribution"]["distribution"]
        ==
        "even_spread"
    ):
        score += 2
        evidence.append(
            "Interruptions are distributed throughout the timeline"
        )

    confidence = score / total

    return {
        "profile": "chaotic_behavior",
        "score": score,
        "total": total,
        "confidence": confidence,
        "evidence": evidence,
    }