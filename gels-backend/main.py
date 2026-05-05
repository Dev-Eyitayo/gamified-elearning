from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
from models import domain

# Import all routers
from api import auth, learning, gamification, instructor, admin 

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GELS API",
    description="Gamified eLearning System Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach all Routers
app.include_router(auth.router)
app.include_router(learning.router)
app.include_router(gamification.router)
app.include_router(instructor.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "GELS Core API is fully operational."}