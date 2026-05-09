from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import List, Optional
from core.database import get_db
from models.domain import EventLog, DecisionLog, Module, LearnerProfile, PlayerType, Course, DiagnosticQuestion, CoursePath, Section, Unit, Level, Lesson
from schemas.learning import AssessmentSubmit
from services.ai_engine import run_edm_pipeline, generate_curriculum_from_asset
import random
from datetime import datetime, timezone
import uuid
from services.league_engine import process_weekly_leagues
from sqlalchemy.orm import selectinload
import shutil

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

class CreateCourse(BaseModel):
    instructor_id: str
    title: str

class CreateSection(BaseModel):
    course_id: str
    title: str

class CreateUnit(BaseModel):
    section_id: str
    title: str

# --- SPECIFIC ROUTES (Must come before catch-all routes) ---

@router.post("/onboarding")
def complete_onboarding(data: OnboardingData, db: Session = Depends(get_db)):
    """PRD Sec 8: Saves Baseline Assessment & Player-Type Survey"""
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == data.user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Learner profile not found")
    
    profile.knowledge_state = {"baseline_topic": data.baseline_score}
    
    try:
        profile.player_type = PlayerType(data.player_type.upper())
    except ValueError:
        profile.player_type = PlayerType.ACHIEVER 

    db.commit()
    return {"message": "Onboarding complete. Profile calibrated."}

@router.get("/modules")
def get_curriculum_modules(db: Session = Depends(get_db)):
    """Fetch curriculum tree for classes page"""
    modules = db.query(Module).all()
    return [
        {
            "module_id": str(m.module_id),
            "title": m.title,
            "name": m.name,
            "difficulty": m.difficulty.value if hasattr(m.difficulty, 'value') else str(m.difficulty),
            "topic_id": m.topic_id
        }
        for m in modules
    ]

@router.post("/submit-assessment")
def submit_assessment(data: AssessmentSubmit, db: Session = Depends(get_db)):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == data.user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # 1. Award XP and Sync Gems
    xp_gain = 15 + (5 if data.score >= 80 else 0)
    profile.xp_total += xp_gain
    profile.gems = data.remaining_gems

    # 2. 🔥 STREAK LOGIC
    now = datetime.now(timezone.utc)

    last_active = profile.last_active_at
    if last_active and last_active.tzinfo is None:
        last_active = last_active.replace(tzinfo=timezone.utc)

    if last_active:
        delta = now.date() - last_active.date()
        
        if delta.days == 0:
            # ✅ FIX: First lesson of the day - if streak is 0, this is effectively day 1
            if profile.streak_days == 0:
                profile.streak_days = 1
            # else: already practiced today, keep streak as is
        elif delta.days == 1:
            profile.streak_days += 1
        elif delta.days > 1:
            profile.streak_days = 1
    else:
        profile.streak_days = 1

    profile.last_active_at = now
    
    db.commit()
    return {"status": "success", "streak": profile.streak_days}

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
    db_modules = db.query(Module).all()
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
            "title": mod.name,
            "icon": icons[idx % len(icons)], 
            "colorClass": p["colorClass"], 
            "bgClass": p["bgClass"], 
            "borderClass": p["borderClass"]
        })

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

    db_questions = db.query(DiagnosticQuestion).all()
    quizzes_payload = {"beginner": [], "intermediate": [], "advanced": []}
    
    for q in db_questions:
        level = q.difficulty_level.lower()
        if level in quizzes_payload:
            quizzes_payload[level].append({
                "question": q.question_text,
                "options": q.options
            })

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
        course_id="sys-default-course", 
        difficulty_level=data.difficulty,
        question_text=data.question,
        options={"note": data.lesson_note, "choices": data.options}
    )
    db.add(new_q)
    db.commit()
    return {"success": True, "message": "Question successfully dropped into the database!"}

