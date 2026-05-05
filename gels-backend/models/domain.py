import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from core.database import Base
import enum

class UserRole(str, enum.Enum):
    learner = "learner"
    instructor = "instructor"
    admin = "admin"

class PlayerType(str, enum.Enum):
    ACHIEVER = "ACHIEVER"
    SOCIALIZER = "SOCIALIZER"
    EXPLORER = "EXPLORER"

class Difficulty(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.learner, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    last_active = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    profile = relationship("LearnerProfile", back_populates="user", uselist=False)

class LearnerProfile(Base):
    __tablename__ = "learner_profiles"
    
    profile_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    knowledge_state = Column(JSONB, default=dict) # Map of {topic_id: mastery_score}
    player_type = Column(SQLEnum(PlayerType), default=PlayerType.ACHIEVER)
    engagement_score = Column(Float, default=0.6)
    xp_total = Column(Integer, default=0)
    current_level = Column(Integer, default=1)
    streak_days = Column(Integer, default=0)
    last_updated = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="profile")

class Module(Base):
    __tablename__ = "modules"
    
    module_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    content_url = Column(String, nullable=False)
    difficulty = Column(SQLEnum(Difficulty), default=Difficulty.MEDIUM)
    topic_id = Column(String(255)) # Storing as string for simplicity in pilot
    estimated_minutes = Column(Integer, default=15)

class EventLog(Base):
    __tablename__ = "event_log"
    
    event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    session_id = Column(UUID(as_uuid=True), default=uuid.uuid4)
    event_type = Column(String(50), nullable=False) # e.g., ASSESSMENT_SUBMIT
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.module_id"), nullable=True)
    payload = Column(JSONB, default=dict) # Flexible event data
    processed = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

class DecisionLog(Base):
    __tablename__ = "decision_log"
    
    log_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    module_id = Column(String, nullable=True)
    action = Column(String(50), nullable=False) # e.g., REMEDIATE, ESCALATE
    rationale = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User")