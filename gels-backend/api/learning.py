from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from core.database import get_db
from models.domain import EventLog, DecisionLog, Module, LearnerProfile, PlayerType
from schemas.learning import AssessmentSubmit
from services.ai_engine import run_edm_pipeline
from models.domain import Course, DiagnosticQuestion

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

@router.get("/onboarding-config")
def get_onboarding_config(db: Session = Depends(get_db)):
    """Dynamically fetches Courses and Diagnostic Quizzes from the Database"""
    
    # 1. Fetch live courses from the DB
    db_courses = db.query(Course).all()
    courses_payload = [
        {
            "id": str(c.course_id), 
            "title": c.title, 
            "icon": c.icon, 
            "colorClass": c.color_class, 
            "bgClass": c.bg_class, 
            "borderClass": c.border_class
        } for c in db_courses
    ]

    # 2. Fetch live diagnostic questions and group them by difficulty
    db_questions = db.query(DiagnosticQuestion).all()
    quizzes_payload = {"beginner": [], "intermediate": [], "advanced": []}
    
    for q in db_questions:
        level = q.difficulty_level.lower()
        if level in quizzes_payload:
            quizzes_payload[level].append({
                "question": q.question_text,
                "options": q.options
            })

    # 3. Return the dynamic payload
    return {
        "courses": courses_payload,
        "levels": [
            {"id": "beginner", "title": "Beginner", "description": "I'm completely new to this topic.", "icon": "Book", "bgHex": "bg-[#58CC02]"},
            {"id": "intermediate", "title": "Intermediate", "description": "I know the basics and want to level up.", "icon": "Rocket", "bgHex": "bg-[#FF9600]"},
            {"id": "advanced", "title": "Advanced", "description": "I have prior experience and want a challenge.", "icon": "Flame", "bgHex": "bg-[#FF4B4B]"}
        ],
        "diagnosticQuizzes": quizzes_payload,
        "surveyQuestions": [
            {
                "question": "When you learn something new, you prefer to:",
                "options": [
                    {"id": "ACHIEVER", "text": "Master it completely and get a high score", "icon": "Trophy", "color": "text-[#FFD900]"},
                    {"id": "SOCIALIZER", "text": "Discuss it and solve problems with peers", "icon": "Users", "color": "text-[#1CB0F6]"},
                    {"id": "EXPLORER", "text": "Explore related topics and hidden concepts", "icon": "Compass", "color": "text-[#CE82FF]"}
                ]
            }
        ]
    }
