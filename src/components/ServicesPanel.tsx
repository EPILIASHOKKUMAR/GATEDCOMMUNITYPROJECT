import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { propertyServices, type PropertyService } from '@/constants/services';

const groups = [{
  title: 'Property Services',
  description: 'Essential services for property owners',
  icon: 'home' as const,
  tone: 'green' as const,
  services: propertyServices,
}];

export function ServicesPanel({ onSelect }: { onSelect: (service: PropertyService) => void }) {
  return (
    <View style={s.panel}>
      {groups.map((group) => {
        const tone = colors.serviceTones[group.tone];
        return (
          <View key={group.title} style={s.group}>
            <View style={[s.header, { backgroundColor: tone.background, borderColor: tone.border }]}>
              <View style={[s.icon, { backgroundColor: tone.iconBackground }]}>
                <MaterialCommunityIcons name={group.icon} size={22} color={tone.foreground} />
              </View>
              <View style={s.copy}>
                <Text accessibilityRole="header" style={[s.title, { color: tone.foreground }]}>{group.title.toUpperCase()}</Text>
                <Text style={s.description}>{group.description}</Text>
              </View>
            </View>
            {group.services.map((service) => (
              <Pressable key={service.title} accessibilityRole="button" accessibilityLabel={service.title}
                onPress={() => onSelect(service)}
                style={({ pressed }) => [s.row, pressed && { backgroundColor: tone.background }]}>
                <View style={[s.icon, { backgroundColor: tone.background, borderColor: tone.border, borderWidth: 1 }]}>
                  <MaterialCommunityIcons name={service.icon} size={22} color={tone.foreground} />
                </View>
                <View style={s.copy}>
                  <Text style={s.serviceTitle}>{service.title}</Text>
                  <Text style={s.description}>{service.description}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  panel: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  group: { flexBasis: 280, flexGrow: 1, flexShrink: 1, minWidth: 0, gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderRadius: radii.lg, minHeight: 80 },
  icon: { width: 40, height: 40, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: spacing.xs },
  title: { ...typography.label, fontWeight: '800' },
  description: { ...typography.caption, color: colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, borderRadius: radii.md, minHeight: 64 },
  serviceTitle: { ...typography.label, color: colors.textPrimary },
});
