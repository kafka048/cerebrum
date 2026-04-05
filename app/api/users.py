from fastapi import APIRouter, HTTPException, Depends 
from sqlalchemy.orm import Session

from app.db.database import get_db 
from app.models.user import User 
from app.schemas.user import UserCreate, UserRead 
from app.core.security import hash_password

router = APIRouter()

@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)): 
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="A User associated with this email already exists. Please try again with a new email.")
    
    hashed_pwd = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_pwd
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
       raise HTTPException(status_code=400, detail="User does not exist")

