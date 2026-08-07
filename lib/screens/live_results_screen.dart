import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/glass_card.dart';

class LiveResultsScreen extends StatelessWidget {
  const LiveResultsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock historical results matching Satta King (2-digit Jodi numbers)
    final List<Map<String, dynamic>> history = [
      {
        'date': 'Wednesday, 05 Aug 2026',
        'results': [
          {'market': 'DESAWAR', 'result': '52'},
          {'market': 'DELHI BAZAR', 'result': '19'},
          {'market': 'SHRI GANESH', 'result': '83'},
          {'market': 'FARIDABAD', 'result': '57'},
        ]
      },
      {
        'date': 'Tuesday, 04 Aug 2026',
        'results': [
          {'market': 'DESAWAR', 'result': '70'},
          {'market': 'DELHI BAZAR', 'result': '12'},
          {'market': 'SHRI GANESH', 'result': '93'},
          {'market': 'FARIDABAD', 'result': '18'},
          {'market': 'GHAZIABAD', 'result': '45'},
          {'market': 'GALI', 'result': '88'},
          {'market': 'TAJ', 'result': '26'},
        ]
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('LIVE RESULTS HISTORY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: AppColors.background,
        elevation: 0,
        automaticallyImplyLeading: false,
        centerTitle: true,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
        itemCount: history.length,
        itemBuilder: (context, index) {
          final dayData = history[index];
          final resultsList = dayData['results'] as List;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 14.0),
                child: Row(
                  children: [
                    const Icon(Icons.calendar_month, color: AppColors.primary, size: 16),
                    const SizedBox(width: 8),
                    Text(
                      dayData['date'],
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ],
                ),
              ),
              // Results Grid (2 Columns)
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: resultsList.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 2.2,
                ),
                itemBuilder: (context, idx) {
                  final res = resultsList[idx];
                  return GlassCard(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          res['market'],
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            color: AppColors.textPrimary,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Result:',
                              style: TextStyle(color: AppColors.textSecondary, fontSize: 10),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withOpacity(0.08),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppColors.primary.withOpacity(0.15)),
                              ),
                              child: Text(
                                res['result'],
                                style: const TextStyle(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
              const SizedBox(height: 10),
            ],
          );
        },
      ),
    );
  }
}
