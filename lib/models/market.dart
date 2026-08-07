class Market {
  final String id;
  final String title;
  final String openTime;
  final String closeTime;
  String currentResult; // e.g. "123-67-890" or "--- - - ---"
  final bool isOpen;

  Market({
    required this.id,
    required this.title,
    required this.openTime,
    required this.closeTime,
    required this.currentResult,
    required this.isOpen,
  });
}

class Bet {
  final String id;
  final String marketTitle;
  final String gameType; // e.g. "Single Digit", "Jodi"
  final String selectedNumber;
  final int points;
  final String status; // "Pending", "Won", "Lost"
  final DateTime dateTime;
  final String? winAmount;

  Bet({
    required this.id,
    required this.marketTitle,
    required this.gameType,
    required this.selectedNumber,
    required this.points,
    required this.status,
    required this.dateTime,
    this.winAmount,
  });
}
