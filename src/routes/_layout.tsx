<<<<<<< HEAD
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, usePathname } from 'expo-router';
=======

import { colors } from '@/theme';
import { Stack } from 'expo-router';
>>>>>>> origin/v1
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/AuthContext';
import { colors } from '@/theme';
import BottomNavigation from '../components/BottomNavigation';

function AppNavigator() {
  const pathname = usePathname();
  const showBottomNavigation = pathname !== '/' && pathname !== '/index';

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="menu" options={{ headerShown: false }} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
        <Stack.Screen name="protect" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
<<<<<<< HEAD
        <Stack.Screen name="Refer" options={{ headerShown: false }} />
      </Stack>

      {showBottomNavigation && <BottomNavigation />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
=======
        <Stack.Screen name="my-friends" options={{ headerShown: false }} />
        <Stack.Screen name="community-events" options={{ headerShown: false }} />
        <Stack.Screen name="community-groups" options={{ headerShown: false }} />

      </Stack>

>>>>>>> origin/v1
      <StatusBar style="dark" />
    </AuthProvider>
  );
}
<<<<<<< HEAD

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
=======
>>>>>>> origin/v1
