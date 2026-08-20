# Android API Integration Contract

## Base URLs
- **Local Emulator**: `http://10.0.2.2:3000/`
- **Wi-Fi Device**: `http://<HOST_IP>:3000/`
- **Production HTTPS**: `https://<YOUR_PRODUCTION_DOMAIN>/`

## Data Transfer Objects (DTOs)
The Android client (`android/`) uses Retrofit & Kotlin Serialization to map backend JSON envelopes:

### Response Envelope DTO (`ApiResponseEnvelope.kt`)
```kotlin
@Serializable
data class ApiResponseEnvelope<T>(
    val success: Boolean,
    val data: T? = null,
    val error: ApiError? = null,
    val meta: ApiMeta? = null
)

@Serializable
data class ApiError(
    val code: String,
    val message: String
)

@Serializable
data class ApiMeta(
    val requestId: String? = null,
    val timestamp: String? = null,
    val latencyMs: Long? = null
)
```

## Android API Endpoints (`ForecastApiService.kt`)
- `POST /api/v1/forecasts`: Generate forecast.
- `GET /api/v1/forecasts`: List user forecasts.
- `POST /api/v1/what-if`: Execute What-If simulation.
- `POST /api/v1/assistant`: Send assistant message.
- `GET /api/v1/notifications`: Sync notifications.
- `POST /api/v1/feedback`: Submit feedback ticket.
