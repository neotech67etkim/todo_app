import Constants from 'expo-constants';
import type * as ExpoNotifications from 'expo-notifications';
import { Platform } from 'react-native';

// Expo Go(SDK 53+)는 안드로이드에서 expo-notifications 네이티브 모듈을 지원하지 않고,
// 이 환경에서는 모듈을 require()하는 것만으로도 크래시가 납니다. 그래서 이 환경에서는
// 아예 모듈을 불러오지 않고 null로 두어 모든 알림 관련 함수가 조용히 아무 일도
// 하지 않게 합니다. (개발 빌드/iOS Expo Go/스토어 빌드에서는 정상 동작합니다.)
// https://docs.expo.dev/develop/development-builds/introduction/
const isUnsupportedExpoGoAndroid = Constants.appOwnership === 'expo' && Platform.OS === 'android';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Notifications: typeof ExpoNotifications | null = isUnsupportedExpoGoAndroid
  ? null
  : (require('expo-notifications') as typeof ExpoNotifications);

if (Notifications) {
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
  if (!Notifications) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(hour: number, minute: number) {
  if (!Notifications) return;
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
    } as ExpoNotifications.NotificationTriggerInput,
  });
}

export async function cancelDailyReminder() {
  if (!Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID).catch(() => {});
}

export async function updateAppBadge(count: number) {
  if (!Notifications) return;
  await Notifications.setBadgeCountAsync(count).catch(() => {});
}
