import React, { createContext, useContext, useEffect, useState } from 'react';
import { LatLng } from 'react-native-maps';
import User from '../types';
import { getUserInfo } from '../services/github';
import { getUserByLogin, postUser, deleteUser } from '../services/users';
import { getFromStorage, setInStorage, removeFromStorage } from '../services/storage';

interface UserContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, coordinates: LatLng) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = '@devfinder_user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFromStorage<User>(STORAGE_KEY)
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (username: string, coordinates: LatLng) => {
    const fromGitHub = await getUserInfo(username);

    // Remove any stale entry for this login before re-registering
    const existing = await getUserByLogin(fromGitHub.login).catch(() => null);
    if (existing) await deleteUser(existing.id);

    const registered = await postUser({
      login: fromGitHub.login,
      name: fromGitHub.name ?? fromGitHub.login,
      avatar_url: fromGitHub.avatar_url,
      company: fromGitHub.company ?? '',
      bio: fromGitHub.bio,
      coordinates,
    });

    await setInStorage(STORAGE_KEY, registered);
    setUser(registered);
  };

  const signOut = async () => {
    if (user) await deleteUser(user.id).catch(() => {});
    await removeFromStorage(STORAGE_KEY);
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
