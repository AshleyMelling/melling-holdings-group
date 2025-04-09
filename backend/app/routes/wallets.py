import json
import requests
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from fastapi import Path
import time
from app.models import WalletLookupRequest 

from app.models import (
    WalletLookupRequest,
    ColdStorageWalletCreate,
    ColdStorageWalletResponse,
)
from app.db_models import ColdStorageWallet
from app.dependencies import get_db


router = APIRouter()

@router.post("/lookup-wallet")
def fetch_wallet_data(req: WalletLookupRequest, db: Session = Depends(get_db)):
    base_url = f"https://mempool.space/api/address/{req.address}"

    try:
        res_address = requests.get(base_url, timeout=10)
        res_utxo = requests.get(base_url + "/utxo", timeout=10)
        res_txs = requests.get(base_url + "/txs", timeout=10)
        res_txs_chain = requests.get(base_url + "/txs/chain", timeout=10)
        res_txs_mempool = requests.get(base_url + "/txs/mempool", timeout=10)
    except requests.RequestException:
        raise HTTPException(status_code=503, detail="Failed to reach mempool.space")

    if res_address.status_code != 200:
        raise HTTPException(status_code=404, detail="Wallet not found")

    # Load data safely
    try:
        full_data = {
            **res_address.json(),
            "utxos": res_utxo.json() if res_utxo.ok else [],
            "txs": res_txs.json() if res_txs.ok else [],
            "txs_chain": res_txs_chain.json() if res_txs_chain.ok else [],
            "txs_mempool": res_txs_mempool.json() if res_txs_mempool.ok else [],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse data: {e}")

    # Calculate balance
    chain_stats = full_data["chain_stats"]
    funded = chain_stats.get("funded_txo_sum", 0)
    spent = chain_stats.get("spent_txo_sum", 0)
    balance_sats = funded - spent
    balance_btc = round(balance_sats / 1e8, 8)
    now = datetime.utcnow().isoformat()

    # Update DB
    wallet = db.query(ColdStorageWallet).filter_by(address=req.address).first()
    if wallet:
        wallet.balance = str(balance_btc)
        wallet.lastChecked = now
        wallet.data = json.dumps(full_data)
        db.commit()
        db.refresh(wallet)

    return {
        "name": req.name,
        "address": req.address,
        "balance": str(balance_btc),
        "lastChecked": now,
        "data": full_data
    }


# in your FastAPI route (save_wallet)
@router.post("/cold-storage-wallets", response_model=ColdStorageWalletResponse)
def save_wallet(payload: ColdStorageWalletCreate, db: Session = Depends(get_db)):
    # Check for existing wallet with the same address only
    existing = db.query(ColdStorageWallet).filter(
        ColdStorageWallet.address == payload.address
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="Wallet with that address already exists")

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

from fastapi import Path

@router.patch("/wallets/{wallet_id}", response_model=ColdStorageWalletResponse)
def update_wallet(wallet_id: int, payload: ColdStorageWalletCreate, db: Session = Depends(get_db)):
    wallet = db.query(ColdStorageWallet).filter(ColdStorageWallet.id == wallet_id).first()

    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    wallet.name = payload.name
    wallet.address = payload.address
    wallet.balance = payload.balance
    wallet.lastChecked = payload.lastChecked
    wallet.data = json.dumps(payload.data)

    db.commit()
    db.refresh(wallet)

    return wallet

@router.post("/wallets/sync")
def sync_all_wallets(db: Session = Depends(get_db)):
    """
    Re-fetch all known wallet addresses from the DB and update their balance/data.
    """
    wallets = db.query(ColdStorageWallet).all()
    updated = 0

    for wallet in wallets:
        print(f"🔄 Syncing: {wallet.name} - {wallet.address}")
        try:
            url = f"https://mempool.space/api/address/{wallet.address}"
            res_address = requests.get(url, timeout=10)

            if res_address.status_code != 200:
                print(f"❌ Failed to fetch: {wallet.address}")
                continue

            data = res_address.json()
            funded = data["chain_stats"].get("funded_txo_sum", 0)
            spent = data["chain_stats"].get("spent_txo_sum", 0)
            balance_btc = round((funded - spent) / 1e8, 8)
            now = datetime.utcnow().isoformat()

            wallet.balance = str(balance_btc)
            wallet.lastChecked = now
            wallet.data = json.dumps(data)

            updated += 1
        except Exception as e:
            print(f"⚠️ Error syncing {wallet.address}: {e}")
            continue

    db.commit()
    return {"msg": f"Synced {updated} wallet(s)"}

