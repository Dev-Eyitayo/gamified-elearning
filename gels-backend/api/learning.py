from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from core.database import get_db
from models.domain import EventLog, DecisionLog, Module, LearnerProfile, PlayerType
from schemas.learning import AssessmentSubmit
from services.ai_engine import run_edm_pipeline
from models.domain import Course, DiagnosticQuestion
import random
from datetime import datetime, timezone
import uuid
from services.league_engine import process_weekly_leagues

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
    
class AIDropQuestion(BaseModel):
    question: str
    difficulty: str = "MEDIUM"
    lesson_note: str = "Let's review this concept!"
    options: list

class AIQuestionDrop(BaseModel):
    lesson_note: str = "Let's review this concept!"
    question: str
    difficulty: str = "MEDIUM"
    options: list

class AIQuestionsPayload(BaseModel):
    questions: List[AIQuestionDrop]

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

@router.get("/modules")
def get_curriculum_modules(db: Session = Depends(get_db)):
    """Fetch curriculum tree for classes page"""
    modules = db.query(Module).all()
    
    # Manually map the database objects to JSON-friendly strings
    return [
        {
            "module_id": str(m.module_id), # Convert UUID to string
            "title": m.title,
            "name": m.name,
            "difficulty": m.difficulty.value if hasattr(m.difficulty, 'value') else str(m.difficulty), # Convert Enum to string
            "topic_id": m.topic_id
        }
        for m in modules
    ]

