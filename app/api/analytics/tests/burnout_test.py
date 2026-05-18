from api.analytics.datasets.burnout import burnout_logs
from api.analytics.insights.streak_engine import (
    calculate_streak,
    calculate_longest_streak,
    calculate_streak_statistics,
    find_streak_breaks
)

current_streak = calculate_streak(burnout_logs)
print(f"Current Streak: {current_streak}")

longest_streak = calculate_longest_streak(burnout_logs)
print(f"Longest Streak: {longest_streak}")

streak_breaks = find_streak_breaks(burnout_logs)
print(f"Streak Breaks: {streak_breaks}")


statistics = calculate_streak_statistics(burnout_logs)
print(f"\nStatistics Summary:\n{statistics}")