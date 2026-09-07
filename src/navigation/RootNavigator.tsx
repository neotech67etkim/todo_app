import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import ListDetailScreen from '../screens/ListDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeList" component={HomeScreen} options={{ title: '할일 목록' }} />
      <HomeStack.Screen
        name="ListDetail"
        component={ListDetailScreen}
        options={({ route }: any) => ({ title: route.params?.listName ?? '리스트' })}
      />
    </HomeStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeStackNavigator} options={{ title: '홈' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: '설정', headerShown: true }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
