import uuid
from sqlalchemy import Text, Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from core.database import Base
import enum
from datetime import datetime
from sqlalchemy.sql import func

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
    profile = relationship("LearnerProfile", back_populates="user", uselist=False, foreign_keys="[LearnerProfile.user_id]")

class LearnerProfile(Base):
    __tablename__ = "learner_profiles"
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True) # 🔥 Add this
    profile_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    knowledge_state = Column(JSONB, default=dict) # Map of {topic_id: mastery_score}
    player_type = Column(SQLEnum(PlayerType), default=PlayerType.ACHIEVER)
    engagement_score = Column(Float, default=0.6)
    xp_total = Column(Integer, default=0)
    current_level = Column(Integer, default=1)
    streak_days = Column(Integer, default=0)
    last_active_at = Column(DateTime(timezone=True), default=func.now())
    last_updated = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    gems = Column(Integer, default=25)
    last_gem_update = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    current_league = Column(String, default="Bronze") # Bronze, Silver, Gold... Diamond
    weekly_xp = Column(Integer, default=0)
    cohort_id = Column(String, nullable=True)
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)

    user = relationship("User", back_populates="profile", foreign_keys=[user_id])
    
    # 🔥 Explicitly point to instructor_id
    instructor = relationship("User", foreign_keys=[instructor_id])

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


class Course(Base):
    __tablename__ = "courses"
    
    course_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    icon = Column(String(50), default="Book") # Matches Lucide icon names
    color_class = Column(String(50), default="text-[#1CB0F6]")
    bg_class = Column(String(50), default="bg-[#DDF4FF]")
    border_class = Column(String(50), default="border-[#1CB0F6]")

class DiagnosticQuestion(Base):
    __tablename__ = "diagnostic_questions"
    
    question_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.course_id"), nullable=False)
    difficulty_level = Column(String(50), nullable=False) # 'beginner', 'intermediate', 'advanced'
    question_text = Column(String, nullable=False)
    options = Column(JSONB, nullable=False)

class Quest(Base):
    __tablename__ = "quests"
    
    quest_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(String, nullable=False)
    reward_xp = Column(Integer, default=50)
    quest_type = Column(String(50), default="solo") # 'solo' or 'team'
    is_active = Column(Boolean, default=True)

class Achievement(Base):
    __tablename__ = "achievements"
    
    achievement_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    target_metric = Column(Integer, nullable=False) # e.g., 30000
    metric_type = Column(String(50), nullable=False) # 'xp', 'streak', 'modules_completed'
    icon = Column(String(50), default="Trophy")
    color = Column(String(50), default="text-[#1CB0F6]")
    bg = Column(String(50), default="bg-[#DDF4FF]")

class Notification(Base):
    __tablename__ = "notifications"
    
    notification_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    type = Column(String(50), nullable=False) # 'achievement', 'social', 'ai', 'quest'
    title = Column(String(255), nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class CoursePath(Base):
    __tablename__ = "course_paths"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    language_or_topic = Column(String) 
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    sections = relationship("Section", back_populates="course", cascade="all, delete-orphan", order_by="Section.order_index")

# 2. SECTION (The major chapters / CEFR milestones)
class Section(Base):
    __tablename__ = "sections"
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String, ForeignKey("course_paths.id"))
    title = Column(String) # e.g., "Section 1: The Basics"
    order_index = Column(Integer) # To keep them in linear order
    
    course = relationship("CoursePath", back_populates="sections")
    units = relationship("Unit", back_populates="section", cascade="all, delete-orphan", order_by="Unit.order_index")

# 3. UNIT (Themed episodes)
class Unit(Base):
    __tablename__ = "units"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    section_id = Column(String, ForeignKey("sections.id"))
    title = Column(String) # e.g., "Talk about components"
    guidebook_text = Column(Text, nullable=True) # The grammar/concept guide
    order_index = Column(Integer)
    theme_color = Column(String, default="#1CB0F6") # Unit background color
    
    section = relationship("Section", back_populates="units")
    levels = relationship("Level", back_populates="unit", cascade="all, delete-orphan", order_by="Level.order_index")

# 4. LEVEL (The Bubbles / Stepping Stones)
class Level(Base):
    __tablename__ = "levels"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    unit_id = Column(String, ForeignKey("units.id"))
    icon_type = Column(String, default="star") # "star", "book" (story), "dumbbell" (practice), "trophy" (review)
    order_index = Column(Integer)
    
    unit = relationship("Unit", back_populates="levels")
    lessons = relationship("Lesson", back_populates="level", cascade="all, delete-orphan", order_by="Lesson.order_index")

# 5. LESSON (The actual session containing the exercises/questions)
class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    level_id = Column(String, ForeignKey("levels.id"))
    title = Column(String)
    order_index = Column(Integer)
    
    level = relationship("Level", back_populates="lessons")

class UserFollow(Base):
    __tablename__ = "user_follows"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    follower_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    following_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))