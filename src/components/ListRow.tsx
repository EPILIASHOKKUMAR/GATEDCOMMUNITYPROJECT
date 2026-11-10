import { ReactNode } from 'react';
import { View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography } from '@/theme';
import IconBadge from './IconBadge';

type Props = {
  icon: ReactNode;
  label: string;
  /** Static text shown on the right. */
  value?: string;
  /** Renders a switch on the right. */
  toggle?: { value: boolean; onValueChange: (v: boolean) => void };
  /** Makes the row tappable and shows a chevron. */
  onPress?: () => void;
};

export default function ListRow({ icon, label, value, toggle, onPress }: Props) {
  const content = (
    <>
      <IconBadge>{icon}</IconBadge>
      <Text style={styles.label}>{label}</Text>
      {value !== undefined && <Text style={styles.value}>{value}</Text>}
      {toggle && (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onValueChange}
          trackColor={{ false: colors.borderStrong, true: colors.primary }}
          thumbColor={colors.white}
        />
      )}
      {onPress && <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />}
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }
  return <View style={styles.row}>{content}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 56 },
  pressed: { opacity: 0.75 },
  label: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1 },
  value: { ...typography.small, color: colors.textSecondary },
});
