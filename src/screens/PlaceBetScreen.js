import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppDataContext } from '../context/AppDataContext';
import { Colors } from '../theme/colors';
import BidLoader from '../components/BidLoader';

const { width } = Dimensions.get('window');
const gap = 10;
const padding = 20;
const columns = 5;
const cellWidth = (width - (padding * 2) - (gap * (columns - 1))) / columns;

export default function PlaceBetScreen({ market, onClose }) {
  const { walletBalance, addBet } = useContext(AppDataContext);
  const [points, setPoints] = useState('');
  const [selectedDigit, setSelectedDigit] = useState(null);
  const [gameType, setGameType] = useState('Jodi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPointsFocused, setIsPointsFocused] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState('loading');

  const gameTypes = ['Jodi', 'Harup (Ander)', 'Harup (Bahar)'];

  const generateChoices = () => {
    if (gameType === 'Jodi') {
      return Array.from({ length: 100 }, (_, i) => String(i).padStart(2, '0'));
    }
    return Array.from({ length: 10 }, (_, i) => String(i));
  };

  const handleQuickPoints = (value) => {
    const current = parseInt(points) || 0;
    setPoints(String(current + value));
  };

  const handleSubmit = () => {
    if (selectedDigit === null) {
      Alert.alert('Error', 'Please select a number from the grid');
      return;
    }
    if (!points) {
      Alert.alert('Error', 'Please enter points');
      return;
    }
    const pts = parseInt(points);
    if (isNaN(pts) || pts <= 0) {
      Alert.alert('Error', 'Enter a valid points amount');
      return;
    }
    if (pts > walletBalance) {
      Alert.alert('Error', 'Insufficient wallet balance');
      return;
    }

    setLoaderStatus('loading');
    setIsSubmitting(true);

    setTimeout(() => {
      setLoaderStatus('success');
      
      setTimeout(() => {
        setIsSubmitting(false);
        addBet({
          id: 'bet_' + Date.now(),
          marketTitle: market.title,
          gameType,
          selectedNumber: selectedDigit,
          points: pts,
          status: 'Pending',
          dateTime: new Date().toISOString()
        });
        onClose();
      }, 1800);
    }, 1500);
  };

  const choices = generateChoices();

  return (
    <View style={styles.container}>
      <BidLoader visible={isSubmitting} status={loaderStatus} />
      {/* Header bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.appBarTitle}>{market.title}</Text>
          <Text style={styles.appBarSubtitle}>Select & Bid</Text>
        </View>

        <View style={styles.walletBadge}>
          <Ionicons name="wallet-outline" size={12} color={Colors.success} style={{ marginRight: 4 }} />
          <Text style={styles.walletText}>₹{walletBalance.toFixed(0)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Game type selector */}
        <View style={styles.typesContainer}>
          {gameTypes.map((type) => {
            const isActive = gameType === type;
            return (
              <TouchableOpacity 
                key={type} 
                style={[styles.typeTab, isActive && styles.typeTabActive]} 
                onPress={() => {
                  setGameType(type);
                  setSelectedDigit(null);
                }}
              >
                <Text style={[styles.typeText, isActive && styles.typeTextActive]}>{type}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Digit Selection Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SELECT YOUR NUMBER</Text>
          {selectedDigit !== null && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.indicatorLabel}>Selected:</Text>
              <Text style={styles.indicatorValue}>{selectedDigit}</Text>
            </View>
          )}
        </View>

        <View style={styles.grid}>
          {choices.map((choice) => {
            const isSelected = selectedDigit === choice;
            return (
              <TouchableOpacity 
                key={choice} 
                style={[styles.gridCell, isSelected && styles.gridCellActive]}
                onPress={() => setSelectedDigit(choice)}
                activeOpacity={0.8}
              >
                <Text style={[styles.gridCellText, isSelected && styles.gridCellTextActive]}>
                  {choice}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Points selector card */}
        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>Enter Bid Points</Text>
          <TextInput
            style={[styles.pointsInput, isPointsFocused && styles.pointsInputFocused]}
            value={points}
            onChangeText={setPoints}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#94A3B8"
            onFocus={() => setIsPointsFocused(true)}
            onBlur={() => setIsPointsFocused(false)}
          />
          <View style={styles.quickPointsRow}>
            {[100, 500, 1000, 5000].map((val) => (
              <TouchableOpacity key={val} style={styles.quickPill} onPress={() => handleQuickPoints(val)}>
                <Text style={styles.quickPillText}>+{val >= 1000 ? (val / 1000) + 'K' : val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.btnRow}>
              <Text style={styles.submitBtnText}>PLACE BID NOW</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFF" style={{ marginLeft: 6 }} />
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appBar: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  titleContainer: {
    alignItems: 'center',
  },
  appBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  appBarSubtitle: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  walletText: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 11,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  typesContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 4,
    borderRadius: 14,
    marginBottom: 24,
  },
  typeTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  typeTextActive: {
    color: Colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  indicatorValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gap,
    marginBottom: 28,
  },
  gridCell: {
    width: cellWidth,
    height: cellWidth,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCellActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  gridCellText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gridCellTextActive: {
    color: '#FFFFFF',
  },
  pointsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 10,
    elevation: 2,
  },
  pointsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pointsInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  pointsInputFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
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
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
