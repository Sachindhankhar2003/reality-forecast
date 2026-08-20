package com.realityforecast.app.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

data class ChatMessage(val role: String, val text: String, val timestamp: String = "Just now")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AssistantScreen() {
    var messageText by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            ChatMessage("ASSISTANT", "Hi! I'm Reality AI. What are you planning today?")
        )
    }
    val listState = rememberLazyListState()
    val coroutineScope = rememberCoroutineScope()

    val suggestedQuestions = listOf(
        "Why this departure time?",
        "What is the main risk?",
        "What if I leave earlier?",
        "What evidence was used?"
    )

    fun handleSend(input: String) {
        if (input.isBlank()) return
        val trimmed = input.trim()
        messages.add(ChatMessage("USER", trimmed))
        messageText = ""

        // Dynamic conversational response matching exact user query intent
        val lower = trimmed.lowercase()
        val reply = when {
            lower in listOf("hello", "hi", "hey", "hlo") ->
                "Hi! I'm Reality AI. What are you planning today?"
            lower.matches(Regex("^[0-9]+$")) || lower.length < 3 ->
                "I can help with travel, interviews, meetings, weather, timing, risks, and decision planning. What would you like to plan?"
            lower.contains("time") || lower.contains("leave") || lower.contains("depart") ->
                "Leave around 08:20 AM. That gives you enough buffer for the current traffic estimate and a 09:30 AM arrival target."
            lower.contains("risk") || lower.contains("traffic") ->
                "The primary risk is NH-48 traffic congestion (+18 min delay around Sirhaul border). Departing by 08:20 AM avoids peak bottleneck."
            lower.contains("why") ->
                "Leaving at 08:20 AM provides a 30-minute safety buffer against peak 08:30-09:30 AM highway congestion."
            else ->
                "For your scheduled Software Developer Interview in Gurgaon tomorrow at 10 AM, I recommend departing by 08:20 AM via car or Delhi Metro Yellow Line."
        }

        messages.add(ChatMessage("ASSISTANT", reply))
        coroutineScope.launch {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Reality AI", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text("Evidence-Aware Assistant", fontSize = 11.sp, color = Color(0xFFA855F7))
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
                .imePadding()
        ) {
            // Suggested Pills
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                suggestedQuestions.take(2).forEach { q ->
                    SuggestionChip(
                        onClick = { handleSend(q) },
                        label = { Text(q, fontSize = 10.sp, color = Color(0xFFA855F7)) },
                        colors = SuggestionChipDefaults.suggestionChipColors(containerColor = Color(0xFF1D0C38))
                    )
                }
            }

            // Message History List
            LazyColumn(
                state = listState,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(messages) { msg ->
                    val isUser = msg.role == "USER"
                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = if (isUser) Alignment.CenterEnd else Alignment.CenterStart
                    ) {
                        Surface(
                            color = if (isUser) Color(0xFFA855F7) else Color(0xFF1D0C38),
                            shape = RoundedCornerShape(
                                topStart = 14.dp,
                                topEnd = 14.dp,
                                bottomStart = if (isUser) 14.dp else 2.dp,
                                bottomEnd = if (isUser) 2.dp else 14.dp
                            ),
                            modifier = Modifier.widthIn(max = 280.dp)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text(
                                    text = msg.text,
                                    fontSize = 13.sp,
                                    color = Color.White,
                                    lineHeight = 18.sp
                                )
                            }
                        }
                    }
                }
            }

            // Chat Input Field Bar
            Surface(
                color = Color(0xFF1D0C38),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .padding(12.dp)
                        .fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = messageText,
                        onValueChange = { messageText = it },
                        placeholder = { Text("Ask Reality AI...", fontSize = 12.sp, color = Color.Gray) },
                        modifier = Modifier.weight(1f),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFFA855F7),
                            unfocusedBorderColor = Color(0xFF4C1D95),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        )
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = { handleSend(messageText) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFA855F7)),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Send", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
