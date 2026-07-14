"""
LangGraph Tools — 5 mandatory tools for CRM HCP Agent
"""
import json
from datetime import date, datetime, timedelta
from typing import Optional
from langchain_core.tools import tool
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models


def get_db_session() -> Session:
    return SessionLocal()


def parse_relative_date(date_str: str) -> Optional[str]:
    """Convert 'today', 'tomorrow', 'next Tuesday' to ISO date string."""
    if not date_str:
        return None
    today = date.today()
    s = date_str.lower().strip()
    days_map = {
        "monday": 0, "tuesday": 1, "wednesday": 2,
        "thursday": 3, "friday": 4, "saturday": 5, "sunday": 6
    }
    if "today" in s:
        return today.isoformat()
    if "tomorrow" in s:
        return (today + timedelta(days=1)).isoformat()
    if "next" in s:
        for name, num in days_map.items():
            if name in s:
                ahead = num - today.weekday()
                if ahead <= 0:
                    ahead += 7
                return (today + timedelta(days=ahead)).isoformat()
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(date_str.strip(), fmt).date().isoformat()
        except ValueError:
            continue
    return None


@tool
def log_interaction(
    doctor_name: str,
    hospital: str = "",
    specialty: str = "",
    visit_date: str = "",
    discussion: str = "",
    products_discussed: str = "",
    follow_up_date: str = "",
    additional_notes: str = "",
    ai_summary: str = "",
    raw_input: str = ""
) -> str:
    """
    Log a new HCP interaction into the database.
    Extracts doctor name, hospital, specialty, products, follow-up date
    from user input and saves structured record to MySQL.
    """
    db = get_db_session()
    try:
        hcp = db.query(models.HCP).filter(
            models.HCP.name.ilike(f"%{doctor_name}%")
        ).first()
        if not hcp and doctor_name:
            hcp = models.HCP(
                name=doctor_name,
                hospital=hospital or None,
                specialty=specialty or None
            )
            db.add(hcp)
            db.flush()

        visit_date_obj = None
        if visit_date:
            r = parse_relative_date(visit_date)
            if r:
                visit_date_obj = date.fromisoformat(r)

        follow_up_date_obj = None
        if follow_up_date:
            r = parse_relative_date(follow_up_date)
            if r:
                follow_up_date_obj = date.fromisoformat(r)

        interaction = models.Interaction(
            hcp_id=hcp.id if hcp else None,
            doctor_name=doctor_name,
            hospital=hospital or (hcp.hospital if hcp else None),
            specialty=specialty or (hcp.specialty if hcp else None),
            visit_date=visit_date_obj or date.today(),
            discussion=discussion,
            products_discussed=products_discussed,
            follow_up_date=follow_up_date_obj,
            additional_notes=additional_notes,
            ai_summary=ai_summary,
            raw_input=raw_input
        )
        db.add(interaction)

        if follow_up_date_obj and hcp:
            db.add(models.FollowUp(
                hcp_id=hcp.id,
                scheduled_date=follow_up_date_obj,
                notes=f"Follow-up with {doctor_name}"
            ))

        db.commit()
        db.refresh(interaction)
        return json.dumps({
            "success": True,
            "interaction_id": interaction.id,
            "doctor_name": doctor_name,
            "message": f"Interaction logged with ID {interaction.id}"
        })
    except Exception as e:
        db.rollback()
        return json.dumps({"success": False, "error": str(e)})
    finally:
        db.close()


