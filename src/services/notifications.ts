import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Expo Go(SDK 53+)는 안드로이드에서 expo-notifications 기능을 지원하지 않습니다.
// (Google 정책 변경으로 Expo 팀이 Expo Go에서 제거함 — 개발 빌드에서는 정상 동작합니다.)
// https://docs.expo.dev/develop/development-builds/introduction/
const isUnsupportedExpoGoAndroid = Constants.appOwnership === 'expo' && Platform.OS === 'android';

if (!isUnsupportedExpoGoAndroid) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

const DAILY_NOTIFICATION_ID = 'daily-todo-reminder';

export async function requestNotificationPermission(): Promise<boolean> {
  if (isUnsupportedExpoGoAndroid) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(hour: number, minute: number) {
  if (isUnsupportedExpoGoAndroid) return;
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
  if (isUnsupportedExpoGoAndroid) return;
  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID).catch(() => {});
}

export async function updateAppBadge(count: number) {
  if (isUnsupportedExpoGoAndroid) return;
  await Notifications.setBadgeCountAsync(count).catch(() => {});
}
