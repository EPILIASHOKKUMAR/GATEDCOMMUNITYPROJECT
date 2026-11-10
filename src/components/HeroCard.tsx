import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, typography } from '@/theme';

type Variant = 'navy' | 'primary';

const variants = {
  navy: { bg: colors.navy, kicker: '#B8C5E8', subtitle: '#E0E6F7', shadow: shadows.elevated },
  primary: { bg: colors.primary, kicker: '#CDEFE2', subtitle: '#E6F8F1', shadow: shadows.primary },
} as const;

type Props = {
  kicker: string;
  title: string;
  subtitle: string;
  variant?: Variant;
};

export default function HeroCard({ kicker, title, subtitle, variant = 'navy' }: Props) {
  const v = variants[variant];
  return (
    <View style={[styles.hero, { backgroundColor: v.bg }, v.shadow]}>
      <Text style={[styles.kicker, { color: v.kicker }]}>{kicker}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.subtitle, { color: v.subtitle }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: spacing.lg, borderRadius: radii.xl, padding: spacing.xl },
  kicker: { ...typography.caption, letterSpacing: 1.2, marginBottom: spacing.sm, fontWeight: '700' },
  title: { ...typography.h2, color: colors.white, marginBottom: spacing.sm },
  subtitle: { ...typography.small, lineHeight: 20 },
});

