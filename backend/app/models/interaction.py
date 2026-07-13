from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.hcp import HCP


class Interaction(Base):
    __tablename__ = "interactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    hcp_id: Mapped[int] = mapped_column(ForeignKey("hcps.id"), nullable=False)

    interaction_type: Mapped[str] = mapped_column(String(50), nullable=False)
    interaction_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    duration_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)

    raw_notes: Mapped[str] = mapped_column(Text, nullable=False)
    ai_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    products_discussed: Mapped[list[str]] = mapped_column(JSON, default=list)
    objections: Mapped[list[str]] = mapped_column(JSON, default=list)
    sentiment: Mapped[str] = mapped_column(String(30), default="neutral")
    next_action: Mapped[str | None] = mapped_column(Text, nullable=True)
    follow_up_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="completed")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    hcp: Mapped["HCP"] = relationship(back_populates="interactions")