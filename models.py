from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class HCP(Base):
    __tablename__ = "hcp"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(255), nullable=False)
    hospital = Column(String(255), nullable=True)
    specialty = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    interactions = relationship("Interaction", back_populates="hcp")
    follow_ups = relationship("FollowUp", back_populates="hcp")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=func.now())


class Interaction(Base):
    __tablename__ = "interaction"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    hcp_id = Column(Integer, ForeignKey("hcp.id", ondelete="SET NULL"), nullable=True)
    doctor_name = Column(String(255), nullable=True)
    hospital = Column(String(255), nullable=True)
    specialty = Column(String(255), nullable=True)
    visit_date = Column(Date, nullable=True)
    discussion = Column(Text, nullable=True)
    products_discussed = Column(Text, nullable=True)
    follow_up_date = Column(Date, nullable=True)
    additional_notes = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    raw_input = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    hcp = relationship("HCP", back_populates="interactions")
    follow_ups = relationship("FollowUp", back_populates="interaction")


class FollowUp(Base):
    __tablename__ = "followup"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    interaction_id = Column(Integer, ForeignKey("interaction.id", ondelete="SET NULL"), nullable=True)
    hcp_id = Column(Integer, ForeignKey("hcp.id", ondelete="SET NULL"), nullable=True)
    scheduled_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    interaction = relationship("Interaction", back_populates="follow_ups")
    hcp = relationship("HCP", back_populates="follow_ups")
