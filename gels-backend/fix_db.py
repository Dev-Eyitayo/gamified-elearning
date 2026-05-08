from core.database import engine, Base
from models.domain import CoursePath, Section, Unit, Level, Lesson

def init_tables():
    print("Creating new Path Hierarchy tables...")
    # This will create any missing tables without deleting existing ones
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

if __name__ == "__main__":
    init_tables()