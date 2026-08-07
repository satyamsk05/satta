import 'package:flutter/material.dart';
import '../theme.dart';
import '../models/app_data.dart';
import '../widgets/glass_card.dart';
import '../widgets/primary_button.dart';
import 'admin_panel_screen.dart';
import 'theme_settings_screen.dart';

// --- DEPOSIT SCREEN ---
class DepositScreen extends StatefulWidget {
  const DepositScreen({super.key});

  @override
  State<DepositScreen> createState() => _DepositScreenState();
}

class _DepositScreenState extends State<DepositScreen> {
  final _amountController = TextEditingController();
  final AppData _appData = AppData();
  String _selectedMethod = 'GPay';

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  void _handleDeposit() {
    final amount = double.tryParse(_amountController.text.trim());
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid deposit amount')),
      );
      return;
    }
    _appData.deposit(amount);
    _amountController.clear();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Successfully deposited ₹${amount.toStringAsFixed(2)} via $_selectedMethod!')),
    );
  }

  void _quickFill(String amount) {
    setState(() {
      _amountController.text = amount;
    });
  }

  @override
  Widget build(BuildContext context) {
    final paymentMethods = [
      {
        'name': 'GPay',
        'logoUrl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png'
      },
      {
        'name': 'PhonePe',
        'logoUrl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png'
      },
      {
        'name': 'Paytm',
        'logoUrl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo.logo.svg/512px-Paytm_Logo.logo.svg.png'
      },
      {
        'name': 'UPI ID',
        'logoUrl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png'
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('DEPOSIT MONEY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Current Balance Header Card
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Current Balance', style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w500)),
                  const SizedBox(height: 8),
                  Text(
                    '₹ ${_appData.walletBalance.toStringAsFixed(2)}',
                    style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Enter Amount
            const Text(
              'ENTER DEPOSIT AMOUNT',
              style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary, fontSize: 11, letterSpacing: 1.0),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
              decoration: InputDecoration(
                prefixText: '₹ ',
                prefixStyle: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                hintText: 'Enter amount (e.g. 500)',
                hintStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 14, fontWeight: FontWeight.normal),
                filled: true,
                fillColor: AppColors.surface,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.primary, width: 1.2),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Quick Fill Amount Row
            Wrap(
              spacing: 8,
              children: ['100', '500', '1000', '2000', '5000'].map<Widget>((amt) {
                return ActionChip(
                  label: Text('+₹$amt', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 11)),
                  backgroundColor: AppColors.surface,
                  side: const BorderSide(color: AppColors.border),
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                  onPressed: () => _quickFill(amt),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Payment Methods Selection Grid
            const Text(
              'SELECT PAYMENT METHOD',
              style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary, fontSize: 11, letterSpacing: 1.0),
            ),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: paymentMethods.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 2.2,
              ),
              itemBuilder: (context, index) {
                final method = paymentMethods[index];
                final isSelected = _selectedMethod == method['name'];
                return GestureDetector(
                  onTap: () => setState(() => _selectedMethod = method['name'] as String),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.primary.withOpacity(0.06) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? AppColors.primary : AppColors.border,
                        width: isSelected ? 1.5 : 1.0,
                      ),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    child: Row(
                      children: [
                        Image.network(
                          method['logoUrl'] as String,
                          height: 20,
                          width: 40,
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) {
                            return const Icon(Icons.payment, size: 20, color: AppColors.textSecondary);
                          },
                        ),
                        const SizedBox(width: 10),
                        Text(
                          method['name'] as String,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: isSelected ? AppColors.primary : AppColors.textPrimary,
                          ),
                        ),
                        const Spacer(),
                        if (isSelected)
                          const Icon(Icons.check_circle, color: AppColors.primary, size: 16),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 28),

            PrimaryButton(
              text: 'DEPOSIT NOW',
              borderRadius: 10,
              onPressed: _handleDeposit,
            ),
          ],
        ),
      ),
    );
  }
}

// --- WITHDRAWAL SCREEN ---
class WithdrawalScreen extends StatefulWidget {
  const WithdrawalScreen({super.key});

  @override
  State<WithdrawalScreen> createState() => _WithdrawalScreenState();
}

class _WithdrawalScreenState extends State<WithdrawalScreen> {
  final _amountController = TextEditingController();
  final _upiController = TextEditingController();
  final _bankNameController = TextEditingController();
  final _holderNameController = TextEditingController();
  final _accountNoController = TextEditingController();
  final _ifscController = TextEditingController();

  final AppData _appData = AppData();
  String _withdrawalMethod = 'UPI'; // UPI or BANK

