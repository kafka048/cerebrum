from api.analytics.datasets.disciplined import disciplined_logs
from api.analytics.datasets.chaotic import chaotic_logs
from api.analytics.datasets.recovering import recovering_logs
from api.analytics.datasets.burnout import burnout_logs
from api.analytics.datasets.declining import declining_logs
from api.analytics.datasets.weekend_warrior import weekend_warrior_logs

# from api.analytics.signals.streak_engine import calculate_streak, calculate_longest_streak, calculate_streak_statistics, find_streak_breaks
# from api.analytics.signals.adherence_engine import calculate_adherence_rate, calculate_recent_adherence, calculate_temporal_adherence_profile, calculate_adherence_statistics
# from api.analytics.signals.momentum_engine import calculate_weighted_score, calculate_momentum_direction, calculate_momentum_acceleration, calculate_momentum_statistics
from api.analytics.signals.consistency_engine import convert_tasklogs_binary
from api.analytics.signals.signals_aggregator import signals_aggregator


# ==================================================
# DISCIPLINED DATASET
# ==================================================

print("\n=== DISCIPLINED DATASET ===")

disciplined_dataset = convert_tasklogs_binary(disciplined_logs)
print(f"Disciplined Dataset: {disciplined_dataset}")

aggregated_stats = signals_aggregator(disciplined_logs)

print(f"Aggregated Stats for Disciplined Logs: {aggregated_stats}")

print()


# ==================================================
# CHAOTIC DATASET
# ==================================================

print("\n=== CHAOTIC DATASET ===")

chaotic_dataset = convert_tasklogs_binary(chaotic_logs)
print(f"Chaotic Dataset: {chaotic_dataset}")

aggregated_stats = signals_aggregator(chaotic_logs)

print(f"Aggregated Stats for Chaotic Logs: {aggregated_stats}")

print()


# ==================================================
# RECOVERING DATASET
# ==================================================

print("\n=== RECOVERING DATASET ===")

recovering_dataset = convert_tasklogs_binary(recovering_logs)
print(f"Recovering Dataset: {recovering_dataset}")

aggregated_stats = signals_aggregator(recovering_logs)

print(f"Aggregated Stats for Recovering Logs: {aggregated_stats}")

print()


# ==================================================
# BURNOUT DATASET
# ==================================================

print("\n=== BURNOUT DATASET ===")

burnout_dataset = convert_tasklogs_binary(burnout_logs)
print(f"Burnout Dataset: {burnout_dataset}")

aggregated_stats = signals_aggregator(burnout_logs)

print(f"Aggregated Stats for Burnout Logs: {aggregated_stats}")

print()


# ==================================================
# DECLINING DATASET
# ==================================================

print("\n=== DECLINING DATASET ===")

declining_dataset = convert_tasklogs_binary(declining_logs)
print(f"Declining Dataset: {declining_dataset}")

aggregated_stats = signals_aggregator(declining_logs)

print(f"Aggregated Stats for Declining Logs: {aggregated_stats}")

print()


# ==================================================
# WEEKEND WARRIOR DATASET
# ==================================================

print("\n=== WEEKEND WARRIOR DATASET ===")

weekend_warrior_dataset = convert_tasklogs_binary(weekend_warrior_logs)
print(f"Weekend Warrior Dataset: {weekend_warrior_dataset}")

aggregated_stats = signals_aggregator(weekend_warrior_logs)

print(f"Aggregated Stats for Weekend Warrior Logs: {aggregated_stats}")

print()