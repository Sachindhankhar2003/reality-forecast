package com.realityforecast.app.core.network

data class ApiResponseEnvelope<T>(
    val success: Boolean,
    val data: T?,
    val error: ApiError?,
    val meta: ApiMeta
)

data class ApiError(
    val code: String,
    val message: String,
    val details: Any? = null
)

data class ApiMeta(
    val requestId: String,
    val timestamp: String,
    val latencyMs: Long? = null,
    val page: Int? = null,
    val limit: Int? = null,
    val total: Int? = null
)

// Data Transfer Objects (DTOs)
data class ForecastDto(
    val id: String,
    val title: String,
    val originalInput: String,
    val domain: String,
    val status: String,
    val summary: String,
    val overallScore: Double,
    val confidence: Double,
    val createdAt: String
)

data class UserProfileDto(
    val id: String,
    val email: String,
    val name: String?,
    val role: String,
    val status: String
)

data class MemoryDto(
    val id: String,
    val category: String,
    val key: String,
    val value: String,
    val enabled: Boolean,
    val confidence: Double
)

data class AssistantResponseDto(
    val sanitizedPrompt: String,
    val answer: String,
    val toolUsed: String,
    val memoryCandidates: List<MemoryCandidateDto>? = null
)

data class MemoryCandidateDto(
    val category: String,
    val key: String,
    val value: String,
    val confidence: Double
)

data class WhatIfResponseDto(
    val scoreDelta: Double?,
    val hypothesis: String?,
    val summary: String?,
    val immutableNotice: String?
)

data class UserActivitySummaryDto(
    val totalForecasts: Int,
    val totalConversations: Int,
    val avgAiLatencyMs: Long,
    val completedOutcomes: Int,
    val topDomain: String,
    val brierAccuracyScore: Double
)
