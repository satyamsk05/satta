import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppDataContext } from '../context/AppDataContext';
import { Colors } from '../theme/colors';

export default function DepositScreen({ onClose }) {
  const { addPoints } = useContext(AppDataContext);
  const [amount, setAmount] = useState('');
  const [txnId, setTxnId] = useState('');
  const [step, setStep] = useState(1); // 1 = Enter amount, 2 = Pay & Verify
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(null);

  const handleNext = () => {
    const amt = parseInt(amount);
    if (isNaN(amt) || amt < 100) {
      Alert.alert('Error', 'Minimum deposit amount is ₹100');
      return;
    }
    setStep(2);
  };

  const handleVerify = () => {
    if (!txnId || txnId.length < 8) {
      Alert.alert('Error', 'Enter a valid 12-digit UTR/Txn ID');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addPoints(parseInt(amount));
      Alert.alert('Success', `Deposit request of ₹${amount} received! Points will be credited upon receipt verification.`, [
        { text: 'OK', onPress: onClose }
      ]);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={step === 2 ? () => setStep(1) : onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Deposit Points</Text>
        <View style={{ width: 40 }} />
      </View>

      {step === 1 ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.headerText}>Add points to wallet</Text>
          <Text style={styles.subtitleText}>Specify the amount of points you want to deposit. 1 Point = ₹1.</Text>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>ENTER DEPOSIT AMOUNT (₹)</Text>
            <TextInput
              style={[styles.pointsInput, isFocused === 'amount' && styles.pointsInputFocused]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              placeholder="0.00"
              placeholderTextColor="#94A3B8"
              onFocus={() => setIsFocused('amount')}
              onBlur={() => setIsFocused(null)}
            />
            
            <View style={styles.quickPointsRow}>
              {[500, 1000, 2000, 5000].map((val) => (
                <TouchableOpacity key={val} style={styles.quickPill} onPress={() => setAmount(String(val))}>
                  <Text style={styles.quickPillText}>+₹{val}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleNext}>
            <Text style={styles.submitBtnText}>CONTINUE TO PAYMENT</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.headerText}>Complete Payment</Text>
          <Text style={styles.subtitleText}>Pay ₹{amount} to the details below, copy the Transaction UTR ID, and submit it here.</Text>

          {/* QR Code Placeholder card */}
          <View style={styles.card}>
            <View style={styles.qrContainer}>
              <View style={styles.qrBox}>
                <Ionicons name="qr-code" size={100} color={Colors.textPrimary} />
              </View>
              <Text style={styles.qrLabel}>SCAN TO PAY WITH ANY UPI APP</Text>
              <Text style={styles.upiAddress}>UPI ID: merchant@ybl</Text>
            </View>
          </View>

          {/* TXN Verification Input */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>SUBMIT TRANSACTION ID (12 DIGIT UTR)</Text>
            <TextInput
              style={[styles.input, isFocused === 'txn' && styles.inputFocused]}
              placeholder="Enter UTR/Txn Ref Number"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={txnId}
              onChangeText={setTxnId}
              onFocus={() => setIsFocused('txn')}
              onBlur={() => setIsFocused(null)}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleVerify} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>SUBMIT TRANSACTION</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
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
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 24,
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
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  pointsInputFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
  },
  quickPointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  quickPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  qrBox: {
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
  },
  qrLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  upiAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: '#F8FAFC',
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
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
