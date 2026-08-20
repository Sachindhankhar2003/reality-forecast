# Production Readiness & Deployment Checklist

## 1. Authentication & Security Configuration
- **Auth.js v5 Secrets**: Set `AUTH_SECRET` in production environment variables (32+ random characters).
- **Google OAuth Registration**:
  - Register Authorized JavaScript origin: `https://your-domain.com`
  - Register Authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
  - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in environment variables.

---

## 2. PostgreSQL Production Database Migration
- Development uses local SQLite (`file:./dev.db`).
- For production deployment:
  1. Change `provider = "postgresql"` in `prisma/schema.prisma`.
  2. Set `DATABASE_URL="postgresql://user:password@host:5432/dbname"` in production environment.
  3. Execute `npx prisma migrate deploy` to create schema indexes and tables.

---

## 3. External Provider Keys (Optional Live Telemetry)
- `GEMINI_API_KEY`: Server-side AI assistant tool capabilities.
- `TOMTOM_API_KEY`: Real-time traffic congestion telemetry.
- `MAPBOX_ACCESS_TOKEN`: Geographic route rendering.
- *Fallback Safety*: If API keys are missing or external APIs time out, the system automatically falls back to deterministic estimation tagged with `ESTIMATED` or `UNKNOWN` badges without crashing.

---

## 4. Android Client Environment Setup
- For Android local emulator dev: `ApiClient.setBaseUrl("http://10.0.2.2:3000/")`
- For physical Wi-Fi testing: `ApiClient.setBaseUrl("http://<YOUR_LAN_IP>:3000/")`
- For production HTTPS release: `ApiClient.setBaseUrl("https://your-domain.com/")`
