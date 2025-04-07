from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import ALLOWED_ORIGINS
from app.routes.auth import router as auth_router
from app.routes.protected import router as protected_router
from app.routes.wallets import router as wallets_router  # Exposes /api/fetch-wallet-data and /api/cold-storage-wallets
from app.database import engine
from app.db_models import Base
from app.routes import wallets
from app.routes.kraken import router as kraken_router
from apscheduler.schedulers.background import BackgroundScheduler
from app.tasks import update_kraken_data  # Our background task function
from app.routes import kraken_history

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
app.include_router(wallets_router, prefix="/api")  # Exposes /api/fetch-wallet-data and /api/cold-storage-wallets
app.include_router(wallets.router, prefix="/api")
app.include_router(kraken_router, prefix="/api")  # Exposes /api/kraken/balance
app.include_router(kraken_history.router, prefix="/api")  # Exposes /api/kraken/history/trades and /api/kraken/history/ledgers
# Scheduler setup
scheduler = BackgroundScheduler()

@app.on_event("startup")
def start_scheduler():
    # Schedule the update_kraken_data function to run every 5 minutes.
    scheduler.add_job(update_kraken_data, "interval", minutes=5)
    scheduler.start()
    print("Scheduler started: Kraken data will update every 5 minutes.")

@app.on_event("shutdown")
def shutdown_scheduler():
    scheduler.shutdown()
    print("Scheduler shut down.")

for route in app.routes:
    print("ROUTE:", route.path, route.methods)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
