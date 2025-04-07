# This file is part of the Melling Holdings Group project.
# It is licensed under the MIT License.
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQL Server connection string (already correct)
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://sqlserver:Oscarmoo123!@34.142.115.35:1433/mellingholdingsgroup?driver=ODBC+Driver+17+for+SQL+Server"

# ✅ Remove SQLite-only connect_args
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_session():
    """
    FastAPI dependency that creates a new SQLAlchemy session,
    yields it, and ensures it is closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# This function is used in the FastAPI routes to get a database session.
# It ensures that the session is properly closed after use.
# This is important for resource management and to avoid connection leaks.
# The session is created using the SessionLocal factory, which is bound to the engine.
# The session is yielded to the route handler, and once the request is completed,
# the session is closed in the finally block.
# This is a common pattern in FastAPI applications that use SQLAlchemy.
# It allows for easy management of database connections and ensures that each request
# has its own session. 