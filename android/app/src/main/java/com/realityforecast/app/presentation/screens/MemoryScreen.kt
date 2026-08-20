package com.realityforecast.app.presentation.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class MemoryItem(val id: String, val category: String, val key: String, val value: String, val enabled: Boolean)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MemoryScreen() {
    val memories = remember {
        mutableStateListOf(
            MemoryItem("mem-1", "Transport", "preferred_mode", "Usually travel by Delhi Metro or Car from Noida", true),
            MemoryItem("mem-2", "Interview", "target_role", "Senior React & Full Stack Engineering Focus", true),
            MemoryItem("mem-3", "Habits", "schedule_constraint", "Requires 25m safety buffer for morning interviews", true)
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Personal Memory & Calibration Context", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White) },
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
            Text("User-Controlled Memory Factors", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(10.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(memories) { memory ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF261147)),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp).fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Surface(color = Color(0xFF4C1D95), shape = RoundedCornerShape(4.dp)) {
                                    Text(memory.category.uppercase(), modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), color = Color(0xFFA855F7), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(memory.value, fontSize = 13.sp, color = Color.White)
                            }
                            Switch(
                                checked = memory.enabled,
                                onCheckedChange = { isChecked ->
                                    val idx = memories.indexOfFirst { it.id == memory.id }
                                    if (idx != -1) {
                                        memories[idx] = memory.copy(enabled = isChecked)
                                    }
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
