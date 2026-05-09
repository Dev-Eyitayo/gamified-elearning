# gels-backend/list_backend.py
from sqlalchemy import text, inspect
from core.database import engine, SessionLocal
from models.domain import LearnerProfile

def audit_backend():
    print("🔍 Starting Backend Audit...\n")
    
    # 1. List all Tables in the DB
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"📁 Database Tables Found: {', '.join(tables)}")

    with engine.connect() as conn:
        # 2. Check for the missing streak columns
        print("\n⚡ Checking 'learner_profiles' structure...")
        columns = [c['name'] for c in inspector.get_columns('learner_profiles')]
        
        if 'last_active_at' not in columns:
            print("❌ Column 'last_active_at' is MISSING. Fixing now...")
            conn.execute(text("""
                ALTER TABLE learner_profiles 
                ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
            """))
            conn.commit()
            print("✅ Column 'last_active_at' added successfully.")
        else:
            print("✅ Column 'last_active_at' exists.")

        # 3. List Current User Streaks
        print("\n🔥 Current Streak Leaderboard (Internal Check):")
        result = conn.execute(text("""
            SELECT u.email, lp.streak_days, lp.last_active_at 
            FROM users u 
            JOIN learner_profiles lp ON u.user_id = lp.user_id 
            ORDER BY lp.streak_days DESC
        """))
        
        for row in result:
            print(f"User: {row[0]} | Streak: {row[1]} days | Last Active: {row[2]}")

    print("\n🚀 Audit Complete. Restart your Uvicorn server.")

if __name__ == "__main__":
    audit_backend()