package com.realityforecast.app.data.repository

import com.realityforecast.app.core.network.ApiClient
import com.realityforecast.app.core.network.CreateForecastRequest
import com.realityforecast.app.core.network.ForecastDto
import com.realityforecast.app.core.network.WhatIfRequest
import com.realityforecast.app.core.network.WhatIfResponseDto

class ForecastRepository {
    private val api get() = ApiClient.createService()

    suspend fun getForecasts(): Result<List<ForecastDto>> {
        return try {
            val response = api.getForecasts()
            if (response.isSuccessful && response.body()?.success == true) {
                Result.success(response.body()?.data ?: emptyList())
            } else {
                Result.failure(Exception(response.body()?.error?.message ?: "Failed to load forecasts"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createForecast(prompt: String): Result<ForecastDto> {
        return try {
            val response = api.createForecast(CreateForecastRequest(prompt))
            if (response.isSuccessful && response.body()?.success == true && response.body()?.data != null) {
                Result.success(response.body()!!.data!!)
            } else {
                Result.failure(Exception(response.body()?.error?.message ?: "Forecast generation failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun simulateWhatIf(forecastId: String, userInput: String): Result<WhatIfResponseDto> {
        return try {
            val response = api.simulateWhatIf(WhatIfRequest(forecastId, userInput))
            if (response.isSuccessful && response.body()?.success == true && response.body()?.data != null) {
                Result.success(response.body()!!.data!!)
            } else {
                Result.failure(Exception(response.body()?.error?.message ?: "What-If simulation failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
