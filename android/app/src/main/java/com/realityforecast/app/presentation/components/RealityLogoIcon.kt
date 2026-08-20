package com.realityforecast.app.presentation.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun RealityLogoIcon(
    size: Dp = 48.dp,
    primaryColor: Color = Color(0xFFA855F7),
    accentColor: Color = Color(0xFFC084FC)
) {
    Canvas(modifier = Modifier.size(size)) {
        val width = this.size.width
        val height = this.size.height

        // 1. Draw Outer Hexagonal Shield Frame
        val shieldPath = Path().apply {
            moveTo(width * 0.5f, height * 0.05f)
            lineTo(width * 0.9f, height * 0.25f)
            lineTo(width * 0.9f, height * 0.75f)
            lineTo(width * 0.5f, height * 0.95f)
            lineTo(width * 0.1f, height * 0.75f)
            lineTo(width * 0.1f, height * 0.25f)
            close()
        }

        drawPath(
            path = shieldPath,
            color = primaryColor,
            style = Stroke(width = width * 0.07f)
        )

        // 2. Draw Checkmark Signal Inside Shield
        val checkPath = Path().apply {
            moveTo(width * 0.3f, height * 0.52f)
            lineTo(width * 0.46f, height * 0.68f)
            lineTo(width * 0.72f, height * 0.36f)
        }

        drawPath(
            path = checkPath,
            color = Color.White,
            style = Stroke(width = width * 0.09f)
        )

        // 3. Draw Future Target Trajectory Dot
        drawCircle(
            color = accentColor,
            radius = width * 0.08f,
            center = Offset(width * 0.75f, height * 0.28f)
        )
    }
}
