import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppDataContext } from '../context/AppDataContext';
import { Colors } from '../theme/colors';

export default function DashboardScreen({ onNavigate, onSelectMarket }) {
  const { currentUserName, walletBalance, markets } = useContext(AppDataContext);

  const renderMarketItem = ({ item }) => {
    return (
      <View style={styles.marketCard}>
        <View style={styles.marketHeader}>
          <View style={[styles.statusBadge, { backgroundColor: item.isOpen ? '#ECFDF5' : '#F1F5F9' }]}>
            <View style={[styles.statusDot, { backgroundColor: item.isOpen ? Colors.success : Colors.secondary }]} />
            <Text style={[styles.statusText, { color: item.isOpen ? Colors.success : Colors.secondary }]}>
              {item.isOpen ? 'LIVE' : 'CLOSED'}
            </Text>
          </View>
        </View>

        <Text style={styles.marketTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.marketTime} numberOfLines={1}>
          {item.openTime} - {item.closeTime}
        </Text>
        
        <Text style={styles.resultText}>
          Result: <Text style={styles.resultValue}>{item.currentResult}</Text>
        </Text>

        <TouchableOpacity 
          style={[styles.playBtn, { backgroundColor: item.isOpen ? Colors.primary : Colors.border }]}
          disabled={!item.isOpen}
          onPress={() => onSelectMarket(item)}
        >
          <Text style={[styles.playBtnText, { color: item.isOpen ? '#FFF' : Colors.secondary }]}>
            {item.isOpen ? 'Play' : 'Closed'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.userName}>{currentUserName || 'User'}</Text>
        </View>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>
            {currentUserName ? currentUserName[0].toUpperCase() : 'U'}
          </Text>
        </View>
      </View>

      {/* Wallet balance card */}
      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <Ionicons name="card-outline" size={16} color={Colors.textSecondary} />
        </View>
        <Text style={styles.walletAmount}>₹ {walletBalance.toFixed(2)}</Text>
        <View style={styles.walletActions}>
          <TouchableOpacity style={styles.walletOutlineBtn} onPress={() => onNavigate(4)}>
            <Text style={styles.walletOutlineBtnText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.walletSolidBtn} onPress={() => onNavigate(5)}>
            <Text style={styles.walletSolidBtnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ticker Box */}
      <View style={styles.tickerBox}>
        <View style={styles.tickerDot} />
        <Text style={styles.tickerText}>
          Live Kalyan Morning result is out. Play responsively.
        </Text>
      </View>

      {/* Markets Section */}
      <Text style={styles.sectionTitle}>Active Markets</Text>
      
      <View style={styles.gridContainer}>
        {markets.map((item) => (
          <View key={item.id} style={styles.gridItem}>
            {renderMarketItem({ item })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  walletIcon: {
    fontSize: 16,
  },
  walletAmount: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginVertical: 12,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  walletOutlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  walletOutlineBtnText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  walletSolidBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  walletSolidBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  tickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 28,
  },
  tickerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 12,
  },
  tickerText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  marketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 8,
    elevation: 1,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  marketTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  marketTime: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  resultText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 12,
  },
  resultValue: {
    fontWeight: '700',
    color: Colors.success,
  },
  playBtn: {
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
