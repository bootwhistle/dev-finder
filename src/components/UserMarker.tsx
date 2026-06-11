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

  const isCurrentUser = data.login === db.users[0].login;

  return (
    <Marker coordinate={data.coordinates} tracksViewChanges={!imageLoaded}>
      {/* View is only here for pointerEvents — no overflow:hidden, which is
          what caused the quarter-circle clipping bug on Android.
          borderRadius on Image itself handles the circular shape. */}
      <View pointerEvents="none">
        <Image
          source={{ uri: data.avatar_url }}
          style={[
            styles.avatar,
            { borderColor: isCurrentUser ? '#4285F4' : '#fff' },
          ]}
          onLoad={() => setImageLoaded(true)}
        />
      </View>

      <Callout onPress={handleCalloutPress}>
        <TouchableOpacity
          style={styles.callout}
          activeOpacity={0.7}
          onPress={handleCalloutPress}
        >
          <Text style={styles.name}>{data.name}</Text>
          {!!data.company && <Text style={styles.sub}>{data.company}</Text>}
          {!!data.bio && <Text style={styles.sub}>{data.bio}</Text>}
        </TouchableOpacity>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    backgroundColor: '#bbb',
  },
  callout: {
    width: 280,
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
});
