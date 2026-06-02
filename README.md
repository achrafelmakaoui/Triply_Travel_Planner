# Triply - Travel Planner

Intelligent travel planning web app powered by a multi-agent AI system.
Built with React, Node.js/Express, and FastAPI.

A modern MERN stack application where users describe their dream trip in
natural language, and a team of specialized AI agents collaborate in
real-time to generate a personalized itinerary, with live streaming and
human-in-the-loop approval.

---

## Features

- 🔐 **JWT Authentication** : Sign up, sign in, secure protected routes
- 🤖 **Multi-Agent AI** : Researcher, Budget, Itinerary, Booking agents
- 📡 **Real-Time Streaming** : Server-Sent Events show agent activity live
- 👤 **Human-in-the-Loop** : User approves booking before finalization
- 💾 **Trip History** : Save and manage all your itineraries
- 🔗 **Public Sharing** : Share trips with unique public links
- 🎨 **Modern UI** : Clean React interface with CSS Modules

---

## Architecture

```
┌─────────────────────────────────────────┐
│         FRONTEND — React (port 3000)    │
└─────────────────┬───────────────────────┘
                  │ REST + JWT + SSE
                  ▼
┌─────────────────────────────────────────┐
│   BACKEND — Express (port 5000)         │
│   Auth · Trip CRUD · SSE Proxy · Share  │
└────────┬──────────────────────┬─────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────────┐
│    MongoDB      │    │ FastAPI (port 8000) │
│ users · trips   │    │ LangGraph + Agents  │
└─────────────────┘    └─────────────────────┘
```

Three independent services communicate via HTTP and SSE.

---

## Project Structure

```
travel-planner/
├── frontend/                # React.js application
│   └── src/
│       ├── api/             # Axios instance
│       ├── context/         # Auth context
│       ├── components/      # Hero, Features, Navbar, ...
│       └── pages/           # 9 pages
│
├── backend/                 # Express.js API
│   └── src/
│       ├── config/db.js
│       ├── middleware/protect.js
│       ├── models/          # User, Trip (Mongoose)
│       ├── routes/          # auth, trips, plan, profile
│       └── app.js
│
└── travel_planner/          # FastAPI + LangGraph
    ├── agents/              # 4 specialist agents
    ├── rag/                 # PDF ingestion + retrieval
    ├── data/documents/
    ├── api_server.py        # FastAPI wrapper
    └── graph.py             # LangGraph workflow
```

---

## Quick Setup

You need to set up **3 services** in this order.

### Prerequisites

- **Python 3.10**
- **Node.js 18+**
- **MongoDB** (local or Atlas)
- Free **Groq API key** from [console.groq.com](https://console.groq.com)

### 1️⃣ AI Backend (FastAPI)

Github Repo : **https://github.com/achrafelmakaoui/travel-planner-multi-agent**
```powershell
cd travel_planner
py -3.10 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
create .env       # add your GROQ_API_KEY
python -m rag.ingest          # build the vector store
uvicorn api_server:app --reload --port 8000
```

Verify at **http://localhost:8000/docs**

### 2️⃣ Express Backend

```powershell
cd backend
npm install
create .env       # configure MongoDB + JWT_SECRET
npm run dev
```

Verify at **http://localhost:5000**

### 3️⃣ Frontend (React)

```powershell
cd frontend
npm install
npm start
```

Opens at **http://localhost:3000**

---

## How to Use

1. Go to **http://localhost:3000**
2. Click **Get Started** to create an account
3. Click **New trip** in the dashboard
4. Type your travel request, hit **Start planning**
5. Watch the AI agents work in real time
6. Review the booking and **Confirm** or **Cancel**
7. Save the trip to your history
8. View, share, or delete from **My Trips**

### Example Prompts

```
- Plan a 5-day trip to Marrakech for 2 people, budget 800 EUR, focused on food and culture.
- 3 days in Lisbon, budget 600 EUR, history and local food.
- Family vacation in Barcelona, 4 people, 1 week, budget 2500 EUR, kid-friendly.
```

---

## API Endpoints

### Express Backend (port 5000)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Sign in | ❌ |
| GET | `/api/auth/me` | Current user | ✅ |
| GET | `/api/trips` | List trips | ✅ |
| POST | `/api/trips` | Save trip | ✅ |
| GET | `/api/trips/:id` | Trip details | ✅ |
| DELETE | `/api/trips/:id` | Delete trip | ✅ |
| PATCH | `/api/trips/:id/share` | Toggle sharing | ✅ |
| GET | `/api/trips/share/:shareId` | Public view | ❌ |
| POST | `/api/plan/stream` | Start planning (SSE) | ✅ |
| POST | `/api/plan/resume` | Resume after HITL | ✅ |
| GET | `/api/profile` | Get profile | ✅ |
| PATCH | `/api/profile` | Update profile | ✅ |

---

## Technologies - MERN

- **Frontend**: React.js · React Router · Axios · CSS Modules · Server-Sent Events.
- **Backend**: Node.js · Express.js · Mongoose · JWT · bcrypt
- **AI Backend**: FastAPI · LangGraph · LangChain · Groq (Llama 3.1) · ChromaDB
- **Database**: MongoDB
- **Tools**: Git · GitHub · npm · nodemon

---


## About

This project was built for the **Technologies Web** module as an evolution
of a previous multi-agent AI project from the **IA Agentique** module.
The original Streamlit prototype was transformed into a full-stack web
application with React, Express, MongoDB, and Server-Sent Events streaming.

---