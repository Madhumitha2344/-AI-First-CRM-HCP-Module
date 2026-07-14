from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import hcp, interaction, chat, followup, summary

app = FastAPI(
    title="AI-First CRM HCP Module",
    description="LangGraph + Groq (gemma2-9b-it) powered CRM — MySQL",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hcp.router)
app.include_router(interaction.router)
app.include_router(chat.router)
app.include_router(followup.router)
app.include_router(summary.router)

@app.on_event("startup")
async def startup():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️ Database warning: {e}")

@app.get("/")
def root():
    return {"message": "CRM HCP API running", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}
