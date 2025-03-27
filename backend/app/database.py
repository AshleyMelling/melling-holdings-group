from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# For SQLite; change the URL for PostgreSQL or another DB
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://sqlserver:Oscarmoo123!@34.142.115.35:1433/mellingholdingsgroup?driver=ODBC+Driver+17+for+SQL+Server"

# For SQLite, disable same thread check (not needed for PostgreSQL)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()
