import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:html/parser.dart' as html_parser;
import 'market.dart';

class AppData extends ChangeNotifier {
  static final AppData _instance = AppData._internal();
  factory AppData() => _instance;
  AppData._internal() {
    _initPreferences();
    _startLiveResultTimer();
  }

  SharedPreferences? _prefs;
  String? _currentUserPhone;
  String? _currentUserName;
  double _walletBalance = 0.0;
  List<Bet> _betHistory = [];
  Timer? _liveTimer;
  String _currentTheme = 'royalLight';

  // Persisted Bank Details per user
  bool _isBankAdded = false;
  String _savedBankName = '';
  String _savedHolderName = '';
  String _savedAccountNo = '';
  String _savedIfsc = '';
  String _savedUpiId = '';

  final List<Market> _markets = [
    Market(id: '1', title: 'DESAWAR', openTime: '10:00 PM', closeTime: '05:00 AM', currentResult: '52', isOpen: true),
    Market(id: '2', title: 'DELHI BAZAR', openTime: '11:00 AM', closeTime: '03:00 PM', currentResult: '19', isOpen: true),
    Market(id: '3', title: 'SHRI GANESH', openTime: '12:00 PM', closeTime: '04:30 PM', currentResult: '83', isOpen: true),
    Market(id: '4', title: 'FARIDABAD', openTime: '02:00 PM', closeTime: '06:00 PM', currentResult: '57', isOpen: true),
    Market(id: '5', title: 'GHAZIABAD', openTime: '04:00 PM', closeTime: '08:30 PM', currentResult: 'Waiting...', isOpen: true),
    Market(id: '6', title: 'GALI', openTime: '06:00 PM', closeTime: '11:50 PM', currentResult: 'Waiting...', isOpen: true),
    Market(id: '7', title: 'TAJ', openTime: '12:30 PM', closeTime: '03:15 PM', currentResult: '42', isOpen: true),
  ];

  bool _isInitialized = false;
  bool get isInitialized => _isInitialized;

  String? get currentUserPhone => _currentUserPhone;
  String? get currentUserName => _currentUserName;
  double get walletBalance => _walletBalance;
  List<Market> get markets => _markets;
  List<Bet> get betHistory => _betHistory;
  String get currentTheme => _currentTheme;

  // Bank Getters
  bool get isBankAdded => _isBankAdded;
  String get savedBankName => _savedBankName;
  String get savedHolderName => _savedHolderName;
  String get savedAccountNo => _savedAccountNo;
  String get savedIfsc => _savedIfsc;
  String get savedUpiId => _savedUpiId;

  Future<void> setTheme(String theme) async {
    _currentTheme = theme;
    await _prefs?.setString('app_theme_mode', theme);
    notifyListeners();
  }

  Future<void> _initPreferences() async {
    _prefs = await SharedPreferences.getInstance();
    _currentUserPhone = _prefs?.getString('logged_in_user_phone');
    _currentUserName = _prefs?.getString('logged_in_user_name');
    _currentTheme = _prefs?.getString('app_theme_mode') ?? 'royalLight';
    if (_currentUserPhone != null) {
      _loadUserData();
    }
    _isInitialized = true;
    notifyListeners();
    fetchLiveResults();
  }

  void _startLiveResultTimer() {
    _liveTimer?.cancel();
    _liveTimer = Timer.periodic(const Duration(seconds: 30), (timer) {
      fetchLiveResults();
    });
  }

  Future<void> fetchLiveResults() async {
    try {
      final url = Uri.parse('https://api.allorigins.win/get?url=${Uri.encodeComponent('https://satta-king-fast.com/')}');
      final response = await http.get(url).timeout(const Duration(seconds: 10));
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final htmlContent = data['contents'] as String;
        final document = html_parser.parse(htmlContent);
        final rows = document.querySelectorAll('tr.game-result');
        
        for (var row in rows) {
          final nameElement = row.querySelector('.game-name');
          final todayElement = row.querySelector('.today-number h3');
          
          if (nameElement != null && todayElement != null) {
            final name = nameElement.text.trim().toUpperCase();
            final result = todayElement.text.trim();
            
            for (var market in _markets) {
              if (name == market.title || market.title.contains(name) || name.contains(market.title)) {
                if (result != '--' && result != 'XX' && result.isNotEmpty) {
                  market.currentResult = result;
                }
              }
            }
          }
        }
        notifyListeners();
      }
    } catch (e) {
      // Fallback
    }
  }

