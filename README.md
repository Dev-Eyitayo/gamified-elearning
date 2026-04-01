# Gamified eLearning System (GELS) 🎓

> [cite_start]**A Dual-Adaptive, Glass-Box AI Architecture for Personalized Education** [cite: 3]

[cite_start]**GELS** is the first natively unified architecture where the Cognitive Engine (adaptive learning) and the Affective Engine (gamification) share a single Educational Data Mining (EDM) infrastructure[cite: 19]. [cite_start]This ensures that content difficulty and motivational mechanics are always synchronized in real time[cite: 19].

---

## 🏗️ Architecture Overview

[cite_start]The system is organized as a decoupled, three-tier architecture with a shared data persistence layer[cite: 126, 127]. [cite_start]It operates on a **Glass Box AI** principle, ensuring instructors maintain full pedagogical authority and visibility into all AI-driven decisions[cite: 21, 29, 172].

### Core Engines
* [cite_start]**Cognitive Engine (Google Gemini 1.5 Flash):** Evaluates learner state vectors to decide the next pedagogical action (e.g., ADVANCE, REMEDIATE, SIMPLIFY)[cite: 54, 61, 62].
* [cite_start]**Affective Engine:** A tailored gamification system mapped to Self-Determination Theory (SDT)[cite: 22, 231]. [cite_start]It dynamically assigns mechanics (badges, XP, private/team quests) based on the user's active player type (ACHIEVER, SOCIALIZER, EXPLORER)[cite: 84, 85, 87].
* [cite_start]**Educational Data Mining (EDM):** A real-time processing pipeline built directly into FastAPI `BackgroundTasks` that aggregates telemetry and updates learner states without requiring external message brokers like Redis or Celery[cite: 114, 136].

---

## 💻 Tech Stack

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14+ (React) | [cite_start]SSR, fast hydration, and component-driven state management. |
| **Backend** | FastAPI (Python) | Async request handling and built-in BackgroundTasks. [cite_start]Managed via `uv`. |
| **AI Engine** | Google Gemini 1.5 Flash | [cite_start]Free tier via Google AI Studio; powerful structured reasoning[cite: 54, 136]. |
| **Database** | PostgreSQL 15+ | [cite_start]JSONB column on `event_log` handles flexible telemetry payloads[cite: 136, 159, 160]. |
| **Infrastructure**| Docker Compose | [cite_start]Single config to spin up the entire database layer locally. |

---

## 🚀 Local Development Setup

### 1. Database Initialization (Docker)
[cite_start]Ensure Docker is installed and running, then spin up the PostgreSQL instance. Create a `docker-compose.yml` in your root directory if you haven't already.

```bash
# Start the database in detached mode
docker-compose up -d