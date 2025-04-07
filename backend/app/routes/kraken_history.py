from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_session as get_db
from app.db_models import KrakenTrade, KrakenLedger

router = APIRouter()

@router.get("/kraken/history/trades")
def get_trades(db: Session = Depends(get_db)):
    trades = db.query(KrakenTrade).order_by(KrakenTrade.time.desc()).all()
    return [trade.__dict__ for trade in trades]

@router.get("/kraken/history/ledgers")
def get_ledgers(db: Session = Depends(get_db)):
    ledgers = db.query(KrakenLedger).order_by(KrakenLedger.time.desc()).all()
    return [ledger.__dict__ for ledger in ledgers]