  void _loadUserData() {
    if (_prefs == null || _currentUserPhone == null) return;
    _walletBalance = _prefs!.getDouble('user_${_currentUserPhone}_balance') ?? 25000.0;
    _currentUserName = _prefs!.getString('user_${_currentUserPhone}_name') ?? 'User';
    
    // Load bank details
    _isBankAdded = _prefs!.getBool('user_${_currentUserPhone}_bank_added') ?? false;
    _savedBankName = _prefs!.getString('user_${_currentUserPhone}_bank_name') ?? '';
    _savedHolderName = _prefs!.getString('user_${_currentUserPhone}_holder_name') ?? '';
    _savedAccountNo = _prefs!.getString('user_${_currentUserPhone}_account_no') ?? '';
    _savedIfsc = _prefs!.getString('user_${_currentUserPhone}_ifsc') ?? '';
    _savedUpiId = _prefs!.getString('user_${_currentUserPhone}_upi_id') ?? '';

    final betHistoryJson = _prefs!.getString('user_${_currentUserPhone}_bets');
    if (betHistoryJson != null) {
      try {
        final List<dynamic> decoded = json.decode(betHistoryJson);
        _betHistory = decoded.map((item) => Bet(
          id: item['id'] ?? '',
          marketTitle: item['marketTitle'] ?? '',
          gameType: item['gameType'] ?? '',
          selectedNumber: item['selectedNumber'] ?? '',
          points: (item['points'] ?? 0).toDouble(),
          status: item['status'] ?? 'Pending',
          dateTime: DateTime.parse(item['dateTime'] ?? DateTime.now().toIso8601String()),
          winAmount: item['winAmount'],
        )).toList();
      } catch (e) {
        _betHistory = [];
      }
    } else {
      _betHistory = [];
    }
  }

  Future<void> _saveUserData() async {
    if (_prefs == null || _currentUserPhone == null) return;
    await _prefs!.setDouble('user_${_currentUserPhone}_balance', _walletBalance);
    await _prefs!.setString('user_${_currentUserPhone}_name', _currentUserName ?? 'User');
    
    // Save bank details
    await _prefs!.setBool('user_${_currentUserPhone}_bank_added', _isBankAdded);
    await _prefs!.setString('user_${_currentUserPhone}_bank_name', _savedBankName);
    await _prefs!.setString('user_${_currentUserPhone}_holder_name', _savedHolderName);
    await _prefs!.setString('user_${_currentUserPhone}_account_no', _savedAccountNo);
    await _prefs!.setString('user_${_currentUserPhone}_ifsc', _savedIfsc);
    await _prefs!.setString('user_${_currentUserPhone}_upi_id', _savedUpiId);

    final betsMap = _betHistory.map((bet) => {
      'id': bet.id,
      'marketTitle': bet.marketTitle,
      'gameType': bet.gameType,
      'selectedNumber': bet.selectedNumber,
      'points': bet.points,
      'status': bet.status,
      'dateTime': bet.dateTime.toIso8601String(),
      'winAmount': bet.winAmount,
    }).toList();
    await _prefs!.setString('user_${_currentUserPhone}_bets', json.encode(betsMap));
  }

  Future<void> saveBankDetails(String bankName, String holderName, String accountNo, String ifsc) async {
    _isBankAdded = true;
    _savedBankName = bankName;
    _savedHolderName = holderName;
    _savedAccountNo = accountNo;
    _savedIfsc = ifsc;
    await _saveUserData();
    notifyListeners();
  }

  Future<void> removeBankDetails() async {
    _isBankAdded = false;
    _savedBankName = '';
    _savedHolderName = '';
    _savedAccountNo = '';
    _savedIfsc = '';
    await _saveUserData();
    notifyListeners();
  }

  Future<void> saveUpiId(String upiId) async {
    _savedUpiId = upiId;
    await _saveUserData();
    notifyListeners();
  }

  Future<bool> registerUser(String phone, String name, String password) async {
    if (_prefs == null) return false;
    
    // Check registered users list or direct password existence
    final List<String> registeredUsers = _prefs!.getStringList('registered_users_list') ?? [];
    if (registeredUsers.contains(phone) || _prefs!.containsKey('user_${phone}_password')) {
      return false; // User already exists!
    }
    
    // Save to registered users index
    registeredUsers.add(phone);
    await _prefs!.setStringList('registered_users_list', registeredUsers);
    
    // Set password, name, and default balance
    await _prefs!.setString('user_${phone}_password', password);
    await _prefs!.setString('user_${phone}_name', name);
    await _prefs!.setDouble('user_${phone}_balance', 25000.0);
    
    await loginUser(phone, password);
    return true;
  }

