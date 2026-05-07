import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# For local development, assuming a local Postgres instance
# Make sure to create a database named 'gels_db' in your local Postgres
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://gels_pyrd_user:sSd1i9fVih4C8JoL0LPm3dePtjuXt1h3@dpg-d7tnhv57vvec73cldqlg-a.oregon-postgres.render.com/gels_pyrd")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()