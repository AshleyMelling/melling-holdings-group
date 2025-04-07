import csv
import logging
from pathlib import Path
from app.database import SessionLocal
from app.db_models import KrakenLedger
from sqlalchemy.exc import IntegrityError

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# Path to your CSV file
CSV_PATH = Path("/home/remem/bitcoinholdings/backend/app/services/ledgers.csv")

def import_kraken_ledger_from_csv():
    db = SessionLocal()
    count_inserted = 0
    count_skipped = 0

    with open(CSV_PATH, newline='', encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Use the 'refid' field as a unique identifier (adjust if needed)
            ledger_id = row.get("refid")
            if not ledger_id:
                logging.warning("No refid found in row; skipping: %s", row)
                continue

            # Skip if ledger already exists in the database
            if db.query(KrakenLedger).filter_by(id=ledger_id).first():
                logging.info("Skipping duplicate ledger %s", ledger_id)
                count_skipped += 1
                continue

            # Create a new KrakenLedger instance.
            # Adjust the field conversion as necessary; here we assume all fields are strings.
            new_ledger = KrakenLedger(
                id=ledger_id,
                type=row.get("type"),
                asset=row.get("asset"),
                amount=row.get("amount"),
                fee=row.get("fee"),
                time=row.get("time")  # If stored as a number, you might convert: float(row.get("time"))
            )

            db.add(new_ledger)
            logging.info("Inserted ledger %s", ledger_id)
            count_inserted += 1

    try:
        db.commit()
        logging.info("✅ Ledger import complete. Inserted: %s | Skipped: %s", count_inserted, count_skipped)
    except IntegrityError as e:
        db.rollback()
        logging.error("❌ DB commit failed: %s", e)
    finally:
        db.close()

if __name__ == "__main__":
    import_kraken_ledger_from_csv()
