# /home/remem/bitcoinholdings/backend/app/routes/kraken_history.py
from fastapi import UploadFile, File, APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_session as get_db
from app.db_models import KrakenTrade
from app.routes.kraken_client import kraken  # assuming you defined this globally
from datetime import datetime
from app.db_models import KrakenLedger
import pandas as pd
from sqlalchemy.exc import SQLAlchemyError
from io import StringIO


router = APIRouter()

@router.get("/kraken/history/trades")
def get_trades(db: Session = Depends(get_db)):
    trades = db.query(KrakenTrade).order_by(KrakenTrade.time.desc()).all()
    return [trade.__dict__ for trade in trades]

@router.get("/kraken/history/ledgers")
def get_ledgers(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    total = db.query(KrakenLedger).count()
    offset = (page - 1) * page_size
    ledgers = (
        db.query(KrakenLedger)
        .order_by(KrakenLedger.time.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": [ledger.__dict__ for ledger in ledgers]
    }

@router.post("/kraken/history/sync")
def sync_kraken_trade_history(db: Session = Depends(get_db)):
    try:
        response = kraken.query_private("TradesHistory", {"trades": True})

        if "error" in response and response["error"]:
            print("❌ Kraken API error:", response["error"])
            raise HTTPException(status_code=400, detail=response["error"])

        trades = response["result"]["trades"]
        count = 0

        for trade_id, trade_data in trades.items():
            trade = KrakenTrade(
                id=trade_id,
                order_txid=trade_data.get("ordertxid"),
                post_txid=trade_data.get("postxid"),
                asset_pair=trade_data.get("pair"),
                time=trade_data.get("time"),
                trade_type=trade_data.get("type"),
                order_type=trade_data.get("ordertype"),
                price=trade_data.get("price"),
                cost=trade_data.get("cost"),
                fee=trade_data.get("fee"),
                vol=trade_data.get("vol"),
                margin=trade_data.get("margin"),
                misc=trade_data.get("misc"),
                trade_id=trade_data.get("trade_id"),
                maker=trade_data.get("maker"),
                raw_data=trade_data,
            )

            db.merge(trade)
            count += 1

        db.commit()
        print(f"✅ Synced {count} trades successfully.")
        return {"detail": f"Synced {count} trades successfully"}

    except Exception as e:
        print("❌ Error in Kraken sync:", str(e))
        raise HTTPException(status_code=500, detail="Trade sync failed")

@router.post("/kraken/history/sync-ledgers")
def sync_kraken_ledger_history(db: Session = Depends(get_db)):
    try:
        latest = db.query(KrakenLedger).order_by(KrakenLedger.time.desc()).first()
        latest_time = int(latest.time.timestamp()) - 10 if latest else None
        params = {"start": latest_time} if latest_time else {}

        result = kraken.query_private("Ledgers", params)
        ledgers = result["result"]["ledger"]
        count = 0

        existing_txids = {
            txid for (txid,) in db.query(KrakenLedger.txid).all()
        }

        for txid, data in ledgers.items():
            if txid in existing_txids:
                continue  # avoid duplicates

            ledger = KrakenLedger(
                txid=txid,
                refid=data.get("refid"),
                time=datetime.fromtimestamp(data.get("time")),
                type=data.get("type"),
                subtype=data.get("subtype", ""),
                aclass=data.get("aclass", ""),
                asset=data.get("asset"),
                amount=data.get("amount"),
                fee=data.get("fee", "0.0000"),
                balance=data.get("balance"),
                wallet=None,  # often missing from API
                raw_data=data  
            )

            db.add(ledger)
            count += 1

        db.commit()
        print(f"✅ Synced {count} new ledger entries.")
        return {"detail": f"Synced {count} new ledger entries"}

    except Exception as e:
        print("❌ Error syncing ledger history:", str(e))
        raise HTTPException(status_code=500, detail="Ledger sync failed")