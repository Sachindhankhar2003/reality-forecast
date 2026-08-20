# Production Deployment Guide

## Architecture Blueprint
```
Web Browsers & Android Clients
             │
           HTTPS
             ▼
Cloudflare CDN / Load Balancer
             │
             ▼
Next.js Production Instance
(Node.js / Vercel / Docker Container)
             │
      ┌──────┴──────┐
      ▼             ▼
PostgreSQL      Gemini API & Telemetry Providers
```

## Step-by-Step Deployment

### 1. Build Verification
Before deploying, execute:
```bash
npm run test
npx next build --webpack
```

### 2. Configure Production Secrets
Ensure the following variables are securely set in host secrets:
- `DATABASE_URL`: Managed PostgreSQL connection string.
- `AUTH_SECRET`: Min 32-character random string.
- `AUTH_URL`: Canonical production HTTPS URL.
- `GEMINI_API_KEY`: API key for Reality AI.
- `TOMTOM_API_KEY`: API key for traffic telemetry.
- `WEB_APP_ORIGIN`: Canonical frontend origin.

### 3. Local Network Development Testing
To allow local testing from mobile devices on the same Wi-Fi network:
```bash
npx next dev -H 0.0.0.0 -p 3000
```
Access from phone browser: `http://<YOUR_COMPUTER_IP>:3000`.
