from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from core.database import get_db
from models.domain import LearnerProfile, User, Quest, Achievement, Notification
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/api/gamification", tags=["Affective Engine"])

@router.get("/profile")
def get_profile(user_id: str, db: Session = Depends(get_db)):
    """Fetches user stats and manages the 24-hour Gem Refill cycle"""
    
    # Safety check for frontend 'undefined' strings
    if user_id == "undefined" or not user_id:
        raise HTTPException(status_code=400, detail="Invalid User ID")

    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
    user = db.query(User).filter(User.user_id == user_id).first()
    
    if not profile or not user:
        raise HTTPException(status_code=404, detail="Profile not found")

    # --- 🔥 DYNAMIC GEM REFILL LOGIC (Duolingo Style) ---
    MAX_GEMS = 25
    SECONDS_PER_GEM = 86400 / 25  # Refill 25 gems over 24 hours

    if profile.gems < MAX_GEMS:
        now = datetime.now(timezone.utc)
        last_update = profile.last_gem_update
        
        if last_update.tzinfo is None:
            last_update = last_update.replace(tzinfo=timezone.utc)

        time_passed = (now - last_update).total_seconds()
        
        if time_passed >= SECONDS_PER_GEM:
            gems_earned = int(time_passed // SECONDS_PER_GEM)
            new_gem_count = min(MAX_GEMS, profile.gems + gems_earned)
            
            profile.gems = new_gem_count
            
            if new_gem_count == MAX_GEMS:
                profile.last_gem_update = now
            else:
                profile.last_gem_update += timedelta(seconds=gems_earned * SECONDS_PER_GEM)
            
            db.commit()

    return {
        "username": user.email.split('@')[0],
        "email": user.email,
        "xp_total": profile.xp_total,
        "streak_days": profile.streak_days,
        "player_type": profile.player_type.value if hasattr(profile.player_type, 'value') else profile.player_type,
        "current_level": profile.current_level,
        "engagement_score": profile.engagement_score,
        "gems": profile.gems
    }

@router.get("/leaderboard")
def get_leaderboard(scope: str = "global", player_type: str = None, db: Session = Depends(get_db)):
    """US-004: Contextual leaderboard with Explicit Join Path to avoid Ambiguity"""
    
    # 🔥 FIX: Explicitly join on user_id to resolve AmbiguousForeignKeysError
    query = db.query(User.email, LearnerProfile.xp_total, LearnerProfile.player_type, LearnerProfile.user_id)\
              .join(LearnerProfile, User.user_id == LearnerProfile.user_id)
    
    if scope == "private" and player_type:
        query = query.filter(LearnerProfile.player_type == player_type)
        
    leaders = query.order_by(desc(LearnerProfile.xp_total)).limit(10).all()
    
    return {"entries": [
        {
            "user_id": str(l.user_id), 
            "username": l.email.split('@')[0].replace('.', ' ').title(), 
            "xp": l.xp_total, 
            "type": l.player_type.value if hasattr(l.player_type, 'value') else l.player_type
        } for l in leaders
    ]}

@router.get("/quests")
def get_active_quests(db: Session = Depends(get_db)):
    """Fetch active daily quests"""
    active_quests = db.query(Quest).filter(Quest.is_active == True).all()
    return [
        {
            "id": str(q.quest_id), 
            "type": q.quest_type, 
            "title": q.title, 
            "description": q.description,
            "reward_xp": q.reward_xp, 
            "status": "active"
        } for q in active_quests
    ]

@router.get("/achievements")
def get_user_achievements(user_id: str, db: Session = Depends(get_db)):
    """Dynamically calculates trophy progress based on real user stats"""
    
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    achievements = db.query(Achievement).all()
    
    if not achievements:
        return [
            {"id": "sys-1", "title": "XP Olympian", "metric": "30000", "current": min(profile.xp_total, 30000), "total": 30000, "icon": "Dumbbell", "color": "text-[#1CB0F6]", "bg": "bg-[#DDF4FF]"},
            {"id": "sys-2", "title": "Sleepwalker", "metric": "50", "current": min(profile.streak_days, 50), "total": 50, "icon": "Moon", "color": "text-[#CE82FF]", "bg": "bg-[#F3D9FF]"},
            {"id": "sys-3", "title": "Flawless Finisher", "metric": "100", "current": 0, "total": 100, "icon": "Target", "color": "text-[#58CC02]", "bg": "bg-[#D7FFB8]"}
        ]

    results = []
    for ach in achievements:
        current_progress = 0
        
        if ach.metric_type == 'xp':
            current_progress = profile.xp_total
        elif ach.metric_type == 'streak':
            current_progress = profile.streak_days
            
        current_progress = min(current_progress, ach.target_metric)

        results.append({
            "id": str(ach.achievement_id),
            "title": ach.title,
            "metric": str(ach.target_metric),
            "current": current_progress,
            "total": ach.target_metric,
            "icon": ach.icon,
            "color": ach.color,
            "bg": ach.bg
        })

    return results

@router.get("/notifications")
def get_notifications(user_id: str, db: Session = Depends(get_db)):
    """Fetches real notifications for the user from the database"""
    
    # --- ADD THIS SAFETY CHECK ---
    if user_id == "undefined" or not user_id:
        return []
        
    notifications = db.query(Notification).filter(Notification.user_id == user_id).order_by(desc(Notification.created_at)).all()
    
    return [
        {
            "id": str(n.notification_id),
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "time": "Recent",
            "isRead": n.is_read
        }
        for n in notifications
    ]

@router.get("/social")
def get_social_data(user_id: str, db: Session = Depends(get_db)):
    """Fetches cohort activity feed and friends with explicit join condition"""
    
    if user_id == "undefined" or not user_id:
        return {"friends": [], "feed": []}

    # 🔥 FIX: Added explicit onclause
    peers = db.query(User.email, LearnerProfile.xp_total)\
        .join(LearnerProfile, User.user_id == LearnerProfile.user_id)\
        .filter(User.user_id != user_id)\
        .limit(4).all()
    
    friends_list = []
    colors = ["bg-[#58CC02]", "bg-[#CE82FF]", "bg-[#FF9600]", "bg-[#1CB0F6]"]
    
    for i, peer in enumerate(peers):
        name = peer.email.split('@')[0].replace('.', ' ').title()
        friends_list.append({
            "name": name,
            "xp": f"{peer.xp_total} XP",
            "initials": name[:2].upper(),
            "color": colors[i % len(colors)]
        })

    feed = []
    if friends_list:
        top_peer = friends_list[0]
        feed.append({
            "friend_name": top_peer["name"],
            "friend_initials": top_peer["initials"],
            "friend_color": top_peer["color"],
            "time_ago": "Recently",
            "message": f"Just reached {top_peer['xp']} and is climbing the leaderboard!"
        })

    return {"friends": friends_list, "feed": feed}