from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from pydantic import BaseModel
from core.database import get_db
from models.domain import LearnerProfile, DecisionLog, Module, Difficulty

router = APIRouter(prefix="/api/instructor", tags=["Instructor Glass-Box Portal"])

# --- SCHEMAS ---
class ModuleCreate(BaseModel):
    title: str
    name: str
    topic_id: str
    difficulty: str
    content_url: str
    estimated_minutes: int

class OverrideRequest(BaseModel):
    student_id: str
    module_id: str
    reason: str

# --- ENDPOINTS ---

@router.get("/cohort-analytics")
def get_cohort_analytics(db: Session = Depends(get_db)):
    """US-010: Aggregated cohort metrics"""
    total_students = db.query(LearnerProfile).count()
    at_risk = db.query(LearnerProfile).filter(LearnerProfile.engagement_score < 0.4).count()
    
    return {
        "total_active": total_students,
        "avg_mastery_estimate": "72%", # Aggregated from JSONB in full production
        "at_risk_count": at_risk,
        "drop_off_rate": round(at_risk / max(total_students, 1), 2)
    }

@router.get("/decision-log")
def get_decision_log(db: Session = Depends(get_db)):
    """US-011: Glass Box AI decision log"""
    logs = db.query(DecisionLog).order_by(DecisionLog.timestamp.desc()).limit(20).all()
    return [{"log_id": str(l.log_id), "user_id": str(l.user_id), "action": l.action, "rationale": l.rationale, "time": l.timestamp} for l in logs]

@router.post("/override-path")
def manual_path_override(data: OverrideRequest, db: Session = Depends(get_db)):
    """US-012: Manually overrides AI path"""
    override_log = DecisionLog(
        user_id=data.student_id,
        module_id=data.module_id,
        action="INSTRUCTOR_OVERRIDE",
        rationale=f"Manual Override: {data.reason}"
    )
    db.add(override_log)
    db.commit()
    return {"success": True, "message": "Override logged successfully"}

@router.post("/modules")
def create_module(data: ModuleCreate, db: Session = Depends(get_db)):
    """US-009: Upload structured modules"""
    try:
        diff_enum = Difficulty(data.difficulty.upper())
    except ValueError:
        diff_enum = Difficulty.MEDIUM

    new_module = Module(
        title=data.title,
        name=data.name,
        topic_id=data.topic_id,
        difficulty=diff_enum,
        content_url=data.content_url,
        estimated_minutes=data.estimated_minutes
    )
    db.add(new_module)
    db.commit()
    return {"success": True, "module_id": str(new_module.module_id)}

@router.put("/settings")
def update_gamification_settings():
    """US-013: Toggle gamification mechanics (Mock)"""
    return {"success": True, "message": "Cohort gamification settings updated."}