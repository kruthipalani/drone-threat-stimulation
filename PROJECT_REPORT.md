# PROJECT REPORT: THRYVE | AI-Enabled Drone & Counter-Drone Threat Simulation Trainer

**Problem Statement ID:** 26247  
**Organization:** Ministry of Defence (MoD)  
**Department:** Defence Services Staff College (DSSC)  
**Theme:** Robotics and Drones  
**Product Name:** THRYVE | Drone Threat Simulation Trainer  
**Phase:** Phase 3 Production & Deployment Readiness  

---

## 1. Project Overview
**THRYVE** is a software-based simulation and training platform designed for defence personnel to train against single-drone, multi-drone, and autonomous swarm threats.

---

## 2. Phase 3 Production & Deployment Audit
1. **Security & Secrets Protection:**
   - Zero exposed service-role keys or database passwords in client bundles.
   - Environment variables follow Next.js client-side vs server-side isolation conventions.
   - `.env.local` added to `.gitignore`. `.env.example` provides safe placeholders.
2. **Pathing & URL Auditing:**
   - Search across codebase confirmed 0 hardcoded `localhost` references in client fetches.
   - All internal API calls utilize relative routes (`/api/scenarios`, `/api/health`, `/api/sessions/complete`).
3. **Truthful Telemetry Status:**
   - Status badge in [`Navbar.tsx`](file:///c:/Users/kruth/OneDrive/Desktop/DRONE%20WEB%20247/src/components/Navbar.tsx) dynamically displays `TELEMETRY: LIVE POSTGRESQL` when Supabase is configured and `TELEMETRY: DEMO MODE` during fallback testing.
4. **Health Check Endpoint:**
   - Implemented `GET /api/health` returning JSON service status and database connectivity mode.
5. **Production Build & Dynamic Route Verification:**
   - Production build tested via Next.js Turbopack compiler (`npm run build`).
   - All 15 routes (including dynamic routes `/training/[scenarioId]`, `/aar/[sessionId]`, `/api/scenarios/[id]`, `/api/aar/[sessionId]`) generated cleanly.

---

## 3. Technology Stack
- **Frontend:** Next.js 15 (App Router, TypeScript)
- **UI & Styling:** Tailwind CSS v4, Lucide Icons, Custom Tactical Radar System
- **Backend APIs:** Next.js API Routes (`src/app/api/...`)
- **Database:** Supabase PostgreSQL with seed mode fallback
- **Deployment Platform:** Vercel

---

## 4. Environment Variables
```env
# Public Supabase Client Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

---

## 5. Deployment Instructions (Vercel)
1. Push codebase to GitHub/GitLab.
2. Import repository into **Vercel**.
3. Select **Next.js** framework preset.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Environment Variables.
5. Click **Deploy**.
6. Verify deployment by visiting `/api/health`.

---

## 6. Build Results
- **Status:** **PASS (15/15 routes compiled cleanly)**
- Zero TypeScript errors, zero hydration errors, zero broken dynamic paths.
