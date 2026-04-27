from fastapi import FastAPI
from app.db.base import Base
from app.db.database import engine

from app.api.auth.router import router as user_router
from app.api.goals.router import router as goal_router
from app.api.tasklogs.router import router as tasklog_router
from app.api.tasks.router import router as task_router

from app.api.insights.router import router as insights_router


Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(user_router, prefix="/users", tags=['users'])
app.include_router(goal_router, prefix="/goals", tags=['goals'])
app.include_router(task_router, prefix="/tasks", tags=['tasks'])
app.include_router(tasklog_router, prefix="/tasklogs", tags=['tasklogs'])
app.include_router(insights_router, tags=['insights'])



@app.get('/health')
def health():
    return {
        "message" : "healthy endpoint" 
    }
