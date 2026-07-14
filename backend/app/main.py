from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routes import router as api_router
from app.database import Base, engine
from app.models.hcp import HCP
from app.models.interaction import Interaction

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-First CRM HCP Module",
    description="Log Interaction API with LangGraph and Groq",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-first-crm-three.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def health_check():
    return {
        "message": "AI-First CRM backend is running",
        "status": "healthy",
    }


@app.get("/health/database")
def database_health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "message": "PostgreSQL database is connected",
        "status": "healthy",
    }