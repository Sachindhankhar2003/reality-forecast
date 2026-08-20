# Reality Forecast — Decision-Support System

> **Scientific Disclaimer**: Reality Forecast computes probabilistic estimates based on live telemetry, deterministic factor weighting, and historical calibration. It is an evidence-based decision-support system and does NOT claim certainty about future events.

---

## 🌟 Overview

Reality Forecast is a senior SaaS decision-support application built with **Next.js App Router**, **TypeScript**, **Vanilla CSS**, **Prisma**, **SQLite / PostgreSQL**, and **Auth.js**.

It combines natural language plan parsing, real-time weather and traffic telemetry (Open-Meteo & TomTom), deterministic scoring engines, What-If simulation, outcome feedback calibration loops, and tool-bound AI assistance to help users make better decisions.

---

## 🏗️ Architecture

```
User Input ("Ask Reality")
   ↓
Prompt Injection Sanitizer & Domain Classifier
   ↓
Temporal Resolver & Missing Info Engine
   ↓
Parallel Telemetry Collectors (Open-Meteo Weather & TomTom Traffic)
   ↓
16-Stage Deterministic Forecast Scoring Engine
   ↓
Risk Matrix & Prioritized Advice Engine
   ↓
Bounded Personalization & Calibration Layer
   ↓
Immutable Snapshot → What-If Simulator & Reality Outcome Feedback Loop
```

---

## 🚀 Key Modules & Capabilities

1. **Ask Reality Input**: Natural language intent parsing with live entity extraction (Event, Date, Time, Location, Transport, Domain) and single highest-value clarification prompt.
2. **Forecast Transparency**: Visual badges for **FACT**, **LIVE ESTIMATE**, **INFERENCE**, and **UNKNOWN**. Expandable "Why is the score X?" explanations. Baseline vs. Personalized score breakdown.
3. **What-If Plan Simulation**: Test alternative hypotheses (departure time, transit mode, preparation depth) without mutating base immutable forecast snapshots.
4. **Reality Feedback Loop**: Natural language outcome recording (`SUCCESS`, `PARTIAL`, `FAILED`, `DELAYED`, `CANCELLED`, `UNEXPECTED`, `UNKNOWN`) comparing expected vs. actual results.
5. **Personal Analytics & Calibration**: Domain-filtered performance trends, Brier Score calibration loss metrics ($BS = \frac{1}{N} \sum (f_t - o_t)^2$), confidence reliability, and evidence-backed personal pattern detection.
6. **Adaptive Interview Prep**: STAR-method evaluation (Situation, Task, Action, Result), technical depth scoring, project-specific question generation, and Final Interview Readiness Reports.
7. **Reality AI Assistant**: Dedicated tool-bound AI sliding drawer operating strictly over controlled server-side tools (`getCurrentForecast`, `getRelevantMemory`, `getRelevantHistory`, `getCurrentEvidence`, `getPersonalInsights`, `getTopActions`, `simulateWhatIf`, `getInterviewReadiness`).
8. **Multi-Event Planning**: Timeline schedule parser, conflict detection (overlapping events, tight travel buffers), and optimization recommendations.
9. **Production Hardening**: SSRF protection (`isSafeExternalUrl` blocking localhost, 127.0.0.1, link-local metadata IPs, and private IP ranges), strict authorization, Zod schema validation, and rate limiting.

---

## 🛠️ Local Development & Testing

```bash
# 1. Install dependencies
npm install

# 2. Run Database Migrations / Seed
npx prisma db push
npx prisma db seed

# 3. Start Development Server
npm run dev

# 4. Execute Unit & End-to-End Test Suite
npm run test

# 5. Run Lint & Production Build
npm run lint
npm run build
```

---

## 🔑 Environment Variables

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-production-auth-secret"
GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🛡️ Security & Privacy Model

- User data isolation: Strict session-scoped ownership enforcement across all endpoints.
- AI safety: All external data and user text are treated strictly as **DATA**, sanitized against prompt injection attempts using `[FILTERED_INSTRUCTION_ATTEMPT]`.
- No raw database access for AI: Reality AI receives only minimum necessary context through controlled server-side tools.
