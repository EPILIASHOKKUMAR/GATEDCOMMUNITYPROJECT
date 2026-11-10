
import React from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, usePathname, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationItem = {
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  route?: Href;
};

const navigationItems: NavigationItem[] = [
  { label: 'Home', icon: 'home', route: '/home' },
  { label: 'Search', icon: 'magnify', route: '/explore' },
  { label: 'Sell', icon: 'plus', route: '/menu' },
  { label: 'Activity', icon: 'heart-outline' },
  { label: 'Menu', icon: 'menu', route: '/menu' },
  { label: 'Settings', icon: 'cog-outline', route: '/settings' },
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.bar}>
        {navigationItems.map((item) => {
          const active = item.route === pathname;
          const isSell = item.label === 'Sell';

          return (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              onPress={() => {
                if (item.label === 'Activity') {
                  Alert.alert('Activity', 'Coming soon');
                  return;
                }

                if (item.route) {
                  router.replace(item.route);
                }
              }}
              style={styles.item}
            >
              {isSell ? (
                <View style={styles.sellIcon}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={27}
                    color="#07845B"
                  />
                </View>
              ) : (
                <MaterialCommunityIcons
                  name={item.icon}
                  size={25}
                  color={active ? '#07845B' : '#7B8BA0'}
                />
              )}

              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={[styles.label, active && styles.activeLabel]}
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
    backgroundColor: '#FFFFFF',
  },
  bar: {
    minHeight: 62,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E6ECF2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 3,
    paddingTop: 7,
    paddingBottom: 5,
    elevation: 12,
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
    color: '#07845B',
    fontWeight: '900',
  },
  sellIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#07845B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