  @override
  void initState() {
    super.initState();
    _upiController.text = _appData.savedUpiId;
    _bankNameController.text = _appData.savedBankName;
    _holderNameController.text = _appData.savedHolderName;
    _accountNoController.text = _appData.savedAccountNo;
    _ifscController.text = _appData.savedIfsc;
  }

  @override
  void dispose() {
    _amountController.dispose();
    _upiController.dispose();
    _bankNameController.dispose();
    _holderNameController.dispose();
    _accountNoController.dispose();
    _ifscController.dispose();
    super.dispose();
  }

  void _handleWithdraw() {
    final amount = double.tryParse(_amountController.text.trim());

    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid withdrawal amount')),
      );
      return;
    }
    if (amount > _appData.walletBalance) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Insufficient balance to withdraw')),
      );
      return;
    }

    if (_withdrawalMethod == 'UPI') {
      final upi = _upiController.text.trim();
      if (upi.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please enter a valid UPI ID')),
        );
        return;
      }
      _appData.saveUpiId(upi);
    } else {
      if (!_appData.isBankAdded) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please add a bank account first')),
        );
        return;
      }
    }

    _appData.withdraw(amount);
    _amountController.clear();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Withdrawal request of ₹${amount.toStringAsFixed(2)} submitted successfully!')),
    );
  }

  void _quickFill(String amount) {
    setState(() {
      _amountController.text = amount;
    });
  }

  void _showAddBankSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(context).viewInsets.bottom + 20),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'ADD BANK ACCOUNT',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textPrimary),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    )
                  ],
                ),
                const SizedBox(height: 16),
                _inputField(controller: _bankNameController, hint: 'Bank Name (e.g. State Bank of India)'),
                _inputField(controller: _holderNameController, hint: 'Account Holder Name'),
                _inputField(controller: _accountNoController, hint: 'Account Number', type: TextInputType.number),
                _inputField(controller: _ifscController, hint: 'IFSC Code (e.g. SBIN0001234)'),
                const SizedBox(height: 16),
                PrimaryButton(
                  text: 'SAVE BANK DETAILS',
                  borderRadius: 10,
                  onPressed: () async {
                    if (_bankNameController.text.isEmpty ||
                        _holderNameController.text.isEmpty ||
                        _accountNoController.text.isEmpty ||
                        _ifscController.text.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Please fill all bank details')),
                      );
                      return;
                    }
                    await _appData.saveBankDetails(
                      _bankNameController.text.trim(),
                      _holderNameController.text.trim(),
                      _accountNoController.text.trim(),
                      _ifscController.text.trim(),
                    );
                    if (mounted) {
                      setState(() {});
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Bank details saved successfully!')),
                      );
                    }
                  },
                )
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _inputField({required TextEditingController controller, required String hint, TextInputType type = TextInputType.text}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: TextField(
        controller: controller,
        keyboardType: type,
        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.normal),
          filled: true,
          fillColor: AppColors.surface,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: AppColors.primary, width: 1.2),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('WITHDRAW MONEY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Available Balance
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Available Balance', style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w500)),
                  const SizedBox(height: 8),
                  Text(
                    '₹ ${_appData.walletBalance.toStringAsFixed(2)}',
                    style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Withdraw Amount Input
            const Text(
              'WITHDRAWAL AMOUNT',
              style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary, fontSize: 11, letterSpacing: 1.0),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
              decoration: InputDecoration(
                prefixText: '₹ ',
                prefixStyle: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                hintText: 'Enter amount to withdraw',
                hintStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 14, fontWeight: FontWeight.normal),
                filled: true,
                fillColor: AppColors.surface,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.primary, width: 1.2),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Quick Fill Chips
            Wrap(
              spacing: 8,
              children: ['500', '1000', '2000', '5000', '10000'].map<Widget>((amt) {
                return ActionChip(
                  label: Text('+₹$amt', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 11)),
                  backgroundColor: AppColors.surface,
                  side: const BorderSide(color: AppColors.border),
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                  onPressed: () => _quickFill(amt),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // Method Selector Toggle
            const Text(
              'WITHDRAWAL METHOD',
              style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary, fontSize: 11, letterSpacing: 1.0),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _withdrawalMethod = 'UPI'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: _withdrawalMethod == 'UPI' ? AppColors.primary.withOpacity(0.06) : Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: _withdrawalMethod == 'UPI' ? AppColors.primary : AppColors.border,
                          width: _withdrawalMethod == 'UPI' ? 1.5 : 1.0,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          'UPI Transfer',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: _withdrawalMethod == 'UPI' ? AppColors.primary : AppColors.textPrimary,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _withdrawalMethod = 'BANK'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: _withdrawalMethod == 'BANK' ? AppColors.primary.withOpacity(0.06) : Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: _withdrawalMethod == 'BANK' ? AppColors.primary : AppColors.border,
                          width: _withdrawalMethod == 'BANK' ? 1.5 : 1.0,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          'Bank Account',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: _withdrawalMethod == 'BANK' ? AppColors.primary : AppColors.textPrimary,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Dynamic Inputs depending on Method
            if (_withdrawalMethod == 'UPI') ...[
              const Text(
                'UPI INFORMATION',
                style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary, fontSize: 11, letterSpacing: 1.0),
              ),
              const SizedBox(height: 8),
              _inputField(controller: _upiController, hint: 'Enter UPI ID (e.g. name@upi)'),
            ] else ...[
              const Text(
                'BANK ACCOUNT DETAILS',
                style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary, fontSize: 11, letterSpacing: 1.0),
              ),
              const SizedBox(height: 8),
              if (!_appData.isBankAdded)
                GestureDetector(
                  onTap: _showAddBankSheet,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.border, style: BorderStyle.solid),
                    ),
                    child: const Column(
                      children: [
                        Icon(Icons.add_circle_outline, color: AppColors.primary, size: 28),
                        SizedBox(height: 8),
                        Text(
                          'ADD BANK ACCOUNT DETAILS',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            letterSpacing: 0.5,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Click to add Bank Name, Account No, & IFSC Code',
                          style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                )
              else
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.08),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.account_balance, color: AppColors.primary, size: 20),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _appData.savedBankName,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textPrimary),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'A/C: ${_appData.savedAccountNo.length > 4 ? '******' + _appData.savedAccountNo.substring(_appData.savedAccountNo.length - 4) : _appData.savedAccountNo}',
                              style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                            ),
                            Text(
                              'Holder: ${_appData.savedHolderName} | IFSC: ${_appData.savedIfsc}',
                              style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () async {
                          await _appData.removeBankDetails();
                          setState(() {
                            _bankNameController.clear();
                            _holderNameController.clear();
                            _accountNoController.clear();
                            _ifscController.clear();
                          });
                        },
                        child: const Text('Change', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 12)),
                      ),
                    ],
                  ),
                ),
            ],
            const SizedBox(height: 24),

            PrimaryButton(
              text: 'WITHDRAW NOW',
              borderRadius: 10,
              onPressed: _handleWithdraw,
            ),
          ],
        ),
      ),
    );
  }
}

