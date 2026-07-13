import json
from datetime import datetime

from langchain_core.tools import tool

from app.database import SessionLocal
from app.models.hcp import HCP
from app.models.interaction import Interaction


def parse_date(value):

    if not value:
        return None

    try:
        return datetime.fromisoformat(
            value.replace("Z", "+00:00")
        )
    except Exception:
        return None


@tool
def log_interaction(
    hcp_id: int,
    interaction_type: str,
    raw_notes: str,
    ai_summary: str = "",
    products_discussed: list[str] | None = None,
    objections: list[str] | None = None,
    sentiment: str = "neutral",
    next_action: str = "",
    follow_up_date: str | None = None,
):
    """
    Log a new HCP interaction.
    """

    db = SessionLocal()

    try:

        hcp = db.get(HCP, hcp_id)

        if not hcp:
            return json.dumps(
                {
                    "success": False,
                    "message": "HCP not found",
                }
            )

        if ai_summary == "":
            ai_summary = (
                raw_notes[:200]
                if len(raw_notes) > 200
                else raw_notes
            )

        interaction = Interaction(
            hcp_id=hcp_id,
            interaction_type=interaction_type,
            raw_notes=raw_notes,
            ai_summary=ai_summary,
            products_discussed=products_discussed or [],
            objections=objections or [],
            sentiment=sentiment,
            next_action=next_action,
            follow_up_date=parse_date(follow_up_date),
            status="Completed",
        )

        db.add(interaction)
        db.commit()
        db.refresh(interaction)

        return json.dumps(
            {
                "success": True,
                "interaction_id": interaction.id,
                "summary": ai_summary,
                "message": "Interaction logged successfully",
            }
        )

    except Exception as e:

        db.rollback()

        return json.dumps(
            {
                "success": False,
                "error": str(e),
            }
        )

    finally:
        db.close()


@tool
def edit_interaction(
    interaction_id: int,
    updates_json: str,
):
    """
    Edit an existing interaction.
    """

    db = SessionLocal()

    try:

        interaction = db.get(
            Interaction,
            interaction_id,
        )

        if not interaction:

            return json.dumps(
                {
                    "success": False,
                    "message": "Interaction not found",
                }
            )

        updates = json.loads(updates_json)

        for field, value in updates.items():

            if hasattr(interaction, field):
                setattr(interaction, field, value)

        db.commit()
        db.refresh(interaction)

        return json.dumps(
            {
                "success": True,
                "interaction_id": interaction.id,
                "message": "Interaction updated successfully",
            }
        )

    except Exception as e:

        db.rollback()

        return json.dumps(
            {
                "success": False,
                "error": str(e),
            }
        )

    finally:
        db.close()


@tool
def generate_ai_summary(raw_notes: str):
    """
    Generate an AI summary from interaction notes.
    """

    if not raw_notes:

        return json.dumps(
            {
                "summary": "",
            }
        )

    summary = raw_notes

    if len(summary) > 250:
        summary = summary[:250] + "..."

    return json.dumps(
        {
            "summary": summary,
        }
    )