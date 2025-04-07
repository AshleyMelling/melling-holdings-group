# app/tasks.py
import os
import krakenex
from datetime import datetime
from sqlalchemy.orm import Session
from app.db_models import KrakenWallet
from app.database import SessionLocal
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

def get_kraken_client():
    k = krakenex.API()
    k.key = os.getenv("KRAKEN_API_KEY")
    k.secret = os.getenv("KRAKEN_API_SECRET")
    return k

def update_kraken_data():
    """
    Fetch Kraken data and update the database.
    If a record exists for an asset, update its balance and timestamp;
    otherwise, create a new record.
    """
    client = get_kraken_client()
    response = client.query_private("Balance")
    
    if response.get("error"):
        print("Error fetching Kraken data:", response["error"])
        return

    data = response["result"]
    db: Session = SessionLocal()
    try:
        for asset, balance_str in data.items():
            # Find an existing record
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
        print(f"[{datetime.utcnow()}] Kraken data updated successfully.")
    except Exception as e:
        db.rollback()
        print("Error updating Kraken data:", e)
    finally:
        db.close()
