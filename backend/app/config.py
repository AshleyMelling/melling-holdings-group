# app/config.py
import os

# JWT configuration and other constants
SECRET_KEY = "your-secret-key"  # Replace with a secure key for production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://www.mellingholdingsgroup.com")

ALLOWED_ORIGINS = [FRONTEND_URL]