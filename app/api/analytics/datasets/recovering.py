from datetime import date

from schemas.task_log import TaskLogCreate, TaskStatus

"""
DATASET: RECOVERING USER

Behavioral Profile:
- Poor initial consistency
- Frequent early interruptions
- Gradual stabilization
- Improving continuity over time
- Positive momentum recovery

Expected Analytics:
- Weak early streaks
- Stronger recent streak
- Reduced interruption frequency
- Improving behavioral momentum
- Positive recovery trajectory
"""

recovering_logs = [

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 1),
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 2),
        status=TaskStatus.skipped
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 3),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 4),
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 5),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 6),
        status=TaskStatus.skipped
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 7),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 8),
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 9),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 10),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 11),
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 12),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 13),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 14),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 15),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 16),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 17),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 18),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 19),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 20),
        status=TaskStatus.completed
    ),
]