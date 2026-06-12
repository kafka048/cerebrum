from datetime import date

from schemas.task_log import TaskLogCreate, TaskStatus

"""
DATASET: SUSTAINABLE PERFORMER

Behavioral Profile:
- Consistently high execution
- Occasional interruptions
- No burnout signature
- No recovery signature
- No meaningful decline
- Sustainable long-term performance

Expected Analytics:
- High adherence
- Stable temporal profile
- Near-neutral momentum
- Low transition rate
- Long positive runs
- Short negative runs
- Strong current streak
"""

sustainable_performer_logs = [

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 1),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 2),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 3),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 4),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 5),
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 6),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 7),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 8),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 9),
        status=TaskStatus.completed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 10),
        status=TaskStatus.failed
    ),

    TaskLogCreate(
        task_id=1,
        log_date=date(2026, 5, 11),
        status=TaskStatus.completed
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
        status=TaskStatus.failed
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