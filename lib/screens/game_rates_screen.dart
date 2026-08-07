import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/glass_card.dart';

class GameRatesScreen extends StatelessWidget {
  const GameRatesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> rates = [
      {'game': 'Single Digit', 'rate': '1 : 9.5'},
      {'game': 'Jodi', 'rate': '1 : 95'},
      {'game': 'Single Pana', 'rate': '1 : 140'},
      {'game': 'Double Pana', 'rate': '1 : 280'},
      {'game': 'Triple Pana', 'rate': '1 : 600'},
      {'game': 'Half Sangam', 'rate': '1 : 1000'},
      {'game': 'Full Sangam', 'rate': '1 : 10000'},
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('GAME RATES', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: AppColors.background,
        elevation: 0,
        automaticallyImplyLeading: false,
        centerTitle: true,
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(20.0),
        itemCount: rates.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 14,
          mainAxisSpacing: 14,
          childAspectRatio: 1.4,
        ),
        itemBuilder: (context, index) {
          final item = rates[index];
          return GlassCard(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.08),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.percent, color: AppColors.primary, size: 14),
                    ),
                    const Text(
                      'RATE',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  item['game']!,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        color: AppColors.textPrimary,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  item['rate']!,
                  style: const TextStyle(
                    color: AppColors.success,
                    fontWeight: FontWeight.w900,
                    fontSize: 15,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
