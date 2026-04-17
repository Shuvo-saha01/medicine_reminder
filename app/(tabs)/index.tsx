import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert as RNAlert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Card } from '../../components/Card';
import { Alarm, getAlarms, deleteAlarm } from '../../utils/storage';
import { cancelAlarmNotification } from '../../utils/notifications';

export default function Home() {
  const router = useRouter();
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const loadAlarms = async () => {
    const data = await getAlarms();
    setAlarms(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadAlarms();
    }, [])
  );

  const handleDelete = async (id: string) => {
    RNAlert.alert('Delete Alarm', 'Are you sure you want to delete this reminder?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          await deleteAlarm(id);
          await cancelAlarmNotification(id);
          loadAlarms();
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: Alarm }) => {
    const date = new Date(item.time);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <Card style={styles.alarmCard}>
        <View style={styles.alarmInfo}>
          <Text style={styles.alarmName}>{item.name}</Text>
          <Text style={styles.alarmTime}>{timeString}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={() => router.push({ pathname: '/alertModal', params: { id: item.id } })}
            style={styles.iconButton}
          >
            <Ionicons name="pencil" size={20} color={Colors.textLight} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleDelete(item.id)}
            style={styles.iconButton}
          >
            <Ionicons name="trash" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {alarms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="medical" size={48} color={Colors.secondary} />
          <Text style={styles.emptyText}>No medicine reminders set.</Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/alertModal')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
  },
  alarmCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alarmInfo: {
    flex: 1,
  },
  alarmName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  alarmTime: {
    fontSize: 16,
    color: Colors.textLight,
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
