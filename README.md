# AI-First CRM – HCP Module

## Project Overview

AI-First CRM is a Healthcare Professional (HCP) Customer Relationship Management system designed for Life Science field representatives.

The application enables sales representatives to manage Healthcare Professionals, log interactions, retrieve interaction history, and receive AI-powered recommendations using LangGraph and Groq LLM.

---

## Features

### HCP Management

* Create Healthcare Professional
* View HCP Profile
* Store Hospital, Specialty, City, Tier, Email and Phone

### Interaction Management

* Log Interaction
* Edit Interaction
* View Interaction History
* Follow-up Scheduling

### AI CRM Assistant

* Conversational Chat Interface
* HCP Profile Retrieval
* Interaction History Retrieval
* AI Summary Generation
* Next Best Action Recommendation
* Follow-up Recommendation

---

## Tech Stack

### Frontend

* React.js
* Redux Toolkit
* Material UI
* Axios
* React Router

### Backend

* Python
* FastAPI
* SQLAlchemy

### Database

* PostgreSQL / MySQL

### AI

* LangGraph
* Groq LLM
* Llama 3.1

---

## LangGraph Tools

The AI Agent uses the following tools:

1. Log Interaction
2. Edit Interaction
3. Get HCP Profile
4. Get Interaction History
5. Suggest Next Best Action
6. Generate AI Summary
7. Generate Follow-up

---

## Project Structure

AI-First-CRM/

backend/

* app/

  * agents/
  * api/
  * database.py
  * models/
  * schemas/
  * tools/
  * main.py

frontend/

* src/

  * components/
  * layout/
  * pages/
  * redux/
  * services/
  * store/

---

## API Endpoints

### HCP

* POST /api/hcps
* GET /api/hcps
* GET /api/hcps/{id}

### Interaction

* POST /api/interactions
* GET /api/interactions
* PATCH /api/interactions/{id}

### AI Agent

* POST /api/agent/chat

---

## Installation

### Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs at

http://127.0.0.1:8000

Swagger

http://127.0.0.1:8000/docs

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at

http://localhost:5173

---

## AI Workflow

User Request

↓

LangGraph Agent

↓

Tool Selection

↓

Groq LLM

↓

Database

↓

AI Response

---

## Screens

* Dashboard
* Create HCP
* Log Interaction
* Interaction History
* AI Chat Assistant

---

## Future Improvements

* Authentication & Authorization
* Voice-based Interaction Logging
* File Upload Support
* Calendar Integration
* Analytics Dashboard
* Multi-user CRM
* Email Integration

---

## Author

Syed Faiz

B.E. Computer Science Engineering (2025)

Chandigarh University
