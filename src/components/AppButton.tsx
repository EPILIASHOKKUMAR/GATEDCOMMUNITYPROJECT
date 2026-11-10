import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, typography, shadows, spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const bg = isPrimary ? colors.primary : variant === 'secondary' ? colors.surface : 'transparent';
  const fg = isPrimary ? colors.white : isOutline ? colors.primary : colors.navy;
  const border = isOutline ? colors.primary : variant === 'secondary' ? colors.border : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.84 : 1 },
        isPrimary && !disabled && shadows.primary,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radii.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  label: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600' },
});

