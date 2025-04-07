import krakenex
import os
from dotenv import load_dotenv

load_dotenv()  # Loads .env file

api = krakenex.API()
api.key = os.getenv("KRAKEN_API_KEY")
api.secret = os.getenv("KRAKEN_API_SECRET")

response = api.query_private("Balance")

if "error" in response and response["error"]:
    print("❌ Error:", response["error"])
else:
    print("✅ Success:", response["result"])
