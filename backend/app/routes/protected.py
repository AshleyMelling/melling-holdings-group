# app/routes/protected.py

from fastapi import APIRouter, Depends
from app.security import get_current_user

router = APIRouter(
    prefix="/protected",
    dependencies=[Depends(get_current_user)]
)

@router.get("/dashboard")
async def dashboard():
    return {"msg": "Welcome to your protected dashboard!"}
