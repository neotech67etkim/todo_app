import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DAILY_NOTIFICATION_ID = 'daily-todo-reminder';

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(hour: number, minute: number) {
  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID).catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_NOTIFICATION_ID,
    content: {
      title: '오늘의 할일 알림',
      body: '아직 완료하지 않은 할일이 있어요. 앱에서 확인해보세요!',
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as Notifications.NotificationTriggerInput,
  });
}

export async function cancelDailyReminder() {
  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID).catch(() => {});
}

export async function updateAppBadge(count: number) {
  await Notifications.setBadgeCountAsync(count).catch(() => {});
}
