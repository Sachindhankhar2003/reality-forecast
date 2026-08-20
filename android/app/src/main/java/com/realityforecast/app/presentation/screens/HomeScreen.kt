package com.realityforecast.app.presentation.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.realityforecast.app.presentation.components.RealityLogoIcon
import com.realityforecast.app.presentation.viewmodel.ForecastViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: ForecastViewModel,
    onNavigateToDetail: (String) -> Unit,
    onNavigateToCreate: () -> Unit
) {
    var promptInput by remember { mutableStateOf("") }
    
    // Dynamic Active Forecast State derived from User Input
    var activeForecastTitle by remember { mutableStateOf("Software Developer Interview") }
    var activeForecastSubtitle by remember { mutableStateOf("Delhi NCR → Gurgaon  •  Tomorrow 10:00 AM") }
    var activeFeasibility by remember { mutableStateOf("68%") }
    var activeMainRisk by remember { mutableStateOf("NH-48 traffic congestion delay") }
    var activeAction by remember { mutableStateOf("Depart by 08:20 AM via Metro / Car") }

    var showWhyPlan by remember { mutableStateOf(false) }
    var showRisks by remember { mutableStateOf(false) }
    var showEvidence by remember { mutableStateOf(false) }
    var showScenarios by remember { mutableStateOf(false) }
    val scrollState = rememberScrollState()

    fun processDynamicForecast(prompt: String) {
        if (prompt.isBlank()) return
        val lower = prompt.lowercase()
        when {
            lower.contains("flight") || lower.contains("airport") || lower.contains("mumbai") -> {
                activeForecastTitle = "Flight Departure to Destination"
                activeForecastSubtitle = "Delhi → Airport T3  •  Tomorrow 04:00 PM"
                activeFeasibility = "85%"
                activeMainRisk = "Security Check-in & Terminal Queue"
                activeAction = "Depart at 01:30 PM via Airport Express Line"
            }
            lower.contains("train") || lower.contains("railway") || lower.contains("station") -> {
                activeForecastTitle = "Vande Bharat Train Journey"
                activeForecastSubtitle = "New Delhi Railway Station  •  Tomorrow 06:00 AM"
                activeFeasibility = "92%"
                activeMainRisk = "Early morning platform crowd"
                activeAction = "Depart at 05:00 AM via Taxi / Cab"
            }
            lower.contains("meeting") || lower.contains("client") || lower.contains("cp") -> {
                activeForecastTitle = "Executive Client Strategy Meeting"
                activeForecastSubtitle = "Connaught Place Block B  •  Tomorrow 11:30 AM"
                activeFeasibility = "78%"
                activeMainRisk = "Central Delhi Outer Circle Parking"
                activeAction = "Depart at 10:30 AM via Yellow Line Metro"
            }
            else -> {
                activeForecastTitle = prompt.take(32).capitalize()
                activeForecastSubtitle = "Target Destination  •  Scheduled Event"
                activeFeasibility = "75%"
                activeMainRisk = "Peak hour urban travel congestion"
                activeAction = "Depart 45 mins earlier with 30m buffer"
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            // High Quality Vector Reality Forecast Logo Icon
                            RealityLogoIcon(size = 32.dp)
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text("Reality Forecast", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text("Decision Intelligence", fontSize = 10.sp, color = Color.Gray)
                            }
                        }

                        // Avatar User Profile Button
                        Surface(
                            color = Color(0xFFA855F7),
                            shape = CircleShape,
                            modifier = Modifier.size(32.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text("S", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }
                    }
                },
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
            // User Greeting Header
            Text("Good morning, Sachin", fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
            Text("Your decision intelligence at a glance.", fontSize = 12.sp, color = Color(0xFFA855F7), modifier = Modifier.padding(bottom = 16.dp))

            // Ask Reality Input Card (Empty by default for user's own work!)
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1D0C38)),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Plan a New Moment", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = promptInput,
                        onValueChange = { promptInput = it },
                        placeholder = { Text("Type your plan here... (e.g. Flight to Mumbai at 4 PM)", fontSize = 11.sp, color = Color.Gray) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFFA855F7),
                            unfocusedBorderColor = Color(0xFF4C1D95),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        )
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Button(
                        onClick = {
                            if (promptInput.isNotBlank()) {
                                processDynamicForecast(promptInput)
                                viewModel.createForecast(promptInput)
                                promptInput = ""
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFA855F7)),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.align(Alignment.End)
                    ) {
                        Text("Predict Plan →", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // DYNAMIC ACTIVE FORECAST CARD
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF261147)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().padding(bottom = 14.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(color = Color(0x33A855F7), shape = RoundedCornerShape(6.dp)) {
                            Text("ACTIVE FORECAST", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFFA855F7), modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                        }
                        Surface(color = Color(0x3310B981), shape = RoundedCornerShape(6.dp)) {
                            Text("Feasibility $activeFeasibility", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981), modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(activeForecastTitle, fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Text(activeForecastSubtitle, fontSize = 12.sp, color = Color.Gray)

                    Spacer(modifier = Modifier.height(14.dp))
                    Surface(color = Color(0xFF1D0C38), shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("MAIN RISK: $activeMainRisk", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFFF87171))
                            Text("RECOMMENDED ACTION: $activeAction", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF34D399), modifier = Modifier.padding(top = 4.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // 4 Actionable Progressive Disclosure Toggles
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        FilterChip(
                            selected = showWhyPlan,
                            onClick = { showWhyPlan = !showWhyPlan },
                            label = { Text("Why this plan?", fontSize = 10.sp) }
                        )
                        FilterChip(
                            selected = showRisks,
                            onClick = { showRisks = !showRisks },
                            label = { Text("Show risks", fontSize = 10.sp) }
                        )
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        FilterChip(
                            selected = showEvidence,
                            onClick = { showEvidence = !showEvidence },
                            label = { Text("Evidence", fontSize = 10.sp) }
                        )
                        FilterChip(
                            selected = showScenarios,
                            onClick = { showScenarios = !showScenarios },
                            label = { Text("Detailed scenarios", fontSize = 10.sp) }
                        )
                    }

                    // Collapsible Detail Views
                    AnimatedVisibility(visible = showWhyPlan) {
                        Surface(color = Color(0xFF130A24), shape = RoundedCornerShape(8.dp), modifier = Modifier.padding(top = 8.dp).fillMaxWidth()) {
                            Text("Optimal window avoids peak 08:30–09:30 AM congestion window. Guarantees 30m arrival safety buffer.", fontSize = 11.sp, color = Color.LightGray, modifier = Modifier.padding(10.dp))
                        }
                    }
                    AnimatedVisibility(visible = showRisks) {
                        Surface(color = Color(0xFF130A24), shape = RoundedCornerShape(8.dp), modifier = Modifier.padding(top = 8.dp).fillMaxWidth()) {
                            Text("• High: Roadwork exit congestion (+20m)\n• Medium: Morning weather shift (+10m)", fontSize = 11.sp, color = Color(0xFFFCA5A5), modifier = Modifier.padding(10.dp))
                        }
                    }
                    AnimatedVisibility(visible = showEvidence) {
                        Surface(color = Color(0xFF130A24), shape = RoundedCornerShape(8.dp), modifier = Modifier.padding(top = 8.dp).fillMaxWidth()) {
                            Text("TomTom Live Speed: 24 km/h  •  Open-Meteo Weather: 29°C Clear", fontSize = 11.sp, color = Color(0xFF93C5FD), modifier = Modifier.padding(10.dp))
                        }
                    }
                    AnimatedVisibility(visible = showScenarios) {
                        Surface(color = Color(0xFF130A24), shape = RoundedCornerShape(8.dp), modifier = Modifier.padding(top = 8.dp).fillMaxWidth()) {
                            Text("1. Depart early -> Arrive on-time (92% On-Time)\n2. Depart late -> Peak delay (LATE)", fontSize = 11.sp, color = Color(0xFFFDE68A), modifier = Modifier.padding(10.dp))
                        }
                    }
                }
            }

            // TELEMETRY METRIC CARDS GRID
            Row(modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                // Weather
                Surface(color = Color(0xFF1D0C38), shape = RoundedCornerShape(12.dp), modifier = Modifier.weight(1f)) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("WEATHER", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                        Text("29°C", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text("Clear sky", fontSize = 10.sp, color = Color.Gray)
                    }
                }
                // Traffic
                Surface(color = Color(0xFF1D0C38), shape = RoundedCornerShape(12.dp), modifier = Modifier.weight(1f)) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("TRAFFIC", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                        Text("+18 min", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFFF87171))
                        Text("Live corridor", fontSize = 10.sp, color = Color.Gray)
                    }
                }
                // Arrival
                Surface(color = Color(0xFF1D0C38), shape = RoundedCornerShape(12.dp), modifier = Modifier.weight(1f)) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("ARRIVAL", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                        Text("09:30 AM", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF34D399))
                        Text("30m buffer", fontSize = 10.sp, color = Color.Gray)
                    }
                }
            }

            // TOP ACTIONS CHECKLIST CARD
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1D0C38)),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("TOP ACTIONS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFFA855F7))
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("1. $activeAction", fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.SemiBold)
                    Text("2. Prepare necessary documentation and agenda", fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(top = 6.dp))
                    Text("3. Keep Delhi Metro / Express Line as instant backup", fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(top = 6.dp))
                }
            }
        }
    }
}
