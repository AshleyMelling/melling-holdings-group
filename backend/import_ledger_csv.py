# scripts/import_ledger_csv.py

import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from app.db_models import KrakenLedger
from app.database import SessionLocal

CSV_PATH = "/home/remem/bitcoinholdings/backend/ledgers.csv"

def run_import():
    df = pd.read_csv(CSV_PATH)

    # Create DB session
    db: Session = SessionLocal()

    inserted = 0
    for _, row in df.iterrows():
        try:
            ledger = KrakenLedger(
                refid=row.get("refid"),
                type=row.get("type"),
                asset=row.get("asset"),
                amount=str(row.get("amount")),
                fee=str(row.get("fee")),
                time=row.get("time"),
                txid=row.get("txid"),
                subtype=row.get("subtype"),
                aclass=row.get("aclass"),
                wallet=row.get("wallet"),
                balance=str(row.get("balance")),
                raw_data=row.to_dict(),
            )
            db.add(ledger)
            inserted += 1
        except Exception as e:
            print(f"⚠️ Skipped row due to error: {e}")

    db.commit()
    db.close()
    print(f"✅ Imported {inserted} ledger rows from CSV.")

if __name__ == "__main__":
    run_import()
