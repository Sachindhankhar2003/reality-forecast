package com.realityforecast.app.core.network

import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // ── Auth ──────────────────────────────────────────────────────────────
    @POST("api/mobile-auth")
    suspend fun mobileLogin(@Body request: MobileLoginRequest): Response<MobileLoginResponse>

    // ── Forecasts ─────────────────────────────────────────────────────────
    @GET("api/forecasts")
    suspend fun getForecasts(): Response<ApiResponseEnvelope<List<ForecastDto>>>

    @GET("api/forecasts/{id}")
    suspend fun getForecastDetail(@Path("id") id: String): Response<ApiResponseEnvelope<ForecastDto>>

    @POST("api/forecasts")
    suspend fun createForecast(@Body request: CreateForecastRequest): Response<ApiResponseEnvelope<ForecastDto>>

    // ── Profile ───────────────────────────────────────────────────────────
    @GET("api/profile")
    suspend fun getProfile(): Response<ApiResponseEnvelope<UserProfileDto>>

    @PUT("api/profile")
    suspend fun updateProfile(@Body profile: UpdateProfileRequest): Response<ApiResponseEnvelope<UserProfileDto>>

    // ── Memory ────────────────────────────────────────────────────────────
    @GET("api/memory")
    suspend fun getMemories(): Response<ApiResponseEnvelope<List<MemoryDto>>>

    @POST("api/memory")
    suspend fun createMemory(@Body request: CreateMemoryRequest): Response<ApiResponseEnvelope<MemoryDto>>

    // ── Assistant ─────────────────────────────────────────────────────────
    @POST("api/assistant")
    suspend fun sendAssistantMessage(@Body request: AssistantRequest): Response<ApiResponseEnvelope<AssistantResponseDto>>

    // ── Conversations ─────────────────────────────────────────────────────
    @GET("api/conversations")
    suspend fun getConversations(): Response<ApiResponseEnvelope<List<ConversationDto>>>

    @POST("api/conversations")
    suspend fun createConversation(@Body request: CreateConversationRequest): Response<ApiResponseEnvelope<ConversationDto>>
}

// ── Request bodies ─────────────────────────────────────────────────────────
data class MobileLoginRequest(val email: String, val password: String)
data class CreateForecastRequest(val prompt: String)
data class UpdateProfileRequest(val name: String?, val bio: String?, val location: String?)
data class CreateMemoryRequest(val category: String, val key: String, val value: String)
data class AssistantRequest(val prompt: String, val forecastId: String? = null)
data class CreateConversationRequest(val title: String?)

// ── Response bodies ────────────────────────────────────────────────────────
data class MobileLoginResponse(
    val success: Boolean,
    val token: String?,
    val user: UserProfileDto?,
    val error: String?
)

data class ConversationDto(
    val id: String,
    val title: String,
    val domain: String?,
    val createdAt: String,
    val updatedAt: String
)
