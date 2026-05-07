from sqlalchemy.orm import Session
from models.domain import LearnerProfile

# Exact 10-League Hierarchy
LEAGUES = [
    "Bronze", "Silver", "Gold", "Sapphire", "Ruby", 
    "Emerald", "Amethyst", "Pearl", "Obsidian", "Diamond"
]

# Promotion Zones based on your 2026 specs (Top X promote)
PROMOTION_ZONES = {
    "Bronze": 15,
    "Silver": 12,
    "Gold": 10,
    "Sapphire": 7,
    "Ruby": 5,
    "Emerald": 5,
    "Amethyst": 5,
    "Pearl": 4,
    "Obsidian": 4,
    "Diamond": 0 # Nobody promotes from Diamond, top 10 go to tournament
}

def process_weekly_leagues(db: Session):
    print("🏆 Starting Weekly League Reset...")
    
    # 1. Get all unique active cohorts
    cohorts = db.query(LearnerProfile.cohort_id, LearnerProfile.current_league).filter(
        LearnerProfile.cohort_id != None
    ).distinct().all()
    
    for cohort_id, league_name in cohorts:
        # Get all users in this specific 30-person cohort, sorted by Weekly XP (highest first)
        users = db.query(LearnerProfile).filter(
            LearnerProfile.cohort_id == cohort_id
        ).order_by(LearnerProfile.weekly_xp.desc()).all()
        
        league_idx = LEAGUES.index(league_name)
        promotion_cutoff = PROMOTION_ZONES.get(league_name, 0)
        
        for rank, user in enumerate(users):
            # Rank is 0-indexed (0 is 1st place, 29 is 30th place)
            
            # --- PROMOTION LOGIC ---
            if rank < promotion_cutoff and league_idx < len(LEAGUES) - 1:
                # Promote to next league
                user.current_league = LEAGUES[league_idx + 1]
                print(f"🔼 PROMOTED: {user.user_id} to {user.current_league}")
            
            # --- DEMOTION LOGIC (Bottom 5 demote, except in Bronze) ---
            # If there are 30 people, bottom 5 means rank 25, 26, 27, 28, 29
            elif rank >= (len(users) - 5) and league_idx > 0:
                # Demote to previous league
                user.current_league = LEAGUES[league_idx - 1]
                print(f"🔽 DEMOTED: {user.user_id} to {user.current_league}")
            
            # --- STAY IN LEAGUE ---
            else:
                pass # They safely survived the week
                
            # --- RESET FOR MONDAY ---
            user.weekly_xp = 0
            user.cohort_id = None # They will be assigned a new cohort when they do their next lesson
            
    db.commit()
    print("✅ Weekly League Reset Complete!")