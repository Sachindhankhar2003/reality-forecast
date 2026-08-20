package com.realityforecast.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.realityforecast.app.core.network.ForecastDto
import com.realityforecast.app.data.repository.ForecastRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class UiState<out T> {
    object Idle : UiState<Nothing>()
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}

class ForecastViewModel(
    private val repository: ForecastRepository = ForecastRepository()
) : ViewModel() {

    private val _forecastsState = MutableStateFlow<UiState<List<ForecastDto>>>(UiState.Idle)
    val forecastsState: StateFlow<UiState<List<ForecastDto>>> = _forecastsState.asStateFlow()

    private val _createState = MutableStateFlow<UiState<ForecastDto>>(UiState.Idle)
    val createState: StateFlow<UiState<ForecastDto>> = _createState.asStateFlow()

    init {
        loadForecasts()
    }

    fun loadForecasts() {
        viewModelScope.launch {
            _forecastsState.value = UiState.Loading
            repository.getForecasts()
                .onSuccess { list ->
                    _forecastsState.value = UiState.Success(list)
                }
                .onFailure { error ->
                    _forecastsState.value = UiState.Error(error.message ?: "Network error occurred")
                }
        }
    }

    fun createForecast(prompt: String) {
        viewModelScope.launch {
            _createState.value = UiState.Loading
            repository.createForecast(prompt)
                .onSuccess { created ->
                    _createState.value = UiState.Success(created)
                    loadForecasts()
                }
                .onFailure { error ->
                    _createState.value = UiState.Error(error.message ?: "Failed to generate forecast")
                }
        }
    }
}