@router.post("/drop-questions")
def drop_ai_questions(payload: AIQuestionsPayload, db: Session = Depends(get_db)):
    """Webhook for the AI (or Postman) to drop questions directly into the database."""
    db.query(DiagnosticQuestion).delete()
    db.commit()

    first_course = db.query(Course).first()
    if not first_course:
        first_course = Course(title="Adaptive AI Curriculum", icon="BrainCircuit")
        db.add(first_course)
        db.commit()
        db.refresh(first_course)

    count = 0
    for q in payload.questions:
        new_q = DiagnosticQuestion(
            course_id=first_course.course_id,
            difficulty_level=q.difficulty,
            question_text=q.question,
            options={"note": q.lesson_note, "choices": q.options}
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
        raise HTTPException(status_code=404, detail="No questions found in the database.")
    
    q = random.choice(questions)
    return {
        "question_id": str(q.question_id),
        "question_text": q.question_text,
        "options": q.options 
    }

@router.post("/admin/trigger-league-reset")
def trigger_league_reset(db: Session = Depends(get_db)):
    """Admin route to manually trigger the Sunday midnight league resets."""
    process_weekly_leagues(db)
    return {"message": "Leagues processed. Weekly XP reset. Cohorts shuffled."}

@router.get("/learning-paths")
def get_all_learning_paths(instructor_id: str, db: Session = Depends(get_db)):
    # 🔥 FIX: Prevent PostgreSQL from crashing if "undefined" is sent
    if not instructor_id or instructor_id == "undefined":
        return []
    
    try:
        # Validate that it is a proper UUID format
        uuid.UUID(instructor_id)
    except ValueError:
        # If it's a garbled string that isn't a UUID, return empty
        return []

    courses = db.query(CoursePath).filter(CoursePath.instructor_id == instructor_id).all()
    if not courses:
        return []
    return [{"id": c.id, "title": c.title} for c in courses]

@router.post("/course")
def create_course(data: CreateCourse, db: Session = Depends(get_db)):
    new_course = CoursePath(instructor_id=data.instructor_id, title=data.title, language_or_topic="Custom")
    db.add(new_course)
    db.commit()
    return {"success": True}

@router.post("/section")
def create_section(data: CreateSection, db: Session = Depends(get_db)):
    # Auto-calculate order_index
    count = db.query(Section).filter(Section.course_id == data.course_id).count()
    new_sec = Section(course_id=data.course_id, title=data.title, order_index=count + 1)
    db.add(new_sec)
    db.commit()
    return {"success": True}

@router.post("/unit")
def create_unit(data: CreateUnit, db: Session = Depends(get_db)):
    count = db.query(Unit).filter(Unit.section_id == data.section_id).count()
    new_unit = Unit(section_id=data.section_id, title=data.title, order_index=count + 1)
    db.add(new_unit)
    db.commit()
    return {"success": True}

@router.get("/learning-path/{course_id}")
def get_full_learning_path(course_id: str, db: Session = Depends(get_db)):
    # 🔥 FIX: selectinload is significantly faster for deep trees than joinedload
    course = db.query(CoursePath).options(
        selectinload(CoursePath.sections)
        .selectinload(Section.units)
        .selectinload(Unit.levels)
        .selectinload(Level.lessons)
    ).filter(CoursePath.id == course_id).first()

    if not course:
        raise HTTPException(status_code=404, detail="Course path not found")

    # 🔥 FIX: Manually build the dictionary to prevent Pydantic recursion crashes
    return {
        "course_id": course.id,
        "title": course.title,
        "sections": [
            {
                "section_id": s.id,
                "title": s.title,
                "units": [
                    {
                        "unit_id": u.id,
                        "title": u.title,
                        "theme_color": u.theme_color,
                        "levels": [
                            {
                                "level_id": l.id,
                                "icon_type": l.icon_type,
                                "lesson_count": len(l.lessons)
                            } for l in u.levels
                        ]
                    } for u in s.units
                ]
            } for s in course.sections
        ]
    }

@router.post("/path-node")
def create_path_node(
    background_tasks: BackgroundTasks, # 🔥 Add BackgroundTasks
    unit_id: str = Form(...),
    icon_type: str = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Creates a Node and triggers DeepSeek AI to parse the uploaded material"""
    new_level = Level(unit_id=unit_id, icon_type=icon_type, order_index=1)
    db.add(new_level)
    db.commit()
    db.refresh(new_level)
    
    new_lesson = Lesson(level_id=new_level.id, title=title, order_index=1)
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)

    # 🔥 SAVE FILE & TRIGGER DEEPSEEK
    file_location = f"uploads/modules/{new_lesson.id}_{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    # Pass new_lesson.id so DeepSeek tags the questions correctly
    background_tasks.add_task(generate_curriculum_from_asset, str(new_lesson.id), file_location)
    
    return {"message": "Node added! DeepSeek is generating questions in the background."}

# gels-backend/api/learning.py

@router.get("/{module_id}/{lesson_id}")
def get_specific_lesson(module_id: str, lesson_id: str, db: Session = Depends(get_db)):
    """Fetches all questions for a lesson pool so the frontend can loop through them."""
    try:
        # 1. Identify all valid IDs (checking Level and child Lessons)
        valid_target_ids = [lesson_id]
        level_lessons = db.query(Lesson).filter(Lesson.level_id == lesson_id).all()
        if level_lessons:
            valid_target_ids.extend([str(l.id) for l in level_lessons])

        # 2. Fetch and filter questions
        all_questions = db.query(DiagnosticQuestion).all()
        filtered = []
        
        for q in all_questions:
            target_id = None
            # Extract module_id from options JSON/Dict
            if isinstance(q.options, dict):
                target_id = q.options.get("module_id")
            elif isinstance(q.options, str):
                import json
                try: target_id = json.loads(q.options).get("module_id")
                except: pass

            if target_id in valid_target_ids or target_id == str(module_id):
                filtered.append({
                    "question_id": str(q.question_id),
                    "question_text": q.question_text,
                    "options": q.options
                })

        if not filtered:
            raise HTTPException(status_code=404, detail="No questions found.")

        # 🔥 Return the FULL LIST for the Duolingo-style loop
        return filtered
        
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=400, detail=str(e))