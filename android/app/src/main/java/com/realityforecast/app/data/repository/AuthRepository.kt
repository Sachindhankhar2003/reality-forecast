package com.realityforecast.app.data.repository

import com.realityforecast.app.core.network.ApiClient
import com.realityforecast.app.core.network.UserProfileDto

class AuthRepository {
    private val api = ApiClient.createService()

    suspend fun getCurrentUser(): Result<UserProfileDto> {
        return try {
            val response = api.getProfile()
            if (response.isSuccessful && response.body()?.success == true && response.body()?.data != null) {
                Result.success(response.body()!!.data!!)
            } else {
                Result.failure(Exception(response.body()?.error?.message ?: "Authentication failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