@router.post("/submit-assessment")
def submit_assessment(data: AssessmentSubmit, user_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Triggers EDM Pipeline via Background Task AND Awards Gamification XP"""
    
    new_event = EventLog(
        user_id=user_id,
        event_type="ASSESSMENT_SUBMIT",
        payload={"score": data.score, "time_spent": data.time_spent_seconds, "attempts": data.attempts}
    )
    db.add(new_event)
    
    awarded_xp = 0
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
    
    if profile:
        # If Correct: Give XP
        if data.score > 0:  
            awarded_xp = 15 # Boosted to match realistic league grinds
            profile.xp_total += awarded_xp
            
            # 🔥 LEAGUE MECHANIC: Add to weekly XP
            # Use getattr/setattr to prevent crashes if the DB column isn't migrated yet
            current_weekly = getattr(profile, 'weekly_xp', 0)
            setattr(profile, 'weekly_xp', current_weekly + awarded_xp)
            
            # 🔥 LEAGUE MECHANIC: Assign to a cohort of 30 if they don't have one
            if not getattr(profile, 'cohort_id', None):
                # Find an active cohort in their current league with less than 30 people
                # (Simplified matchmaking for MVP)
                active_cohort = db.query(LearnerProfile.cohort_id).filter(
                    LearnerProfile.current_league == getattr(profile, 'current_league', 'Bronze'),
                    LearnerProfile.cohort_id != None
                ).group_by(LearnerProfile.cohort_id).having(db.func.count() < 30).first()
                
                if active_cohort:
                    profile.cohort_id = active_cohort[0]
                else:
                    # Create a new cohort bracket
                    profile.cohort_id = f"cohort_{getattr(profile, 'current_league', 'Bronze')}_{uuid.uuid4().hex[:8]}"

            if profile.streak_days == 0:
                profile.streak_days = 1
        
        # If Incorrect: Deduct a Gem
        else:
            if profile.gems > 0:
                if profile.gems == 25:
                    profile.last_gem_update = datetime.now(timezone.utc)
                profile.gems -= 1

        db.commit()

    background_tasks.add_task(run_edm_pipeline, user_id)
    
    return {
        "status": "success", 
        "message": "Assessment logged.",
        "xp_awarded": awarded_xp,
        "gems_remaining": profile.gems if profile else 0
    }

@router.get("/next-module")
def get_next_module(user_id: str, db: Session = Depends(get_db)):
    """Queries pre-computed AI adaptive content"""
    latest_decision = db.query(DecisionLog).filter(DecisionLog.user_id == user_id).order_by(DecisionLog.timestamp.desc()).first()
    if not latest_decision:
        return {"action_taken": "ADVANCE", "rationale": "Starting default path."}
    return {"action_taken": latest_decision.action, "rationale": latest_decision.rationale}

@router.get("/onboarding-config")
def get_onboarding_config(db: Session = Depends(get_db)):
    """Dynamically fetches Instructor Modules (as Courses) and Diagnostic Quizzes from the Database"""
    
    # 1. Fetch live MODULES added by the instructor instead of the hardcoded Course table!
    db_modules = db.query(Module).all()
    
    # Visual assets to keep the frontend looking beautiful
    icons = ["Code", "Database", "Layout", "Book", "Rocket", "Compass"]
    palettes = [
        {"colorClass": "text-[#1CB0F6]", "bgClass": "bg-[#DDF4FF]", "borderClass": "border-[#1CB0F6]"},
        {"colorClass": "text-[#58CC02]", "bgClass": "bg-[#D7FFB8]", "borderClass": "border-[#58CC02]"},
        {"colorClass": "text-[#FF9600]", "bgClass": "bg-[#FFDFB8]", "borderClass": "border-[#FF9600]"},
        {"colorClass": "text-[#CE82FF]", "bgClass": "bg-[#F4E0FF]", "borderClass": "border-[#CE82FF]"},
    ]
    
    courses_payload = []
    for idx, mod in enumerate(db_modules):
        p = palettes[idx % len(palettes)]
        courses_payload.append({
            "id": str(mod.module_id), 
            "title": mod.name, # Use the actual module name (e.g. Intro to Data Structures)
            "icon": icons[idx % len(icons)], 
            "colorClass": p["colorClass"], 
            "bgClass": p["bgClass"], 
            "borderClass": p["borderClass"]
        })

    # Graceful fallback just in case the instructor hasn't uploaded anything yet
    if not courses_payload:
        courses_payload = [
            {
                "id": "pending",
                "title": "Waiting for Instructor...",
                "icon": "Loader2",
                "colorClass": "text-slate-400",
                "bgClass": "bg-slate-100",
                "borderClass": "border-slate-200"
            }
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

@router.post("/drop-question")
def ai_drop_question(data: AIDropQuestion, db: Session = Depends(get_db)):
    """Webhook for an AI or external script to drop a question directly into the DB"""
    new_q = DiagnosticQuestion(
        course_id="sys-default-course", # Fallback ID for MVP
        difficulty_level=data.difficulty,
        question_text=data.question,
        options={
            "note": data.lesson_note,
            "choices": data.options
        }
    )
    db.add(new_q)
    db.commit()
    
    return {
        "success": True, 
        "message": "Question successfully dropped into the database!"
    }

@router.post("/drop-questions")
def drop_ai_questions(payload: AIQuestionsPayload, db: Session = Depends(get_db)):
    """Webhook for the AI (or Postman) to drop questions directly into the database."""
    
    # 1. Clean up old test data to fix the "Same ID / Duplicate" bug!
    db.query(DiagnosticQuestion).delete()
    db.commit()

    # 2. Get or create a valid Course ID to satisfy the PostgreSQL rules
    first_course = db.query(Course).first()
    if not first_course:
        first_course = Course(title="Adaptive AI Curriculum", icon="BrainCircuit")
        db.add(first_course)
        db.commit()
        db.refresh(first_course)

    # 3. Drop all the new questions into the database!
    count = 0
    for q in payload.questions:
        new_q = DiagnosticQuestion(
            course_id=first_course.course_id,
            difficulty_level=q.difficulty,
            question_text=q.question,
            options={
                "note": q.lesson_note,
                "choices": q.options
            }
        )
        db.add(new_q)
        count += 1

    db.commit()
    return {"success": True, "message": f"Successfully dropped {count} questions into the database!"}

@router.get("/question")
def get_lesson_question(db: Session = Depends(get_db)):
    """Fetches a dynamic question strictly from the PostgreSQL database"""
    questions = db.query(DiagnosticQuestion).all()
    
    if not questions:
        raise HTTPException(
            status_code=404, 
            detail="No questions found in the database. Use the /drop-questions route to add some!"
        )
    
    # Pick a random question from the database
    q = random.choice(questions)
    return {
        "question_id": str(q.question_id),
        "question_text": q.question_text,
        "options": q.options 
    }

# --- 1. NEW DYNAMIC ROUTE FOR FRONTEND TO FETCH SPECIFIC LESSON ---
@router.get("/{module_id}/{lesson_id}")
def get_specific_lesson(module_id: str, lesson_id: str, db: Session = Depends(get_db)):
    """Fetches a specific lesson by ID, strictly filtering by the requested module!"""
    try:
        all_questions = db.query(DiagnosticQuestion).all()
        
        # 🔥 BULLETPROOF FILTERING: Safely extract the module_id from the JSONB options
        questions = []
        for q in all_questions:
            if isinstance(q.options, dict) and q.options.get("module_id") == str(module_id):
                questions.append(q)
            elif isinstance(q.options, str):
                import json
                try:
                    parsed = json.loads(q.options)
                    if parsed.get("module_id") == str(module_id):
                        questions.append(q)
                except:
                    pass

        if not questions:
            raise HTTPException(status_code=404, detail="No questions generated for this specific module yet.")

        if lesson_id == "start" or lesson_id == "random":
            q = random.choice(questions)
        else:
            q = next((q for q in questions if str(q.question_id) == lesson_id), None)
            if not q:
                q = random.choice(questions)

        return {
            "question_id": str(q.question_id),
            "question_text": q.question_text,
            "options": q.options,
            "total_questions": len(questions)
        }
    except HTTPException:
        raise  # Pass 404s cleanly to the frontend
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/admin/trigger-league-reset")
def trigger_league_reset(db: Session = Depends(get_db)):
    """Admin route to manually trigger the Sunday midnight league resets."""
    process_weekly_leagues(db)
    return {"message": "Leagues processed. Weekly XP reset. Cohorts shuffled."}