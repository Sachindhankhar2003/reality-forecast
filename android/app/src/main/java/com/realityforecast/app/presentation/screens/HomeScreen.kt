package com.realityforecast.app.presentation.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.runtime.collectAsState
import com.realityforecast.app.core.session.SessionManager
import com.realityforecast.app.presentation.components.RealityLogoIcon
import com.realityforecast.app.presentation.viewmodel.ForecastViewModel
import com.realityforecast.app.presentation.viewmodel.UiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: ForecastViewModel,
    onNavigateToDetail: (String) -> Unit,
    onNavigateToCreate: () -> Unit
) {
    val context = LocalContext.current
    val sessionManager = remember { SessionManager(context) }
    val userName = remember { sessionManager.getUserName() }
    
    val forecastsState by viewModel.forecastsState.collectAsState()
    val createState by viewModel.createState.collectAsState()
    
    var promptInput by remember { mutableStateOf("") }
    val scrollState = rememberScrollState()

    // Fake API active forecast states until integrated fully
    var showActiveForecast by remember { mutableStateOf(false) }
    var isLoadingPrediction by remember { mutableStateOf(false) }

    // Mock data for UI 
    val activeForecastTitle = "Target Plan"
    val activeAction = "Depart by Next Hour via Fastest Transit"

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
                                Text(userName.take(1).uppercase(), fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF120626)) // Match background
            )
        },
        containerColor = Color(0xFF120626) // Deep Dark Background
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
                .verticalScroll(scrollState)
                .imePadding()
        ) {
            // Hero Section 
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1D0C38)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
                border = null
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // Badge
                    Surface(color = Color(0x33A855F7), shape = RoundedCornerShape(6.dp), modifier = Modifier.padding(bottom = 12.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)) {
                            Icon(Icons.Default.Security, contentDescription = null, tint = Color(0xFFA855F7), modifier = Modifier.size(12.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("REALITY FORECAST ENGINE", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFFA855F7))
                        }
                    }
                    
                    Text("Good morning, $userName.", fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
                    Text(
                        "Type what you need to do and your location. Reality AI will predict departure time, best transit mode, and shortest safe paths.", 
                        fontSize = 11.sp, 
                        color = Color.LightGray, 
                        modifier = Modifier.padding(vertical = 12.dp)
                    )

                    // Helper Action Buttons
                    Row(modifier = Modifier.padding(bottom = 12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Surface(shape = RoundedCornerShape(20.dp), color = Color.Transparent, border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF4C1D95)), modifier = Modifier.clickable { /* Detect Location */ }) {
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)) {
                                Icon(Icons.Default.LocationOn, contentDescription = null, tint = Color(0xFF93C5FD), modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Detect Current Location", fontSize = 10.sp, color = Color(0xFF93C5FD))
                            }
                        }
                        Surface(shape = RoundedCornerShape(20.dp), color = Color.Transparent, border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF4C1D95)), modifier = Modifier.clickable { /* Voice Input */ }) {
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)) {
                                Icon(Icons.Default.Mic, contentDescription = null, tint = Color(0xFFA855F7), modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Voice Input", fontSize = 10.sp, color = Color(0xFFA855F7))
                            }
                        }
                    }

                    // Main Input 
                    OutlinedTextField(
                        value = promptInput,
                        onValueChange = { promptInput = it },
                        placeholder = { Text("Type or speak what you need to do tomorrow (e.g. Tomorrow 10 AM interview in Gurgaon)...", fontSize = 11.sp, color = Color.Gray) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(min = 100.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFFA855F7),
                            unfocusedBorderColor = Color(0xFF4C1D95),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedContainerColor = Color(0xFF130A24),
                            unfocusedContainerColor = Color(0xFF130A24)
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )
                    
                    Spacer(modifier = Modifier.height(12.dp))
                    
                    // Chips Row and Button
                    Column {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                            Text("TRY SAMPLES:", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Button(
                                onClick = {
                                    if (promptInput.isNotBlank()) {
                                        viewModel.createForecast(promptInput)
                                        showActiveForecast = true
                                        promptInput = ""
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFA855F7)),
                                shape = RoundedCornerShape(8.dp),
                            ) {
                                Text("Predict Plan →", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }
                        
                        LazyRow(modifier = Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            item { SampleChip("💼 Interview in Gurgaon", onClick = { promptInput = "Tomorrow 10 AM interview in Gurgaon" }) }
                            item { SampleChip("✈️ Flight at IGI Airport", onClick = { promptInput = "Flight at IGI Airport" }) }
                            item { SampleChip("🚆 Train at NDLS", onClick = { promptInput = "Train at NDLS Station" }) }
                            item { SampleChip("🏢 Client Meeting CP", onClick = { promptInput = "Client Meeting in Connaught Place" }) }
                        }
                    }
                }
            }

            // Results UI - Dynamic State
            if (!showActiveForecast) {
                // EMPTY STATE
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.Transparent),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
                ) {
                    Box(modifier = Modifier.fillMaxWidth().background(Color(0xFF1D0C38)).border(1.dp, Color(0xFF4C1D95), RoundedCornerShape(16.dp))) {
                        Column(modifier = Modifier.padding(32.dp).fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Color(0xFFA855F7), modifier = Modifier.size(36.dp))
                            Spacer(modifier = Modifier.height(16.dp))
                            Text("No predictions yet", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                "Type your event + location above and click Predict Plan to get your first AI-powered forecast with live weather, traffic and route analysis.", 
                                fontSize = 12.sp, 
                                color = Color.LightGray, 
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(horizontal = 16.dp)
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(
                                onClick = { /* Focus input */ },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFA855F7)),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Create First Prediction →", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            } else {
                // ACTIVE FORECAST STATE (Drawn similar to web)
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
                                Text("DIRECT ACTION", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFFA855F7), modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                            }
                            Surface(color = Color(0x3310B981), shape = RoundedCornerShape(6.dp)) {
                                Text("High Feasibility", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981), modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(activeForecastTitle, fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color.White)

                        Spacer(modifier = Modifier.height(14.dp))
                        Surface(color = Color(0xFF1D0C38), shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth()) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text("RECOMMENDED ACTION: $activeAction", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF34D399))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun SampleChip(text: String, onClick: () -> Unit) {
    Surface(
        shape = RoundedCornerShape(20.dp),
        color = Color(0x334C1D95),
        modifier = Modifier.clickable { onClick() }
    ) {
        Text(text, fontSize = 10.sp, color = Color(0xFFD8B4FE), modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp))
    }
}
