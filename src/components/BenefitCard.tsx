import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  title: string;
  description: string;
  accent: string;
};

export default function BenefitCard({ title, description, accent }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accent: { width: 4, borderRadius: radii.pill, marginRight: spacing.md },
  body: { flex: 1 },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: 2 },
  description: { ...typography.small, color: colors.textSecondary },
});

