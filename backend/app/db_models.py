from sqlalchemy import Column, Integer, String, Text
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
    address = Column(String(255), unique=True, index=True, nullable=False)  # ✅ unique + indexed
    balance = Column(String(100), nullable=False)
    lastChecked = Column(String(100), nullable=False)
    data = Column(Text, nullable=True)  # JSON string
