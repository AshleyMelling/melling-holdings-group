# app/routes/ledger_upload.py

from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
import csv
import io
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_session as get_db
from app.db_models import KrakenLedger

router = APIRouter()

@router.post("/kraken/history/upload-ledger")
async def upload_ledger_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Ensure that a CSV file is uploaded
    if file.content_type != "text/csv":
        raise HTTPException(status_code=400, detail="Invalid file type, please upload a CSV file.")
    try:
        # Read file contents
        contents = await file.read()
        decoded = contents.decode('utf-8')
        
        # Use Python's CSV DictReader to parse CSV data
        reader = csv.DictReader(io.StringIO(decoded))
        
        inserted_count = 0
        for row in reader:
            # Expected CSV columns:
            # "txid", "refid", "time", "type", "subtype", "aclass", "asset", "wallet", "amount", "fee", "balance"
            # Ensure at least the unique identifier is present.
            if not row.get("txid"):
                continue

            # Check for duplicate based on txid
            existing = db.query(KrakenLedger).filter_by(txid=row["txid"]).first()
            if existing:
                continue

            # Convert time. If the time is in "YYYY-MM-DD HH:MM:SS" format, parse it. 
            # Otherwise, try converting directly to float.
            time_str = row.get("time", "")
            try:
                # Try parsing as a datetime string
                dt = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")
                time_float = dt.timestamp()
            except Exception:
                try:
                    time_float = float(time_str)
                except Exception:
                    time_float = 0.0

            # Create new ledger entry
            ledger = KrakenLedger(
                txid = row.get("txid"),
                refid = row.get("refid"),
                type = row.get("type"),
                subtype = row.get("subtype"),
                aclass = row.get("aclass"),
                asset = row.get("asset"),
                wallet = row.get("wallet"),
                amount = row.get("amount"),
                fee = row.get("fee"),
                balance = row.get("balance"),
                time = time_float
            )
            db.add(ledger)
            inserted_count += 1

        db.commit()
        return {"detail": f"Imported {inserted_count} ledger records successfully."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
