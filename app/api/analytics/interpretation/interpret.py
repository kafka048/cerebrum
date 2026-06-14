from typing import Any
from api.analytics.interpretation.profiles.burnout_profile import score_burnout
from api.analytics.interpretation.profiles.chaotic_profile import score_chaotic_behavior
from api.analytics.interpretation.profiles.declining_profile import score_declining
from api.analytics.interpretation.profiles.recovery_profile import score_recovery_pattern
from api.analytics.interpretation.profiles.sustainable_profile import score_sustainable_performer
from api.analytics.interpretation.profiles.weekend_warrior import score_weekend_warrior


def interpret(signals: dict[str, Any]) -> dict[str, Any]:

    burnout_profile: dict[str, Any] = score_burnout(signals)
    chaotic_profile: dict[str, Any] = score_chaotic_behavior(signals)
    declining_profile: dict[str, Any] = score_declining(signals)
    recovery_profile: dict[str, Any] = score_recovery_pattern(signals)
    sustainable_profile: dict[str, Any] = score_sustainable_performer(signals)
    weekend_warrior_profile: dict[str, Any] = score_weekend_warrior(signals)

    results = [
        burnout_profile,
        chaotic_profile,
        declining_profile,
        recovery_profile,
        sustainable_profile,
        weekend_warrior_profile
    ]

    def get_confidence(profile: dict[str, Any]) -> float:
        return profile["confidence"]      
    
    ranked_profiles = sorted(results, key=get_confidence, reverse=True)   

    return {
        "primary_profile" : ranked_profiles[0],
        "all_profiles" : ranked_profiles
    }
    


    