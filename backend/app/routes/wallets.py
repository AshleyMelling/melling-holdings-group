import json
import requests
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.models import (
    WalletLookupRequest,
    ColdStorageWalletCreate,
    ColdStorageWalletResponse,
)
from app.db_models import ColdStorageWallet
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/lookup-wallet")
def fetch_wallet_data(req: WalletLookupRequest):
    url = f"https://mempool.space/api/address/{req.address}"
    res = requests.get(url)

    if res.status_code != 200:
        raise HTTPException(status_code=404, detail="Wallet not found")

    data = res.json()
    funded = data["chain_stats"]["funded_txo_sum"]
    spent = data["chain_stats"]["spent_txo_sum"]
    balance_sats = funded - spent
    balance_btc = round(balance_sats / 1e8, 8)
    now = datetime.utcnow().isoformat()

    return {
        "name": req.name,
        "address": req.address,
        "balance": str(balance_btc),
        "lastChecked": now,
        "data": data,
    }

# in your FastAPI route (save_wallet)
@router.post("/cold-storage-wallets", response_model=ColdStorageWalletResponse)
def save_wallet(payload: ColdStorageWalletCreate, db: Session = Depends(get_db)):
    # Check for existing address or name
    existing = db.query(ColdStorageWallet).filter(
        (ColdStorageWallet.address == payload.address) |
        (ColdStorageWallet.name == payload.name)
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="Wallet with that name or address already exists")

    wallet = ColdStorageWallet(
        name=payload.name,
        address=payload.address,
        balance=payload.balance,
        lastChecked=payload.lastChecked,
        data=json.dumps(payload.data)
    )
    db.add(wallet)
    db.commit()
    db.refresh(wallet)
    return wallet



@router.get("/wallets", response_model=List[ColdStorageWalletResponse])
def list_wallets(db: Session = Depends(get_db)):
    wallets = db.query(ColdStorageWallet).all()
    print("🔎 Returning wallets:", wallets)
    return wallets

@router.delete("/wallets/{wallet_id}")
def delete_wallet(wallet_id: int, db: Session = Depends(get_db)):
    wallet = db.query(ColdStorageWallet).filter(ColdStorageWallet.id == wallet_id).first()

    if not wallet:
        print(f"❌ Wallet ID {wallet_id} not found.")
        raise HTTPException(status_code=404, detail="Wallet not found")

    print(f"🗑️ Deleting wallet: ID={wallet.id}, Label={wallet.name}, Address={wallet.address}")
    db.delete(wallet)
    db.commit()

    print("✅ Deletion committed.")
    return {"status": "success", "message": f"Wallet ID {wallet_id} deleted"}

