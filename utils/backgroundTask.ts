import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { recordMedicationAction } from './storage';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
  if (error) {
    console.error('Error in background task:', error);
    return;
  }
  
  // Explicitly check for notification response
  if (data && typeof data === 'object' && 'actionIdentifier' in data && 'notification' in data) {
    const response = data as unknown as Notifications.NotificationResponse;
    const { actionIdentifier, notification } = response;
    const { alarmId, name } = notification.request.content.data;

    if (actionIdentifier === 'TAKEN') {
      await recordMedicationAction(alarmId as string, name as string, 'taken');
    } else if (actionIdentifier === 'MISSED') {
      await recordMedicationAction(alarmId as string, name as string, 'missed');
    }
  }
});

export const registerBackgroundTasks = () => {
  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
};
