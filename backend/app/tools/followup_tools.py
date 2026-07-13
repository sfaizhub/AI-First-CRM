import json
from datetime import datetime, timedelta

from langchain_core.tools import tool


@tool
def generate_followup(
    hcp_id: int,
    interaction_summary: str,
):
    """
    Generate follow-up recommendation for an HCP.
    """

    followup_date = (
        datetime.now() + timedelta(days=14)
    ).strftime("%Y-%m-%d")

    priority = "Medium"

    summary = interaction_summary.lower()

    if "interested" in summary or "positive" in summary:
        priority = "High"

    if "not interested" in summary or "rejected" in summary:
        priority = "Low"

    return json.dumps(
        {
            "success": True,
            "hcp_id": hcp_id,
            "priority": priority,
            "follow_up_date": followup_date,
            "recommended_action": "Schedule a follow-up visit and discuss the product benefits.",
            "reason": "Generated automatically by AI CRM Agent."
        }
    )