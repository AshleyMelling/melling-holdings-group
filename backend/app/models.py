from pydantic import BaseModel, EmailStr, field_validator
from typing import Any


# ---------------------
# 🔐 Auth Schemas
# ---------------------
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Please enter a valid email address.")
        return v


# ---------------------
# 💼 Wallet Schemas
# ---------------------
class WalletLookupRequest(BaseModel):
    name: str
    address: str


class ColdStorageWalletCreate(BaseModel):
    name: str
    address: str
    balance: str
    lastChecked: str
    data: Any  # Raw Mempool response


class ColdStorageWalletResponse(ColdStorageWalletCreate):
    id: int

    class Config:
        from_attributes = True
