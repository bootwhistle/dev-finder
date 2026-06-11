import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GitHubUser } from '../types';

interface UserContextType {
  user: GitHubUser | null;
  loading: boolean;
  signIn: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = '@devfinder_user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => {
        if (data) setUser(JSON.parse(data));
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (username: string) => {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error('User not found');
    const data: GitHubUser = await response.json();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
