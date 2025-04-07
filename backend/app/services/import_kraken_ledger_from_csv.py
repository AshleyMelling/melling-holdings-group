import csv
import logging
from pathlib import Path
from datetime import datetime
from app.database import SessionLocal
from app.db_models import KrakenLedger
from sqlalchemy.exc import IntegrityError

# Setup logging with maximum detail.
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# Update this path to the location of your CSV file.
CSV_PATH = Path("/home/remem/bitcoinholdings/backend/app/services/ledgers.csv")

def convert_time(time_val) -> float:
    """
    Convert a time value to a Unix timestamp (float).
    If time_val is numeric, returns it as a float.
    Otherwise, attempts to parse it as a datetime string.
    """
    logging.debug("Converting time value: %s", time_val)
    try:
        converted = float(time_val)
        logging.debug("Direct conversion successful: %s", converted)
        return converted
    except (ValueError, TypeError) as e:
        logging.debug("Direct conversion failed: %s", e)
    
    try:
        # Attempt to parse a common datetime string format.
        dt = datetime.strptime(time_val, "%Y-%m-%d %H:%M:%S")
        converted = dt.timestamp()
        logging.debug("Datetime parsing successful: %s", converted)
        return converted
    except (ValueError, TypeError) as e:
        logging.error("Unable to convert time value '%s': %s", time_val, e)
        return 0.0

def import_kraken_ledger_from_csv():
    logging.info("Starting ledger CSV import from: %s", CSV_PATH)
    db = SessionLocal()
    inserted_count = 0
    skipped_count = 0
    total_rows = 0

    try:
        with open(CSV_PATH, newline='', encoding="utf-8") as csvfile:
            logging.info("Opened CSV file successfully.")
            reader = csv.DictReader(csvfile)
            for row in reader:
                total_rows += 1
                logging.debug("Processing row %s: %s", total_rows, row)
                
                ledger_id = row.get("refid")
                if not ledger_id:
                    logging.warning("Row %s missing refid; skipping: %s", total_rows, row)
                    skipped_count += 1
                    continue

                # Normalize the ledger id if needed (e.g., strip spaces)
                normalized_refid = ledger_id.strip()
                logging.debug("Row %s normalized refid: %s", total_rows, normalized_refid)
                
                raw_time = row.get("time")
                converted_time = convert_time(raw_time)
                logging.debug("Row %s: raw time=%s, converted time=%s", total_rows, raw_time, converted_time)
                
                # Create a new ledger record. Note that refid is stored as a normal field.
                new_ledger = KrakenLedger(
                    refid=normalized_refid,
                    type=row.get("type"),
                    asset=row.get("asset"),
                    amount=(row.get("amount") or "0.0000").strip(),
                    fee=row.get("fee"),
                    time=converted_time,
                )
                logging.debug("Row %s: Prepared new ledger: %s", total_rows, new_ledger.__dict__)
                db.add(new_ledger)
                inserted_count += 1

            logging.info("Finished processing CSV rows. Total rows: %s, Inserted: %s, Skipped: %s",
                         total_rows, inserted_count, skipped_count)
        try:
            db.commit()
            logging.info("✅ Ledger import commit successful.")
        except IntegrityError as e:
            db.rollback()
            logging.error("❌ DB commit failed: %s", e)
    except Exception as e:
        logging.error("Error reading CSV file: %s", e)
    finally:
        db.close()
        logging.info("Database session closed.")

if __name__ == "__main__":
    import_kraken_ledger_from_csv()
    logging.info("Script executed directly.")
else:
    logging.info("Script imported as a module.")
    # This is useful for testing or when the script is part of a larger application.
    # You can define additional functions or classes here if needed.