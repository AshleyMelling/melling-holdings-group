import os
from fastapi import APIRouter, HTTPException, Depends, Response
from app.models import UserSignup, UserLogin
from app.auth import hash_password, verify_password, create_access_token
from app.database import SessionLocal
from app.db_models import User
from sqlalchemy.orm import Session
from app.security import get_current_user

router = APIRouter()

# Environment flag for dev vs. production
IS_PROD = os.getenv("ENV") == "production"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
async def signup(user: UserSignup, db: Session = Depends(get_db)):
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
async def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        print("❌ User not found:", user.email)
    else:
        print("✅ User found:", db_user.email)
        print("🔐 Stored hash:", db_user.hashed_password)
        print("🔐 Input password:", user.password)
        print("🔍 Password match?", verify_password(user.password, db_user.hashed_password))

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": db_user.email})

    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=False,  # Make sure it's False for development
        samesite="lax",
        path="/",
        max_age=60 * 60 * 24 * 7
    )


    return {
        "msg": "Login successful",
        "user": {
            "name": db_user.username,
            "email": db_user.email
        }
    }

@router.get("/user")
async def read_user(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="token", path="/")
    return {"msg": "Logged out successfully"}
