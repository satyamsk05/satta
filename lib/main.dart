import 'package:flutter/material.dart';
import 'theme.dart';
import 'models/app_data.dart';
import 'screens/auth_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/live_results_screen.dart';
import 'screens/game_rates_screen.dart';
import 'screens/bet_history_screen.dart';
import 'screens/utility_screens.dart';

void main() {
  runApp(const MatkaApp());
}

class MatkaApp extends StatelessWidget {
  const MatkaApp({super.key});

  @override
  Widget build(BuildContext context) {
    final appData = AppData();
    return ListenableBuilder(
      listenable: appData,
      builder: (context, _) {
        AppTheme.activeTheme = appData.currentTheme;
        return MaterialApp(
          title: 'Matka Betting App',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme,
          home: const AuthWrapper(),
        );
      },
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  final AppData _appData = AppData();

  @override
  void initState() {
    super.initState();
    _appData.addListener(_updateState);
  }

  @override
  void dispose() {
    _appData.removeListener(_updateState);
    super.dispose();
  }

  void _updateState() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (!_appData.isInitialized) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
      );
    }
    if (_appData.currentUserPhone == null) {
      return AuthScreen(
        onLoginSuccess: () {
          // Trigger build reload
          setState(() {});
        },
      );
    }
    return const MainNavigationShell();
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = [
      DashboardScreen(onNavigate: _navigateTo),
      const LiveResultsScreen(),
      const BetHistoryScreen(),
      const ProfileScreen(),
      const DepositScreen(),     // Index 4
      const WithdrawalScreen(),   // Index 5
      const SupportScreen(),      // Index 6
    ];
  }

  void _navigateTo(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  Widget _navItem(int index, IconData outlineIcon, IconData filledIcon, String label) {
    final isActive = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isActive ? AppColors.primary.withOpacity(0.08) : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isActive ? filledIcon : outlineIcon,
              color: isActive ? AppColors.primary : AppColors.textSecondary,
              size: 20,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.bold,
                color: isActive ? AppColors.primary : AppColors.textSecondary,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isMainTab = _currentIndex <= 3;

    return Scaffold(
      body: SafeArea(
        child: IndexedStack(
          index: _currentIndex,
          children: _screens,
        ),
      ),
      bottomNavigationBar: isMainTab
          ? Container(
              margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.border),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 15,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _navItem(0, Icons.home_outlined, Icons.home, 'HOME'),
                      _navItem(1, Icons.emoji_events_outlined, Icons.emoji_events, 'RESULTS'),
                      _navItem(2, Icons.history_outlined, Icons.history, 'BETS'),
                      _navItem(3, Icons.person_outline, Icons.person, 'PROFILE'),
                    ],
                  ),
                ),
              ),
            )
          : null,
      floatingActionButton: !isMainTab
          ? FloatingActionButton(
              onPressed: () => setState(() => _currentIndex = 0), // Go back home
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              child: const Icon(Icons.home),
            )
          : null,
    );
  }
}
