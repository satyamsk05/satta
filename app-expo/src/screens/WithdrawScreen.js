import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppDataContext } from '../context/AppDataContext';
import { Colors } from '../theme/colors';

export default function WithdrawScreen({ onClose, onGoToBankSettings }) {
  const { walletBalance, withdrawPoints, isBankAdded, savedUpiId, savedBankName, savedAccountNo } = useContext(AppDataContext);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleWithdraw = () => {
    if (!isBankAdded) {
      Alert.alert(
        'Payment Details Missing',
        'Please configure your bank details or UPI ID first.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Configure Now', onPress: onGoToBankSettings }
        ]
      );
      return;
    }

    const amt = parseInt(amount);
    if (isNaN(amt) || amt < 500) {
      Alert.alert('Error', 'Minimum withdrawal amount is ₹500');
      return;
    }

    if (amt > walletBalance) {
      Alert.alert('Error', 'Insufficient wallet points');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      withdrawPoints(amt);
      Alert.alert(
        'Request Submitted',
        `Withdrawal request of ₹${amt} has been submitted. Amount will be credited to your account within 4-6 hours.`,
        [{ text: 'OK', onPress: onClose }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Withdraw Points</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Request settlement payout</Text>
        <Text style={styles.subtitleText}>Submit withdrawal requests to redeem your wallet balance points. 1 Point = ₹1.</Text>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>WITHDRAWABLE BALANCE</Text>
          <Text style={styles.balanceValue}>₹{walletBalance.toFixed(2)}</Text>
        </View>

        {/* Input */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ENTER WITHDRAWAL AMOUNT (₹)</Text>
          <TextInput
            style={[styles.pointsInput, isFocused && styles.pointsInputFocused]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            placeholder="Min ₹500"
            placeholderTextColor="#94A3B8"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        {/* Settlement destination */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>PAYOUT DESTINATION</Text>
          {isBankAdded ? (
            <View style={styles.destinationRow}>
              <Ionicons name={savedUpiId ? 'flash' : 'business'} size={20} color={Colors.success} />
              <View style={styles.destinationDetails}>
                <Text style={styles.destinationTitle}>
                  {savedUpiId ? 'UPI Wallet Transfer' : savedBankName}
                </Text>
                <Text style={styles.destinationSubtitle}>
                  {savedUpiId ? savedUpiId : `A/C: •••• ${savedAccountNo.slice(-4)}`}
                </Text>
              </View>
              <TouchableOpacity onPress={onGoToBankSettings}>
                <Text style={styles.changeLink}>Edit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.configureBtn} onPress={onGoToBankSettings}>
              <Ionicons name="add-circle" size={18} color={Colors.error} />
              <Text style={styles.configureBtnText}>Add Settlement Account</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleWithdraw} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>REQUEST WITHDRAWAL</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appBar: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  appBarTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  pointsInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
  },
  pointsInputFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationDetails: {
    flex: 1,
    marginLeft: 12,
  },
  destinationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  destinationSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  changeLink: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '700',
  },
  configureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  configureBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.error,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
