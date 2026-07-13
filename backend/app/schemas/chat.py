from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=3,
        description="Natural-language request for the CRM AI assistant",
    )


class ChatResponse(BaseModel):
    reply: str
    tool_calls: list[str] = []