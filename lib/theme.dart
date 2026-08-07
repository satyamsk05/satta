import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color background = Color(0xFFF9FAFB);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceElevated = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE5E7EB);
  
  static const Color primary = Color(0xFF2563EB); // Royal Blue
  static const Color primaryDark = Color(0xFF1D4ED8);
  static const Color secondary = Color(0xFF6B7280);
  
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  
  static const Color textPrimary = Color(0xFF111827); // Dark gray/black
  static const Color textSecondary = Color(0xFF6B7280); // Muted gray
}

class ThemeColors {
  static Color background(BuildContext context) => Theme.of(context).scaffoldBackgroundColor;
  static Color surface(BuildContext context) => Theme.of(context).cardColor;
  static Color primary(BuildContext context) => Theme.of(context).primaryColor;
  static Color textPrimary(BuildContext context) => Theme.of(context).textTheme.bodyMedium?.color ?? AppColors.textPrimary;
  static Color textSecondary(BuildContext context) => Theme.of(context).textTheme.labelLarge?.color ?? AppColors.textSecondary;
  static Color border(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return isDark ? const Color(0xFF28282C) : const Color(0xFFE5E7EB);
  }
}

class AppTheme {
  static String activeTheme = 'royalLight';

  static ThemeData get lightTheme {
    final isDark = activeTheme != 'royalLight';
    Color primaryColor;
    Color bgColor;
    Color surfaceColor;
    Color textPrimaryColor;
    Color textSecondaryColor;

    switch (activeTheme) {
      case 'neonCyberDark':
        primaryColor = const Color(0xFF10B981); // Emerald Neon Green
        bgColor = const Color(0xFF090D1A);
        surfaceColor = const Color(0xFF0F1626);
        textPrimaryColor = const Color(0xFFF8FAFC);
        textSecondaryColor = const Color(0xFF94A3B8);
        break;
      case 'royalGoldDark':
        primaryColor = const Color(0xFFD4AF37); // Gold
        bgColor = const Color(0xFF0F0F10);
        surfaceColor = const Color(0xFF161618);
        textPrimaryColor = const Color(0xFFF8FAFC);
        textSecondaryColor = const Color(0xFFA0A0A5);
        break;
      case 'amethystGlass':
        primaryColor = const Color(0xFF9F7AEA); // Amethyst Purple
        bgColor = const Color(0xFF0C0914);
        surfaceColor = const Color(0xFF140F22);
        textPrimaryColor = const Color(0xFFF8FAFC);
        textSecondaryColor = const Color(0xFF958EAC);
        break;
      default: // royalLight
        primaryColor = const Color(0xFF2563EB); // Royal Blue
        bgColor = const Color(0xFFF9FAFB);
        surfaceColor = const Color(0xFFFFFFFF);
        textPrimaryColor = const Color(0xFF111827);
        textSecondaryColor = const Color(0xFF6B7280);
    }

    return ThemeData(
      brightness: isDark ? Brightness.dark : Brightness.light,
      scaffoldBackgroundColor: bgColor,
      primaryColor: primaryColor,
      cardColor: surfaceColor,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryColor,
        brightness: isDark ? Brightness.dark : Brightness.light,
        primary: primaryColor,
        secondary: const Color(0xFF6B7280),
        surface: surfaceColor,
        error: const Color(0xFFEF4444),
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.plusJakartaSans(
          fontSize: 40,
          fontWeight: FontWeight.bold,
          color: textPrimaryColor,
          letterSpacing: -0.5,
        ),
        headlineLarge: GoogleFonts.plusJakartaSans(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: textPrimaryColor,
          letterSpacing: -0.5,
        ),
        headlineMedium: GoogleFonts.plusJakartaSans(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimaryColor,
        ),
        bodyLarge: GoogleFonts.plusJakartaSans(
          fontSize: 16,
          fontWeight: FontWeight.normal,
          color: textPrimaryColor,
        ),
        bodyMedium: GoogleFonts.plusJakartaSans(
          fontSize: 14,
          fontWeight: FontWeight.normal,
          color: textPrimaryColor,
        ),
        labelLarge: GoogleFonts.plusJakartaSans(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: textSecondaryColor,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
