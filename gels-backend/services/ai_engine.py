import os
import json
import requests
import re
from sqlalchemy.orm import Session
from models.domain import LearnerProfile, DecisionLog, DiagnosticQuestion, Course
from core.database import SessionLocal
from dotenv import load_dotenv
import PyPDF2

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# 🔥 CRITICAL FIX: Changed to a valid OpenRouter slug so the API stops rejecting it!
MODEL_NAME = "deepseek/deepseek-chat" 

def call_openrouter(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", 
        "X-Title": "GELS Platform" 
    }
    payload = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}]
    }
    
    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
        response.raise_for_status() 
        data = response.json()
        return data['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        error_msg = response.text if response else str(e)
        print(f"\n[!!!] OPENROUTER API CRASH [!!!]")
        print(f"Status Code: {response.status_code if response else 'N/A'}")
        print(f"Error Details: {error_msg}\n")
        raise Exception(f"OpenRouter API Failed: {error_msg}")

def run_edm_pipeline(user_id: str):
    db = SessionLocal() 
    try:
        profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
        if not profile: return
        
        state_vector = {
            "knowledge_level": profile.knowledge_state,
            "engagement_score": profile.engagement_score,
            "player_type": profile.player_type.value,
            "recent_performance": "struggling" if profile.engagement_score < 0.5 else "nominal"
        }
        
        prompt = f"""
        You are the GELS Cognitive Engine. You must decide the next pedagogical action for a software engineering student.
        Given this learner state: {json.dumps(state_vector)}
        Choose ONLY from: [ADVANCE, ESCALATE, REMEDIATE, SIMPLIFY, TRIGGER_REWARD, PAUSE_AND_REFLECT]
        Respond strictly in valid JSON: {{"action": "ACTION_NAME", "rationale": "One sentence explaining why."}}
        """
        
        raw_text = call_openrouter(prompt).strip()
        match = re.search(r'\{.*\}', raw_text, re.DOTALL)
        if match:
            raw_text = match.group(0)
        decision = json.loads(raw_text)
        
        new_log = DecisionLog(
            user_id=user_id,
            action=decision.get("action", "ADVANCE"),
            rationale=decision.get("rationale", "System default action.")
        )
        db.add(new_log)
        db.commit()
    except Exception as e:
        print(f"[-] DeepSeek Engine Error (EDM): {e}")
        db.rollback()
    finally:
        db.close()

def extract_text_from_file(file_path: str) -> str:
    ext = file_path.split('.')[-1].lower()
    try:
        if ext in ['md', 'txt', 'csv']:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        elif ext == 'pdf':
            text = ""
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for i, page in enumerate(reader.pages):
                    if i >= 10: break 
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
            return text
        else:
            return f"Please upload a valid text or PDF file."
    except Exception as e:
        return f"Failed to extract text: {e}"

def generate_curriculum_from_asset(module_id: str, file_path: str):
    db = SessionLocal() 
    try:
        print(f"\n[*] DeepSeek Engine is analyzing {file_path}...")
        file_content = extract_text_from_file(file_path)

        prompt = f"""
        You are an expert instructional designer for a gamified eLearning app.
        Analyze the following material:
        ---
        {file_content}
        ---
        Generate 15 highly engaging, bite-sized learning cards.
        Each card MUST include a conversational 'lesson_note' that teaches the concept in 1-2 sentences, followed by a multiple-choice question to test it.
        
        Output ONLY valid JSON in this exact structure without any markdown blocks:
        [
          {{
            "lesson_note": "A fun, encouraging explanation.",
            "question": "The engaging question text here?",
            "difficulty": "EASY",
            "options": [
              {{"id": 1, "text": "Option A", "isCorrect": true}},
              {{"id": 2, "text": "Option B", "isCorrect": false}},
              {{"id": 3, "text": "Option C", "isCorrect": false}},
              {{"id": 4, "text": "Option D", "isCorrect": false}}
            ]
          }}
        ]
        """

        raw_text = call_openrouter(prompt).strip()
        
        # 🔥 CRITICAL FIX: Bulletproof Regex to extract JSON even if DeepSeek wraps it in weird text
        match = re.search(r'\[.*\]', raw_text, re.DOTALL)
        if match:
            raw_text = match.group(0)

        questions_data = json.loads(raw_text)

        first_course = db.query(Course).first()
        if not first_course:
            first_course = Course(title="Adaptive AI Curriculum", icon="BrainCircuit")
            db.add(first_course)
            db.commit()
            db.refresh(first_course)
            
        valid_course_id = first_course.course_id

        for q_data in questions_data:
            new_q = DiagnosticQuestion(
                course_id=valid_course_id, 
                difficulty_level=q_data.get("difficulty", "MEDIUM"),
                question_text=q_data["question"],
                options={
                    "module_id": str(module_id), 
                    "note": q_data.get("lesson_note", "Let's review this concept!"),
                    "choices": q_data["options"]
                }
            )
            db.add(new_q)

        db.commit()
        print(f"[+] DeepSeek successfully generated and dropped {len(questions_data)} adaptive questions!\n")

    except Exception as e:
        print(f"[-] DeepSeek Content Generation Failed: {e}")
        db.rollback()
        
        # 🔥 THE ULTIMATE SAFETY NET: If the API crashes, we write a fallback question to the DB so the frontend NEVER hangs on a 404!
        try:
            fc = db.query(Course).first()
            fallback_q = DiagnosticQuestion(
                course_id=fc.course_id if fc else "fallback-id",
                difficulty_level="EASY",
                question_text=f"AI Engine Error: The background task failed. Please check your OpenRouter API key. (Details: {str(e)[:80]})",
                options={
                    "module_id": str(module_id),
                    "note": "The AI failed to process this file. This is a fallback lesson so you don't get stuck in a loading loop.",
                    "choices": [
                        {"id": 1, "text": "I will check the backend logs", "isCorrect": True},
                        {"id": 2, "text": "I will stare at the screen", "isCorrect": False}
                    ]
                }
            )
            db.add(fallback_q)
            db.commit()
        except Exception as fallback_error:
            print(f"Fallback generation also failed: {fallback_error}")
            
    finally:
        db.close()