@tool
def edit_interaction(
    interaction_id: int,
    doctor_name: str = "",
    hospital: str = "",
    specialty: str = "",
    discussion: str = "",
    products_discussed: str = "",
    follow_up_date: str = "",
    additional_notes: str = "",
    ai_summary: str = ""
) -> str:
    """
    Edit or update an existing HCP interaction by its ID.
    Only the provided fields are updated; others remain unchanged.
    """
    db = get_db_session()
    try:
        interaction = db.query(models.Interaction).filter(
            models.Interaction.id == interaction_id
        ).first()
        if not interaction:
            return json.dumps({"success": False, "error": f"Interaction {interaction_id} not found"})

        if doctor_name: interaction.doctor_name = doctor_name
        if hospital: interaction.hospital = hospital
        if specialty: interaction.specialty = specialty
        if discussion: interaction.discussion = discussion
        if products_discussed: interaction.products_discussed = products_discussed
        if additional_notes: interaction.additional_notes = additional_notes
        if ai_summary: interaction.ai_summary = ai_summary
        if follow_up_date:
            r = parse_relative_date(follow_up_date)
            if r:
                interaction.follow_up_date = date.fromisoformat(r)

        db.commit()
        db.refresh(interaction)
        return json.dumps({
            "success": True,
            "interaction_id": interaction_id,
            "message": f"Interaction {interaction_id} updated successfully"
        })
    except Exception as e:
        db.rollback()
        return json.dumps({"success": False, "error": str(e)})
    finally:
        db.close()


@tool
def search_hcp(query: str) -> str:
    """
    Search Healthcare Professionals (HCPs) by name, hospital, or specialty.
    Returns list of matching doctors with their details.
    """
    db = get_db_session()
    try:
        results = db.query(models.HCP).filter(
            (models.HCP.name.ilike(f"%{query}%")) |
            (models.HCP.hospital.ilike(f"%{query}%")) |
            (models.HCP.specialty.ilike(f"%{query}%"))
        ).limit(10).all()
        return json.dumps({
            "success": True,
            "count": len(results),
            "hcps": [
                {"id": h.id, "name": h.name, "hospital": h.hospital,
                 "specialty": h.specialty, "email": h.email}
                for h in results
            ]
        })
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})
    finally:
        db.close()


@tool
def schedule_followup(
    hcp_name: str,
    scheduled_date: str,
    notes: str = "",
    interaction_id: int = 0
) -> str:
    """
    Schedule a follow-up meeting with an HCP.
    Accepts natural dates like 'next Tuesday' or '2025-08-10'.
    """
    db = get_db_session()
    try:
        hcp = db.query(models.HCP).filter(
            models.HCP.name.ilike(f"%{hcp_name}%")
        ).first()
        resolved = parse_relative_date(scheduled_date)
        if not resolved:
            return json.dumps({"success": False, "error": f"Cannot parse date: {scheduled_date}"})

        followup = models.FollowUp(
            hcp_id=hcp.id if hcp else None,
            interaction_id=interaction_id or None,
            scheduled_date=date.fromisoformat(resolved),
            notes=notes or f"Follow-up with {hcp_name}"
        )
        db.add(followup)
        db.commit()
        db.refresh(followup)
        return json.dumps({
            "success": True,
            "followup_id": followup.id,
            "scheduled_date": resolved,
            "message": f"Follow-up scheduled with {hcp_name} on {resolved}"
        })
    except Exception as e:
        db.rollback()
        return json.dumps({"success": False, "error": str(e)})
    finally:
        db.close()


@tool
def generate_visit_summary(interaction_id: int) -> str:
    """
    Generate a detailed professional visit summary for a given interaction ID.
    Returns all fields including AI summary and follow-up info.
    """
    db = get_db_session()
    try:
        i = db.query(models.Interaction).filter(
            models.Interaction.id == interaction_id
        ).first()
        if not i:
            return json.dumps({"success": False, "error": f"Interaction {interaction_id} not found"})

        return json.dumps({
            "success": True,
            "summary": {
                "interaction_id": i.id,
                "doctor": i.doctor_name,
                "hospital": i.hospital,
                "specialty": i.specialty,
                "visit_date": str(i.visit_date) if i.visit_date else None,
                "discussion": i.discussion,
                "products_covered": i.products_discussed,
                "follow_up_date": str(i.follow_up_date) if i.follow_up_date else None,
                "notes": i.additional_notes,
                "ai_summary": i.ai_summary,
                "generated_at": datetime.now().isoformat()
            }
        })
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})
    finally:
        db.close()


ALL_TOOLS = [
    log_interaction,
    edit_interaction,
    search_hcp,
    schedule_followup,
    generate_visit_summary
]
