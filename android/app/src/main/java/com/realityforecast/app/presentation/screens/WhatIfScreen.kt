package com.realityforecast.app.presentation.screens

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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WhatIfScreen(
    forecastId: String,
    onNavigateBack: () -> Unit
) {
    var scenarioInput by remember { mutableStateOf("What if I leave 30 minutes earlier and take Metro?") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("What-If Simulation Engine", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White) },
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
                    Text("Hypothesis Input", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFFA855F7))
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = scenarioInput,
                        onValueChange = { scenarioInput = it },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFFA855F7),
                            unfocusedBorderColor = Color(0xFF4C1D95),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        )
                    )
                }
            }

            // Simulation Result Delta Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1D0C38)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("SIMULATION DELTA RESULT", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                    Spacer(modifier = Modifier.height(10.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Current: 72%", fontSize = 13.sp, color = Color.Gray)
                            Text("Simulated: 81%", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }

                        Surface(
                            color = Color(0xFF064E3B),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(
                                text = "+9% Score Delta",
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                color = Color(0xFF6EE7B7),
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Advancing departure by 30 minutes bypasses peak highway congestion on NH-48 and reduces tardiness risk.",
                        fontSize = 12.sp,
                        color = Color.LightGray
                    )
                }
            }
        }
    }
}
