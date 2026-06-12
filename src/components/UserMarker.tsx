import React from 'react';
import { PixelRatio, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import User from '../types';
import db from '../data/mockUsers';

interface Props {
  data: User;
  onPress: () => void;
}

const PR = PixelRatio.get();

function circleImageUri(url: string, sizeDp: number): string {
  const px = Math.round(sizeDp * PR);
  return (
    `https://wsrv.nl/?url=${encodeURIComponent(url)}` +
    `&w=${px}&h=${px}&fit=cover&mask=circle&n=-1`
  );
}

export default function UserMarker({ data, onPress }: Props) {
  const isCurrentUser = data.login === db.users[0].login;
  const markerSizeDp = isCurrentUser ? 72 : 54;

  return (
    <Marker
      coordinate={data.coordinates}
      image={{ uri: circleImageUri(data.avatar_url, markerSizeDp) }}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={onPress}
    />
  );
}
