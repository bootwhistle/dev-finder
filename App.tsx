import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, useUser } from './src/context/UserContext';
import SignUpScreen from './src/screens/SignUpScreen';
import MapScreen from './src/screens/MapScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export type RootStackParamList = {
  Setup: undefined;
  Main: undefined;
  Profile: { githubUsername: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#021A62" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#021A62' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Main" component={MapScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Github Profile' }} />
          </>
        ) : (
          <Stack.Screen name="Setup" component={SignUpScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <AppNavigator />
      </UserProvider>
    </GestureHandlerRootView>
  );
}
