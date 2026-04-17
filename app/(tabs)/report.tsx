import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, AppState, AppStateStatus } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Colors from '../../constants/Colors';
import { Card } from '../../components/Card';
import { getStats, getLogs, Stats, Log } from '../../utils/storage';

export default function Report() {
  const [stats, setStats] = useState<Stats>({ streak: 0, taken: 0, missed: 0 });
  const [logs, setLogs] = useState<Log[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const s = await getStats();
        const l = await getLogs();
        setStats(s);
        setLogs(l.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      };
      loadData();

      const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          loadData();
        }
      });

      return () => {
        subscription.remove();
      };
    }, [])
  );

  // Generate GitHub commit history style grid (last 30 actions as simplified example)
  // Each block represents a log action
  const renderHistoryGrid = () => {
    // Show up to 35 most recent actions in a grid (7 columns x 5 rows)
    const recentLogs = logs.slice(0, 35).reverse();
    
    // Fill the rest with empty slots if less than 35
    const emptySlots = Math.max(0, 35 - recentLogs.length);
    const gridItems = [
      ...Array(emptySlots).fill(null),
      ...recentLogs
    ];

    return (
      <View style={styles.gridContainer}>
        {gridItems.map((log, index) => {
          let backgroundColor = Colors.border; // Empty state
          if (log) {
            backgroundColor = log.status === 'taken' ? Colors.success : Colors.error;
          }
          return (
            <View 
              key={index} 
              style={[styles.gridBlock, { backgroundColor }]} 
            />
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </Card>
        
        <View style={styles.row}>
          <Card style={[styles.statCard, { flex: 1, marginRight: 8, backgroundColor: Colors.success }]}>
            <Text style={[styles.statValue, { color: Colors.text }]}>{stats.taken}</Text>
            <Text style={[styles.statLabel, { color: Colors.text }]}>Taken</Text>
          </Card>
          <Card style={[styles.statCard, { flex: 1, marginLeft: 8, backgroundColor: Colors.error }]}>
            <Text style={[styles.statValue, { color: Colors.text }]}>{stats.missed}</Text>
            <Text style={[styles.statLabel, { color: Colors.text }]}>Missed</Text>
          </Card>
        </View>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>History</Text>
        <Card style={styles.historyCard}>
          {renderHistoryGrid()}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>Taken</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors.error }]} />
              <Text style={styles.legendText}>Missed</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statsContainer: {
    padding: 16,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 8,
    fontWeight: '600',
  },
  historySection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  historyCard: {
    padding: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  gridBlock: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    color: Colors.textLight,
    fontSize: 14,
  },
});
