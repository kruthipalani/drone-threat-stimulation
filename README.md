# THRYVE | Drone Threat Simulation Trainer

[![SIH 2026](https://img.shields.io/badge/SIH-2026-emerald.svg)](https://sih.gov.in)
[![Ministry of Defence](https://img.shields.io/badge/MoD-DSSC-blue.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-Production%20Ready-black.svg)](https://vercel.com)

**Problem Statement ID:** 26247  
**Title:** AI-Enabled Drone & Counter-Drone Threat Simulation Trainer  
**Organization:** Ministry of Defence (MoD)  
**Department:** Defence Services Staff College (DSSC)  

---

## 🛡️ Project Overview
**THRYVE** is a production-ready software-based simulation and assessment web platform designed for defence personnel to train against single-drone, multi-drone, and autonomous swarm threats.

---

## 🚀 Local Setup & Production Testing

### 1. Development Mode
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 2. Production Build Test
```bash
npm run build
npm run start
```

---

## 🚢 Supabase Database Setup
1. Create a project in [Supabase](https://supabase.com).
2. Open **SQL Editor**.
3. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
4. Copy `Project URL` and `Anon Key`.

---

## 🌐 Vercel Deployment Instructions
1. Push project to your GitHub repository.
2. Import repository into [Vercel](https://vercel.com).
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.
5. Test live health check at `https://YOUR-VERCEL-DOMAIN.vercel.app/api/health`.

---

## 📁 Key Routes
- `/`: Landing Page
- `/dashboard`: Trainee Dashboard
- `/scenarios`: Scenario Repository & Procedural Generator
- `/training/[scenarioId]`: Interactive Multi-Target Simulation
- `/aar/[sessionId]`: After-Action Review (AAR) Dashboard
- `/history`: Trainee Longitudinal Performance Log
- `/admin`: Instructor Admin Dashboard
- `/api/health`: Production Health Endpoint
