# app/routes/public.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def home():
    return {"msg": "Welcome to the Home Page!"}

@router.get("/login")
async def login_page():
    return {"msg": "Please log in to access your dashboard."}