// --- PROFILE SCREEN ---
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final AppData appData = AppData();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('MY PROFILE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: AppColors.background,
        elevation: 0,
        automaticallyImplyLeading: false,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
        child: Column(
          children: [
            // Avatar & Basic Info
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.surface,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.border, width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.02),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(Icons.person_outline, size: 36, color: AppColors.primary),
            ),
            const SizedBox(height: 16),
            Text(
              appData.currentUserName ?? 'User',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 4),
            Text(
              appData.currentUserPhone != null ? '+91 ${appData.currentUserPhone}' : '+91 9876543210',
              style: const TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w600, fontSize: 12),
            ),
            const SizedBox(height: 8),
            // Verified Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.success.withOpacity(0.08),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: AppColors.success.withOpacity(0.2)),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.verified, size: 12, color: AppColors.success),
                  SizedBox(width: 4),
                  Text('VERIFIED USER', style: TextStyle(color: AppColors.success, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Profile Quick Stats Card
            GlassCard(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _statsColumn('${appData.betHistory.length * 3 + 12}', 'Games Played'),
                  _statsColumn('${appData.betHistory.where((b) => b.status == 'Won').length}', 'Winning Bets'),
                  _statsColumn('12', 'Referrals'),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Settings List
            GlassCard(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Material(
                color: Colors.transparent,
                child: Column(
                  children: [
                    _profileItem(context, Icons.share_outlined, 'Refer & Earn', 'Get 500 bonus points', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const ReferAndEarnScreen()));
                    }),
                    const Divider(color: AppColors.border, height: 1),
                    _profileItem(context, Icons.menu_book_outlined, 'Rules & Regulations', 'Read game guidelines', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const RulesScreen()));
                    }),
                    const Divider(color: AppColors.border, height: 1),
                    _profileItem(context, Icons.security_outlined, 'Privacy Policy', 'Check terms & security', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const PrivacyPolicyScreen()));
                    }),
                    const Divider(color: AppColors.border, height: 1),
                    _profileItem(context, Icons.admin_panel_settings_outlined, 'Admin Panel', 'Owner dashboard & override controls', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const AdminPanelScreen()));
                    }),
                    const Divider(color: AppColors.border, height: 1),
                    _profileItem(context, Icons.palette_outlined, 'Theme & Animations', 'Customize premium app colors and dynamic icons', () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const ThemeSettingsScreen()));
                    }),
                    const Divider(color: AppColors.border, height: 1),
                    _profileItem(context, Icons.logout, 'Log Out', 'Sign out of account', () {
                      appData.logout();
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Logged out successfully!')),
                      );
                    }),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _statsColumn(String value, String label) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _profileItem(BuildContext context, IconData icon, String title, String subtitle, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: AppColors.textSecondary, size: 20),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textPrimary, fontSize: 14)),
      subtitle: Text(subtitle, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
      trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 16),
      onTap: onTap,
    );
  }
}

