# from api.analytics.datasets.disciplined import disciplined_logs
# from api.analytics.datasets.chaotic import chaotic_logs
from api.analytics.datasets.recovering import recovering_logs
# from api.analytics.signals.streak_engine import calculate_streak, calculate_longest_streak, calculate_streak_statistics, find_streak_breaks

from api.analytics.signals.momentum_engine import calculate_weighted_score, calculate_momentum_direction, calculate_momentum_acceleration, calculate_momentum_statistics
# current_streak = calculate_streak(disciplined_logs)
# print(f"Current Streak: {current_streak}")

# longest_streak = calculate_longest_streak(disciplined_logs)
# print(f"Longest Streak: {longest_streak}")

# streak_breaks = find_streak_breaks(disciplined_logs)
# print(f"Streak Breaks: {streak_breaks}")


# statistics = calculate_streak_statistics(disciplined_logs)
# print(f"\nStatistics Summary:\n{statistics}")


weighted_score = calculate_weighted_score(recovering_logs)
print(f"Weighted Score: {weighted_score}")

momentum_direction = calculate_momentum_direction(recovering_logs)
print(f"Momentum Direction: {momentum_direction}")

momentum_acceleration = calculate_momentum_acceleration(recovering_logs)
print(f"Momentum Acceleration: {momentum_acceleration}")

momentum_stats = calculate_momentum_statistics(recovering_logs)
print(f"Momentum Statistics: {momentum_stats}")