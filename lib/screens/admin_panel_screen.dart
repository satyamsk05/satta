import 'package:flutter/material.dart';
import '../theme.dart';
import '../models/app_data.dart';
import '../widgets/glass_card.dart';

class AdminPanelScreen extends StatefulWidget {
  const AdminPanelScreen({super.key});

  @override
  State<AdminPanelScreen> createState() => _AdminPanelScreenState();
}

class _AdminPanelScreenState extends State<AdminPanelScreen> with SingleTickerProviderStateMixin {
  final AppData _appData = AppData();
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showBalanceDialog(Map<String, dynamic> user) {
    final balanceController = TextEditingController(text: user['balance'].toString());
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text('Adjust Balance for ${user['name']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Current: ₹${user['balance'].toStringAsFixed(2)}', style: const TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 12),
              TextField(
                controller: balanceController,
                keyboardType: TextInputType.number,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                decoration: InputDecoration(
                  labelText: 'New Wallet Balance (₹)',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('CANCEL', style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () async {
                final double? newBal = double.tryParse(balanceController.text.trim());
                if (newBal != null) {
                  await _appData.adminUpdateUserBalance(user['phone'] as String, newBal);
                  if (mounted) {
                    Navigator.pop(context);
                    setState(() {});
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('User balance updated successfully!')),
                    );
                  }
                }
              },
              child: const Text('SAVE'),
            ),
          ],
        );
      },
    );
  }

  void _showOverrideResultDialog(Map<String, dynamic> market) {
    final resultController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text('Override Result: ${market['title']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          content: TextField(
            controller: resultController,
            keyboardType: TextInputType.number,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            decoration: InputDecoration(
              labelText: 'Manual Result (2 Digit)',
              hintText: 'e.g. 52',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('CANCEL', style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () {
                final result = resultController.text.trim();
                if (result.isNotEmpty) {
                  _appData.adminOverrideMarketResult(market['id'] as String, result);
                  Navigator.pop(context);
                  setState(() {});
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Result for ${market['title']} manually overridden to $result!')),
                  );
                }
              },
              child: const Text('OVERRIDE'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildSummaryCard(String title, String value, IconData icon) {
    return Expanded(
      child: GlassCard(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary, size: 20),
            const SizedBox(height: 6),
            Text(title, style: const TextStyle(color: AppColors.textSecondary, fontSize: 9, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(value, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.textPrimary)),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final users = _appData.getAllUsers();
    final allBets = _appData.getAllBets();
    final totalWalletBalance = users.fold<double>(0.0, (sum, u) => sum + (u['balance'] as double));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('OWNER ADMIN PANEL', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          indicatorColor: AppColors.primary,
          indicatorWeight: 2,
          tabs: const [
            Tab(text: 'USERS'),
            Tab(text: 'ALL BETS'),
            Tab(text: 'OVERRIDE RESULTS'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Stat Headers
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              children: [
                _buildSummaryCard('TOTAL USERS', '${users.length}', Icons.people_outline),
                const SizedBox(width: 8),
                _buildSummaryCard('ACTIVE BETS', '${allBets.length}', Icons.stars_outlined),
                const SizedBox(width: 8),
                _buildSummaryCard('TOTAL BALANCES', '₹${totalWalletBalance.toStringAsFixed(0)}', Icons.wallet_outlined),
              ],
            ),
          ),
          
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // USERS TAB
                users.isEmpty
                    ? const Center(child: Text('No users registered yet.'))
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        itemCount: users.length,
                        itemBuilder: (context, index) {
                          final u = users[index];
                          return Card(
                            elevation: 0,
                            margin: const EdgeInsets.only(bottom: 10),
                            color: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: const BorderSide(color: AppColors.border),
                            ),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: AppColors.primary.withOpacity(0.08),
                                child: const Icon(Icons.person, color: AppColors.primary, size: 18),
                              ),
                              title: Text(u['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textPrimary)),
                              subtitle: Text('+91 ${u['phone']}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    '₹${(u['balance'] as double).toStringAsFixed(2)}',
                                    style: const TextStyle(fontWeight: FontWeight.w900, color: AppColors.primary, fontSize: 13),
                                  ),
                                  const SizedBox(width: 6),
                                  const Icon(Icons.edit, size: 14, color: AppColors.textSecondary),
                                ],
                              ),
                              onTap: () => _showBalanceDialog(u),
                            ),
                          );
                        },
                      ),

                // ALL BETS TAB
                allBets.isEmpty
                    ? const Center(child: Text('No bets placed yet.'))
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        itemCount: allBets.length,
                        itemBuilder: (context, index) {
                          final b = allBets[index];
                          return Card(
                            elevation: 0,
                            margin: const EdgeInsets.only(bottom: 10),
                            color: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: const BorderSide(color: AppColors.border),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(14.0),
                              child: Row(
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        '${b['marketTitle']} - ${b['gameType']}',
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.textPrimary),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'By: ${b['userName']} (+91 ${b['userPhone']})',
                                        style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                                      ),
                                    ],
                                  ),
                                  const Spacer(),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        'Jodi: ${b['selectedNumber']}',
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.primary),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '₹${(b['points'] as double).toStringAsFixed(0)} pts',
                                        style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary, fontSize: 11),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),

                // OVERRIDE RESULTS TAB
                ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  itemCount: _appData.markets.length,
                  itemBuilder: (context, index) {
                    final m = _appData.markets[index];
                    return Card(
                      elevation: 0,
                      margin: const EdgeInsets.only(bottom: 10),
                      color: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: const BorderSide(color: AppColors.border),
                      ),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: AppColors.primary.withOpacity(0.08),
                          child: const Icon(Icons.stars, color: AppColors.primary, size: 18),
                        ),
                        title: Text(m.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textPrimary)),
                        subtitle: Text('Declared Result: ${m.currentResult}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                        trailing: const Icon(Icons.edit_note, color: AppColors.primary, size: 20),
                        onTap: () => _showOverrideResultDialog({
                          'id': m.id,
                          'title': m.title,
                          'currentResult': m.currentResult,
                        }),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
