from fastapi import HTTPException, APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.auth.user_signup import create_user
from app.api.auth.user_login import login_user
from app.db.database import get_db
from app.schemas.user import UserRead, UserCreate, UserLogin, TokenResponse


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

@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
   
    token = login_user(user.email, user.password, db)

    if not token: # token  None | Empty | False & not explicitly None
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return TokenResponse(
        access_token=token,
        token_type="bearer"
    )

