import { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, shadows } from '@/theme';

type Props = {
  size?: number;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export default function Avatar({ size = 52, elevated = false, style, children }: Props) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        elevated && shadows.primary,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
