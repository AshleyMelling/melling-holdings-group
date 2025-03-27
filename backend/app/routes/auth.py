from fastapi import APIRouter, HTTPException, Depends
from app.models import UserSignup, UserLogin  # Import both models
from app.auth import hash_password
from app.database import SessionLocal
from app.db_models import User
from sqlalchemy.orm import Session
from app.security import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
async def signup(user: UserSignup, db: Session = Depends(get_db)):
    # Check if the email is already registered
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User created successfully"}

@router.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    from app.auth import verify_password
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    from app.auth import create_access_token
    access_token = create_access_token(data={"sub": db_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": db_user.username,
            "email": db_user.email
        }
    }

@router.get("/user")
async def read_user(current_user: dict = Depends(get_current_user)):
    # Assume get_current_user returns a dict with user details.
    return current_user