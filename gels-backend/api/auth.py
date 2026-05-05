from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from models.domain import User, LearnerProfile, UserRole
from schemas.auth import UserCreate, UserLogin, Token
from datetime import timedelta

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash the password and create the user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3. PRD Cold Start Strategy: If it's a learner, build their initial profile!
    if new_user.role == UserRole.learner:
        new_profile = LearnerProfile(
            user_id=new_user.user_id,
            knowledge_state={}, # Empty to start, filled by diagnostic
            engagement_score=0.6, # Optimistic default
            current_level=1,
            xp_total=0
        )
        db.add(new_profile)
        db.commit()

    # 4. Generate JWT Token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.user_id), "role": new_user.role}, 
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "role": new_user.role}


@router.post("/login", response_model=Token)
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    # 1. Find user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 2. Verify password
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 3. Generate Token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.user_id), "role": user.role}, 
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "role": user.role}