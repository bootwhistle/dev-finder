import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import { useUser } from '../context/UserContext';
import { COLORS } from '../theme';

const INITIAL_REGION = {
  latitude: 51.0447,
  longitude: -114.0719,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useUser();

  const handleSignUp = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await signIn(trimmed);
    } catch {
      Alert.alert('', 'There is no such username on GitHub', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={INITIAL_REGION} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.inputContainer}>
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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#111',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    height: 50,
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
    letterSpacing: 0.3,
  },
});