  Future<bool> loginUser(String phone, String password) async {
    if (_prefs == null) return false;
    final savedPassword = _prefs!.getString('user_${phone}_password');
    if (savedPassword == null || savedPassword != password) {
      return false;
    }
    _currentUserPhone = phone;
    _currentUserName = _prefs!.getString('user_${phone}_name') ?? 'User';
    await _prefs!.setString('logged_in_user_phone', phone);
    await _prefs!.setString('logged_in_user_name', _currentUserName ?? 'User');
    
    _loadUserData();
    notifyListeners();
    return true;
  }

  Future<void> logout() async {
    _currentUserPhone = null;
    _currentUserName = null;
    _walletBalance = 0.0;
    _betHistory = [];
    _isBankAdded = false;
    _savedBankName = '';
    _savedHolderName = '';
    _savedAccountNo = '';
    _savedIfsc = '';
    _savedUpiId = '';
    if (_prefs != null) {
      await _prefs!.remove('logged_in_user_phone');
      await _prefs!.remove('logged_in_user_name');
    }
    notifyListeners();
  }

  void addBet(Bet bet) {
    if (_currentUserPhone == null) return;
    _betHistory.insert(0, bet);
    _walletBalance -= bet.points;
    _saveUserData();
    notifyListeners();
  }

  void deposit(double amount) {
    if (_currentUserPhone == null) return;
    _walletBalance += amount;
    _saveUserData();
    notifyListeners();
  }

  void withdraw(double amount) {
    if (_currentUserPhone == null) return;
    if (_walletBalance >= amount) {
      _walletBalance -= amount;
      _saveUserData();
      notifyListeners();
    }
  }

  // Admin Methods
  List<Map<String, dynamic>> getAllUsers() {
    if (_prefs == null) return [];
    final List<String> registeredUsers = _prefs!.getStringList('registered_users_list') ?? [];
    List<Map<String, dynamic>> usersList = [];
    for (var phone in registeredUsers) {
      final name = _prefs!.getString('user_${phone}_name') ?? 'User';
      final balance = _prefs!.getDouble('user_${phone}_balance') ?? 25000.0;
      usersList.add({
        'phone': phone,
        'name': name,
        'balance': balance,
      });
    }
    return usersList;
  }

  Future<void> adminUpdateUserBalance(String phone, double newBalance) async {
    if (_prefs == null) return;
    await _prefs!.setDouble('user_${phone}_balance', newBalance);
    if (_currentUserPhone == phone) {
      _walletBalance = newBalance;
    }
    notifyListeners();
  }

  List<Map<String, dynamic>> getAllBets() {
    if (_prefs == null) return [];
    final List<String> registeredUsers = _prefs!.getStringList('registered_users_list') ?? [];
    List<Map<String, dynamic>> allBets = [];
    for (var phone in registeredUsers) {
      final userName = _prefs!.getString('user_${phone}_name') ?? 'User';
      final betHistoryJson = _prefs!.getString('user_${phone}_bets');
      if (betHistoryJson != null) {
        try {
          final List<dynamic> decoded = json.decode(betHistoryJson);
          for (var item in decoded) {
            allBets.add({
              'userPhone': phone,
              'userName': userName,
              'marketTitle': item['marketTitle'] ?? '',
              'gameType': item['gameType'] ?? '',
              'selectedNumber': item['selectedNumber'] ?? '',
              'points': (item['points'] ?? 0).toDouble(),
              'status': item['status'] ?? 'Pending',
              'dateTime': item['dateTime'] ?? '',
            });
          }
        } catch (e) {
          // ignore
        }
      }
    }
    allBets.sort((a, b) => (b['dateTime'] as String).compareTo(a['dateTime'] as String));
    return allBets;
  }

  void adminOverrideMarketResult(String marketId, String newResult) {
    for (var market in _markets) {
      if (market.id == marketId) {
        market.currentResult = newResult;
        break;
      }
    }
    notifyListeners();
  }

  void cancelTimer() {
    _liveTimer?.cancel();
  }

  @override
  void dispose() {
    _liveTimer?.cancel();
    super.dispose();
  }
}
