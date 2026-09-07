import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = '@todo_sharing_app/username';

interface UserContextValue {
  username: string;
  setUsername: (name: string) => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextValue>({
  username: '',
  setUsername: async () => {},
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsernameState] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) setUsernameState(value);
      setLoading(false);
    });
  }, []);

  const setUsername = async (name: string) => {
    await AsyncStorage.setItem(STORAGE_KEY, name);
    setUsernameState(name);
  };

  return (
    <UserContext.Provider value={{ username, setUsername, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
