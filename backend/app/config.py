# app/config.py

# JWT configuration and other constants
SECRET_KEY = "your-secret-key"  # Replace with a secure key for production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CORS settings
ALLOWED_ORIGINS = ["http://localhost:3000"]