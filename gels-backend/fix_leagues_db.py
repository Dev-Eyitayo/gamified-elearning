from core.database import engine
from sqlalchemy import text

def patch_database():
    print("Connecting to Database...")
    with engine.connect() as conn:
        try:
            # Add the current_league column
            conn.execute(text("ALTER TABLE learner_profiles ADD COLUMN current_league VARCHAR DEFAULT 'Bronze';"))
            print("✅ Successfully added 'current_league' column!")
        except Exception as e:
            print("⚠️ 'current_league' column might already exist or failed:", str(e).split('\n')[0])
            
        try:
            # Add the weekly_xp column
            conn.execute(text("ALTER TABLE learner_profiles ADD COLUMN weekly_xp INTEGER DEFAULT 0;"))
            print("✅ Successfully added 'weekly_xp' column!")
        except Exception as e:
            print("⚠️ 'weekly_xp' column might already exist or failed:", str(e).split('\n')[0])

        try:
            # Add the cohort_id column
            conn.execute(text("ALTER TABLE learner_profiles ADD COLUMN cohort_id VARCHAR;"))
            print("✅ Successfully added 'cohort_id' column!")
        except Exception as e:
            print("⚠️ 'cohort_id' column might already exist or failed:", str(e).split('\n')[0])
            
        # Commit the changes to the database
        conn.commit()
    print("🎉 Database patching complete! You can now use the League System.")

if __name__ == "__main__":
    patch_database()