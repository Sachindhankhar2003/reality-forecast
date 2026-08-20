package com.realityforecast.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.*
import com.realityforecast.app.presentation.auth.LoginScreen
import com.realityforecast.app.presentation.screens.*
import com.realityforecast.app.presentation.viewmodel.ForecastViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    primary = Color(0xFFA855F7),
                    background = Color(0xFF120626),
                    surface = Color(0xFF1D0C38)
                )
            ) {
                MainAppScreen()
            }
        }
    }
}

@Composable
fun MainAppScreen() {
    val navController = rememberNavController()
    val forecastViewModel: ForecastViewModel = viewModel()

    // Default to false so user MUST log in first on opening app
    var isLoggedIn by remember { mutableStateOf(false) }
    val navItems = listOf("Home", "Forecasts", "Assistant", "Activity", "Profile")
    val navIcons = listOf(
        Icons.Default.Home,
        Icons.Default.Search,
        Icons.Default.Send,
        Icons.Default.List,
        Icons.Default.Person
    )
    var selectedItem by remember { mutableStateOf(0) }

    if (!isLoggedIn) {
        LoginScreen(onLoginSuccess = { isLoggedIn = true })
    } else {
        Scaffold(
            bottomBar = {
                NavigationBar(containerColor = Color(0xFF1D0C38)) {
                    navItems.forEachIndexed { index, item ->
                        NavigationBarItem(
                            icon = {
                                Icon(
                                    imageVector = navIcons[index],
                                    contentDescription = item,
                                    tint = if (selectedItem == index) Color(0xFFA855F7) else Color.Gray
                                )
                            },
                            label = {
                                Text(
                                    text = item,
                                    fontSize = 10.sp,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                    color = if (selectedItem == index) Color.White else Color.Gray
                                )
                            },
                            selected = selectedItem == index,
                            onClick = {
                                selectedItem = index
                                when (index) {
                                    0 -> navController.navigate("home")
                                    1 -> navController.navigate("home")
                                    2 -> navController.navigate("assistant")
                                    3 -> navController.navigate("activity")
                                    4 -> navController.navigate("profile")
                                }
                            }
                        )
                    }
                }
            }
        ) { innerPadding ->
            NavHost(
                navController = navController,
                startDestination = "home",
                modifier = Modifier.padding(innerPadding)
            ) {
                composable("home") {
                    HomeScreen(
                        viewModel = forecastViewModel,
                        onNavigateToDetail = { id -> navController.navigate("detail/$id") },
                        onNavigateToCreate = {}
                    )
                }
                composable("detail/{id}") { backStackEntry ->
                    val id = backStackEntry.arguments?.getString("id") ?: ""
                    ForecastDetailScreen(
                        forecastId = id,
                        onNavigateBack = { navController.popBackStack() },
                        onNavigateToWhatIf = { targetId -> navController.navigate("whatif/$targetId") }
                    )
                }
                composable("whatif/{id}") { backStackEntry ->
                    val id = backStackEntry.arguments?.getString("id") ?: ""
                    WhatIfScreen(
                        forecastId = id,
                        onNavigateBack = { navController.popBackStack() }
                    )
                }
                composable("assistant") {
                    AssistantScreen()
                }
                composable("activity") {
                    ActivityDashboardScreen()
                }
                composable("profile") {
                    ProfileScreen(onLogout = { isLoggedIn = false })
                }
            }
        }
    }
}
