import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';
import UserMarker from '../components/UserMarker';
import db from '../data/mockUsers';
import { COLORS } from '../theme';
import { RootStackParamList } from '../../App';

type MapNavProp = StackNavigationProp<RootStackParamList, 'Main'>;

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
        {db.users.map((u) => (
          <UserMarker
            key={u.id}
            data={u}
            handleCalloutPress={() =>
              navigation.navigate('Profile', { githubUsername: u.login })
            }
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.buildTag}>build 6</Text>
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
});
