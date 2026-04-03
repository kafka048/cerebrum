from fastapi import FastAPI
from app.db.base import Base
from app.db.database import engine
import app.models

Base.metadata.create_all(bind=engine)




app = FastAPI()

@app.get('/health')
def health():
    return {
        "message" : "healthy endpoint" 
    }
