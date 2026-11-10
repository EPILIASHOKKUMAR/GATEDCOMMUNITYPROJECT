import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  step: number;
  title: string;
  description: string;
};

export default function StepItem({ step, title, description }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{step}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: spacing.lg },
  badge: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  badgeText: { ...typography.h3, color: colors.navy, fontSize: 16 },
  body: { flex: 1 },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: 2 },
  description: { ...typography.small, color: colors.textSecondary },
});

