import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Notifications from 'expo-notifications';
import { requestPermissions, registerNotificationCategories } from "../utils/notifications";
import { registerBackgroundTasks } from "../utils/backgroundTask";
import { recordMedicationAction } from "../utils/storage";

// Register task outside of component lifecycle
registerBackgroundTasks();

export default function RootLayout() {
  useEffect(() => {
    const init = async () => {
      await requestPermissions();
      await registerNotificationCategories();
    };
    init();

    const subscription = Notifications.addNotificationResponseReceivedListener(async response => {
      const { actionIdentifier, notification } = response;
      const { alarmId, name } = notification.request.content.data;
      
      if (actionIdentifier === 'TAKEN') {
        await recordMedicationAction(alarmId as string, name as string, 'taken');
      } else if (actionIdentifier === 'MISSED') {
        await recordMedicationAction(alarmId as string, name as string, 'missed');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="alertModal" 
        options={{ 
          presentation: 'fullScreenModal',
          headerShown: false,
          animation: 'slide_from_bottom'
        }} 
      />
    </Stack>
  );
}
