from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from core.database import get_db
from models.domain import EventLog, DecisionLog, Module, LearnerProfile, PlayerType
from schemas.learning import AssessmentSubmit
from services.ai_engine import run_edm_pipeline

router = APIRouter(prefix="/api/learning", tags=["Learning & Core Loop"])

# --- SCHEMAS ---
class OnboardingData(BaseModel):
    user_id: str
    baseline_score: float
    player_type: str

class ModuleResponse(BaseModel):
    module_id: str
    title: str
    name: str
    difficulty: str
    topic_id: str
    
# --- ENDPOINTS ---

@router.post("/onboarding")
def complete_onboarding(data: OnboardingData, db: Session = Depends(get_db)):
    """PRD Sec 8: Saves Baseline Assessment & Player-Type Survey"""
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == data.user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Learner profile not found")
    
    # Initialize knowledge state based on baseline quiz
    profile.knowledge_state = {"baseline_topic": data.baseline_score}
    
    # Set player type from survey (ACHIEVER, SOCIALIZER, EXPLORER)
    try:
        profile.player_type = PlayerType(data.player_type.upper())
    except ValueError:
        profile.player_type = PlayerType.ACHIEVER # Default fallback

    db.commit()
    return {"message": "Onboarding complete. Profile calibrated."}

@router.get("/modules", response_model=List[ModuleResponse])
def get_curriculum_modules(db: Session = Depends(get_db)):
    """Fetch curriculum tree for classes page"""
    modules = db.query(Module).all()
    return modules

@router.post("/submit-assessment")
def submit_assessment(data: AssessmentSubmit, user_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Triggers EDM Pipeline & Gemini API via Background Task"""
    new_event = EventLog(
        user_id=user_id,
        event_type="ASSESSMENT_SUBMIT",
        payload={"score": data.score, "time_spent": data.time_spent_seconds, "attempts": data.attempts}
    )
    db.add(new_event)
    db.commit()

    background_tasks.add_task(run_edm_pipeline, user_id, db)
    return {"status": "success", "message": "Assessment logged. AI Engine evaluating next path."}

@router.get("/next-module")
def get_next_module(user_id: str, db: Session = Depends(get_db)):
    """Queries pre-computed AI adaptive content"""
    latest_decision = db.query(DecisionLog).filter(DecisionLog.user_id == user_id).order_by(DecisionLog.timestamp.desc()).first()
    if not latest_decision:
        return {"action_taken": "ADVANCE", "rationale": "Starting default path."}
    return {"action_taken": latest_decision.action, "rationale": latest_decision.rationale}