package com.realityforecast.app.core.network

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    // Production Render backend URL
    private const val PRODUCTION_URL = "https://reality-forecast.onrender.com/"
    private var baseUrl: String = PRODUCTION_URL
    private var authToken: String? = null
    private var service: ApiService? = null

    fun setBaseUrl(url: String) {
        val formatted = if (url.endsWith("/")) url else "$url/"
        if (baseUrl != formatted) {
            baseUrl = formatted
            service = null
        }
    }

    fun setAuthToken(token: String?) {
        if (authToken != token) {
            authToken = token
            service = null // rebuild with new token
        }
    }

    fun getBaseUrl(): String = baseUrl

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BASIC
    }

    private val authInterceptor = Interceptor { chain ->
        val requestBuilder = chain.request().newBuilder()
        authToken?.let { token ->
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }
        chain.proceed(requestBuilder.build())
    }

    fun createService(): ApiService {
        return service ?: run {
            val client = OkHttpClient.Builder()
                .addInterceptor(authInterceptor)
                .addInterceptor(loggingInterceptor)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build()

            Retrofit.Builder()
                .baseUrl(baseUrl)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(ApiService::class.java)
                .also { service = it }
        }
    }
}
