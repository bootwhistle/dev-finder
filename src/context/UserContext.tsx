import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import User from '../types';
import { registerUser, removeUser } from '../services/api';

interface UserContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = '@devfinder_user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => {
        if (data) setUser(JSON.parse(data));
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (username: string) => {
    // 1. Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('Location permission denied');

    // 2. Get current GPS position
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    // 3. Validate GitHub username and fetch profile
    const ghRes = await fetch(`https://api.github.com/users/${username}`);
    if (!ghRes.ok) throw new Error('User not found');
    const gh = await ghRes.json();

    // 4. Register (or update location) in backend
    const registered = await registerUser({
      login: gh.login,
      name: gh.name ?? gh.login,
      avatar_url: gh.avatar_url,
      company: gh.company ?? '',
      bio: gh.bio,
      coordinates,
    });

    // 5. Persist locally so the session survives app restarts
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(registered));
    setUser(registered);
  };

  const signOut = async () => {
    if (user) await removeUser(user.id);
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
