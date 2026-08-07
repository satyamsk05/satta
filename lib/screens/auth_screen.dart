import 'package:flutter/material.dart';
import '../theme.dart';
import '../models/app_data.dart';
import '../widgets/primary_button.dart';

class AuthScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;
  const AuthScreen({super.key, required this.onLoginSuccess});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _phoneController = TextEditingController();
  final _nameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _appData = AppData();

  bool _isSignUp = false;
  bool _agreedToTerms = true;
  bool _showForm = false; // Phase controller: false = splash/brand, true = input form

  @override
  void initState() {
    super.initState();
    // Smooth transition from Splash style logo to input form
    Future.delayed(const Duration(milliseconds: 1800), () {
      if (mounted) {
        setState(() {
          _showForm = true;
        });
      }
    });
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _nameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleSubmit() async {
    if (!_agreedToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please agree to the Terms of Service & Privacy Policy')),
      );
      return;
    }

    final phone = _phoneController.text.trim();
    final password = _passwordController.text.trim();
    final name = _nameController.text.trim();

    if (phone.isEmpty || password.isEmpty || (_isSignUp && name.isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields')),
      );
      return;
    }

    if (_isSignUp) {
      final success = await _appData.registerUser(phone, name, password);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration successful! Welcome.')),
        );
        widget.onLoginSuccess();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Phone number already registered. Please Login.')),
        );
      }
    } else {
      final success = await _appData.loginUser(phone, password);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login successful!')),
        );
        widget.onLoginSuccess();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Invalid phone number or password.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.center,
            radius: 1.5,
            colors: [
              Color(0xFF222225),
              Color(0xFF0F0F10),
            ],
          ),
        ),
        child: SafeArea(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 600),
            transitionBuilder: (child, animation) {
              return FadeTransition(
                opacity: animation,
                child: child,
              );
            },
            child: _showForm ? _buildLoginForm() : _buildSplashScreen(),
          ),
        ),
      ),
    );
  }

  // Phase 1: Minimal Brand Splash Screen matching the screenshot
  Widget _buildSplashScreen() {
    return Column(
      key: const ValueKey('splash_phase'),
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const SizedBox(height: 60),
        // Central Logo
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'GO',
                  style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 2.0,
                  ),
                ),
                Text(
                  'MATKA',
                  style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w900,
                    color: const Color(0xFFD4AF37), // Gold accent
                    shadows: [
                      Shadow(
                        color: const Color(0xFFD4AF37).withOpacity(0.3),
                        blurRadius: 15,
                      ),
                    ],
                    letterSpacing: 2.0,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              '100% SECURE PLAY ZONE',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: Colors.white38,
                letterSpacing: 3.0,
              ),
            ),
          ],
        ),

        // Bottom Trust Badges matching screenshot exactly
        Padding(
          padding: const EdgeInsets.only(bottom: 24.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _trustBadge(Icons.lock_outline, '256 AES', 'ENCRYPTION'),
              _trustBadge(Icons.verified_user_outlined, '100%', 'SECURED'),
              _trustBadge(Icons.language, 'ISO 27001', 'CERTIFIED'),
            ],
          ),
        ),
      ],
    );
  }

  // Phase 2: Ultra Clean Sign In Input form matching screenshot
  Widget _buildLoginForm() {
    final phone = _phoneController.text.trim();
    final password = _passwordController.text.trim();
    final name = _nameController.text.trim();
    final isButtonEnabled = phone.isNotEmpty && password.isNotEmpty && (!_isSignUp || name.isNotEmpty);

    return SingleChildScrollView(
      key: const ValueKey('login_phase'),
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 48),

          // Action Heading matching the styling
          RichText(
            text: TextSpan(
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w800,
                height: 1.3,
                color: Colors.white,
              ),
              children: [
                const TextSpan(text: 'Play '),
                TextSpan(
                  text: 'Matka',
                  style: TextStyle(color: const Color(0xFFD4AF37), shadows: [
                    Shadow(color: const Color(0xFFD4AF37).withOpacity(0.4), blurRadius: 15),
                  ]),
                ),
                const TextSpan(text: ' and \nWin '),
                const TextSpan(
                  text: 'Gold',
                  style: TextStyle(color: Color(0xFFD4AF37)),
                ),
                const TextSpan(text: ' on every game'),
              ],
            ),
          ),
          const SizedBox(height: 48),

          // Input form box
          if (_isSignUp) ...[
            const Text(
              'Enter Full Name',
              style: TextStyle(color: Colors.white60, fontSize: 12, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF161618),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white10),
              ),
              child: TextField(
                controller: _nameController,
                style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(
                  hintText: 'Your name',
                  hintStyle: TextStyle(color: Colors.white30, fontSize: 14),
                  contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  border: InputBorder.none,
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],

          const Text(
            'Enter Mobile Number',
            style: TextStyle(color: Colors.white60, fontSize: 12, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF161618),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white10),
            ),
            child: Row(
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16.0),
                  child: Row(
                    children: [
                      Text('🇮🇳', style: TextStyle(fontSize: 20)),
                      SizedBox(width: 8),
                      Text(
                        '(+91)',
                        style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                ),
                Container(width: 1, height: 24, color: Colors.white10),
                Expanded(
                  child: TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold, letterSpacing: 1.0),
                    onChanged: (_) => setState(() {}),
                    decoration: const InputDecoration(
                      hintText: 'Mobile number',
                      hintStyle: TextStyle(color: Colors.white30, fontSize: 14, letterSpacing: 0.0),
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                      border: InputBorder.none,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          const Text(
            'Enter Password',
            style: TextStyle(color: Colors.white60, fontSize: 12, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF161618),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white10),
            ),
            child: TextField(
              controller: _passwordController,
              obscureText: true,
              style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
              onChanged: (_) => setState(() {}),
              decoration: const InputDecoration(
                hintText: 'Password',
                hintStyle: TextStyle(color: Colors.white30, fontSize: 14),
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                border: InputBorder.none,
              ),
            ),
          ),
          const SizedBox(height: 32),

          // Checkbox and terms agreement row matching styling
          Row(
            children: [
              Theme(
                data: ThemeData(unselectedWidgetColor: Colors.white24),
                child: Checkbox(
                  value: _agreedToTerms,
                  activeColor: const Color(0xFFD4AF37),
                  checkColor: Colors.black,
                  onChanged: (val) {
                    setState(() {
                      _agreedToTerms = val ?? true;
                    });
                  },
                ),
              ),
              Expanded(
                child: RichText(
                  text: const TextSpan(
                    style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.w500),
                    children: [
                      TextSpan(text: 'I agree to the '),
                      TextSpan(
                        text: 'Terms of Service',
                        style: TextStyle(color: Color(0xFFD4AF37), fontWeight: FontWeight.bold),
                      ),
                      TextSpan(text: ' and '),
                      TextSpan(
                        text: 'Privacy Policy',
                        style: TextStyle(color: Color(0xFFD4AF37), fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Primary login button matching screenshot
          Opacity(
            opacity: isButtonEnabled ? 1.0 : 0.4,
            child: SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: isButtonEnabled ? _handleSubmit : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: isButtonEnabled ? const Color(0xFFD4AF37) : const Color(0xFF1E2022),
                  foregroundColor: Colors.black,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  _isSignUp ? 'CREATE ACCOUNT' : 'GET STARTED',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 0.5),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Toggle Login/SignUp mode link
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                _isSignUp ? 'Already have an account? ' : "Don't have an account? ",
                style: const TextStyle(color: Colors.white38, fontSize: 13, fontWeight: FontWeight.w500),
              ),
              GestureDetector(
                onTap: () {
                  setState(() {
                    _isSignUp = !_isSignUp;
                  });
                },
                child: Text(
                  _isSignUp ? 'Login' : 'Sign Up',
                  style: const TextStyle(
                    color: Color(0xFFD4AF37),
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _trustBadge(IconData icon, String line1, String line2) {
    return Column(
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: const Color(0xFF1A1A1C),
            shape: BoxShape.circle,
            border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.15)),
          ),
          child: Icon(icon, color: const Color(0xFFD4AF37), size: 18),
        ),
        const SizedBox(height: 8),
        Text(
          line1,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 0.5),
        ),
        const SizedBox(height: 2),
        Text(
          line2,
          style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white38, letterSpacing: 0.5),
        ),
      ],
    );
  }
}
