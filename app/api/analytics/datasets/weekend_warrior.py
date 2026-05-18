from datetime import date

from schemas.task_log import TaskLogCreate, TaskStatus

"""
DATASET: WEEKEND WARRIOR

Behavioral Profile:
- Minimal weekday discipline
- Heavy weekend activity bursts
- Inconsistent long-term continuity
- Cyclical behavioral engagement
- Motivation tied to free-time windows

Expected Analytics:
- Very fragmented streaks
- Frequent interruption points
- Moderate adherence
- High periodicity
- Weak sustained continuity
"""

weekend_warrior_logs = [

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 1),   # Friday
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 2),   # Saturday
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 3),   # Sunday
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 4),   # Monday
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 5),   # Tuesday
        status=TaskStatus.skipped
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 6),   # Wednesday
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 7),   # Thursday
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 8),   # Friday
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 9),   # Saturday
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 10),  # Sunday
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 11),  # Monday
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 12),  # Tuesday
        status=TaskStatus.skipped
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 13),  # Wednesday
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 14),  # Thursday
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 15),  # Friday
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 16),  # Saturday
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 17),  # Sunday
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 18),  # Monday
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 19),  # Tuesday
        status=TaskStatus.skipped
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 20),  # Wednesday
        status=TaskStatus.failed
    ),
]