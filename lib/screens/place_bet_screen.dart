import 'package:flutter/material.dart';
import '../theme.dart';
import '../models/market.dart';
import '../models/app_data.dart';

class PlaceBetScreen extends StatefulWidget {
  final Market market;
  const PlaceBetScreen({super.key, required this.market});

  @override
  State<PlaceBetScreen> createState() => _PlaceBetScreenState();
}

class _PlaceBetScreenState extends State<PlaceBetScreen> {
  final AppData _appData = AppData();
  final _pointsController = TextEditingController();
  
  String? _selectedDigit;
  String _selectedGameType = 'Jodi';
  
  final List<String> _gameTypes = [
    'Jodi',
    'Harup (Ander)',
    'Harup (Bahar)',
  ];

  @override
  void dispose() {
    _pointsController.dispose();
    super.dispose();
  }

  // Helper to generate selectable numbers based on game type
  List<String> _generateChoices() {
    if (_selectedGameType == 'Jodi') {
      return List.generate(100, (index) => index.toString().padLeft(2, '0'));
    } else {
      return List.generate(10, (index) => index.toString());
    }
  }

  // Quick points helper
  void _addQuickPoints(int amount) {
    final currentPoints = int.tryParse(_pointsController.text) ?? 0;
    setState(() {
      _pointsController.text = (currentPoints + amount).toString();
    });
  }

  void _submitBet() {
    final digit = _selectedDigit ?? '';
    final pointsText = _pointsController.text.trim();

    if (digit.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a number from the grid'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
      return;
    }

    if (pointsText.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter points'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
      return;
    }

    final points = int.tryParse(pointsText);
    if (points == null || points <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Enter a valid points amount'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
      return;
    }

    if (points > _appData.walletBalance) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Insufficient wallet balance'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
      return;
    }

    // Add Bet to State
    final newBet = Bet(
      id: 'bet_${DateTime.now().millisecondsSinceEpoch}',
      marketTitle: widget.market.title,
      gameType: _selectedGameType,
      selectedNumber: digit,
      points: points,
      status: 'Pending',
      dateTime: DateTime.now(),
    );

