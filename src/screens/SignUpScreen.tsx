import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker, PoiClickEvent, Region } from 'react-native-maps';
import { useUser } from '../context/UserContext';
import { DEFAULT_LOCATION, tryGetCurrentPosition } from '../utils/location';
import { COLORS } from '../theme';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [markerLocation, setMarkerLocation] = useState<LatLng>(DEFAULT_LOCATION);
  const [currentRegion, setCurrentRegion] = useState<Region>({
    ...DEFAULT_LOCATION,
    latitudeDelta: 0.004,
    longitudeDelta: 0.004,
  });
  const { signIn } = useUser();

  useEffect(() => {
    tryGetCurrentPosition()
      .then((pos) => {
        setMarkerLocation(pos);
        setCurrentRegion((r) => ({ ...r, ...pos }));
      })
      .catch(() => {
        /* keep default location */
      });
  }, []);

  function handleMapPress(event: MapPressEvent | PoiClickEvent) {
    setMarkerLocation(event.nativeEvent.coordinate);
  }

  const handleSignUp = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await signIn(trimmed, markerLocation);
    } catch {
      Alert.alert('', 'There is no such username on GitHub', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        region={currentRegion}
        onRegionChangeComplete={setCurrentRegion}
        onPress={handleMapPress}
        onPoiClick={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        showsIndoors={false}
        mapPadding={{ top: 0, right: 24, bottom: 128, left: 24 }}
      >
        <Marker coordinate={markerLocation} />
      </MapView>

      <KeyboardAvoidingView behavior="position" style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Insert your GitHub username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleSignUp}
          returnKeyType="go"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    padding: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#031b6233',
    borderRadius: 4,
    borderWidth: 1,
    height: 56,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
