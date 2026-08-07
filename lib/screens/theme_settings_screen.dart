import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import '../theme.dart';
import '../models/app_data.dart';
import '../widgets/glass_card.dart';

class ThemeSettingsScreen extends StatefulWidget {
  const ThemeSettingsScreen({super.key});

  @override
  State<ThemeSettingsScreen> createState() => _ThemeSettingsScreenState();
}

class _ThemeSettingsScreenState extends State<ThemeSettingsScreen> with TickerProviderStateMixin {
  final AppData _appData = AppData();
  late final AnimationController _lottieController;

  // Custom UI Component States
  bool _customToggle = true;
  double _sliderValue = 0.7;
  int _selectedSegment = 0;
  bool _isLocked = true;
  int _batteryLevel = 85;
  double _volumeLevel = 0.5;
  bool _isLiked = false;

  @override
  void initState() {
    super.initState();
    _lottieController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();
  }

  @override
  void dispose() {
    _lottieController.dispose();
    super.dispose();
  }

  Widget _buildThemeCard({
    required String id,
    required String name,
    required String description,
    required Color primaryColor,
    required Color bgColor,
    required bool isActive,
    required List<Color> previewColors,
  }) {
    return GestureDetector(
      onTap: () {
        _appData.setTheme(id);
        setState(() {});
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive ? primaryColor : AppColors.border,
            width: isActive ? 2.0 : 1.0,
          ),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: primaryColor.withOpacity(0.15),
                    blurRadius: 15,
                    offset: const Offset(0, 6),
                  ),
                ]
              : [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.01),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
        ),
        child: Row(
          children: [
            // Preview Circle
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: bgColor,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.border),
              ),
              child: Center(
                child: Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: primaryColor,
                    shape: BoxShape.circle,
                  ),
                  child: isActive
                      ? const Icon(Icons.check, size: 14, color: Colors.white)
                      : null,
                ),
              ),
            ),
            const SizedBox(width: 16),
            // Text details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            // Palette Preview dots
            Row(
              children: previewColors
                  .map((color) => Container(
                        margin: const EdgeInsets.only(left: 4),
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: color,
                          shape: BoxShape.circle,
                        ),
                      ))
                  .toList(),
            )
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentTheme = _appData.currentTheme;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'THEMES & ANIMATED ICONS',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Info
            const Text(
              'SELECT APP THEME',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 12,
                letterSpacing: 1.5,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 12),

            // Themes choices
            _buildThemeCard(
              id: 'royalLight',
              name: 'Royal Light Theme',
              description: 'Classic white layout with Royal Blue accents',
              primaryColor: const Color(0xFF2563EB),
              bgColor: const Color(0xFFF9FAFB),
              isActive: currentTheme == 'royalLight',
              previewColors: [const Color(0xFF2563EB), const Color(0xFFE5E7EB), const Color(0xFFFFFFFF)],
            ),
            _buildThemeCard(
              id: 'neonCyberDark',
              name: 'Neon Cyber Dark',
              description: 'Cyberpunk absolute black with Emerald Neon accents',
              primaryColor: const Color(0xFF10B981),
              bgColor: const Color(0xFF090D1A),
              isActive: currentTheme == 'neonCyberDark',
              previewColors: [const Color(0xFF10B981), const Color(0xFF0F1626), const Color(0xFF1E2638)],
            ),
            _buildThemeCard(
              id: 'royalGoldDark',
              name: 'Royal Gold Dark',
              description: 'Luxurious carbon theme with Elegant Gold accents',
              primaryColor: const Color(0xFFD4AF37),
              bgColor: const Color(0xFF0F0F10),
              isActive: currentTheme == 'royalGoldDark',
              previewColors: [const Color(0xFFD4AF37), const Color(0xFF161618), const Color(0xFF28282C)],
            ),
            _buildThemeCard(
              id: 'amethystGlass',
              name: 'Amethyst Glass Dark',
              description: 'Mystic deep violet theme with soft Purple accents',
              primaryColor: const Color(0xFF9F7AEA),
              bgColor: const Color(0xFF0C0914),
              isActive: currentTheme == 'amethystGlass',
              previewColors: [const Color(0xFF9F7AEA), const Color(0xFF140F22), const Color(0xFF2B2046)],
            ),

            const SizedBox(height: 24),

            // Lottie Canvas Player
            const Text(
              'LOTTIE VECTOR CANVAS (SCENE.JSON)',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 12,
                letterSpacing: 1.5,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 12),
            GlassCard(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  const Text(
                    'Full Interactive Micro-Animation Canvas',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Renders raw vector data dynamically from Scene.json',
                    style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    height: 160,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.border),
                    ),
                    padding: const EdgeInsets.all(12),
                    child: Center(
                      child: Lottie.asset(
                        'Scene.json',
                        controller: _lottieController,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) {
                          return Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.broken_image_outlined, color: AppColors.error, size: 36),
                              const SizedBox(height: 8),
                              Text(
                                'Scene.json asset rendering: $error',
                                style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton.icon(
                        onPressed: () {
                          if (_lottieController.isAnimating) {
                            _lottieController.stop();
                          } else {
                            _lottieController.repeat();
                          }
                          setState(() {});
                        },
                        icon: Icon(_lottieController.isAnimating ? Icons.pause : Icons.play_arrow),
                        label: Text(_lottieController.isAnimating ? 'Pause' : 'Play'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: () {
                          _lottieController.reset();
                          _lottieController.forward();
                        },
                        icon: const Icon(Icons.replay),
                        label: const Text('Restart'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.primary,
                          side: BorderSide(color: AppColors.primary),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Interactive Dynamic Components
            const Text(
              'LIVE DYNAMIC COMPONENTS',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 12,
                letterSpacing: 1.5,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 12),

            // Row of Circular Icons from screenshot
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Battery
                Expanded(
                  child: _iconCard(
                    title: 'Battery',
                    color: Colors.green,
                    icon: _batteryIcon(),
                    value: '$_batteryLevel%',
                    onTap: () {
                      setState(() {
                        _batteryLevel = (_batteryLevel - 15) <= 0 ? 100 : (_batteryLevel - 15);
                      });
                    },
                  ),
                ),
                const SizedBox(width: 8),
                // Volume
                Expanded(
                  child: _iconCard(
                    title: 'Volume',
                    color: Colors.purple,
                    icon: Icon(
                      _volumeLevel == 0
                          ? Icons.volume_mute
                          : (_volumeLevel < 0.6 ? Icons.volume_down : Icons.volume_up),
                      color: Colors.white,
                    ),
                    value: '${(_volumeLevel * 100).toInt()}%',
                    onTap: () {
                      setState(() {
                        _volumeLevel = (_volumeLevel + 0.2) > 1.0 ? 0.0 : (_volumeLevel + 0.2);
                      });
                    },
                  ),
                ),
                const SizedBox(width: 8),
                // Thumbs Up
                Expanded(
                  child: _iconCard(
                    title: 'Reaction',
                    color: Colors.orange,
                    icon: Icon(
                      _isLiked ? Icons.thumb_up : Icons.thumb_up_outlined,
                      color: Colors.white,
                    ),
                    value: _isLiked ? 'Liked' : 'Like',
                    onTap: () {
                      setState(() {
                        _isLiked = !_isLiked;
                      });
                    },
                  ),
                ),
                const SizedBox(width: 8),
                // Lock
                Expanded(
                  child: _iconCard(
                    title: 'Status',
                    color: Colors.pink,
                    icon: Icon(
                      _isLocked ? Icons.lock : Icons.lock_open,
                      color: Colors.white,
                    ),
                    value: _isLocked ? 'Locked' : 'Unlocked',
                    onTap: () {
                      setState(() {
                        _isLocked = !_isLocked;
                      });
                    },
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Toggles and sliders cards
            GlassCard(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Toggle row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Premium Custom Toggle', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          Text('Animate UI on change', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                        ],
                      ),
                      // Custom switch replicating screenshot
                      GestureDetector(
                        onTap: () => setState(() => _customToggle = !_customToggle),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          width: 64,
                          height: 36,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(18),
                            color: _customToggle ? const Color(0xFF10B981) : AppColors.border,
                          ),
                          padding: const EdgeInsets.all(4),
                          alignment: _customToggle ? Alignment.centerRight : Alignment.centerLeft,
                          child: Container(
                            width: 28,
                            height: 28,
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2)),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 32, color: AppColors.border),

                  // Slider section matching green slider in screenshot
                  const Text('Dynamic Range Slider', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.tune, size: 18, color: AppColors.textSecondary),
                      const SizedBox(width: 12),
                      Expanded(
                        child: SliderTheme(
                          data: SliderThemeData(
                            activeTrackColor: const Color(0xFF10B981),
                            inactiveTrackColor: AppColors.border,
                            thumbColor: Colors.white,
                            overlayColor: const Color(0xFF10B981).withOpacity(0.12),
                            trackHeight: 6,
                          ),
                          child: Slider(
                            value: _sliderValue,
                            onChanged: (val) => setState(() => _sliderValue = val),
                          ),
                        ),
                      ),
                      Text(
                        '${(_sliderValue * 100).toInt()}%',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ],
                  ),
                  const Divider(height: 32, color: AppColors.border),

                  // Segmented control replicating screenshot
                  const Text('Segmented Tabs', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.border),
                    ),
                    padding: const EdgeInsets.all(4),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _selectedSegment = 0),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                color: _selectedSegment == 0 ? AppColors.surface : Colors.transparent,
                                boxShadow: _selectedSegment == 0
                                    ? [const BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))]
                                    : [],
                              ),
                              child: const Center(child: Text('Item 01', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _selectedSegment = 1),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                color: _selectedSegment == 1 ? AppColors.surface : Colors.transparent,
                                boxShadow: _selectedSegment == 1
                                    ? [const BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))]
                                    : [],
                              ),
                              child: const Center(child: Text('Item 02', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Continue Button (Premium Dark Button with arrow on right)
            GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('Dynamic configuration successfully applied!'),
                    backgroundColor: AppColors.primary,
                  ),
                );
              },
              child: Container(
                width: double.infinity,
                height: 56,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(28),
                  gradient: const LinearGradient(
                    colors: [Color(0xFF10B981), Color(0xFF059669)],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF10B981).withOpacity(0.3),
                      blurRadius: 15,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const SizedBox(width: 32),
                    const Text(
                      'Continue',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: 0.5),
                    ),
                    Container(
                      width: 32,
                      height: 32,
                      decoration: const BoxDecoration(color: Colors.black26, shape: BoxShape.circle),
                      child: const Icon(Icons.arrow_forward, color: Colors.white, size: 16),
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _iconCard({
    required String title,
    required Color color,
    required Widget icon,
    required String value,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
        borderRadius: 16,
        child: Column(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              child: Center(child: icon),
            ),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(value, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
          ],
        ),
      ),
    );
  }

  Widget _batteryIcon() {
    IconData icon;
    if (_batteryLevel > 80) {
      icon = Icons.battery_full;
    } else if (_batteryLevel > 50) {
      icon = Icons.battery_5_bar;
    } else if (_batteryLevel > 20) {
      icon = Icons.battery_3_bar;
    } else {
      icon = Icons.battery_alert;
    }
    return Icon(icon, color: Colors.white);
  }
}

extension AlignExtension on Widget {
  Widget get center => Center(child: this);
}