    _appData.addBet(newBet);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF161618),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
          side: BorderSide(color: const Color(0xFFD4AF37).withOpacity(0.2), width: 1.5),
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle),
              child: const Icon(Icons.check, color: Colors.black, size: 16),
            ),
            const SizedBox(width: 12),
            const Text(
              'Bet Placed!',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        content: RichText(
          text: TextSpan(
            style: const TextStyle(color: Colors.white70, fontSize: 14, height: 1.4),
            children: [
              const TextSpan(text: 'Your bet of '),
              TextSpan(text: '$points points ', style: const TextStyle(color: Color(0xFFD4AF37), fontWeight: FontWeight.bold)),
              const TextSpan(text: 'on number '),
              TextSpan(text: '"$digit" ', style: const TextStyle(color: Color(0xFFD4AF37), fontWeight: FontWeight.bold)),
              const TextSpan(text: 'under '),
              TextSpan(text: '$_selectedGameType ', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const TextSpan(text: 'has been successfully submitted.'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pop(context); // Go back to dashboard
            },
            child: const Text(
              'DONE',
              style: TextStyle(color: Color(0xFFD4AF37), fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final choices = _generateChoices();

    return Scaffold(
      backgroundColor: const Color(0xFF0F0F10), // Sleek Absolute Dark
      appBar: AppBar(
        title: Text(
          widget.market.title.toUpperCase(),
          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, letterSpacing: 1.0, color: Colors.white),
        ),
        backgroundColor: const Color(0xFF0F0F10),
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white70),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0, top: 10.0, bottom: 10.0),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF161618),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.account_balance_wallet_outlined, color: Color(0xFFD4AF37), size: 14),
                  const SizedBox(width: 6),
                  Text(
                    '₹${_appData.walletBalance.toStringAsFixed(2)}',
                    style: const TextStyle(
                      color: Color(0xFFD4AF37),
                      fontWeight: FontWeight.w900,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topCenter,
            radius: 1.2,
            colors: [Color(0xFF222225), Color(0xFF0F0F10)],
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Premium Wallet & Timing Card (Glassmorphic Ticket Look)
              Container(
                padding: const EdgeInsets.all(20.0),
                decoration: BoxDecoration(
                  color: const Color(0xFF161618).withOpacity(0.85),
                  borderRadius: BorderRadius.circular(20.0),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 15,
                      offset: const Offset(0, 8),
                    )
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'MARKET TIMING',
                          style: TextStyle(color: Color(0xFFD4AF37), fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.0),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.green.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.green.withOpacity(0.3)),
                          ),
                          child: const Row(
                            children: [
                              CircleAvatar(radius: 3, backgroundColor: Colors.green),
                              SizedBox(width: 6),
                              Text(
                                'OPEN',
                                style: TextStyle(color: Colors.green, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 0.5),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Open Time', style: TextStyle(color: Colors.white38, fontSize: 11, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Text(
                              widget.market.openTime,
                              style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Close Time', style: TextStyle(color: Colors.white38, fontSize: 11, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Text(
                              widget.market.closeTime,
                              style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Game Type - Premium sliding tabs instead of dropdown
              const Text(
                'SELECT GAME TYPE',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11, color: Colors.white38, letterSpacing: 1.5),
              ),
              const SizedBox(height: 10),
              Container(
                height: 50,
                decoration: BoxDecoration(
                  color: const Color(0xFF161618),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white.withOpacity(0.06)),
                ),
                padding: const EdgeInsets.all(4),
                child: Row(
                  children: _gameTypes.map((type) {
                    final isSelected = _selectedGameType == type;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedGameType = type;
                            _selectedDigit = null; // reset selection
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10),
                            color: isSelected ? const Color(0xFF222225) : Colors.transparent,
                            border: Border.all(
                              color: isSelected ? const Color(0xFFD4AF37).withOpacity(0.3) : Colors.transparent,
                            ),
                            boxShadow: isSelected
                                ? [
                                    BoxShadow(
                                      color: const Color(0xFFD4AF37).withOpacity(0.08),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    )
                                  ]
                                : [],
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            type,
                            style: TextStyle(
                              color: isSelected ? const Color(0xFFD4AF37) : Colors.white60,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 28),

              // Select Number Section with elegant styling
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _selectedGameType == 'Jodi' ? 'SELECT JODI NUMBER (00 - 99)' : 'SELECT HARUP DIGIT (0 - 9)',
                    style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11, color: Colors.white38, letterSpacing: 1.5),
                  ),
                  if (_selectedDigit != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFD4AF37).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Selected: $_selectedDigit',
                        style: const TextStyle(color: Color(0xFFD4AF37), fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    )
                ],
              ),
              const SizedBox(height: 10),

              // Premium Scrollable Grid
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF161618),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.06)),
                ),
                child: GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: _selectedGameType == 'Jodi' ? 5 : 5,
                    mainAxisSpacing: 10,
                    crossAxisSpacing: 10,
                    childAspectRatio: 1.1,
                  ),
                  itemCount: choices.length,
                  itemBuilder: (context, index) {
                    final choice = choices[index];
                    final isSelected = _selectedDigit == choice;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedDigit = choice;
                        });
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 150),
                        decoration: BoxDecoration(
                          gradient: isSelected
                              ? const LinearGradient(
                                  colors: [Color(0xFFD4AF37), Color(0xFFB8860B)],
                                )
                              : null,
                          color: isSelected ? null : const Color(0xFF222225),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isSelected ? const Color(0xFFD4AF37) : Colors.white.withOpacity(0.04),
                            width: 1,
                          ),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: const Color(0xFFD4AF37).withOpacity(0.3),
                                    blurRadius: 6,
                                    offset: const Offset(0, 3),
                                  )
                                ]
                              : [],
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          choice,
                          style: TextStyle(
                            color: isSelected ? Colors.black : Colors.white70,
                            fontWeight: FontWeight.w900,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 28),

              // Points Input & Quick Selection Buttons (Grouped in an Elegant Container)
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF161618).withOpacity(0.85),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withOpacity(0.06)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'ENTER BET POINTS',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 11, color: Colors.white38, letterSpacing: 1.5),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF222225),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.2)),
                      ),
                      child: TextField(
                        controller: _pointsController,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 0.5),
                        onChanged: (_) => setState(() {}),
                        decoration: InputDecoration(
                          prefixIcon: const Icon(Icons.monetization_on_outlined, color: Color(0xFFD4AF37), size: 22),
                          suffixIcon: _pointsController.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.backspace_outlined, color: Color(0xFFD4AF37), size: 16),
                                  onPressed: () {
                                    setState(() {
                                      _pointsController.clear();
                                    });
                                  },
                                )
                              : null,
                          hintText: 'Enter bet points amount (Min 10)',
                          hintStyle: const TextStyle(color: Colors.white24, fontSize: 13, letterSpacing: 0.0),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Quick points list - Styled as luxury poker chips
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _quickPointButton('+100', 100),
                        _quickPointButton('+500', 500),
                        _quickPointButton('+1K', 1000),
                        _quickPointButton('+5K', 5000),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 36),

              // Premium Submit Button (Glowing transition based on form completeness)
              GestureDetector(
                onTap: _submitBet,
                child: AnimatedOpacity(
                  duration: const Duration(milliseconds: 200),
                  opacity: (_selectedDigit != null && _pointsController.text.isNotEmpty) ? 1.0 : 0.5,
                  child: Container(
                    width: double.infinity,
                    height: 56,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(28),
                      gradient: const LinearGradient(
                        colors: [Color(0xFFD4AF37), Color(0xFFB8860B)],
                      ),
                      boxShadow: (_selectedDigit != null && _pointsController.text.isNotEmpty)
                          ? [
                              BoxShadow(
                                color: const Color(0xFFD4AF37).withOpacity(0.4),
                                blurRadius: 20,
                                offset: const Offset(0, 6),
                              ),
                            ]
                          : [],
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const SizedBox(width: 32),
                        const Text(
                          'PLACE BET',
                          style: TextStyle(color: Colors.black, fontWeight: FontWeight.w900, fontSize: 14, letterSpacing: 1.0),
                        ),
                        Container(
                          width: 30,
                          height: 30,
                          decoration: const BoxDecoration(color: Colors.black12, shape: BoxShape.circle),
                          child: const Icon(Icons.arrow_forward, color: Colors.black, size: 15),
                        )
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _quickPointButton(String label, int value) {
    return GestureDetector(
      onTap: () => _addQuickPoints(value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFF222225),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.25)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 4,
              offset: const Offset(0, 2),
            )
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.add, color: Color(0xFFD4AF37), size: 10),
            const SizedBox(width: 2),
            Text(
              label.replaceAll('+', ''),
              style: const TextStyle(
                color: Color(0xFFD4AF37),
                fontWeight: FontWeight.w900,
                fontSize: 12,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
