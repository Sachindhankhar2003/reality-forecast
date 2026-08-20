package com.realityforecast.app

import com.realityforecast.app.core.network.ApiMeta
import com.realityforecast.app.core.network.ApiResponseEnvelope
import com.realityforecast.app.core.network.UserActivitySummaryDto
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ActivityAnalyticsTest {

    @Test
    fun testUserActivitySummaryDtoParsing() {
        val summary = UserActivitySummaryDto(
            totalForecasts = 14,
            totalConversations = 8,
            avgAiLatencyMs = 1420L,
            completedOutcomes = 6,
            topDomain = "Travel & Commute",
            brierAccuracyScore = 0.92
        )

        val envelope = ApiResponseEnvelope(
            success = true,
            data = summary,
            error = null,
            meta = ApiMeta(requestId = "req_act_100", timestamp = "2026-08-19T12:00:00Z", latencyMs = 42L)
        )

        assertTrue(envelope.success)
        assertNotNull(envelope.data)
        assertEquals(14, envelope.data?.totalForecasts)
        assertEquals(1420L, envelope.data?.avgAiLatencyMs)
        assertEquals("Travel & Commute", envelope.data?.topDomain)
        assertEquals(42L, envelope.meta.latencyMs)
    }
}
