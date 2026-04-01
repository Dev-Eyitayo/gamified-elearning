# Gamified eLearning System (GELS) 🎓

> **A Dual-Adaptive, Glass-Box AI Architecture for Personalized Education**

**GELS** is the first natively unified architecture where the Cognitive Engine (adaptive learning) and the Affective Engine (gamification) share a single Educational Data Mining (EDM) infrastructure[cite: 19]. This ensures that content difficulty and motivational mechanics are always synchronized in real time[cite: 19].

---

## 🏗️ Architecture Overview

The system is organized as a decoupled, three-tier architecture with a shared data persistence layer[cite: 126, 127]. It operates on a **Glass Box AI** principle, ensuring instructors maintain full pedagogical authority and visibility into all AI-driven decisions[cite: 21, 29, 172].

### Core Engines
* **Cognitive Engine (Google Gemini 1.5 Flash):** Evaluates learner state vectors to decide the next pedagogical action (e.g., ADVANCE, REMEDIATE, SIMPLIFY)[cite: 54, 61, 62].
* **Affective Engine:** A tailored gamification system mapped to Self-Determination Theory (SDT). It dynamically assigns mechanics (badges, XP, private/team quests) based on the user's active player type (ACHIEVER, SOCIALIZER, EXPLORER)[cite: 84, 85, 87].
* **Educational Data Mining (EDM):** A real-time processing pipeline built directly into FastAPI `BackgroundTasks` that aggregates telemetry and updates learner states without requiring external message brokers like Redis or Celery[cite: 114, 136].

---

## 💻 Tech Stack

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14+ (React) | SSR, fast hydration, and component-driven state management. |
| **Backend** | FastAPI (Python) | Async request handling and built-in BackgroundTasks. Managed via `uv`. |
| **AI Engine** | Google Gemini 1.5 Flash | Free tier via Google AI Studio; powerful structured reasoning[cite: 54, 136]. |
| **Database** | PostgreSQL 15+ | JSONB column on `event_log` handles flexible telemetry payloads[cite: 136, 159, 160]. |
| **Infrastructure**| Docker Compose | Single config to spin up the entire database layer locally. |

---

## 🚀 Local Development Setup

### 1. Database Initialization (Docker)
Ensure Docker is installed and running, then spin up the PostgreSQL instance. Create a `docker-compose.yml` in your root directory if you haven't already.

```bash
# Start the database in detached mode
docker-compose up -d

---

### 2. Backend Setup (FastAPI + uv)
The logic layer relies on FastAPI and uses `uv` for fast Python package management.

```bash
# Navigate to the backend directory
cd gels-backend

# Initialize uv and create a virtual environment
uv init
uv venv

# Activate the virtual environment
# On macOS/Linux:
source .venv/bin/activate

# On Windows:
.venv\Scripts\activate

# Install dependencies
uv add "fastapi[standard]" sqlalchemy alembic "python-jose[cryptography]" passlib[bcrypt] google-generativeai pydantic-settings psycopg2-binary

# Run the backend development server
uvicorn main:app --reload
```

---

### 3. Frontend Setup (Next.js)
The presentation layer is built with Next.js and the App Router.

```bash
# Navigate to the frontend directory
cd gels-frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the `gels-backend` directory with the following required keys:

```env
# Google AI Studio (Free tier API Key)
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL Database
DATABASE_URL=postgresql://gels_user:gels_password@localhost:5432/gels_db

# Security
JWT_SECRET_KEY=your_super_secret_jwt_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 📚 API Endpoints (Quick Reference)

### Authentication
- **POST** `/api/auth/register` - Create a new user account (learner, instructor, or admin).
- **POST** `/api/auth/login` - Authenticate and receive a JWT.

### Learning
- **GET** `/api/learning/next-module` - Fetch the next adaptive content module computed by Gemini.
- **POST** `/api/learning/submit-assessment` - Submit quiz answers; asynchronously triggers the EDM pipeline to update the learner state.

### Gamification
- **GET** `/api/gamification/profile` - Fetch learner XP, badges, level, and streaks.
- **GET** `/api/gamification/leaderboard` - Get contextual leaderboards filtered by player type (e.g., private vs. global).

### Instructor / Glass Box
- **GET** `/api/instructor/decision-log` - Retrieve the human-readable rationale for every AI action taken on a student.
- **POST** `/api/instructor/override-path` - Manually override the system's adaptive path for a specific student.

---

## 🤝 Roadmap (Phases 2 & 3)

### Phase 2 (Enhanced Intelligence)
- Few-shot learning examples injected into Gemini prompts from pilot data  
- Dynamic player-type recalculation  
- Private leaderboards  
- MongoDB integration for the `event_log`  

### Phase 3 (Full Production)
- Multi-course support with cross-course adaptive sequencing  
- Real-time team quests for SOCIALIZER profiles  
- Explainable AI (XAI) narrative generation  
- Longitudinal learning analytics for institutions  