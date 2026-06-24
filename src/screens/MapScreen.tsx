import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';
import UserMarker from '../components/UserMarker';
import { getUsers } from '../services/users';
import { getFromNetworkFirst } from '../services/storage';
import { DEFAULT_LOCATION, tryGetCurrentPosition } from '../utils/location';
import { COLORS } from '../theme';
import { RootStackParamList } from '../../App';
import User from '../types';

type MapNavProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function MapScreen() {
  const navigation = useNavigation<MapNavProp>();
  const { user, signOut } = useUser();
  const mapViewRef = useRef<MapView>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [devs, setDevs] = useState<User[]>([]);
  const [userLocation, setUserLocation] = useState<LatLng>();
  const [currentRegion, setCurrentRegion] = useState<Region>();

  useEffect(() => {
    getFromNetworkFirst('users', getUsers())
      .then(setDevs)
      .catch((err) => Alert.alert(String(err)));

    tryGetCurrentPosition()
      .catch(() => DEFAULT_LOCATION)
      .then((coords) => {
        setUserLocation(coords);
        setCurrentRegion({ ...coords, latitudeDelta: 0.1, longitudeDelta: 0.1 });
      });
  }, []);

  function fitAll() {
    const locations: LatLng[] = devs.map((dev) => dev.coordinates);
    if (userLocation) locations.push(userLocation);
    mapViewRef.current?.fitToCoordinates(locations, {
      edgePadding: { top: 128, right: 64, bottom: 64, left: 64 },
      animated: true,
    });
  }

  if (!currentRegion) return null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={StyleSheet.absoluteFill}
        initialRegion={currentRegion}
        onMapReady={fitAll}
        onPress={() => setSelectedUser(null)}
        showsUserLocation={true}
        showsMyLocationButton={false}
        moveOnMarkerPress={false}
        toolbarEnabled={false}
        showsIndoors={false}
        mapPadding={{ top: 0, right: 24, bottom: 0, left: 24 }}
      >
        {devs.map((dev) => (
          <UserMarker
            key={dev.id}
            data={dev}
            isCurrentUser={dev.id === user?.id}
            onPress={() => setSelectedUser(dev)}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

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
    top: 64,
    right: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
