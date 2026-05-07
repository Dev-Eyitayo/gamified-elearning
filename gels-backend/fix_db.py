from core.database import engine
from sqlalchemy import text

def patch_database():
    print("Connecting to Render Database...")
    with engine.connect() as conn:
        try:
            # Add the gems column
            conn.execute(text("ALTER TABLE learner_profiles ADD COLUMN gems INTEGER DEFAULT 25;"))
            print("✅ Successfully added 'gems' column!")
        except Exception as e:
            print("⚠️ 'gems' column might already exist or failed:", str(e).split('\n')[0])
            
        try:
            # Add the last_gem_update column
            conn.execute(text("ALTER TABLE learner_profiles ADD COLUMN last_gem_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;"))
            print("✅ Successfully added 'last_gem_update' column!")
        except Exception as e:
            print("⚠️ 'last_gem_update' column might already exist or failed:", str(e).split('\n')[0])
            
        # Commit the changes to the database
        conn.commit()
    print("🎉 Database patching complete!")

if __name__ == "__main__":
    patch_database()