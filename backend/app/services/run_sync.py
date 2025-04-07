from backend.app.services.import_kraken_ledger_from_csv import sync_history

if __name__ == "__main__":
    sync_history()
    
#     trades = fetch_all_trades()
#     ledgers = fetch_all_ledgers()
#
#     for trade in trades.values():         