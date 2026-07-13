from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.agents.graph import run_hcp_agent
from app.database import get_db
from app.models.hcp import HCP
from app.models.interaction import Interaction
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.hcp import HCPCreate, HCPResponse
from app.schemas.interaction import (
    InteractionCreate,
    InteractionResponse,
    InteractionUpdate,
)

router = APIRouter(prefix="/api", tags=["CRM API"])


@router.post("/hcps", response_model=HCPResponse, status_code=status.HTTP_201_CREATED)
def create_hcp(payload: HCPCreate, db: Session = Depends(get_db)):
    hcp = HCP(**payload.model_dump())
    db.add(hcp)
    db.commit()
    db.refresh(hcp)
    return hcp


@router.get("/hcps", response_model=list[HCPResponse])
def list_hcps(db: Session = Depends(get_db)):
    statement = select(HCP).order_by(HCP.full_name)
    return db.scalars(statement).all()


@router.get("/hcps/{hcp_id}", response_model=HCPResponse)
def get_hcp(hcp_id: int, db: Session = Depends(get_db)):
    hcp = db.get(HCP, hcp_id)

    if not hcp:
        raise HTTPException(status_code=404, detail="HCP not found")

    return hcp


@router.post(
    "/interactions",
    response_model=InteractionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_interaction(payload: InteractionCreate, db: Session = Depends(get_db)):
    hcp = db.get(HCP, payload.hcp_id)

    if not hcp:
        raise HTTPException(status_code=404, detail="HCP not found")

    interaction = Interaction(**payload.model_dump())
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction


@router.get("/interactions", response_model=list[InteractionResponse])
def list_interactions(hcp_id: int | None = None, db: Session = Depends(get_db)):
    statement = select(Interaction).order_by(desc(Interaction.interaction_date))

    if hcp_id:
        statement = statement.where(Interaction.hcp_id == hcp_id)

    return db.scalars(statement).all()


@router.get("/interactions/{interaction_id}", response_model=InteractionResponse)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.get(Interaction, interaction_id)

    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")

    return interaction


@router.patch("/interactions/{interaction_id}", response_model=InteractionResponse)
def update_interaction(
    interaction_id: int,
    payload: InteractionUpdate,
    db: Session = Depends(get_db),
):
    interaction = db.get(Interaction, interaction_id)

    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(interaction, field, value)

    db.commit()
    db.refresh(interaction)
    return interaction


@router.post("/agent/chat", response_model=ChatResponse)
def chat_with_ai_agent(payload: ChatRequest):
    try:
        return run_hcp_agent(payload.message)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"AI agent error: {str(error)}",
        ) from error