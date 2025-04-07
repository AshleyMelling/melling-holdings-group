from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
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
