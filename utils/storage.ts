import AsyncStorage from '@react-native-async-storage/async-storage';

const ALARMS_KEY = '@medicine_reminder_alarms';
const LOGS_KEY = '@medicine_reminder_logs';
const STATS_KEY = '@medicine_reminder_stats';

export interface Alarm {
  id: string;
  name: string;
  time: string; // ISO string representing the daily time
}

export interface Log {
  id: string;
  alarmId: string;
  name: string;
  status: 'taken' | 'missed';
  timestamp: string; // ISO string
}

export interface Stats {
  streak: number;
  taken: number;
  missed: number;
}

// Alarms
export const getAlarms = async (): Promise<Alarm[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ALARMS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading alarms', e);
    return [];
  }
};

export const saveAlarm = async (alarm: Alarm): Promise<void> => {
  try {
    const alarms = await getAlarms();
    alarms.push(alarm);
    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
  } catch (e) {
    console.error('Error saving alarm', e);
  }
};

export const deleteAlarm = async (id: string): Promise<void> => {
  try {
    const alarms = await getAlarms();
    const updatedAlarms = alarms.filter(a => a.id !== id);
    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(updatedAlarms));
  } catch (e) {
    console.error('Error deleting alarm', e);
  }
};

export const updateAlarm = async (updatedAlarm: Alarm): Promise<void> => {
  try {
    const alarms = await getAlarms();
    const index = alarms.findIndex(a => a.id === updatedAlarm.id);
    if (index !== -1) {
      alarms[index] = updatedAlarm;
      await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
    }
  } catch (e) {
    console.error('Error updating alarm', e);
  }
};

// Logs
export const getLogs = async (): Promise<Log[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(LOGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading logs', e);
    return [];
  }
};

export const addLog = async (log: Log): Promise<void> => {
  try {
    const logs = await getLogs();
    logs.push(log);
    await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error adding log', e);
  }
};

// Stats
export const getStats = async (): Promise<Stats> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STATS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : { streak: 0, taken: 0, missed: 0 };
  } catch (e) {
    console.error('Error reading stats', e);
    return { streak: 0, taken: 0, missed: 0 };
  }
};

export const updateStats = async (status: 'taken' | 'missed'): Promise<Stats> => {
  try {
    const stats = await getStats();
    if (status === 'taken') {
      stats.taken += 1;
      stats.streak += 1;
    } else if (status === 'missed') {
      stats.missed += 1;
      stats.streak = 0; // Streak resets on miss
    }
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch (e) {
    console.error('Error updating stats', e);
    return { streak: 0, taken: 0, missed: 0 };
  }
};

// Action Handler Wrapper
export const recordMedicationAction = async (alarmId: string, name: string, status: 'taken' | 'missed') => {
  const newLog: Log = {
    id: Date.now().toString(),
    alarmId,
    name,
    status,
    timestamp: new Date().toISOString()
  };
  await addLog(newLog);
  await updateStats(status);
};
