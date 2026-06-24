import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';
import UserMarker from '../components/UserMarker';
import { fetchUsers } from '../services/api';
import { COLORS } from '../theme';
import { RootStackParamList } from '../../App';
import User from '../types';

type MapNavProp = StackNavigationProp<RootStackParamList, 'Main'>;

const INITIAL_REGION = {
  latitude: 51.0447,
  longitude: -114.0719,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

export default function MapScreen() {
  const navigation = useNavigation<MapNavProp>();
  const { user, signOut } = useUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch {
      // backend unreachable — keep existing list
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={
          user
            ? { ...user.coordinates, latitudeDelta: 0.18, longitudeDelta: 0.18 }
            : INITIAL_REGION
        }
        onPress={() => setSelectedUser(null)}
      >
        {users.map((u) => (
          <UserMarker
            key={u.id}
            data={u}
            isCurrentUser={u.id === user?.id}
            onPress={() => setSelectedUser(u)}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.refreshBtn}
        onPress={handleRefresh}
        disabled={refreshing}
        activeOpacity={0.8}
      >
        {refreshing ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Text style={styles.refreshText}>↻</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.buildTag}>build 3</Text>

      {selectedUser && (
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedUser(null)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.cardName}>{selectedUser.name}</Text>
          {!!selectedUser.company && (
            <Text style={styles.cardSub}>{selectedUser.company}</Text>
          )}
          {!!selectedUser.bio && (
            <Text style={styles.cardSub}>{selectedUser.bio}</Text>
          )}

          <TouchableOpacity
            style={styles.profileBtn}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedUser(null);
              navigation.navigate('Profile', { githubUsername: selectedUser.login });
            }}
          >
            <Text style={styles.profileBtnText}>Open GitHub Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutBtn: {
    position: 'absolute',
    top: 52,
    right: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  refreshBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '600',
  },
  buildTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    color: '#fff',
    fontSize: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
  },
  closeBtnText: {
    fontSize: 18,
    color: '#888',
  },
  cardName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
    marginRight: 32,
  },
  cardSub: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  profileBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  profileBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
