# System & Android Production Architecture

## Overview
Reality Forecast is a deterministic prediction and personal decision-intelligence platform built on Next.js 16 App Router, Auth.js v5, Prisma ORM, and external telemetry services.

## Architecture Topology

```
┌─────────────────────────┐       ┌─────────────────────────┐
│     Web Application     │       │    Android Native App   │
│ (Next.js React Client)  │       │ (Kotlin / Jetpack UI)   │
└────────────┬────────────┘       └────────────┬────────────┘
             │                                 │
             │ HTTPS (Browser CORS)            │ HTTPS (Bearer / Auth.js)
             └────────────────┬────────────────┘
                              ▼
           ┌─────────────────────────────────────┐
           │      Reality Forecast Next.js API   │
           │           (/api/v1/...)             │
           └──────────────────┬──────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Forecast Engine │ │ Personal Intel.  │ │ Security & RBAC  │
└────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
           ┌─────────────────────────────────────┐
           │        Prisma ORM Abstraction       │
           └──────────────────┬──────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
   Development Database            Production Database
      (SQLite dev.db)             (Managed PostgreSQL)
```

## Key Architectural Principles
1. **Server-Side Authorization**: Every administrative and private user resource checks session and database role on the server.
2. **Deterministic Baseline Engine**: Prediction scores are derived from evidence weights and mathematical factor models, never random LLM hallucination.
3. **Controlled AI Tool Layer**: Reality AI Assistant interacts with data solely through strict server-side tools (`getCurrentForecast`, `getRelevantMemory`, etc.).
4. **Android Native Readiness**: Android applications consume standard `/api/v1/...` HTTPS endpoints returning a uniform JSON envelope (`{ success, data, error, meta }`).
