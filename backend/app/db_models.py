from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from sqlalchemy.dialects.postgresql import JSONB
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
    
    # Unique identifier as given by Kraken (e.g., "THVRQM-33VKH-UCI7BS")
    id = Column(String, primary_key=True)           
    
    # Trade details from Kraken
    order_txid = Column(String)          # Corresponds to "ordertxid"
    post_txid = Column(String)           # Corresponds to "postxid"
    asset_pair = Column(String)          # Corresponds to "pair"
    time = Column(Float, index=True)     # Unix timestamp as float
    trade_type = Column(String)          # Corresponds to "type"
    order_type = Column(String)          # Corresponds to "ordertype"
    price = Column(String)               # Corresponds to "price"
    cost = Column(String)                # Corresponds to "cost"
    fee = Column(String)                 # Corresponds to "fee"
    vol = Column(String)                 # Corresponds to "vol"
    margin = Column(String)              # Corresponds to "margin"
    misc = Column(String)                # Corresponds to "misc"
    trade_id = Column(Integer)           # Corresponds to "trade_id"
    maker = Column(Boolean)              # Corresponds to "maker"
    
    # Optionally store the entire raw JSON response from Kraken
    raw_data = Column(JSONB)

class KrakenLedger(Base):
    __tablename__ = "kraken_ledgers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    refid = Column(String, index=True)
    type = Column(String)
    asset = Column(String)
    amount = Column(String)
    fee = Column(String)
    time = Column(Float, index=True)
    raw_data = Column(JSONB) 