// --- REFER & EARN SCREEN ---
class ReferAndEarnScreen extends StatelessWidget {
  const ReferAndEarnScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('REFER & EARN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Referral Stats Card
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('YOUR STATS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.textSecondary, letterSpacing: 1.0)),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _statItem('Total Referrals', '12'),
                      _statItem('Earned Points', '6,000'),
                      _statItem('Pending Joins', '3'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // How It Works Card
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('HOW IT WORKS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.textSecondary, letterSpacing: 1.0)),
                  const SizedBox(height: 16),
                  _stepItem(Icons.share_outlined, 'Step 1: Share Link', 'Send your referral code or custom registration link to your friends.'),
                  const SizedBox(height: 12),
                  _stepItem(Icons.app_registration, 'Step 2: Friend Joins', 'Your friend registers on the app using your unique code.'),
                  const SizedBox(height: 12),
                  _stepItem(Icons.account_balance_wallet_outlined, 'Step 3: Friend Deposits', 'Your friend completes their first wallet deposit of 500+ points.'),
                  const SizedBox(height: 12),
                  _stepItem(Icons.stars_outlined, 'Step 4: Earn Points', 'You instantly get 500 bonus points credited to your wallet!'),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Code & Action Card
            GlassCard(
              child: Column(
                children: [
                  const Text('YOUR REFERRAL CODE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.textSecondary, letterSpacing: 0.5)),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('SATYAM500', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, letterSpacing: 1.0, color: AppColors.primary)),
                        Icon(Icons.copy, size: 18, color: AppColors.primary),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            PrimaryButton(
              text: 'SHARE REFERRAL LINK',
              borderRadius: 10,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Referral link copied to clipboard!')),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _statItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w500)),
      ],
    );
  }

  Widget _stepItem(IconData icon, String title, String desc) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: AppColors.primary, size: 20),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textPrimary)),
              const SizedBox(height: 2),
              Text(desc, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, height: 1.3)),
            ],
          ),
        )
      ],
    );
  }
}

// --- RULES SCREEN ---
class RulesScreen extends StatelessWidget {
  const RulesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('RULES & REGULATIONS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Payout Rates Card
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('WINNING PAYOUT RATES', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.textSecondary, letterSpacing: 1.0)),
                  const SizedBox(height: 16),
                  _rateRow('Single Digit / Haruf', '1 : 9.5', '10 pts wins 95 pts'),
                  const Divider(color: AppColors.border, height: 24),
                  _rateRow('Jodi (Double Digit)', '1 : 95', '10 pts wins 950 pts'),
                  const Divider(color: AppColors.border, height: 24),
                  _rateRow('Single Pana (Panel)', '1 : 140', '10 pts wins 1400 pts'),
                  const Divider(color: AppColors.border, height: 24),
                  _rateRow('Double Pana', '1 : 280', '10 pts wins 2800 pts'),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Gameplay Rules Card
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('DETAILED GAMEPLAY RULES', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.textSecondary, letterSpacing: 1.0)),
                  const SizedBox(height: 16),
                  _ruleItem('1. Betting Timing Limits', 'Every market (Desawar, Gali, Faridabad, etc.) locks placing bets exactly 15 minutes before the draw result time. No bets will be accepted after the market closing countdown is over.'),
                  const SizedBox(height: 12),
                  _ruleItem('2. Valid Numbers and Input Validation', 'Make sure to select digits inside the correct mathematical range. Jodi requires exactly two digits (00-99). Single digit requires one digit (0-9). In case of incorrect digit counts, your transaction will fail.'),
                  const SizedBox(height: 12),
                  _ruleItem('3. Payout Processing & Autocredit', 'Winning numbers are fetched directly from official draws. Point returns will be automatically calculated and added directly into your wallet balance within 10-15 minutes of result publications.'),
                  const SizedBox(height: 12),
                  _ruleItem('4. Cancellation Policy', 'Once submitted, a bet cannot be cancelled, modified, or refunded under any circumstances. Please check your chosen numbers carefully before clicking submit.'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _rateRow(String game, String rate, String example) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(game, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textPrimary)),
            const SizedBox(height: 2),
            Text(example, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
          ],
        ),
        Text(rate, style: const TextStyle(color: AppColors.success, fontWeight: FontWeight.bold, fontSize: 14)),
      ],
    );
  }

  Widget _ruleItem(String title, String desc) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textPrimary)),
        const SizedBox(height: 4),
        Text(desc, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, height: 1.4)),
      ],
    );
  }
}

