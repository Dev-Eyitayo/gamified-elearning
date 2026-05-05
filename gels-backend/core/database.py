import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# For local development, assuming a local Postgres instance
# Make sure to create a database named 'gels_db' in your local Postgres
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://gels_user:giiJsGHFAyLNY0pnBPWDf4GKWI4yxd49@dpg-d7spmo0g4nts73e306p0-a.oregon-postgres.render.com/gels")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()