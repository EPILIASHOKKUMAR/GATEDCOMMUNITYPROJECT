import React from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';

export type TabKey =
  | 'home'
  | 'search'
  | 'services'
  | 'sell'
  | 'post'
  | 'activity'
  | 'menu'
  | 'settings'
  | 'protect'
  | string;

export type TabItem = {
  key: TabKey;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  activeIcon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  route?: string;
  isCenterButton?: boolean;
  onPress?: () => void;
};

export const DEFAULT_TABS: TabItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
    route: '/home',
  },
  {
    key: 'search',
    label: 'Search',
    icon: 'magnify',
    activeIcon: 'magnify',
  },
  {
    key: 'sell',
    label: 'Sell',
    icon: 'plus',
    isCenterButton: true,
  },
  {
    key: 'activity',
    label: 'Activity',
    icon: 'heart-outline',
    activeIcon: 'heart',
  },
  {
    key: 'menu',
    label: 'Menu',
    icon: 'menu',
    activeIcon: 'menu',
    route: '/menu',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'cog-outline',
    activeIcon: 'cog',
    route: '/settings',
  },
];

export type BottomNavBarProps = {
  activeTab?: TabKey;
  tabs?: TabItem[];
  onTabPress?: (tab: TabItem) => void;
  style?: StyleProp<ViewStyle>;
};

export default function BottomNavBar({
  activeTab,
  tabs = DEFAULT_TABS,
  onTabPress,
  style,
}: BottomNavBarProps) {
  const router = useRouter();

  const handlePress = (tab: TabItem) => {
    if (tab.onPress) {
      tab.onPress();
      return;
    }
    if (onTabPress) {
      onTabPress(tab);
      return;
    }
    if (tab.route) {
      if (tab.key === activeTab) {
        return;
      }
      if (tab.key === 'home') {
        router.replace(tab.route as any);
      } else {
        router.push(tab.route as any);
      }
      return;
    }
    Alert.alert(tab.label, `${tab.label} feature coming soon.`);
  };

  return (
    <View style={[styles.bottomNav, style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const iconName = (isActive && tab.activeIcon ? tab.activeIcon : tab.icon) as any;
        const tintColor = isActive ? colors.primary : colors.textMuted;

        if (tab.isCenterButton) {
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              style={styles.navItem}
              onPress={() => handlePress(tab)}
            >
              <View style={[styles.centerIconBadge, isActive && styles.centerIconBadgeActive]}>
                <MaterialCommunityIcons name={iconName} size={22} color={colors.primary} />
              </View>
              <Text style={[styles.navText, isActive && styles.navActiveText]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityLabel={isActive ? `${tab.label}, current page` : tab.label}
            style={styles.navItem}
            onPress={() => handlePress(tab)}
          >
            <MaterialCommunityIcons name={iconName} size={25} color={tintColor} />
            <Text style={[styles.navText, isActive && styles.navActiveText]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export { BottomNavBar };

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E6ECF2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingVertical: 12,
    elevation: 12,
    shadowColor: '#183B5B',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 7,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    gap: 3,
  },
  navText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  navActiveText: {
    color: colors.primary,
    fontWeight: '700',
  },
  centerIconBadge: {
    width: 29,
    height: 29,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIconBadgeActive: {
    backgroundColor: colors.primaryLight,
  },
});
