// app/_layout.tsx
import React from 'react';
import { Slot, Stack } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { UserProvider } from '../contexts/UserContext';

// Keep the splash screen visible while fonts are loading
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // or a custom loading component
  }

  return (
    <UserProvider>
      <SafeAreaView style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false, // Hide the default header globally
            gestureEnabled: true,
          }}
        >
          <Slot />
        </Stack>
      </SafeAreaView>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
