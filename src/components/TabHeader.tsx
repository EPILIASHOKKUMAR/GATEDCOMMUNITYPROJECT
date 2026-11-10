import { View, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/theme';

export default function TabHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      <Image
        source={require('@/assets/images/gatedplusLogo.jpeg')}
        resizeMode="contain"
        style={styles.logo}
        accessibilityLabel="GatedPlus"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  logo: { width: 152, height: 33 },
});
