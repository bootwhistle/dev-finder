import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ route }: Props) {
  const { username } = route.params;

  return (
    <WebView
      style={styles.webview}
      source={{ uri: `https://github.com/${username}` }}
      startInLoadingState
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
