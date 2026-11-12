import { AuthProvider } from '@/context/AuthContext';
import BottomNavigation from '@/pages/BottomNavigation';
import { colors } from '@/theme';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

/** Routes where the bottom nav should be hidden (e.g. login/landing) */
const HIDE_NAV_ON = new Set(['/', '/index', '/project-details']);

/** Inner component so usePathname() runs inside the router context */
function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !HIDE_NAV_ON.has(pathname);
  return (
    <View style={styles.root}>
      {children}
      {showNav && <BottomNavigation />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
<<<<<<< HEAD
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
        <Stack.Screen name="services" options={{ headerShown: false }} />
        <Stack.Screen name="legal" options={{ headerShown: false }} />
        <Stack.Screen name="registration" options={{ headerShown: false }} />
        <Stack.Screen name="financial" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="Refer" options={{ headerShown: false }} />
        <Stack.Screen name="my-friends" options={{ headerShown: false }} />
        <Stack.Screen name="community-events" options={{ headerShown: false }} />
        <Stack.Screen name="community-groups" options={{ headerShown: false }} />
        <Stack.Screen name="friends-community" options={{ headerShown: false }}
/>

      </Stack>
=======
      <AppShell>
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
          <Stack.Screen name="Refer" options={{ headerShown: false }} />
          <Stack.Screen name="my-friends" options={{ headerShown: false }} />
          <Stack.Screen name="community-events" options={{ headerShown: false }} />
          <Stack.Screen name="community-groups" options={{ headerShown: false }} />
          <Stack.Screen name="featured-projects" options={{ headerShown: false }} />
          <Stack.Screen name="project-details" options={{ headerShown: false }} />
        </Stack>
      </AppShell>
>>>>>>> 7a09d6d (friends community)
      <StatusBar style="dark" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
