import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert as RNAlert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { CustomButton } from '../components/CustomButton';
import { Alarm, getAlarms, saveAlarm, updateAlarm } from '../utils/storage';
import { scheduleAlarmNotification } from '../utils/notifications';

export default function AlertModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.id as string | undefined;

  const [name, setName] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  useEffect(() => {
    if (editId) {
      getAlarms().then(alarms => {
        const alarm = alarms.find(a => a.id === editId);
        if (alarm) {
          setName(alarm.name);
          const date = new Date(alarm.time);
          setHour(date.getHours().toString().padStart(2, '0'));
          setMinute(date.getMinutes().toString().padStart(2, '0'));
        }
      });
    } else {
      const now = new Date();
      setHour(now.getHours().toString().padStart(2, '0'));
      setMinute(now.getMinutes().toString().padStart(2, '0'));
    }
  }, [editId]);

  const handleSave = async () => {
    if (!name.trim()) {
      RNAlert.alert('Error', 'Please enter a medicine name');
      return;
    }

    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);

    if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
      RNAlert.alert('Error', 'Please enter a valid time (HH:MM)');
      return;
    }

    const date = new Date();
    date.setHours(h, m, 0, 0);

    const newAlarm: Alarm = {
      id: editId || Date.now().toString(),
      name: name.trim(),
      time: date.toISOString(),
    };

    if (editId) {
      await updateAlarm(newAlarm);
    } else {
      await saveAlarm(newAlarm);
    }

    await scheduleAlarmNotification(newAlarm);
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <Animated.View 
        entering={FadeInDown.duration(400).springify()} 
        exiting={FadeOutDown.duration(200)}
        style={styles.content}
      >
        <Text style={styles.title}>{editId ? 'Edit Reminder' : 'New Reminder'}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medicine Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Vitamin C"
            placeholderTextColor={Colors.textLight}
            value={name}
            onChangeText={setName}
            maxLength={30}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time (24-hour)</Text>
          <View style={styles.timeContainer}>
            <TextInput
              style={styles.timeInput}
              keyboardType="number-pad"
              maxLength={2}
              value={hour}
              onChangeText={setHour}
              placeholder="HH"
              placeholderTextColor={Colors.textLight}
            />
            <Text style={styles.timeColon}>:</Text>
            <TextInput
              style={styles.timeInput}
              keyboardType="number-pad"
              maxLength={2}
              value={minute}
              onChangeText={setMinute}
              placeholder="MM"
              placeholderTextColor={Colors.textLight}
            />
          </View>
        </View>

        <CustomButton 
          title="Save Reminder" 
          onPress={handleSave} 
          style={styles.saveButton}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary, // Uses the secondary pastel mint green as background
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    color: Colors.text,
    shadowColor: Colors.textLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInput: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    fontSize: 24,
    textAlign: 'center',
    width: 80,
    color: Colors.text,
    shadowColor: Colors.textLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeColon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginHorizontal: 16,
  },
  saveButton: {
    marginTop: 32,
  },
});
