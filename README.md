# THRYVE SIM-TRAINER

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black.svg)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://expressjs.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-emerald.svg)](https://supabase.com)

A professional full-stack monorepo application for drone & counter-drone threat simulation training, decision assessment, and longitudinal performance analytics.

---

## 📁 Repository Architecture

```
/
├── frontend/                 # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/              # Next.js Pages & Client Views
│   │   ├── components/       # Mission-Control UI Components
│   │   ├── lib/              # API Client & Utility Functions
│   │   └── types/            # Shared TypeScript Interfaces
│   ├── public/               # Static Assets
│   └── package.json
│
├── backend/                  # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/           # Supabase & Environment Configuration
│   │   ├── controllers/      # REST API Route Controllers
│   │   ├── middleware/       # Error & Request Handling Middleware
│   │   ├── models/           # TypeScript Interfaces
│   │   ├── routes/           # REST API Route Handlers
│   │   ├── services/         # Scoring, Scenario & Analytics Services
│   │   └── server.ts         # Express Application Entry Point
│   └── package.json
│
├── supabase/
│   └── schema.sql            # PostgreSQL DDL & Seed Script
└── package.json              # Root Workspace Configuration
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
# Install root, frontend, and backend dependencies
npm install
```

### 2. Environment Setup
Copy `.env.example` templates in both `frontend/` and `backend/`:
```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

### 3. Run Development Server
```bash
# Runs both backend (port 4000) and frontend (port 3000) concurrently
npm run dev
```

---

## 🚀 Building for Production

```bash
# Build both frontend and backend
npm run build
```

Or build individually:
```bash
npm run build:frontend
npm run build:backend
```

---

## 🔗 REST API Endpoints (Backend)
- `GET  /api/health`: Health status & telemetry mode
- `GET  /api/scenarios`: Fetch available scenarios
- `GET  /api/scenarios/:id`: Fetch scenario details
- `POST /api/scenarios/generate`: Procedural scenario engine
- `POST /api/sessions/start`: Start training session
- `POST /api/sessions/complete`: Record session & calculate score
- `GET  /api/trainee`: Trainee metrics & session history
- `GET  /api/aar/:sessionId`: After-Action Review (AAR)
- `GET  /api/admin/analytics`: Unit analytics & skill matrix
