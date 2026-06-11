import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';
import { CommunityUser } from '../types';

interface Props {
  user: CommunityUser;
  onCalloutPress: () => void;
}

export default function UserMarker({ user, onCalloutPress }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Marker
      coordinate={{ latitude: user.latitude, longitude: user.longitude }}
      tracksViewChanges={!imageLoaded}
    >
      {/* Outer ring provides white border; inner circle clips image and shows
          a gray fallback so the marker is always visible while image loads */}
      <View style={styles.markerOuter}>
        <View style={styles.markerInner}>
          <Image
            source={{ uri: user.avatar_url }}
            style={styles.avatar}
            onLoad={() => setImageLoaded(true)}
          />
        </View>
      </View>
      <Callout onPress={onCalloutPress}>
        <View style={styles.callout}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.login}>{user.login}</Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerOuter: {
    padding: 2,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  markerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#bbb',
  },
  avatar: {
    width: 40,
    height: 40,
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
