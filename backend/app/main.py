from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import ALLOWED_ORIGINS
from app.routes.auth import router as auth_router
from app.routes.protected import router as protected_router
from app.database import engine
from app.db_models import Base  # Import your ORM models

app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://34.142.110.84:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables (for MVP, simple approach)
Base.metadata.create_all(bind=engine)

# Include authentication routes
app.include_router(auth_router)
app.include_router(protected_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
