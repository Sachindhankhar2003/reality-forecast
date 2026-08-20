# Reality Forecast API Specification

## Response Envelope Standard
All API endpoints return JSON formatted with the standard envelope:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "requestId": "req_123456789",
    "timestamp": "2026-08-19T12:00:00.000Z",
    "latencyMs": 42
  }
}
```

## Endpoints

### 1. Forecast Intelligence
- `POST /api/forecasts` or `POST /api/v1/forecasts`: Generate new probability forecast.
  - Body: `{ "prompt": "Tomorrow interview in Gurgaon at 10 AM", "origin": "Noida", "destination": "Gurgaon", "transport": "car" }`
- `GET /api/forecasts` or `GET /api/v1/forecasts`: List user's active forecasts.
- `GET /api/forecasts/[id]` or `GET /api/v1/forecasts/[id]`: Detailed forecast breakdown including probability distribution, risks, actions, and evidence attribution.

### 2. What-If Simulation
- `POST /api/v1/what-if`: Execute scenario simulation.
  - Body: `{ "forecastId": "...", "departureBufferMinutes": 30, "transportMode": "metro" }`
  - Returns: `{ "originalScore": 0.72, "simulatedScore": 0.85, "delta": 0.13, "riskChanges": [...] }`

### 3. Assistant & Conversations
- `POST /api/conversations` or `POST /api/v1/conversations`: Start new conversation context.
- `POST /api/conversations/[id]/messages` or `POST /api/v1/assistant`: Send query to Reality AI Assistant.

### 4. Personal Intelligence & Memory
- `GET /api/memory` or `GET /api/v1/memory`: List personal memory items.
- `POST /api/v1/onboarding`: Save onboarding profile setup and initial memory context.

### 5. Notifications & Feedback
- `GET /api/v1/notifications`: List unread user notifications.
- `PUT /api/v1/notifications`: Mark notifications as read.
- `POST /api/v1/feedback`: Submit suggestion or feedback ticket.
