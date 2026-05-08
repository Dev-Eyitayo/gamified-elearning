from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from uuid import UUID

class AssessmentSubmit(BaseModel):
    user_id: str  # 🔥 CRITICAL: Added this to identify the user
    module_id: Optional[str] = None
    score: float  # e.g., 85.0 for 85%
    time_spent_seconds: int
    remaining_gems: int # This syncs the Duolingo-style hearts
    attempts: int

class NextModuleResponse(BaseModel):
    module_id: str
    title: str
    difficulty: str
    action_taken: str
    rationale: str