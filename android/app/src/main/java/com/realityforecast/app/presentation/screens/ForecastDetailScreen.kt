package com.realityforecast.app.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.realityforecast.app.core.network.ForecastDto

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ForecastDetailScreen(
    forecastId: String,
    onNavigateBack: () -> Unit,
    onNavigateToWhatIf: (String) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Forecast Intelligence Detail", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White) },
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
        ) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF261147)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "Gurgaon Technical Interview & Commute", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "Domain: Travel & Interview • Location: Delhi NCR", fontSize = 12.sp, color = Color.Gray)
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("Feasibility Score", fontSize = 12.sp, color = Color.Gray)
                            Text("72%", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFFA855F7))
                        }
                        Column {
                            Text("Model Confidence", fontSize = 12.sp, color = Color.Gray)
                            Text("88%", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981))
                        }
                    }
                }
            }

            // Evidence & Risk Badges
            Text("Evidence & Telemetry Badges", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(8.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Surface(color = Color(0xFF1E3A8A), shape = RoundedCornerShape(6.dp)) {
                    Text("FACT: Open-Meteo", modifier = Modifier.padding(6.dp), color = Color(0xFF93C5FD), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
                Surface(color = Color(0xFF064E3B), shape = RoundedCornerShape(6.dp)) {
                    Text("LIVE: TomTom Traffic", modifier = Modifier.padding(6.dp), color = Color(0xFF6EE7B7), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
                Surface(color = Color(0xFF581C87), shape = RoundedCornerShape(6.dp)) {
                    Text("INFERENCE: Buffer", modifier = Modifier.padding(6.dp), color = Color(0xFFC084FC), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = { onNavigateToWhatIf(forecastId) },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFA855F7)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Run What-If Simulation", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }
    }
}
