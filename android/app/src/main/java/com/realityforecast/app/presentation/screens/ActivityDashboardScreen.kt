package com.realityforecast.app.presentation.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ActivityDashboardScreen() {
    val scrollState = rememberScrollState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Activity & Data Transparency", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF1D0C38))
            )
        },
        containerColor = Color(0xFF120626)
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
                .verticalScroll(scrollState)
                .imePadding()
        ) {
            Text("Personal Dataset Summary", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(10.dp))

            // Stat Cards Row 1
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatCard("Forecasts Created", "14", "Active decision runs", Modifier.weight(1f))
                StatCard("AI Conversations", "8", "Persistent chat threads", Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Stat Cards Row 2
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatCard("Avg Response Time", "1.4s", "Server API latency", Modifier.weight(1f))
                StatCard("Accuracy Brier", "0.92", "High calibration score", Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Domain Distribution Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF261147)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Domain Breakdown", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFFA855F7))
                    Spacer(modifier = Modifier.height(8.dp))
                    DomainBar("Travel & Commute", 0.45f, "45%")
                    Spacer(modifier = Modifier.height(6.dp))
                    DomainBar("Technical Interviews", 0.35f, "35%")
                    Spacer(modifier = Modifier.height(6.dp))
                    DomainBar("Career & Personal", 0.20f, "20%")
                }
            }
        }
    }
}

@Composable
fun StatCard(label: String, value: String, subtitle: String, modifier: Modifier = Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFF261147)),
        shape = RoundedCornerShape(10.dp),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(label, fontSize = 11.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(2.dp))
            Text(subtitle, fontSize = 10.sp, color = Color(0xFFA855F7))
        }
    }
}

@Composable
fun DomainBar(label: String, fraction: Float, percentageText: String) {
    Column {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, fontSize = 12.sp, color = Color.White)
            Text(percentageText, fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { fraction },
            modifier = Modifier.fillMaxWidth().height(6.dp),
            color = Color(0xFFA855F7),
            trackColor = Color(0xFF4C1D95)
        )
    }
}
