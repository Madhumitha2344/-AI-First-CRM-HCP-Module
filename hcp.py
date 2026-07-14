from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/hcp", tags=["HCP"])

@router.get("/", response_model=List[schemas.HCPResponse])
def get_all_hcps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.HCP).offset(skip).limit(limit).all()

@router.get("/{hcp_id}", response_model=schemas.HCPResponse)
def get_hcp(hcp_id: int, db: Session = Depends(get_db)):
    hcp = db.query(models.HCP).filter(models.HCP.id == hcp_id).first()
    if not hcp:
        raise HTTPException(status_code=404, detail="HCP not found")
    return hcp

@router.post("/", response_model=schemas.HCPResponse)
def create_hcp(hcp: schemas.HCPCreate, db: Session = Depends(get_db)):
    db_hcp = models.HCP(**hcp.model_dump())
    db.add(db_hcp)
    db.commit()
    db.refresh(db_hcp)
    return db_hcp

@router.put("/{hcp_id}", response_model=schemas.HCPResponse)
def update_hcp(hcp_id: int, hcp_data: schemas.HCPCreate, db: Session = Depends(get_db)):
    hcp = db.query(models.HCP).filter(models.HCP.id == hcp_id).first()
    if not hcp:
        raise HTTPException(status_code=404, detail="HCP not found")
    for key, value in hcp_data.model_dump(exclude_unset=True).items():
        setattr(hcp, key, value)
    db.commit()
    db.refresh(hcp)
    return hcp

@router.delete("/{hcp_id}")
def delete_hcp(hcp_id: int, db: Session = Depends(get_db)):
    hcp = db.query(models.HCP).filter(models.HCP.id == hcp_id).first()
    if not hcp:
        raise HTTPException(status_code=404, detail="HCP not found")
    db.delete(hcp)
    db.commit()
    return {"message": "HCP deleted"}
