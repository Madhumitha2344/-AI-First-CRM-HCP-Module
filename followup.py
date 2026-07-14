from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/followup", tags=["FollowUp"])

@router.get("/", response_model=List[schemas.FollowUpResponse])
def get_all_followups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.FollowUp).order_by(
        models.FollowUp.scheduled_date.asc()
    ).offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.FollowUpResponse)
def create_followup(data: schemas.FollowUpCreate, db: Session = Depends(get_db)):
    followup = models.FollowUp(**data.model_dump())
    db.add(followup)
    db.commit()
    db.refresh(followup)
    return followup

@router.put("/{followup_id}/complete")
def complete_followup(followup_id: int, db: Session = Depends(get_db)):
    followup = db.query(models.FollowUp).filter(models.FollowUp.id == followup_id).first()
    if not followup:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    followup.is_completed = True
    db.commit()
    return {"message": "Follow-up marked as completed"}
