import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';
import User from '../types';
import db from '../data/mockUsers';

interface Props {
  data: User;
  handleCalloutPress: () => void;
}

export default function UserMarker({ data, handleCalloutPress }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // highlight the first db user as "current user" (matches reference approach)
  const isCurrentUser = data.login === (db.users as User[])[0].login;
  const borderColor = isCurrentUser ? '#4285F4' : '#aaa';

  return (
    <Marker coordinate={data.coordinates} tracksViewChanges={!imageLoaded}>
      {/* pointerEvents="none" lets touches pass through to the native Marker
          so the callout opens on tap */}
      <View style={styles.markerOuter} pointerEvents="none">
        <View style={[styles.markerInner, { borderColor }]}>
          <Image
            source={{ uri: data.avatar_url }}
            style={styles.avatar}
            onLoad={() => setImageLoaded(true)}
          />
        </View>
      </View>

      <Callout onPress={handleCalloutPress}>
        <TouchableOpacity style={styles.callout} activeOpacity={0.7} onPress={handleCalloutPress}>
          <Text style={styles.name}>{data.name}</Text>
          {!!data.company && <Text style={styles.sub}>{data.company}</Text>}
          {!!data.bio && <Text style={styles.sub}>{data.bio}</Text>}
        </TouchableOpacity>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerOuter: {
    padding: 2,
    borderRadius: 36,
    backgroundColor: '#fff',
  },
  markerInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#bbb',
    borderWidth: 4,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  callout: {
    width: 240,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 2,
  },
  sub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});
