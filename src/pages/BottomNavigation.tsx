import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';

type NavItem = {
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  route?: '/home' | '/explore' | '/menu' | '/settings';
  action?: () => void;
};

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const items: NavItem[] = [
    { label: 'Home', icon: 'home', route: '/home' },
    { label: 'Search', icon: 'magnify', route: '/explore' },
    { label: 'Sell', icon: 'plus', route: '/menu' },
    {
      label: 'Activity',
      icon: 'heart-outline',
      action: () => Alert.alert('Activity', 'Coming soon'),
    },
    { label: 'Menu', icon: 'menu', route: '/menu' },
    { label: 'Settings', icon: 'cog-outline', route: '/settings' },
  ];

  const activeRoute =
    pathname === '/home' ? '/home' :
    pathname === '/explore' ? '/explore' :
    pathname === '/menu' ? '/menu' :
    pathname === '/settings' ? '/settings' : '';

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.bar}>
        {items.map((item) => {
          const active = Boolean(item.route && item.route === activeRoute);
          const isSell = item.label === 'Sell';
          return (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: active }}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else if (item.route) {
                  router.replace(item.route);
                }
              }}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            >
              {isSell ? (
                <View style={[styles.sellIcon, active && styles.sellIconActive]}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={25}
                    color={colors.primary}
                  />
                </View>
              ) : (
                <MaterialCommunityIcons
                  name={item.icon}
                  size={25}
                  color={active ? colors.primary : '#7B8BA0'}
                />
              )}
              <Text
                allowFontScaling={false}
                style={[styles.label, active && styles.activeLabel]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
  },
  bar: {
    minHeight: 62,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E6ECF2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 3,
    paddingTop: 7,
    paddingBottom: 5,
    elevation: 12,
    shadowColor: '#183B5B',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 7,
  },
  item: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    color: '#7B8BA0',
    fontSize: 10,
    fontWeight: '600',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '900',
  },
  sellIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellIconActive: {
    backgroundColor: '#E9FBF3',
  },
  pressed: {
    opacity: 0.7,
  },
});
