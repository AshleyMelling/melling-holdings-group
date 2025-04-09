from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import ALLOWED_ORIGINS
from app.routes.auth import router as auth_router
from app.routes.protected import router as protected_router
from app.routes.wallets import router as wallets_router  # Exposes /api/fetch-wallet-data and /api/cold-storage-wallets
from app.routes import wallets
from app.routes.kraken import router as kraken_router
from app.routes import kraken_history
from app.database import engine
from app.db_models import Base
from app.routes.kraken_sync import router as kraken_sync_router
from app.routes.ledger_upload import router as ledger_upload_router

# ✅ ENV loader
from dotenv import load_dotenv
import os
from pathlib import Path

# ✅ Load .env from backend directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

ENV = os.getenv("ENV", "production")
print(f"🚀 Running in {ENV} mode")

app = FastAPI()

# ✅ CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create database tables
Base.metadata.create_all(bind=engine)

# ✅ Routers
app.include_router(auth_router, prefix="/api")              # /api/login, /api/signup, /api/user
app.include_router(protected_router, prefix="/api")         # /api/protected
app.include_router(wallets_router, prefix="/api")           # /api/fetch-wallet-data
app.include_router(wallets.router, prefix="/api")           # /api/wallets
app.include_router(kraken_router, prefix="/api")            # /api/kraken/balance
app.include_router(kraken_history.router, prefix="/api")    # /api/kraken/history/...
app.include_router(kraken_sync_router, prefix="/api")      # /api/kraken/sync
app.include_router(ledger_upload_router, prefix="/api")


# ✅ (Optional) Scheduler for Kraken sync
# from apscheduler.schedulers.background import BackgroundScheduler
# from app.tasks import update_kraken_data
# scheduler = BackgroundScheduler()

# @app.on_event("startup")
# def start_scheduler():
#     scheduler.add_job(update_kraken_data, "interval", minutes=5)
#     scheduler.start()
#     print("✅ Scheduler started: Kraken data will update every 5 minutes.")

# @app.on_event("shutdown")
# def shutdown_scheduler():
#     scheduler.shutdown()
#     print("🛑 Scheduler shut down.")

# ✅ Print all routes on startup
for route in app.routes:
    print("ROUTE:", route.path, route.methods)

# ✅ Run dev server (with reload in development mode)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=(ENV == "development"))
