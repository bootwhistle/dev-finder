import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from '../context/UserContext';
import UserMarker from '../components/UserMarker';
import { MOCK_USERS } from '../data/mockUsers';
import { COLORS } from '../theme';
import { RootStackParamList } from '../../App';

type MapNavProp = NativeStackNavigationProp<RootStackParamList, 'Map'>;

const INITIAL_REGION = {
  latitude: 51.0447,
  longitude: -114.0719,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

export default function MapScreen() {
  const navigation = useNavigation<MapNavProp>();
  const { signOut } = useUser();

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={INITIAL_REGION}>
        {MOCK_USERS.map((u) => (
          <UserMarker
            key={u.login}
            user={u}
            onCalloutPress={() => navigation.navigate('Profile', { username: u.login })}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
});
