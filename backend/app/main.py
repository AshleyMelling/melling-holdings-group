from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import ALLOWED_ORIGINS
from app.routes.auth import router as auth_router
from app.routes.protected import router as protected_router
from app.routes.wallets import router as wallets_router # 🆕 Add this
from app.database import engine
from app.db_models import Base
from app.routes import wallets

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.mellingholdingsgroup.com"],  # Update to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth_router, prefix="/api")
app.include_router(protected_router, prefix="/api")
app.include_router(wallets_router, prefix="/api")  # 🆕 This exposes /api/fetch-wallet-data and /api/cold-storage-wallets
app.include_router(wallets.router, prefix="/api")

for route in app.routes:
    print("ROUTE:", route.path, route.methods)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
