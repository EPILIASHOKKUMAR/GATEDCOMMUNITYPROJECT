import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

export default function IconBadge({ size = 36, children }: { size?: number; children: ReactNode }) {
  return <View style={[styles.badge, { width: size, height: size }]}>{children}</View>;
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
});
