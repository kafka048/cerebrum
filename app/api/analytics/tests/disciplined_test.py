from analytics.datasets.disciplined import disciplined_logs
from analytics.insights.streak_engine import calculate_streak, calculate_longest_streak, calculate_streak_statistics, find_streak_breaks

current_streak = calculate_streak(disciplined_logs)
print(f"Current Streak: {current_streak}")

longest_streak = calculate_longest_streak(disciplined_logs)
print(f"Longest Streak: {longest_streak}")

streak_breaks = find_streak_breaks(disciplined_logs)
print(f"Streak Breaks: {streak_breaks}")


statistics = calculate_streak_statistics(disciplined_logs)
print(f"\nStatistics Summary:\n{statistics}")