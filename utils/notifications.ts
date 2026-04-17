import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Alarm } from './storage';

export const MEDICINE_CATEGORY = 'medicine_reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return false;
  }
  return true;
};

export const registerNotificationCategories = async () => {
  await Notifications.setNotificationCategoryAsync(MEDICINE_CATEGORY, [
    {
      identifier: 'TAKEN',
      buttonTitle: 'Taken',
      options: {
        isDestructive: false,
        isAuthenticationRequired: false,
      },
    },
    {
      identifier: 'MISSED',
      buttonTitle: 'Missed',
      options: {
        isDestructive: true,
        isAuthenticationRequired: false,
      },
    },
  ]);
};

export const scheduleAlarmNotification = async (alarm: Alarm) => {
  // Parsing the time string. Assuming ISO string.
  const date = new Date(alarm.time);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Cancel existing if any for this alarm
  await cancelAlarmNotification(alarm.id);

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Medicine Time! 💊',
      body: `It's time to take ${alarm.name}.`,
      data: { alarmId: alarm.id, name: alarm.name },
      categoryIdentifier: MEDICINE_CATEGORY,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    },
  });

  return identifier;
};

export const cancelAlarmNotification = async (alarmId: string) => {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.alarmId === alarmId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
};
