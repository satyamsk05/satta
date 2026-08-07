import 'package:flutter/material.dart';
import '../theme.dart';
import '../models/app_data.dart';
import '../widgets/glass_card.dart';

class BetHistoryScreen extends StatefulWidget {
  const BetHistoryScreen({super.key});

  @override
  State<BetHistoryScreen> createState() => _BetHistoryScreenState();
}

class _BetHistoryScreenState extends State<BetHistoryScreen> {
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
    final history = _appData.betHistory;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('BET HISTORY'),
        backgroundColor: AppColors.background,
        elevation: 0,
        automaticallyImplyLeading: false,
      ),
      body: history.isEmpty
          ? const Center(
              child: Text(
                'No bets placed yet.',
                style: TextStyle(color: AppColors.textSecondary),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: history.length,
              itemBuilder: (context, index) {
                final bet = history[index];
                final isWon = bet.status == 'Won';
                final isLost = bet.status == 'Lost';

                Color statusColor = AppColors.primary;
                if (isWon) statusColor = AppColors.success;
                if (isLost) statusColor = const Color(0xFFFF6B6B);

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: GlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              bet.marketTitle,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: statusColor.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(color: statusColor.withOpacity(0.3)),
                              ),
                              child: Text(
                                bet.status.toUpperCase(),
                                style: TextStyle(
                                  color: statusColor,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Game: ${bet.gameType} | Selected: ${bet.selectedNumber}',
                          style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
                        ),
                        const Divider(color: Colors.white10, height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Points: ${bet.points}',
                              style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                            ),
                            if (isWon && bet.winAmount != null)
                              Text(
                                'Won: ₹${bet.winAmount}',
                                style: const TextStyle(
                                  color: AppColors.success,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
