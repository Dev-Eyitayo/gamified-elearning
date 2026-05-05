from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from core.database import get_db
from models.domain import LearnerProfile, User, Quest, Achievement, Notification

router = APIRouter(prefix="/api/gamification", tags=["Affective Engine"])

@router.get("/profile")
def get_profile(user_id: str, db: Session = Depends(get_db)):
    """Fetches the user's gamification stats AND their personal details"""
    
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
    
    # 👇 THIS IS THE LINE THAT WAS FIXED (User.id -> User.user_id) 👇
    user = db.query(User).filter(User.user_id == user_id).first() 
    
    if not profile or not user:
        raise HTTPException(status_code=404, detail="Profile not found")

    username = user.email.split('@')[0]
    
    return {
        "username": username,
        "email": user.email,
        "xp_total": profile.xp_total,
        "streak_days": profile.streak_days,
        "player_type": profile.player_type.value,
        "current_level": profile.current_level,
        "engagement_score": profile.engagement_score
    }

@router.get("/leaderboard")
def get_leaderboard(scope: str = "global", player_type: str = None, db: Session = Depends(get_db)):
    """US-004 & PRD 4.2.2: Contextual leaderboard"""
    query = db.query(User.email, LearnerProfile.xp_total, LearnerProfile.player_type, LearnerProfile.user_id).join(LearnerProfile)
    
    if scope == "private" and player_type:
        query = query.filter(LearnerProfile.player_type == player_type)
        
    leaders = query.order_by(desc(LearnerProfile.xp_total)).limit(10).all()
    
    return {"entries": [
        {
            "user_id": str(l.user_id), 
            "username": l.email.split('@')[0], 
            "xp": l.xp_total, 
            "type": l.player_type.value
        } for l in leaders
    ]}

@router.get("/quests")
def get_active_quests(db: Session = Depends(get_db)):
    """PRD 4.2.2: Fetch active quests dynamically from the database"""
    active_quests = db.query(Quest).filter(Quest.is_active == True).all()
    
    return [
        {
            "id": str(q.quest_id), 
            "type": q.quest_type, 
            "title": q.title, 
            "description": q.description,
            "reward_xp": q.reward_xp, 
            "status": "active"
        } 
        for q in active_quests
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
    
    notifications = db.query(Notification).filter(Notification.user_id == user_id).order_by(desc(Notification.created_at)).all()
    
    return [
        {
            "id": str(n.notification_id),
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "time": "Recent", # For MVP. In production, calculate time diff from n.created_at
            "isRead": n.is_read
        }
        for n in notifications
    ]

@router.get("/social")
def get_social_data(user_id: str, db: Session = Depends(get_db)):
    """Dynamically fetches peers and recent social feed events"""
    
    # 1. Fetch up to 4 other users from the database to act as the "Cohort/Friends"
    peers = db.query(User.email, LearnerProfile.xp_total).join(LearnerProfile).filter(User.user_id != user_id).limit(4).all()
    
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

    # 2. Generate a dynamic feed based on the top peer's activity
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

    return {
        "friends": friends_list,
        "feed": feed
    }