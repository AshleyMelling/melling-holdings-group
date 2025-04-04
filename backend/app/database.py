from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQL Server connection string (already correct)
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://sqlserver:Oscarmoo123!@34.142.115.35:1433/mellingholdingsgroup?driver=ODBC+Driver+17+for+SQL+Server"

# ✅ Remove SQLite-only connect_args
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
