# Security Audit & Defense Architecture

## 1. Authentication & Authorization (RBAC)
- **Session Management**: Auth.js v5 JWT / Session cookies with server-side validation.
- **Strict Role Isolation**:
  - All new registered and Google OAuth sign-ins default to `role = USER`.
  - Admin endpoints (`/admin/*`, `/api/admin/*`) enforce `requireAdmin()` check. Client role claims are ignored.
  - Cross-user data access is strictly blocked (`userId === session.user.id`).

---

## 2. Server-Side Request Forgery (SSRF) Protection
- **Target Network Isolation**: External telemetry provider HTTP requests validate destination URLs against private IP CIDR ranges:
  - Blocks `127.0.0.0/8` (localhost)
  - Blocks `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
  - Blocks `169.254.169.254` (Cloud metadata endpoint)

---

## 3. Input Validation & Prompt Injection Defense
- **Zod Schema Sanitization**: All endpoint request bodies parse strictly against Zod schemas.
- **System Prompt Integrity**: User prompts passed to Gemini AI are wrapped in boundary tags (`<USER_INPUT>...`) with system override instruction filters.

---

## 4. Rate Limiting & Secret Redaction
- In-memory rate limiting counters (`src/lib/rate-limiter.ts`) enforce max requests per minute window per IP/User ID.
- Logging utilities redact passwords, Auth secrets, API keys, and OAuth client tokens.
