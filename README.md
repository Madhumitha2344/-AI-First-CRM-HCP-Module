AI-First CRM — Healthcare Professional (HCP) Module

> A production-ready, AI-powered Customer Relationship Management system built for **Life Science Field Representatives** to log, manage, and analyze Healthcare Professional interactions using natural language.



Overview

Managing HCP interactions manually is time-consuming and error-prone. This CRM system solves that by combining a structured form interface with a conversational AI chat — powered by **LangGraph** and **Groq LLM** — that automatically extracts, structures, and stores interaction data from plain English input.

Example:
> *"I met Dr. Ravi Kumar today at Apollo Hospital. We discussed insulin therapy and he requested clinical trial data. Schedule a follow-up next Tuesday."*

The AI agent reads this, extracts all relevant fields, saves the interaction to MySQL, schedules the follow-up, and confirms — all in seconds.



Key Features

- Dual input method — Structured Form + AI Conversational Chat
- LangGraph agent with 5 intelligent tools
- Auto-extraction of doctor, hospital, products, dates from natural language
- Relative date resolution — "next Tuesday", "tomorrow"
- Full interaction history with edit and delete
- HCP directory management
- Follow-up scheduling and tracking
- AI-generated visit summaries
- Real-time Redux state management
- Professional responsive UI with Google Inter font



 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js 18 |
| State Management | Redux Toolkit |
| Backend | Python FastAPI |
| AI Framework | LangGraph |
| LLM | Groq API — llama-3.3-70b-versatile |
| Database | MySQL (via SQLAlchemy ORM) |
| HTTP Client | Axios |
| Font | Google Inter |


Project Structure




Architecture

```
┌─────────────────────────────────────────────┐
│           React Frontend (Port 3000)         │
│         Redux Toolkit — State Management     │
│              Axios — HTTP Client             │
└──────────────────────┬──────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────┐
│          FastAPI Backend (Port 8000)         │
│           SQLAlchemy ORM — MySQL             │
│         5 REST API Route Groups              │
└────────────┬─────────────────────┬──────────┘
             │                     │
┌────────────▼──────────┐ ┌────────▼──────────┐
│   MySQL Database       │ │  LangGraph Agent   │
│   XAMPP — Port 3306    │ │  ReAct Loop        │
│                        │ │  Groq LLM          │
│  Tables:               │ │  5 Tools           │
│  - hcp                 │ └───────────────────┘
│  - interaction         │
│  - followup            │
│  - products            │
└────────────────────────┘




LangGraph Workflow

The agent uses a **ReAct (Reason + Act)** pattern:


User Message
     │
     ▼
LangGraph Agent
     │
     ├── Analyze intent with Groq LLM
     │
     ├── Select appropriate tool:
     │   ├── log_interaction       → Extract fields + Save to DB
     │   ├── edit_interaction      → Update existing record
     │   ├── search_hcp            → Query HCP directory
     │   ├── schedule_followup     → Create follow-up entry
     │   └── generate_visit_summary→ Build structured report
     │
     ├── Execute tool → DB operation
     │
     └── Return human-readable confirmation



Tool Descriptions

| Tool | Purpose |
|------|---------|
| `log_interaction` | Extracts structured data from natural language and saves new HCP interaction to MySQL |
| `edit_interaction` | Updates an existing interaction record by ID |
| `search_hcp` | Searches HCP directory by name, hospital, or specialty |
| `schedule_followup` | Schedules follow-up meeting, resolves relative dates |
| `generate_visit_summary` | Generates a detailed visit report for a given interaction |


Database Design

sql


hcp
├── id, name, hospital, specialty, email, phone
└── created_at, updated_at

interaction
├── id, hcp_id (FK), doctor_name, hospital, specialty
├── visit_date, discussion, products_discussed
├── follow_up_date, additional_notes
├── ai_summary, raw_input
└── created_at, updated_at

followup
├── id, interaction_id (FK), hcp_id (FK)
├── scheduled_date, notes, is_completed
└── created_at

products
├── id, name, description, category
└── created_at



API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/` | Send message to LangGraph AI agent |
| GET | `/interaction/` | List all interactions |
| POST | `/interaction/` | Create new interaction (structured form) |
| PUT | `/interaction/{id}` | Update existing interaction |
| DELETE | `/interaction/{id}` | Delete interaction |
| GET | `/hcp/` | List all HCPs |
| POST | `/hcp/` | Add new HCP |
| GET | `/followup/` | List all follow-ups |
| POST | `/followup/` | Schedule new follow-up |
| POST | `/summary/` | Generate AI visit summary |
| GET | `/health` | API health check |

Full interactive Swagger UI: **http://localhost:8000/docs**



Environment Variables

backend/.env

env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/crm_hcp
GROQ_API_KEY=gsk_your_groq_api_key_here
SECRET_KEY=crmsecret123abc
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30


frontend/.env

env
REACT_APP_API_URL=http://localhost:8000



Prerequisites

| Requirement | Version | Download |
|-------------|---------|----------|
| Python | 3.11.x | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| XAMPP (MySQL) | Any | https://apachefriends.org |
| Groq API Key | Free | https://console.groq.com |


Installation & Setup

1. MySQL Database
Open XAMPP → Start MySQL → Open phpMyAdmin → SQL tab → Run:

sql

CREATE DATABASE crm_hcp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


2. Groq API Key
Visit https://console.groq.com → Sign up → API Keys → Create Key → Copy

3. Configure Environment
Edit `backend/.env`:

env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/crm_hcp
GROQ_API_KEY=gsk_your_key_here


4. Run Backend
bash
cd backend
py -3.11 -m pip install -r requirements.txt
py -3.11 -m uvicorn main:app --reload --port 8000


5. Run Frontend
Open a new terminal:
bash
cd frontend
npm install
npm start


6. Access Application
| Service | URL |
|---------|-----|
| Frontend App | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |



Usage Guide

Structured Form
Navigate to "Log Interaction" → Fill in doctor name, hospital, specialty, products, visit date, follow-up date → Save.


AI Chat Interface
Navigate to "AI Chat" → Type in natural language:

example:
"I met Dr. Priya Sharma today at Fortis Hospital.
We discussed Atorvastatin and she requested more samples.
Schedule a follow-up next Monday."


The AI agent will:
1. Extract all fields automatically
2. Save the interaction to the database
3. Schedule the follow-up
4. Confirm what was saved



Application:

Built as an AI-First CRM assignment demonstrating LangGraph + Groq LLM integration with a full-stack React + FastAPI application.


