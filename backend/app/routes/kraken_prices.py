from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter()

# Map Kraken pair names (as returned by Kraken's API) to our desired asset symbols.
ASSET_MAP = {
    "XXBTZUSD": "BTC",
    "XETHZUSD": "ETH",
    "LINKUSD": "LINK",
    "SOLUSD": "SOL",
    "ADAUSD": "ADA",
    "TRXUSD": "TRX",
    "DOTUSD": "DOT",
    "SUIUSD": "SUI",
    "TIAUSD": "TIA",
    "XDGUSD": "DOGE",   # Updated key for Dogecoin (Kraken now uses XDGUSD)
    "WIFUSD": "WIF",
    "GBPUSD": "GBP",
    "EURUSD": "EUR",
    "WINUSD": "WIN",
    "POLUSD": "POL",
}

# Manual fiat conversion rates (USD is defined as 1.0)
MANUAL_FIAT = {
    "USD": {"usd": 1.0, "gbp": 0.79},
    "GBP": {"usd": 1 / 0.79, "gbp": 1.0},
    "EUR": {"usd": 1.08, "gbp": 0.85},
}

@router.get("/kraken/prices")
async def get_kraken_prices():
    # Create a comma-separated string of asset pairs for the API query.
    pairs = ",".join(ASSET_MAP.keys())
    url = f"https://api.kraken.com/0/public/Ticker?pair={pairs}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch Kraken data")
        data = response.json().get("result", {})

    prices = {}
    # Process each returned pair.
    for pair, info in data.items():
        asset = ASSET_MAP.get(pair)
        if not asset:
            continue
        try:
            usd_price = float(info["c"][0])
        except (KeyError, ValueError):
            continue
        # Calculate GBP using a rough conversion factor.
        gbp_price = usd_price * 0.79
        prices[asset] = {"usd": usd_price, "gbp": gbp_price}

    # Make sure that manual fiat rates are available in the output.
    for fiat, rate in MANUAL_FIAT.items():
        if fiat not in prices:
            prices[fiat] = rate

    return prices
