import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

const steps = [
  { title: 'Select Package or Service', description: 'Choose the exact scope of legal scrutiny required for your property transaction.' },
  { title: 'Choose Property', description: 'Select a verified GatedPlus listing or input details of any property found elsewhere.' },
  { title: 'Instant Order & Payment', description: 'Pay transparent fixed fees securely via UPI, NetBanking, or Credit/Debit Cards.' },
  { title: 'Lawyer Auto-Assignment', description: 'GatedPlus assigns the top-scoring verified property advocate matching your jurisdiction.' },
  { title: 'Document Collection', description: 'Upload digital copies or request Doorstep Document Verification for physical papers.' },
  { title: 'Multi-Tier Scrutiny', description: 'Advocate examines 30-year title deeds, encumbrance, tax, master plan, and approvals.' },
  { title: 'Advocate Consultations', description: 'Schedule 1-on-1 Video/Phone consultations to discuss risks and next steps.' },
  { title: 'Stamped Final Report', description: 'Receive a detailed 10-section signed legal verification report with clear title opinion.' },
];

export function LegalProcess() {
  const [selected, setSelected] = useState<number | null>(null);
  const labels = ['Select package', 'Add property', 'Payment', 'Lawyer assigned', 'Documents', 'Legal scrutiny', 'Consultation', 'Final report'];

  return (
    <View style={s.section}>
      <View style={s.header}>
        <Text style={s.eyebrow}>SEAMLESS PROCESS</Text>
        <Text accessibilityRole="header" style={s.heading}>How GatedPlus Legal Works</Text>
        <Text style={s.subtitle}>8 simple steps. Tap a step to learn more.</Text>
      </View>
      <View style={s.grid}>
        {[0, 4].map((offset) => (
          <View key={offset} style={s.row}>
            <View style={s.connector} />
            {steps.slice(offset, offset + 4).map((step, index) => {
              const position = offset + index;
              const active = selected === position;
              return (
                <Pressable key={step.title} accessibilityRole="button"
                  accessibilityLabel={`Step ${position + 1}: ${step.title}`}
                  accessibilityState={{ expanded: active }}
                  onPress={() => setSelected(active ? null : position)}
                  style={({ pressed }) => [s.step, pressed && s.pressed]}>
                  <View style={[s.numberBadge, active && s.activeBadge]}>
                    <Text style={[s.number, active && s.activeNumber]}>{position + 1}</Text>
                  </View>
                  <Text style={[s.title, active && s.activeTitle]}>{labels[position]}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
        {selected !== null && <View style={s.detail} accessibilityLiveRegion="polite">
          <Text style={s.detailTitle}>{selected + 1}. {steps[selected].title}</Text>
          <Text style={s.description}>{steps[selected].description}</Text>
        </View>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  section: { marginTop: spacing.xl, gap: spacing.lg },
  header: { alignItems: 'center', gap: spacing.sm },
  eyebrow: { ...typography.label, fontWeight: '800', letterSpacing: 1, color: colors.legal.accent, textAlign: 'center' },
  heading: { ...typography.h2, fontWeight: '800', color: colors.white, textAlign: 'center' },
  subtitle: { ...typography.caption, color: colors.legal.muted, textAlign: 'center' },
  grid: { width: '100%', maxWidth: 720, alignSelf: 'center', gap: spacing.md, paddingVertical: spacing.md },
  row: { flexDirection: 'row' },
  connector: { position: 'absolute', top: 22, left: '12.5%', right: '12.5%', height: 1, backgroundColor: colors.legal.border },
  step: { width: '25%', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xs },
  numberBadge: { width: 44, height: 44, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.legal.accent, backgroundColor: colors.legal.surface, alignItems: 'center', justifyContent: 'center' },
  activeBadge: { backgroundColor: colors.legal.accent },
  number: { ...typography.h3, fontWeight: '800', color: colors.legal.accent },
  activeNumber: { color: colors.legal.background },
  title: { ...typography.caption, fontSize: 12, fontWeight: '600', color: colors.legal.muted, textAlign: 'center' },
  activeTitle: { color: colors.white },
  detail: { borderLeftWidth: 2, borderLeftColor: colors.legal.accent, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.xs },
  detailTitle: { ...typography.label, color: colors.white },
  pressed: { opacity: 0.7 },
  description: { ...typography.small, lineHeight: 24, color: colors.legal.muted },
});
