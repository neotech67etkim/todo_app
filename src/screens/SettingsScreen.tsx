import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';
import { cancelDailyReminder, requestNotificationPermission, scheduleDailyReminder } from '../services/notifications';

const NOTIF_ENABLED_KEY = '@todo_sharing_app/notif_enabled';
const NOTIF_TIME_KEY = '@todo_sharing_app/notif_time';
const isUnsupportedExpoGoAndroid = Constants.appOwnership === 'expo' && Platform.OS === 'android';

export default function SettingsScreen() {
  const { username, setUsername } = useUser();
  const [nameInput, setNameInput] = useState(username);
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setNameInput(username);
  }, [username]);

  useEffect(() => {
    (async () => {
      const storedEnabled = await AsyncStorage.getItem(NOTIF_ENABLED_KEY);
      const storedTime = await AsyncStorage.getItem(NOTIF_TIME_KEY);
      if (storedEnabled) setEnabled(storedEnabled === 'true');
      if (storedTime) {
        const [h, m] = storedTime.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        setTime(d);
      }
    })();
  }, []);

  const handleSaveName = async () => {
    if (nameInput.trim()) await setUsername(nameInput.trim());
  };

  const applyNotificationSetting = async (nextEnabled: boolean, nextTime: Date) => {
    if (nextEnabled) {
      if (isUnsupportedExpoGoAndroid) {
        Alert.alert(
          '알림을 사용할 수 없습니다',
          'Expo Go(안드로이드)에서는 정책상 알림 기능이 지원되지 않습니다.\n실제 알림을 테스트하려면 개발 빌드(EAS Build)로 만든 앱을 사용해주세요.'
        );
        setEnabled(false);
        return;
      }
      const granted = await requestNotificationPermission();
      if (!granted) {
        setEnabled(false);
        return;
      }
      await scheduleDailyReminder(nextTime.getHours(), nextTime.getMinutes());
    } else {
      await cancelDailyReminder();
    }
    await AsyncStorage.setItem(NOTIF_ENABLED_KEY, String(nextEnabled));
    await AsyncStorage.setItem(NOTIF_TIME_KEY, `${nextTime.getHours()}:${nextTime.getMinutes()}`);
  };

  const handleToggle = async (value: boolean) => {
    setEnabled(value);
    await applyNotificationSetting(value, time);
  };

  const handleTimeChange = async (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (!selectedDate) return;
    setTime(selectedDate);
    if (enabled) await applyNotificationSetting(true, selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>내 이름 (담당자 표시용)</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} value={nameInput} onChangeText={setNameInput} placeholder="예: 홍길동" />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 28 }]}>매일 할일 알림</Text>
      <View style={styles.row}>
        <Text style={styles.label}>알림 사용</Text>
        <Switch value={enabled} onValueChange={handleToggle} />
      </View>
      <TouchableOpacity style={styles.timeButton} onPress={() => setShowPicker(true)} disabled={!enabled}>
        <Text style={styles.timeButtonText}>
          알림 시간: {String(time.getHours()).padStart(2, '0')}:{String(time.getMinutes()).padStart(2, '0')}
        </Text>
      </TouchableOpacity>
      {showPicker && <DateTimePicker value={time} mode="time" is24Hour onChange={handleTimeChange} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
  },
  saveButton: { backgroundColor: '#1976d2', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  saveButtonText: { color: '#fff', fontWeight: '700' },
  label: { fontSize: 15, color: '#333' },
  timeButton: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  timeButtonText: { fontSize: 15, color: '#222' },
});
