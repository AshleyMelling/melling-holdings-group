from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

class ColdStorageWallet(Base):
    __tablename__ = "cold_storage_wallets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(255), unique=True, index=True, nullable=False)  # unique + indexed
    balance = Column(String(100), nullable=False)
    lastChecked = Column(String(100), nullable=False)
    data = Column(Text, nullable=True)  # JSON string
    
class KrakenWallet(Base):
    __tablename__ = "kraken_wallets"
    
    # We'll use the asset name as the primary key (since Kraken returns balances keyed by asset)
    asset = Column(String(50), primary_key=True, index=True)
    balance = Column(String(100), nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class KrakenTrade(Base):
    __tablename__ = "kraken_trades"

    id = Column(String, primary_key=True)
    asset_pair = Column(String)
    order_txid = Column(String)
    cost = Column(String)
    fee = Column(String)
    vol = Column(String)
    time = Column(Float, index=True)  # Used for incremental sync

class KrakenLedger(Base):
    __tablename__ = "kraken_ledgers"
    
    # New surrogate key for uniqueness
    id = Column(Integer, primary_key=True, autoincrement=True)
    # refid is now just a regular field (indexed) so duplicates are allowed
    refid = Column(String, index=True)
    type = Column(String)
    asset = Column(String)
    amount = Column(String)
    fee = Column(String)
    time = Column(Float, index=True)  # Unix timestamp