import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';
import { CommunityUser } from '../types';

interface Props {
  user: CommunityUser;
  onCalloutPress: () => void;
}

export default function UserMarker({ user, onCalloutPress }: Props) {
  return (
    <Marker
      coordinate={{ latitude: user.latitude, longitude: user.longitude }}
      tracksViewChanges={false}
    >
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <Callout onPress={onCalloutPress} tooltip={false}>
        <TouchableOpacity style={styles.callout} activeOpacity={0.8}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.login}>{user.login}</Text>
        </TouchableOpacity>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  callout: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 140,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    color: '#111',
  },
  login: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
});
