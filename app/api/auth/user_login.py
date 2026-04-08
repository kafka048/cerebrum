from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_password, create_access_token

class UserLogin:
    email: str
    password: str

def login_user(email: str, password: str, db: Session):
    email = email.lower().strip()

    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    
    if not verify_password(password, user.hashed_password): # type: ignore
        return None
    
    access_token = create_access_token({"sub" : str(user.user_id)})

    return access_token
