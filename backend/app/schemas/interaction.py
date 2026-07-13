from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class InteractionCreate(BaseModel):
    hcp_id: int
    interaction_type: str = Field(
        description="In-person, Call, Virtual, or Email"
    )
    interaction_date: datetime = Field(default_factory=datetime.now)
    duration_minutes: int | None = Field(default=None, ge=1)

    raw_notes: str = Field(min_length=5)
    ai_summary: str | None = None
    products_discussed: list[str] = Field(default_factory=list)
    objections: list[str] = Field(default_factory=list)
    sentiment: str = "neutral"
    next_action: str | None = None
    follow_up_date: datetime | None = None
    status: str = "completed"


class InteractionUpdate(BaseModel):
    interaction_type: str | None = None
    duration_minutes: int | None = Field(default=None, ge=1)
    raw_notes: str | None = None
    ai_summary: str | None = None
    products_discussed: list[str] | None = None
    objections: list[str] | None = None
    sentiment: str | None = None
    next_action: str | None = None
    follow_up_date: datetime | None = None
    status: str | None = None


class InteractionResponse(InteractionCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)