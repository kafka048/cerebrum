from datetime import date, timedelta

from app.db.database import createSession
from app.models.user import User
from app.models.goal import Goal
from app.models.task import Task
from app.models.task_log import TaskLog
from app.schemas.task_log import TaskStatus
from app.core.security import hash_password

def seed():

    db = createSession()

    try:
        # SEEDED USER
        user = User(
            name="aditi karki",
            email="aditikarki@gmail.com",
            hashed_password = hash_password("aditikarki123")
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        # SEEDED GOALS
        cat_goal = Goal(
            goal_name="Study for CAT",
            description="I have a year to prepare for CAT",
            priority=1,
            start_date=date.today(),
            end_date=(date.today() + timedelta(days=365)),
            status='active',
            user_id=user.user_id
        )

        webdev_goal = Goal(
        goal_name="Become a Full Stack Developer",
        description="Master backend development, databases, APIs, and frontend technologies to become industry ready.",
        priority=1,
        start_date=date.today(),
        end_date=date.today() + timedelta(days=365),
        status="active",
        user_id=user.user_id
        )

        fitness_goal = Goal(
        goal_name="Build a Strong and Athletic Body",
        description="Improve strength, endurance, running performance, and maintain a sustainable fitness routine.",
        priority=1,
        start_date=date.today(),
        end_date=date.today() + timedelta(days=365),
        status="active",
        user_id=user.user_id
        )

        college_goal = Goal(
            goal_name="Get 9+ CGPA",
            description="Score a good CGPA to get good placement",
            priority=1,
            start_date=date.today(),
            end_date=date.today()+timedelta(days=4*365),
            status="active",
            user_id=user.user_id
        )
        
        db.add_all([
            cat_goal,
            webdev_goal,
            fitness_goal,
            college_goal
        ])

        db.commit()
        db.refresh(cat_goal)
        db.refresh(webdev_goal)
        db.refresh(fitness_goal)
        db.refresh(college_goal)

        #SEEDED TASKS
        study_quant = Task(
            task_name="Study Quant",
            goal_id=cat_goal.goal_id
        )

        backend_development = Task(
            task_name="Backend Development",
            goal_id=webdev_goal.goal_id
        )

        run_5k = Task(
            task_name="Run 5k",
            goal_id=fitness_goal.goal_id
        )

        prep_college_exam = Task(
            task_name="Prepare for college exams",
            goal_id=college_goal.goal_id
        )

        db.add_all([
            study_quant,
            backend_development,
            run_5k,
            prep_college_exam
        ])
        db.commit()
        db.refresh(study_quant)
        db.refresh(backend_development)
        db.refresh(run_5k)
        db.refresh(prep_college_exam)

        #SEEDEDTASKLOGS

        quant_pattern = (
            [TaskStatus.completed] * 10 +
            [TaskStatus.failed] * 1 +

            [TaskStatus.completed] * 8 +
            [TaskStatus.failed] * 2 +

            [TaskStatus.completed] * 12 +
            [TaskStatus.skipped] * 1 +
            [TaskStatus.failed] * 2 +

            [TaskStatus.completed] * 9 +
            [TaskStatus.failed] * 3 +

            [TaskStatus.completed] * 15 +
            [TaskStatus.skipped] * 1 +
            [TaskStatus.failed] * 2 +

            [TaskStatus.completed] * 10 +
            [TaskStatus.failed] * 2 +

            [TaskStatus.completed] * 8 +
            [TaskStatus.skipped] * 1 +
            [TaskStatus.failed] * 2 +

            [TaskStatus.completed] * 9 +
            [TaskStatus.failed] * 2
        ) # SUSTAINABLE 

        backend_pattern = (            
            [TaskStatus.failed] * 8 +

            [TaskStatus.completed] * 3 +
            [TaskStatus.failed] * 4 +

            [TaskStatus.completed] * 5 +
            [TaskStatus.failed] * 3 +

            [TaskStatus.completed] * 8 +
            [TaskStatus.skipped] * 2 +

            [TaskStatus.completed] * 10 +
            [TaskStatus.failed] * 2 +

            [TaskStatus.completed] * 12 +
            [TaskStatus.skipped] * 1 +

            [TaskStatus.completed] * 15 +
            [TaskStatus.failed] * 1 +

            [TaskStatus.completed] * 12 +
            [TaskStatus.skipped] * 1 +

            [TaskStatus.completed] * 13
        ) # RECOVERING

        fitness_pattern = (
            [TaskStatus.completed] * 20 +

            [TaskStatus.completed] * 15 +
            [TaskStatus.failed] * 1 +

            [TaskStatus.completed] * 12 +
            [TaskStatus.failed] * 3 +

            [TaskStatus.completed] * 10 +
            [TaskStatus.failed] * 5 +

            [TaskStatus.completed] * 5 +
            [TaskStatus.failed] * 8 +

            [TaskStatus.completed] * 2 +
            [TaskStatus.failed] * 10 +

            [TaskStatus.skipped] * 9
        ) # AMBIGUOUS BURNOUT

        college_pattern = (
            [TaskStatus.completed] * 20 +
            [TaskStatus.completed] * 18 + [TaskStatus.failed] * 2 +
            [TaskStatus.completed] * 19 + [TaskStatus.skipped] * 1 +
            [TaskStatus.completed] * 18 + [TaskStatus.failed] * 2 +
            [TaskStatus.completed] * 20 +
            [TaskStatus.failed] * 9 + 
            [TaskStatus.skipped] * 8 + 
            [TaskStatus.failed] * 4
        ) # CLEAN BURNOUT

        def seed_logs(task: Task, pattern: list[TaskStatus]):     

            for index, status in enumerate(reversed(pattern)): # newest status becomes today's log.
                log = TaskLog(
                    log_date=date.today() - timedelta(days=index),
                    status=status,
                    task_id=task.task_id,
                    user_id=user.user_id
                )   

                db.add(log)
        
        seed_logs(study_quant, quant_pattern)
        seed_logs(backend_development, backend_pattern)
        seed_logs(run_5k, fitness_pattern)
        seed_logs(prep_college_exam, college_pattern)

        db.commit()

    finally:
        db.close()

        
def seed_threshold_data():
    db = createSession()

    try:
        # SEEDED USER
        user = User(
            name="parishasheoran",
            email="parishasheoran@gmail.com",
            hashed_password = hash_password("parisha123")
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        # SEEDED GOALS
        read_goal = Goal(
            goal_name="Read daily",
            description="Improve my comprehension skills",
            priority=1,
            start_date=date.today(),
            end_date=(date.today() + timedelta(days=365)),
            status='active',
            user_id=user.user_id
        )

        backend_goal = Goal(
        goal_name="Become a Backend Developer",
        description="Master backend development, databases, APIs technologies to become industry ready.",
        priority=1,
        start_date=date.today(),
        end_date=date.today() + timedelta(days=365),
        status="active",
        user_id=user.user_id
        )

        workout_goal = Goal(
        goal_name="Build Endurance",
        description=" Improve running performance, and maintain a sustainable fitness routine.",
        priority=1,
        start_date=date.today(),
        end_date=date.today() + timedelta(days=365),
        status="active",
        user_id=user.user_id
        )

        language_goal = Goal(
            goal_name="Learn Spanish",
            description="Develop conversational fluency and expand language skills.",
            priority=2,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=365),
            status="active",
            user_id=user.user_id
        )

        career_goal = Goal(
            goal_name="Crack CAT 2027",
            description="Build quantitative aptitude, verbal ability, and test-taking skills for CAT.",
            priority=1,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=365),
            status="active",
            user_id=user.user_id
        )

        writing_goal = Goal(
            goal_name="Write Consistently",
            description="Develop a daily writing habit and improve clarity of expression.",
            priority=2,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=365),
            status="active",
            user_id=user.user_id
        )

        finance_goal = Goal(
            goal_name="Build Emergency Fund",
            description="Save consistently and establish financial security.",
            priority=2,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=365),
            status="active",
            user_id=user.user_id
        )

        meditation_goal = Goal(
            goal_name="Practice Mindfulness",
            description="Improve focus, self-awareness, and emotional regulation through meditation.",
            priority=3,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=365),
            status="active",
            user_id=user.user_id
        )

        networking_goal = Goal(
            goal_name="Grow Professional Network",
            description="Build meaningful professional relationships and expand career opportunities.",
            priority=3,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=365),
            status="active",
            user_id=user.user_id
        )
        
        db.add_all([
            read_goal,
            backend_goal,
            workout_goal,
            language_goal,
            career_goal,
            writing_goal,
            finance_goal,
            meditation_goal,
            networking_goal
        ])

        db.commit()
        for goal in [
            read_goal,
            backend_goal,
            workout_goal,
            language_goal,
            career_goal,
            writing_goal,
            finance_goal,
            meditation_goal,
            networking_goal
        ]:
            db.refresh(goal)


        # SEEDED TASKS

        read_book = Task(
            task_name="Read 20 Pages",
            goal_id=read_goal.goal_id
        )

        backend_project = Task(
            task_name="Backend Development",
            goal_id=backend_goal.goal_id
        )

        run_5k = Task(
            task_name="Run 5km",
            goal_id=workout_goal.goal_id
        )

        spanish_practice = Task(
            task_name="Practice Spanish",
            goal_id=language_goal.goal_id
        )

        study_cat = Task(
            task_name="Study Quant",
            goal_id=career_goal.goal_id
        )

        daily_writing = Task(
            task_name="Write 500 Words",
            goal_id=writing_goal.goal_id
        )

        save_money = Task(
            task_name="Save Money",
            goal_id=finance_goal.goal_id
        )

        meditate = Task(
            task_name="Meditate 10 Minutes",
            goal_id=meditation_goal.goal_id
        )

        network = Task(
            task_name="Reach Out to One Professional",
            goal_id=networking_goal.goal_id
        )

        db.add_all([
            read_book,
            backend_project,
            run_5k,
            spanish_practice,
            study_cat,
            daily_writing,
            save_money,
            meditate,
            network
        ])

        db.commit()

        for task in [
            read_book,
            backend_project,
            run_5k,
            spanish_practice,
            study_cat,
            daily_writing,
            save_money,
            meditate,
            network
        ]:
            db.refresh(task)

        # SEEDED TASKLOGS            

        sustainable_pattern = [
            TaskStatus.completed, TaskStatus.completed, TaskStatus.failed,
            TaskStatus.completed, TaskStatus.completed, TaskStatus.completed,
            TaskStatus.skipped, TaskStatus.completed, TaskStatus.completed,
            TaskStatus.completed, TaskStatus.failed, TaskStatus.completed,
            TaskStatus.completed, TaskStatus.completed, TaskStatus.completed,
            TaskStatus.skipped, TaskStatus.completed, TaskStatus.completed,
            TaskStatus.completed, TaskStatus.failed, TaskStatus.completed,
            TaskStatus.completed, TaskStatus.completed, TaskStatus.completed,
            TaskStatus.completed, TaskStatus.skipped, TaskStatus.completed,
            TaskStatus.completed, TaskStatus.completed, TaskStatus.completed
        ]

        recovery_pattern = [
            TaskStatus.failed, TaskStatus.failed, TaskStatus.skipped,
            TaskStatus.failed, TaskStatus.failed, TaskStatus.failed,
            TaskStatus.skipped, TaskStatus.failed, TaskStatus.completed,
            TaskStatus.failed,

            TaskStatus.failed, TaskStatus.completed, TaskStatus.failed,
            TaskStatus.completed, TaskStatus.completed, TaskStatus.failed,
            TaskStatus.completed, TaskStatus.completed, TaskStatus.failed,
            TaskStatus.completed,

            TaskStatus.completed, TaskStatus.failed, TaskStatus.completed,
            TaskStatus.completed, TaskStatus.completed, TaskStatus.failed,
            TaskStatus.completed, TaskStatus.completed, TaskStatus.completed,
            TaskStatus.completed
        ]

        chaotic_pattern = [
            TaskStatus.completed, TaskStatus.failed, TaskStatus.completed,
            TaskStatus.completed, TaskStatus.skipped, TaskStatus.failed,
            TaskStatus.completed, TaskStatus.failed, TaskStatus.completed,
            TaskStatus.skipped, TaskStatus.completed, TaskStatus.failed,
            TaskStatus.failed, TaskStatus.completed, TaskStatus.completed,
            TaskStatus.skipped, TaskStatus.failed, TaskStatus.completed,
            TaskStatus.completed, TaskStatus.failed, TaskStatus.skipped,
            TaskStatus.completed, TaskStatus.failed, TaskStatus.completed,
            TaskStatus.completed, TaskStatus.skipped, TaskStatus.completed,
            TaskStatus.failed, TaskStatus.completed, TaskStatus.completed
        ]

        task_pattern_map = [
            (read_book, sustainable_pattern, 7),
            (backend_project, sustainable_pattern, 15),
            (run_5k, sustainable_pattern, 22),

            (spanish_practice, recovery_pattern, 7),
            (study_cat, recovery_pattern, 15),
            (daily_writing, recovery_pattern, 22),

            (save_money, chaotic_pattern, 7),
            (meditate, chaotic_pattern, 15),
            (network, chaotic_pattern, 22),
        ]

        def seed_logs(task: Task, pattern: list[TaskStatus]):
            for index, status in enumerate(reversed(pattern)):
                log = TaskLog(
                    log_date=date.today() - timedelta(days=index),
                    status=status,
                    task_id=task.task_id,
                    user_id=user.user_id
                )
                db.add(log)

        for task, pattern, size in task_pattern_map:
            seed_logs(task, pattern[-size:])

        db.commit()

    finally:
        db.close()     



# FUNCTION CALL
seed_threshold_data()
            


            


            
        





