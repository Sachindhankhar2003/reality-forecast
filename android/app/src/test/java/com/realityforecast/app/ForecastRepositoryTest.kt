package com.realityforecast.app

import com.realityforecast.app.core.network.ApiError
import com.realityforecast.app.core.network.ApiMeta
import com.realityforecast.app.core.network.ApiResponseEnvelope
import com.realityforecast.app.core.network.ForecastDto
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ForecastRepositoryTest {

    @Test
    fun testApiResponseEnvelopeSuccessParsing() {
        val forecast = ForecastDto(
            id = "fc-test-1",
            title = "Gurgaon Interview Travel",
            originalInput = "Trip from Noida",
            domain = "travel",
            status = "READY",
            summary = "Sample forecast summary",
            overallScore = 0.78,
            confidence = 0.88,
            createdAt = "2026-08-19T12:00:00Z"
        )

        val envelope = ApiResponseEnvelope(
            success = true,
            data = listOf(forecast),
            error = null,
            meta = ApiMeta(requestId = "req_12345", timestamp = "2026-08-19T12:00:00Z")
        )

        assertTrue(envelope.success)
        assertNotNull(envelope.data)
        assertEquals(1, envelope.data?.size)
        assertEquals("Gurgaon Interview Travel", envelope.data?.first()?.title)
        assertEquals(0.78, envelope.data?.first()?.overallScore ?: 0.0, 0.001)
    }

    @Test
    fun testApiResponseEnvelopeErrorParsing() {
        val envelope = ApiResponseEnvelope<List<ForecastDto>>(
            success = false,
            data = null,
            error = ApiError(code = "UNAUTHORIZED", message = "Authentication required"),
            meta = ApiMeta(requestId = "req_err_999", timestamp = "2026-08-19T12:00:00Z")
        )

        assertEquals(false, envelope.success)
        assertEquals("UNAUTHORIZED", envelope.error?.code)
        assertEquals("Authentication required", envelope.error?.message)
    }
}
