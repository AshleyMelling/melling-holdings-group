from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)  # Specify length for username
    email = Column(String(255), unique=True, index=True, nullable=False)  # Specify a length for email
    hashed_password = Column(String(255), nullable=False)  # You can set a length for hashed_password as well
