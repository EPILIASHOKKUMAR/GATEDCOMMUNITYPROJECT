import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import TabHeader from '@/components/TabHeader';
import Avatar from '@/components/Avatar';
import ListRow from '@/components/ListRow';
import AppButton from '@/components/AppButton';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [pushAlerts, setPushAlerts] = useState(true);
  const [encroachmentAlerts, setEncroachmentAlerts] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TabHeader />

        <View style={styles.body}>
          <Text style={styles.title}>Settings</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="User profile"
            onPress={() => Alert.alert('Profile', 'Profile editing coming soon.')}
            style={({ pressed }) => [styles.accountCard, pressed && styles.pressed]}
          >
            <Avatar size={52} style={{ marginRight: spacing.md }}>
              <MaterialCommunityIcons name="account" size={28} color={colors.white} />
            </Avatar>
            <View style={styles.accountText}>
              <Text style={styles.accountName}>{user?.fullName ?? 'Property Owner'}</Text>
              <Text style={styles.accountEmail}>{user?.email || 'View your profile'}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
          </Pressable>

          <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
          <View style={styles.group}>
            <ListRow
              icon={<MaterialCommunityIcons name="bell-outline" size={20} color={colors.primary} />}
              label="Push notifications"
              toggle={{ value: pushAlerts, onValueChange: setPushAlerts }}
            />
            <View style={styles.divider} />
            <ListRow
              icon={<MaterialCommunityIcons name="map-marker-outline" size={20} color={colors.primary} />}
              label="Encroachment alerts"
              toggle={{ value: encroachmentAlerts, onValueChange: setEncroachmentAlerts }}
            />
          </View>

          <Text style={styles.sectionLabel}>PROPERTY</Text>
          <View style={styles.group}>
            <ListRow
              icon={<MaterialCommunityIcons name="office-building" size={20} color={colors.primary} />}
              label="Post a property"
              onPress={() => router.push('/menu')}
            />
            <View style={styles.divider} />
            <ListRow
              icon={<MaterialCommunityIcons name="shield-check-outline" size={20} color={colors.primary} />}
              label="Protect property"
              onPress={() => router.push('/protect')}
            />
          </View>

          <Text style={styles.sectionLabel}>ABOUT</Text>
          <View style={styles.group}>
            <ListRow
              icon={<MaterialCommunityIcons name="file-document-outline" size={20} color={colors.primary} />}
              label="Terms & privacy"
              onPress={() => Alert.alert('Terms & Privacy', 'GatedPlus terms and conditions.')}
            />
            <View style={styles.divider} />
            <ListRow
              icon={<MaterialCommunityIcons name="information-outline" size={20} color={colors.primary} />}
              label="App version"
              value="1.0.0"
            />
          </View>

          <AppButton label="Log Out" onPress={handleLogout} variant="outline" style={styles.logout} />
        </View>
      </ScrollView>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNav}>
        <Pressable
          accessibilityRole="button"
          style={styles.navItem}
          onPress={() => router.replace('/home')}
        >
          <MaterialCommunityIcons name="home-outline" size={24} color="#7B8BA0" />
          <Text style={styles.navLabel}>Home</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.navItem}
          onPress={() => router.push('/protect')}
        >
          <MaterialCommunityIcons name="shield-check-outline" size={24} color="#7B8BA0" />
          <Text style={styles.navLabel}>Protect</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.navItem}
          onPress={() => router.push('/menu')}
        >
          <MaterialCommunityIcons name="menu" size={24} color="#7B8BA0" />
          <Text style={styles.navLabel}>Menu</Text>
        </Pressable>

        <View accessibilityLabel="Settings, current page" style={styles.navItem}>
          <MaterialCommunityIcons name="cog" size={24} color={colors.primary} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Settings</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export { SettingsPage, SettingsPage as SettingsScreen };

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  mainScroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  body: { paddingHorizontal: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.md },
  pressed: { opacity: 0.75 },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.card,
  },
  accountText: { flex: 1 },
  accountName: { ...typography.h3, color: colors.textPrimary },
  accountEmail: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  group: {
    backgroundColor: '#F7FAFC',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    ...shadows.card,
  },
  divider: { height: 1, backgroundColor: colors.border },
  logout: { marginTop: spacing.lg },

  // BOTTOM NAVIGATION
  bottomNav: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E6ECF2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    gap: 3,
  },
  navLabel: { fontSize: 11, color: '#7B8BA0' },
  navLabelActive: { color: colors.primary, fontWeight: '700' },
});
