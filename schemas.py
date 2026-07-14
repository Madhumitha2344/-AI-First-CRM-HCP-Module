from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


# ---------- HCP ----------
class HCPBase(BaseModel):
    name: str
    hospital: Optional[str] = None
    specialty: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class HCPCreate(HCPBase):
    pass

class HCPResponse(HCPBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True


# ---------- Product ----------
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True


# ---------- Interaction ----------
class InteractionBase(BaseModel):
    doctor_name: str
    hospital: Optional[str] = None
    specialty: Optional[str] = None
    visit_date: Optional[date] = None
    discussion: Optional[str] = None
    products_discussed: Optional[str] = None
    follow_up_date: Optional[date] = None
    additional_notes: Optional[str] = None

class InteractionCreate(InteractionBase):
    hcp_id: Optional[int] = None
    raw_input: Optional[str] = None

class InteractionUpdate(BaseModel):
    doctor_name: Optional[str] = None
    hospital: Optional[str] = None
    specialty: Optional[str] = None
    visit_date: Optional[date] = None
    discussion: Optional[str] = None
    products_discussed: Optional[str] = None
    follow_up_date: Optional[date] = None
    additional_notes: Optional[str] = None
    ai_summary: Optional[str] = None

class InteractionResponse(InteractionBase):
    id: int
    hcp_id: Optional[int] = None
    ai_summary: Optional[str] = None
    raw_input: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


# ---------- FollowUp ----------
class FollowUpCreate(BaseModel):
    interaction_id: Optional[int] = None
    hcp_id: Optional[int] = None
    scheduled_date: date
    notes: Optional[str] = None

class FollowUpResponse(FollowUpCreate):
    id: int
    is_completed: bool
    created_at: datetime
    class Config:
        from_attributes = True


# ---------- Chat ----------
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    extracted_data: Optional[dict] = None
    action_taken: Optional[str] = None
    interaction_id: Optional[int] = None
