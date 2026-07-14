from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/interaction", tags=["Interaction"])

@router.get("/", response_model=List[schemas.InteractionResponse])
def get_all_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Interaction).order_by(
        models.Interaction.created_at.desc()
    ).offset(skip).limit(limit).all()

@router.get("/{interaction_id}", response_model=schemas.InteractionResponse)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.query(models.Interaction).filter(
        models.Interaction.id == interaction_id
    ).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction

@router.post("/", response_model=schemas.InteractionResponse)
def create_interaction(data: schemas.InteractionCreate, db: Session = Depends(get_db)):
    interaction = models.Interaction(**data.model_dump())
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction

@router.put("/{interaction_id}", response_model=schemas.InteractionResponse)
def update_interaction(
    interaction_id: int,
    data: schemas.InteractionUpdate,
    db: Session = Depends(get_db)
):
    interaction = db.query(models.Interaction).filter(
        models.Interaction.id == interaction_id
    ).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(interaction, key, value)
    db.commit()
    db.refresh(interaction)
    return interaction

@router.delete("/{interaction_id}")
def delete_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.query(models.Interaction).filter(
        models.Interaction.id == interaction_id
    ).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    db.delete(interaction)
    db.commit()
    return {"message": "Interaction deleted"}
