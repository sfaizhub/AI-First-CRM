import json

from langchain_core.tools import tool
from sqlalchemy import desc, select

from app.database import SessionLocal
from app.models.hcp import HCP
from app.models.interaction import Interaction


@tool
def get_hcp_profile(hcp_id: int) -> str:
    """
    Get a healthcare professional profile.
    """

    db = SessionLocal()

    try:
        hcp = db.get(HCP, hcp_id)

        if not hcp:
            return json.dumps({
                "error": f"HCP with ID {hcp_id} was not found."
            })

        return json.dumps({
            "id": hcp.id,
            "full_name": hcp.full_name,
            "specialty": hcp.specialty,
            "hospital": hcp.hospital,
            "city": hcp.city,
            "tier": hcp.tier,
            "email": hcp.email,
            "phone": hcp.phone
        })

    finally:
        db.close()



@tool
def list_hcps() -> str:
    """
    Get all healthcare professionals.
    """

    db = SessionLocal()

    try:
        hcps = db.scalars(
            select(HCP)
        ).all()

        result = []

        for hcp in hcps:
            result.append({
                "id": hcp.id,
                "full_name": hcp.full_name,
                "specialty": hcp.specialty,
                "hospital": hcp.hospital,
                "city": hcp.city,
                "tier": hcp.tier,
                "email": hcp.email,
                "phone": hcp.phone
            })

        return json.dumps(result)

    finally:
        db.close()



@tool
def get_interaction_history(hcp_id: int) -> str:
    """
    Get interaction history of an HCP.
    """

    db = SessionLocal()

    try:

        hcp = db.get(HCP, hcp_id)

        if not hcp:
            return json.dumps({
                "error": "HCP not found"
            })


        statement = (
            select(Interaction)
            .where(Interaction.hcp_id == hcp_id)
            .order_by(desc(Interaction.interaction_date))
        )


        interactions = db.scalars(statement).all()


        history = []


        for item in interactions:

            history.append({
                "interaction_id": item.id,
                "date": (
                    item.interaction_date.isoformat()
                    if item.interaction_date
                    else None
                ),
                "type": item.interaction_type,
                "summary": item.ai_summary,
                "sentiment": item.sentiment,
                "next_action": item.next_action
            })


        return json.dumps({
            "hcp_id": hcp.id,
            "hcp_name": hcp.full_name,
            "interactions": history
        })


    finally:
        db.close()



@tool
def suggest_next_best_action(hcp_id: int) -> str:
    """
    Suggest next best sales action.
    """

    return json.dumps({
        "hcp_id": hcp_id,
        "next_best_action": "Schedule follow up meeting with HCP."
    })