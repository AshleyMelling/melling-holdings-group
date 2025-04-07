from fastapi import APIRouter, HTTPException, Depends
import krakenex
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import SessionLocal  # Your database session maker
from app.db_models import KrakenWallet

load_dotenv()

router = APIRouter()

# Helper function to get Kraken API client
def get_kraken_client():
    k = krakenex.API()
    k.key = os.getenv("KRAKEN_API_KEY")
    k.secret = os.getenv("KRAKEN_API_SECRET")
    return k

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET endpoint to fetch Kraken balances
@router.get("/kraken/balance")
def get_kraken_balance():
    k = get_kraken_client()
    response = k.query_private("Balance")
    if "error" in response and response["error"]:
        raise HTTPException(status_code=400, detail=response["error"])
    return response["result"]

# POST endpoint to store Kraken data into the database
@router.post("/kraken/store")
def store_kraken_data(db: Session = Depends(get_db)):
    k = get_kraken_client()
    response = k.query_private("Balance")
    if "error" in response and response["error"]:
        raise HTTPException(status_code=400, detail=response["error"])
    
    data = response["result"]
    
    for asset, balance_str in data.items():
        # Check if the record for this asset exists
        existing = db.query(KrakenWallet).filter(KrakenWallet.asset == asset).first()
        if existing:
            existing.balance = balance_str
            existing.last_updated = datetime.utcnow()
        else:
            new_wallet = KrakenWallet(
                asset=asset,
                balance=balance_str,
                last_updated=datetime.utcnow()
            )
            db.add(new_wallet)
    
    db.commit()
    return {"detail": "Kraken wallet data stored successfully"}

@router.get("/kraken/data")
def get_stored_kraken_data(db: Session = Depends(get_db)):
    wallets = db.query(KrakenWallet).all()
    # Format data to JSON serializable format
    return [
        {
            "asset": wallet.asset,
            "balance": wallet.balance,
            "last_updated": wallet.last_updated.isoformat() if wallet.last_updated else None,
        }
        for wallet in wallets
    ]