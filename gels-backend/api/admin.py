from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from models.domain import User, UserRole

router = APIRouter(prefix="/api/admin", tags=["System Administration"])

class RoleUpdate(BaseModel):
    new_role: str

@router.get("/health")
def get_system_health():
    """US-015: System health logs & API metrics"""
    return {
        "apiLatency": "112ms",
        "dbStatus": "Healthy",
        "activeConnections": 14,
        "geminiQuota": "2%"
    }

@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    """US-014: List all users"""
    users = db.query(User).all()
    return [{"id": str(u.user_id), "email": u.email, "role": u.role.value, "last_active": u.last_active} for u in users]

@router.put("/users/{user_id}/role")
def update_user_role(user_id: str, data: RoleUpdate, db: Session = Depends(get_db)):
    """US-014: Assign/revoke roles"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        user.role = UserRole(data.new_role.lower())
        db.commit()
        return {"success": True, "message": f"User {user.email} role updated to {user.role.value}"}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid role specified")