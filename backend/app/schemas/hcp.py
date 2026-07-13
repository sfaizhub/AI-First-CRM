from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class HCPCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    specialty: str = Field(min_length=2, max_length=120)
    hospital: str = Field(min_length=2, max_length=180)
    city: str = Field(min_length=2, max_length=80)
    tier: str = "B"
    email: EmailStr | None = None
    phone: str | None = None


class HCPResponse(HCPCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)