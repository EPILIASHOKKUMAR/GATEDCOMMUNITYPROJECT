import { AuthProvider } from '@/context/AuthContext';
import { colors } from '@/theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
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
        <Stack.Screen name="list-property" options={{ headerShown: false }} />
        <Stack.Screen name="add-property" options={{ headerShown: false }} />
        <Stack.Screen name="saved-properties" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="active-protection" options={{ headerShown: false }} />
        <Stack.Screen name="property-reports" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="Refer" options={{ headerShown: false }} />
        <Stack.Screen name="my-friends" options={{ headerShown: false }} />
        <Stack.Screen name="community-events" options={{ headerShown: false }} />
        <Stack.Screen name="community-groups" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </AuthProvider>
  );
}
