from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID

class AssessmentSubmit(BaseModel):
    module_id: str
    score: float  # e.g., 0.85 for 85%
    time_spent_seconds: int
    attempts: int

class NextModuleResponse(BaseModel):
    module_id: str
    title: str
    difficulty: str
    action_taken: str
    rationale: str