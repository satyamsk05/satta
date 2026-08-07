import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:matka/main.dart';
import 'package:matka/models/app_data.dart';

void main() {
  testWidgets('MatkaApp smoke test', (WidgetTester tester) async {
    // Mock initial shared preferences values
    SharedPreferences.setMockInitialValues({
      'logged_in_user_phone': '9876543210',
      'logged_in_user_name': 'Satyam Kumar',
      'user_9876543210_name': 'Satyam Kumar',
      'user_9876543210_balance': 25000.0,
    });

    // Build our app and trigger a frame.
    await tester.pumpWidget(const MatkaApp());
    // Settle async timers and animations
    await tester.pumpAndSettle();

    // Verify that the welcome text is shown.
    expect(find.text('WELCOME BACK'), findsOneWidget);

    // Cancel timer to prevent test failure on pending timers
    AppData().cancelTimer();
  });
}
