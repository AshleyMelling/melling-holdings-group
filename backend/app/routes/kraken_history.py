# /home/remem/bitcoinholdings/backend/app/routes/kraken_history.py
from fastapi import UploadFile, File, APIRouter, Depends, HTTPException
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
def get_ledgers(db: Session = Depends(get_db)):
    ledgers = db.query(KrakenLedger).order_by(KrakenLedger.time.desc()).all()
    return [ledger.__dict__ for ledger in ledgers]

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
