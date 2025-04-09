from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import time

from app.database import get_session as get_db
from app.db_models import KrakenTrade, KrakenLedger
from app.routes.kraken_client import kraken  # shared Kraken client

router = APIRouter()

@router.post("/kraken/history/sync")
def sync_kraken_trade_history(db: Session = Depends(get_db)):
    from app.routes.kraken_client import kraken  # shared krakenex API client

    try:
        result = kraken.query_private("TradesHistory")
        trades = result["result"]["trades"]
    except Exception as e:
        print("❌ Error in Kraken sync:", e)
        raise HTTPException(status_code=500, detail="Failed to sync trade history")

    new_count = 0
    for trade_id, trade_data in trades.items():
        try:
            db.execute(
                """
                INSERT INTO kraken_trades (
                    id, order_txid, post_txid, asset_pair, time,
                    trade_type, order_type, price, cost, fee, vol,
                    margin, misc, trade_id, maker, raw_data
                ) VALUES (
                    :id, :order_txid, :post_txid, :asset_pair, :time,
                    :trade_type, :order_type, :price, :cost, :fee, :vol,
                    :margin, :misc, :trade_id, :maker, :raw_data
                )
                ON CONFLICT (id) DO UPDATE SET
                    order_txid = EXCLUDED.order_txid,
                    post_txid = EXCLUDED.post_txid,
                    asset_pair = EXCLUDED.asset_pair,
                    time = EXCLUDED.time,
                    trade_type = EXCLUDED.trade_type,
                    order_type = EXCLUDED.order_type,
                    price = EXCLUDED.price,
                    cost = EXCLUDED.cost,
                    fee = EXCLUDED.fee,
                    vol = EXCLUDED.vol,
                    margin = EXCLUDED.margin,
                    misc = EXCLUDED.misc,
                    trade_id = EXCLUDED.trade_id,
                    maker = EXCLUDED.maker,
                    raw_data = EXCLUDED.raw_data
                """,
                {
                    "id": trade_id,
                    "order_txid": trade_data.get("ordertxid"),
                    "post_txid": trade_data.get("postxid"),
                    "asset_pair": trade_data.get("pair"),
                    "time": trade_data.get("time"),
                    "trade_type": trade_data.get("type"),
                    "order_type": trade_data.get("ordertype"),
                    "price": trade_data.get("price"),
                    "cost": trade_data.get("cost"),
                    "fee": trade_data.get("fee"),
                    "vol": trade_data.get("vol"),
                    "margin": trade_data.get("margin"),
                    "misc": trade_data.get("misc"),
                    "trade_id": trade_data.get("trade_id"),
                    "maker": trade_data.get("maker"),
                    "raw_data": trade_data,
                },
            )
            new_count += 1
        except Exception as e:
            print(f"⚠️ Failed to upsert trade {trade_id}:", e)

    db.commit()
    return {"msg": f"Synced {new_count} trade(s)"}