// --- PRIVACY POLICY SCREEN ---
class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('PRIVACY POLICY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: GlassCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('PRIVACY & TERMS POLICY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.textSecondary, letterSpacing: 1.0)),
              const SizedBox(height: 16),
              _policySection('1. Personal Data Collection', 'We only collect essential account details during registration (your mobile number and profile name) to authenticate logins and associate wallet balances. We do not gather cookies, location data, or contact list details.'),
              const Divider(color: AppColors.border, height: 24),
              _policySection('2. Transactional and Financial Logs', 'All deposits, points calculations, withdrawal requests, and bet histories are stored securely on our servers. We employ bank-level encryption standards to protect log details. We do not store your bank account passwords, card pins, or UPI transaction passwords.'),
              const Divider(color: AppColors.border, height: 24),
              _policySection('3. Third-party Data Sharing', 'We enforce a strict zero-sharing policy. We do not sell or leak user phone numbers, transaction logs, or profile details to third-party advertising companies, marketing entities, or analytical databases.'),
              const Divider(color: AppColors.border, height: 24),
              _policySection('4. Legal Compliance and Responsibility', 'Users are requested to play responsibly and comply with their local jurisdiction guidelines. Gaming and Satta operations might be restricted in specific regions. The user is solely responsible for ensuring absolute legal compliance before placing point stakes.'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _policySection(String title, String desc) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        Text(desc, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, height: 1.4)),
      ],
    );
  }
}

// --- SUPPORT SCREEN ---
class SupportScreen extends StatelessWidget {
  const SupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('SUPPORT & HELP', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: AppColors.background,
        elevation: 0,
        automaticallyImplyLeading: false,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'NEED ASSISTANCE?',
              style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary, fontSize: 11, letterSpacing: 1.0),
            ),
            const SizedBox(height: 12),
            GlassCard(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Material(
                color: Colors.transparent,
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.chat_bubble_outline, color: AppColors.success, size: 20),
                      title: const Text('WhatsApp Support', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      subtitle: const Text('Instant chat support 24/7'),
                      trailing: const Icon(Icons.chevron_right, size: 16),
                      onTap: () {},
                    ),
                    const Divider(color: AppColors.border, height: 1),
                    ListTile(
                      leading: const Icon(Icons.phone_outlined, color: AppColors.primary, size: 20),
                      title: const Text('Customer Helpline', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      subtitle: const Text('Call our support executives'),
                      trailing: const Icon(Icons.chevron_right, size: 16),
                      onTap: () {},
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 28),
            const Text(
              'FREQUENTLY ASKED QUESTIONS',
              style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary, fontSize: 11, letterSpacing: 1.0),
            ),
            const SizedBox(height: 12),
            GlassCard(
              padding: EdgeInsets.zero,
              child: Material(
                color: Colors.transparent,
                child: Column(
                  children: [
                    Theme(
                      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                      child: const ExpansionTile(
                        title: Text('How to deposit money?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        children: [
                          Padding(
                            padding: EdgeInsets.only(left: 16.0, right: 16.0, bottom: 16.0),
                            child: Text(
                              'You can deposit money using UPI, Bank Card, or Net banking by clicking the DEPOSIT button on the dashboard.',
                              style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                            ),
                          )
                        ],
                      ),
                    ),
                    const Divider(color: AppColors.border, height: 1),
                    Theme(
                      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                      child: const ExpansionTile(
                        title: Text('When do I get withdrawal?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        children: [
                          Padding(
                            padding: EdgeInsets.only(left: 16.0, right: 16.0, bottom: 16.0),
                            child: Text(
                              'Withdrawals are processed within 2-4 hours and transferred directly to your bank account or UPI ID.',
                              style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                            ),
                          )
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
