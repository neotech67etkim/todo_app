import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { UserProvider } from './src/context/UserContext';
import { useTodos } from './src/hooks/useTodos';
import RootNavigator from './src/navigation/RootNavigator';
import { updateAppBadge } from './src/services/notifications';

function BadgeSync() {
  const { todos } = useTodos();
  useEffect(() => {
    const remaining = todos.filter((t) => !t.done).length;
    updateAppBadge(remaining);
  }, [todos]);
  return null;
}

export default function App() {
  return (
    <UserProvider>
      <BadgeSync />
      <RootNavigator />
      <StatusBar style="auto" />
    </UserProvider>
  );
}
