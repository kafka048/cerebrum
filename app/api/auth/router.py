from fastapi import HTTPException, APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.auth.user_signup import create_user
from app.db.database import get_db
from app.schemas.user import UserRead, UserCreate

router = APIRouter(prefix='/user/auth', tags=["AUTH"])

@router.post("/signup", response_model=UserRead)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    new_user = create_user(user, db)

    if not new_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    return new_user

