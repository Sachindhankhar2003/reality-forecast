package com.realityforecast.app.core.network

import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    @GET("api/v1/forecasts")
    suspend fun getForecasts(): Response<ApiResponseEnvelope<List<ForecastDto>>>

    @GET("api/v1/forecasts/{id}")
    suspend fun getForecastDetail(@Path("id") id: String): Response<ApiResponseEnvelope<ForecastDto>>

    @POST("api/v1/forecasts")
    suspend fun createForecast(@Body request: CreateForecastRequest): Response<ApiResponseEnvelope<ForecastDto>>

    @GET("api/v1/profile")
    suspend fun getProfile(): Response<ApiResponseEnvelope<UserProfileDto>>

    @PUT("api/v1/profile")
    suspend fun updateProfile(@Body profile: UpdateProfileRequest): Response<ApiResponseEnvelope<UserProfileDto>>

    @GET("api/v1/memory")
    suspend fun getMemories(): Response<ApiResponseEnvelope<List<MemoryDto>>>

    @POST("api/v1/memory")
    suspend fun createMemory(@Body request: CreateMemoryRequest): Response<ApiResponseEnvelope<MemoryDto>>

    @POST("api/v1/assistant")
    suspend fun sendAssistantMessage(@Body request: AssistantRequest): Response<ApiResponseEnvelope<AssistantResponseDto>>

    @POST("api/v1/what-if")
    suspend fun simulateWhatIf(@Body request: WhatIfRequest): Response<ApiResponseEnvelope<WhatIfResponseDto>>
}

data class CreateForecastRequest(val prompt: String)
data class UpdateProfileRequest(val name: String?, val bio: String?, val location: String?)
data class CreateMemoryRequest(val category: String, val key: String, val value: String)
data class AssistantRequest(val prompt: String, val forecastId: String? = null)
data class WhatIfRequest(val forecastId: String, val userInput: String)
