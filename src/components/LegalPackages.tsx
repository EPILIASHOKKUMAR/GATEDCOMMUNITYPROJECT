import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { legalPackages } from '@/constants/legalPackages';
import { colors, radii, spacing, typography } from '@/theme';

export function LegalPackages({ hideHeader = false, showSummary = false }: { hideHeader?: boolean; showSummary?: boolean } = {}) {
  const { width } = useWindowDimensions();
  const [selected, setSelected] = useState<(typeof legalPackages)[number] | null>(null);
  const columns = width >= 1100 ? 4 : width >= 650 ? 2 : 1;

  return (
    <View style={s.section}>
      {!hideHeader && <View style={s.header}>
        <Text style={s.eyebrow}>COMPREHENSIVE COVERAGE</Text>
        <Text accessibilityRole="header" style={s.heading}>Choose the Right Legal Package</Text>
        <Text style={s.subtitle}>From preliminary document screening to end-to-end conveyance and Sub-Registrar registration assistance.</Text>
      </View>}
      <View style={s.grid}>
        {legalPackages.map((plan) => (
          <View key={plan.title} style={[s.card, { width: columns === 4 ? '23.8%' : columns === 2 ? '48.5%' : '100%' }, plan.popular && s.popular]}>
            {showSummary && !!plan.badge && <Text style={s.eyebrow}>{plan.badge}</Text>}
            <Text accessibilityRole="header" style={s.title}>{plan.title}</Text>
            {showSummary && <Text style={s.subtitle}>{plan.description}</Text>}
            <View style={s.priceRow}>
              <Text style={s.currency}>₹</Text>
              <Text style={s.price}>{plan.price}</Text>
              <Text style={s.once}>/ one-time</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Select ${plan.title}`}
              onPress={() => setSelected(plan)}
              style={({ pressed }) => [s.button, plan.popular && s.primaryButton, pressed && s.pressed]}>
              <Text style={[s.buttonText, plan.popular && s.primaryText]}>Select Package</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Modal visible={selected !== null} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={s.overlay}>
          <View style={s.dialog} accessibilityViewIsModal>
            <View style={s.dialogHeader}>
              <Text style={s.dialogHeading}>Package details</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close package details" onPress={() => setSelected(null)} style={s.close}>
                <MaterialCommunityIcons name="close" size={24} color={colors.white} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={s.dialogContent} showsVerticalScrollIndicator>
              {selected && <>
                {!!selected.badge && <Text style={s.eyebrow}>{selected.badge}</Text>}
                <Text accessibilityRole="header" style={s.title}>{selected.title}</Text>
                <Text style={s.subtitle}>{selected.description}</Text>
                <View style={s.priceRow}>
                  <Text style={s.currency}>₹</Text>
                  <Text style={s.price}>{selected.price}</Text>
                  <Text style={s.once}>/ one-time</Text>
                </View>
            <View style={s.details}>
              <View style={s.detailRow}>
                <MaterialCommunityIcons name="phone-in-talk-outline" size={20} color={colors.legal.accent} />
                <Text style={s.detailText}><Text style={s.bold}>{selected.consultations}</Text> Advocate {selected.consultations === 1 ? 'Consultation' : 'Consultations'}</Text>
              </View>
              <View style={s.detailRow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={colors.legal.accent} />
                <Text style={s.detailText}><Text style={s.bold}>{selected.days} {selected.days === 1 ? 'Day' : 'Days'}</Text> Estimated Turnaround</Text>
              </View>
            </View>
            <View style={s.features}>
              {selected.features.map((feature) => (
                <View key={feature} style={s.feature}>
                  <MaterialCommunityIcons name="check-circle-outline" size={20} color={colors.legal.accent} />
                  <Text style={s.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

              </>}
            </ScrollView>
            <Pressable accessibilityRole="button" onPress={() => setSelected(null)} style={[s.button, s.primaryButton, s.done]}>
              <Text style={[s.buttonText, s.primaryText]}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  section: { marginTop: spacing.xxl, gap: spacing.xxxl },
  header: { alignItems: 'center', gap: spacing.lg },
  eyebrow: { ...typography.label, fontWeight: '800', letterSpacing: 1, color: colors.legal.accent, textAlign: 'center' },
  heading: { ...typography.hero, color: colors.white, textAlign: 'center', fontWeight: '800' },
  subtitle: { ...typography.small, color: colors.legal.muted, lineHeight: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.xl, alignItems: 'stretch' },
  card: { backgroundColor: colors.legal.surface, borderWidth: 1, borderColor: colors.legal.border, borderRadius: radii.xl, padding: spacing.lg, gap: spacing.md },
  popular: { borderColor: colors.legal.accent, backgroundColor: colors.legal.featured },
  title: { ...typography.h2, color: colors.white, fontWeight: '800' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', marginTop: spacing.lg, gap: spacing.xs },
  currency: { ...typography.h2, color: colors.legal.accent, fontWeight: '800' },
  price: { fontSize: 40, lineHeight: 48, fontWeight: '800', color: colors.white },
  once: { ...typography.caption, color: colors.legal.muted },
  details: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.legal.secondaryBorder, paddingVertical: spacing.lg, gap: spacing.md },
  detailRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  detailText: { ...typography.small, color: colors.white, flex: 1 },
  bold: { fontWeight: '700' },
  features: { gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.lg },
  feature: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.legal.secondaryBorder, backgroundColor: colors.legal.secondary },
  featureText: { ...typography.small, color: colors.white, fontWeight: '600', flex: 1 },
  button: { minHeight: 58, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.legal.secondaryBorder, borderRadius: radii.md, padding: spacing.md, backgroundColor: colors.legal.secondary, marginTop: 'auto' },
  primaryButton: { backgroundColor: colors.legal.accent, borderColor: colors.legal.accent },
  buttonText: { ...typography.body, color: colors.white, fontWeight: '800' },
  primaryText: { color: colors.legal.background },
  overlay: { flex: 1, backgroundColor: colors.legal.background, opacity: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  dialog: { width: '100%', maxWidth: 640, maxHeight: '90%', backgroundColor: colors.legal.surface, borderWidth: 1, borderColor: colors.legal.border, borderRadius: radii.xl, overflow: 'hidden', flexShrink: 1 },
  dialogHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.legal.border },
  dialogHeading: { ...typography.label, color: colors.white },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dialogContent: { padding: spacing.lg, gap: spacing.md },
  done: { margin: spacing.md, marginTop: spacing.sm },
  pressed: { opacity: 0.75 },
});
