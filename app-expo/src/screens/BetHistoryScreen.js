import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppDataContext } from '../context/AppDataContext';
import { Colors } from '../theme/colors';

export default function BetHistoryScreen() {
  const { betHistory } = useContext(AppDataContext);

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>My Bid History</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {betHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>No bids placed yet</Text>
            <Text style={styles.emptySubtext}>Your bidding history will show up here.</Text>
          </View>
        ) : (
          betHistory.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.marketTitle}>{item.marketTitle}</Text>
                  <Text style={styles.gameType}>{item.gameType}</Text>
                </View>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{item.selectedNumber}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.detailsLabel}>Points: <Text style={styles.detailsValue}>{item.points}</Text></Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'win' ? '#ECFDF5' : '#FEF2F2' }]}>
                  <Text style={[styles.statusText, { color: item.status === 'win' ? Colors.success : Colors.error }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
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
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marketTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gameType: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  numberBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  detailsLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailsValue: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
