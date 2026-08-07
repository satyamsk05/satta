import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppDataContext } from '../context/AppDataContext';
import { Colors } from '../theme/colors';

export default function BankDetailsScreen({ onClose }) {
  const { 
    saveBankDetails, 
    savedBankName, 
    savedHolderName, 
    savedAccountNo, 
    savedIfsc, 
    savedUpiId,
  } = useContext(AppDataContext);

  const [bankName, setBankName] = useState(savedBankName || '');
  const [holderName, setHolderName] = useState(savedHolderName || '');
  const [accountNo, setAccountNo] = useState(savedAccountNo || '');
  const [ifsc, setIfsc] = useState(savedIfsc || '');
  const [upiId, setUpiId] = useState(savedUpiId || '');
  const [isFocused, setIsFocused] = useState(null);
  const [showUpiSection, setShowUpiSection] = useState(false);

  const handleSaveBank = () => {
    if (!bankName || !holderName || !accountNo || !ifsc) {
      Alert.alert('Error', 'Please fill all Bank details before saving');
      return;
    }
    saveBankDetails(bankName, holderName, accountNo, ifsc, upiId);
    Alert.alert('Success', 'Bank details saved successfully!', [
      { text: 'OK', onPress: onClose }
    ]);
  };

  const handleSaveUpi = () => {
    if (!upiId) {
      Alert.alert('Error', 'Please enter a valid UPI address before saving');
      return;
    }
    saveBankDetails(bankName, holderName, accountNo, ifsc, upiId);
    Alert.alert('Success', 'UPI configurations saved successfully!', [
      { text: 'OK', onPress: onClose }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Bank & UPI Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Configure withdrawal details</Text>
        <Text style={styles.subtitleText}>Specify your preferred bank account or UPI address where you want to receive winning settlements.</Text>

        {/* Bank section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="business" size={16} color={Colors.primary} />
            <Text style={styles.cardTitle}>DIRECT BANK SETTLEMENT</Text>
          </View>

          {/* Dynamic Bank Settlement Card Visual */}
          <View style={styles.bankCardVisual}>
            <View style={styles.cardVisualHeader}>
              <Text style={styles.cardVisualBrand} numberOfLines={1}>{bankName.toUpperCase() || 'BANK NAME'}</Text>
              <Ionicons name="business" size={18} color="#FFFFFF" />
            </View>
            
            <Text style={styles.cardVisualNumber} numberOfLines={1}>
              {accountNo ? accountNo.replace(/(\d{4})/g, '$1 ').trim() : '0000 0000 0000 0000'}
            </Text>
            
            <View style={styles.cardVisualFooter}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardVisualLabel}>ACCOUNT HOLDER</Text>
                <Text style={styles.cardVisualHolder} numberOfLines={1}>{holderName.toUpperCase() || 'HOLDER NAME'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
                <Text style={styles.cardVisualLabel}>IFSC CODE</Text>
                <Text style={styles.cardVisualHolder} numberOfLines={1}>{ifsc.toUpperCase() || 'IFSC0000000'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bank Name</Text>
            <TextInput
              style={[styles.input, isFocused === 'bank' && styles.inputFocused]}
              placeholder="State Bank of India"
              placeholderTextColor="#94A3B8"
              value={bankName}
              onChangeText={setBankName}
              onFocus={() => setIsFocused('bank')}
              onBlur={() => setIsFocused(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Holder Name</Text>
            <TextInput
              style={[styles.input, isFocused === 'holder' && styles.inputFocused]}
              placeholder="John Doe"
              placeholderTextColor="#94A3B8"
              value={holderName}
              onChangeText={holderName => setHolderName(holderName)}
              onFocus={() => setIsFocused('holder')}
              onBlur={() => setIsFocused(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={[styles.input, isFocused === 'acc' && styles.inputFocused]}
              placeholder="000000000000"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={accountNo}
              onChangeText={accountNo => setAccountNo(accountNo)}
              onFocus={() => setIsFocused('acc')}
              onBlur={() => setIsFocused(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>IFSC Code</Text>
            <TextInput
              style={[styles.input, isFocused === 'ifsc' && styles.inputFocused]}
              placeholder="SBIN0001234"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={ifsc}
              onChangeText={ifsc => setIfsc(ifsc)}
              onFocus={() => setIsFocused('ifsc')}
              onBlur={() => setIsFocused(null)}
            />
          </View>
        </View>

        {/* Save Bank Details Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSaveBank}>
          <Text style={styles.submitBtnText}>SAVE DETAILS</Text>
        </TouchableOpacity>

        {/* View More / Toggle UPI Trigger */}
        <TouchableOpacity style={styles.viewMoreBtn} onPress={() => setShowUpiSection(!showUpiSection)}>
          <Text style={styles.viewMoreText}>
            {showUpiSection ? 'Hide UPI Settings ▲' : 'Configure UPI Settings (View More) ▼'}
          </Text>
        </TouchableOpacity>

        {/* Collapsible UPI section below Save Details */}
        {showUpiSection && (
          <View style={[styles.card, { marginTop: 10 }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="flash" size={16} color={Colors.success} />
              <Text style={styles.cardTitle}>UPI SETTINGS</Text>
            </View>

            {/* Dynamic UPI Card Visual */}
            <View style={styles.upiCardVisual}>
              <View style={styles.cardVisualHeader}>
                <Text style={styles.cardVisualBrand}>UPI PAYOUT WALLET</Text>
                <Ionicons name="flash" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.cardVisualNumber} numberOfLines={1}>
                {upiId || 'yourname@bankupi'}
              </Text>
              <View style={styles.cardVisualFooter}>
                <Text style={styles.cardVisualHolder}>SETTLEMENT DESTINATION</Text>
                <Text style={styles.cardVisualType}>UPI</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>UPI Address (e.g. name@upi)</Text>
              <TextInput
                style={[styles.input, isFocused === 'upi' && styles.inputFocused]}
                placeholder="payee@okaxis"
                placeholderTextColor="#94A3B8"
                value={upiId}
                onChangeText={setUpiId}
                onFocus={() => setIsFocused('upi')}
                onBlur={() => setIsFocused(null)}
              />
            </View>

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: Colors.success }]} onPress={handleSaveUpi}>
              <Text style={styles.submitBtnText}>SAVE UPI DETAILS</Text>
            </TouchableOpacity>
          </View>
        )}
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
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '850',
    color: Colors.textPrimary,
    letterSpacing: 0.8,
  },
  upiCardVisual: {
    backgroundColor: '#10B981',
    borderRadius: 18,
    padding: 20,
    height: 140,
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  bankCardVisual: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 20,
    height: 160,
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  cardVisualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardVisualBrand: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardVisualNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    marginVertical: 10,
  },
  cardVisualFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardVisualLabel: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardVisualHolder: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardVisualType: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
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
    marginTop: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  viewMoreBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});
