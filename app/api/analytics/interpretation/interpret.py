from app.api.analytics.interpretation.profiles.burnout_profile import score_burnout
from app.api.analytics.interpretation.profiles.chaotic_profile import score_chaotic_behavior
from app.api.analytics.interpretation.profiles.declining_profile import score_declining
from app.api.analytics.interpretation.profiles.recovery_profile import score_recovery_pattern
from app.api.analytics.interpretation.profiles.sustainable_profile import score_sustainable_performer
from app.api.analytics.interpretation.profiles.weekend_warrior import score_weekend_warrior
from app.schemas.insights.insights import InterpretationResult, ProfileResult
from app.schemas.signal import SignalResult


def interpret(signals: SignalResult) -> InterpretationResult:

    burnout_profile: ProfileResult = score_burnout(signals)
    chaotic_profile: ProfileResult = score_chaotic_behavior(signals)
    declining_profile: ProfileResult = score_declining(signals)
    recovery_profile: ProfileResult = score_recovery_pattern(signals)
    sustainable_profile: ProfileResult = score_sustainable_performer(signals)
    weekend_warrior_profile: ProfileResult = score_weekend_warrior(signals)

    results = [
        burnout_profile,
        chaotic_profile,
        declining_profile,
        recovery_profile,
        sustainable_profile,
        weekend_warrior_profile
    ]

    def get_confidence(profile: ProfileResult) -> float:
        return profile.confidence     
    
    ranked_profiles: list[ProfileResult] = sorted(results, key=get_confidence, reverse=True)   

    return InterpretationResult(
        primary_profile=ranked_profiles[0],
        all_profiles=ranked_profiles,   
    )
    


    