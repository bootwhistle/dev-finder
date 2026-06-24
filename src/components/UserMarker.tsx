import React from 'react';
import { PixelRatio } from 'react-native';
import { Marker } from 'react-native-maps';
import User from '../types';

interface Props {
  data: User;
  isCurrentUser: boolean;
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

export default function UserMarker({ data, isCurrentUser, onPress }: Props) {
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
