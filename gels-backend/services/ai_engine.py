import os
import json
import google.generativeai as genai
from sqlalchemy.orm import Session
from models.domain import LearnerProfile, DecisionLog
from dotenv import load_dotenv

load_dotenv()

# Configure Google Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

def run_edm_pipeline(user_id: str, db: Session):
    """
    Runs in the background via FastAPI BackgroundTasks.
    Reads learner state, consults Gemini, and logs the decision.
    """
    # 1. Fetch current learner state
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
    if not profile:
        return

    # 2. Construct the State Vector JSON (PRD 4.1.1)
    state_vector = {
        "knowledge_level": profile.knowledge_state,
        "engagement_score": profile.engagement_score,
        "player_type": profile.player_type.value,
        "recent_performance": "struggling" if profile.engagement_score < 0.5 else "nominal"
    }

    # 3. Construct the strict prompt for Gemini (PRD 4.1.2)
    prompt = f"""
    You are the GELS Cognitive Engine. You must decide the next pedagogical action for a software engineering student.
    Given this learner state: {json.dumps(state_vector)}
    
    Choose the single best pedagogical action from this list ONLY:
    [ADVANCE, ESCALATE, REMEDIATE, SIMPLIFY, TRIGGER_REWARD, PAUSE_AND_REFLECT]
    
    Respond strictly in valid JSON format without any markdown formatting:
    {{
        "action": "ACTION_NAME",
        "rationale": "One precise sentence explaining why."
    }}
    """

    try:
        # 4. Call Gemini API
        response = model.generate_content(prompt)
        
        # Safely clean the response of any markdown formatting
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        decision = json.loads(raw_text.strip())
        
        action = decision.get("action", "ADVANCE")
        rationale = decision.get("rationale", "System default action.")

        # 5. Write to Glass-Box Decision Log (PRD 4.1.4)
        new_log = DecisionLog(
            user_id=user_id,
            action=action,
            rationale=rationale
        )
        db.add(new_log)
        db.commit()

    except Exception as e:
        print(f"AI Engine Error: {e}")
        db.rollback()