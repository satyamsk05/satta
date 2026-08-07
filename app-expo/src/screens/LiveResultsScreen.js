import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export default function LiveResultsScreen() {
  const history = [
    {
      date: 'Wednesday, 05 Aug 2026',
      results: [
        { market: 'DESAWAR', result: '52' },
        { market: 'DELHI BAZAR', result: '19' },
        { market: 'SHRI GANESH', result: '83' },
        { market: 'FARIDABAD', result: '57' },
      ]
    },
    {
      date: 'Tuesday, 04 Aug 2026',
      results: [
        { market: 'DESAWAR', result: '70' },
        { market: 'DELHI BAZAR', result: '12' },
        { market: 'SHRI GANESH', result: '93' },
        { market: 'FARIDABAD', result: '18' },
        { market: 'GHAZIABAD', result: '45' },
        { market: 'GALI', result: '88' },
        { market: 'TAJ', result: '26' },
      ]
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Live Results History</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {history.map((dayData, index) => (
          <View key={index} style={styles.dayGroup}>
            <View style={styles.dateHeader}>
              <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} style={{ marginRight: 8 }} />
              <Text style={styles.dateText}>{dayData.date}</Text>
            </View>

            <View style={styles.gridContainer}>
              {dayData.results.map((res, resIdx) => (
                <View key={resIdx} style={styles.gridItem}>
                  <View style={styles.card}>
                    <Text style={styles.marketTitle} numberOfLines={1}>
                      {res.market}
                    </Text>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Result:</Text>
                      <View style={styles.resultBadge}>
                        <Text style={styles.resultValue}>{res.result}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
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
  dayGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  calendarIcon: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  marketTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  resultBadge: {
    backgroundColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resultValue: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 12,
  },
});
