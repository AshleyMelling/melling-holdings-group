# /home/remem/bitcoinholdings/backend/app/routes/kraken_client.py
import krakenex
import os
from dotenv import load_dotenv

load_dotenv()

kraken = krakenex.API()
kraken.key = os.getenv("KRAKEN_API_KEY")
kraken.secret = os.getenv("KRAKEN_API_SECRET")
