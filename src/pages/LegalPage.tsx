import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { LegalPackages } from '@/components/LegalPackages';
import { LegalProcess } from '@/components/LegalProcess';

type Icon = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
const benefits: { title: string; icon: Icon }[] = [
  { title: '100% Verified Advocates', icon: 'account-check-outline' },
  { title: 'Confidential & Secure', icon: 'lock-outline' },
  { title: 'Fixed Transparent Pricing', icon: 'ribbon' },
  { title: 'Zero Conflict of Interest', icon: 'shield-outline' },
];

const legalComparison = [
  { feature: 'Lawyer Selection', gatedPlus: 'Automated matching with verified property law specialists', traditional: 'Random references with unknown real-estate specialization' },
  { feature: 'Pricing Structure', gatedPlus: 'Fixed, upfront, all-inclusive pricing with zero hidden retainers', traditional: 'Unpredictable hourly retainers and variable consultation charges' },
  { feature: 'Turnaround SLA', gatedPlus: 'Strict 1 to 7 day delivery with live online milestone tracking', traditional: 'Weeks to months with no commitment or online tracking' },
  { feature: 'Document Collection', gatedPlus: 'Digital portal uploads + Doorstep physical verification service', traditional: 'Client must physically photocopy and deliver thick file bundles' },
  { feature: 'Deliverable', gatedPlus: '10-Section comprehensive stamped report with digital audit trail', traditional: 'Often just a brief verbal opinion or single-page letter' },
];

const individualLegalServices = [
  { title: 'Property Document Verification', description: 'Comprehensive review of property title deeds and ownership papers.', price: '1,499', days: 2, details: 'Our specialized real estate advocates scrutinize parent deeds, link documents, and sanctioned plans to verify legal validity.' },
  { title: 'Title Verification', description: 'Detailed 30-year chain of title ownership investigation.', price: '2,499', days: 3, details: 'Exhaustive verification of ownership transfer sequence across the past 30 years to protect against undisclosed claims.' },
  { title: 'Encumbrance Review', description: 'Analysis of official EC for active mortgages, charges, or court stays.', price: '999', days: 2, details: 'Detailed check of registered liabilities, bank mortgages, and legal disputes recorded with the sub-registrar office.' },
  { title: 'Sale Agreement Review', description: 'Clauses scrutiny to protect buyer interests and advance payments.', price: '1,999', days: 2, details: 'Advocate examination of Agreement of Sale terms, penalty clauses, possession dates, and refund contingencies.' },
  { title: 'Sale Deed Review', description: 'Final conveyance draft examination prior to registration.', price: '1,999', days: 2, details: 'Verification of boundaries, schedule of property, consideration, and indemnity clauses before signing.' },
  { title: 'Written Legal Opinion', description: 'Formal written advisory by senior High Court / RERA advocate.', price: '2,999', days: 4, details: 'Comprehensive legal health report suitable for bank mortgage processing and dispute prevention.' },
  { title: 'Property Due Diligence', description: 'Full spectrum 360° legal, revenue, RERA, and municipal audit.', price: '4,999', days: 5, details: 'Complete end-to-end legal clearance covering revenue records, layout approvals, zoning, master plans, and litigation searches.' },
  { title: 'Custom Legal Consultation', description: '1-on-1 direct telephonic/video consultation with real estate counsel.', price: '1,499', days: 1, details: 'Discuss unique property inheritance, partition, tenant eviction, or boundary dispute scenarios.' },
];

export default function LegalPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [scopeTab, setScopeTab] = useState<'packages' | 'individual'>('packages');
  const [selectedService, setSelectedService] = useState<(typeof individualLegalServices)[number] | null>(null);

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to services" style={s.back}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/services')}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.legal.muted} />
          <Text style={s.backLabel}>Services</Text>
        </Pressable>
        <View style={s.hero}>
          <View style={s.badge}>
            <MaterialCommunityIcons name="shield-outline" size={18} color={colors.legal.accent} />
            <Text style={s.badgeText}>GATEDPLUS LEGAL ASSISTANCE</Text>
          </View>
          <View style={s.headings}>
            <Text accessibilityRole="header" style={[s.heading, wide && s.headingWide]}>Buy Property with Confidence.</Text>
            <Text style={[s.heading, wide && s.headingWide, s.accent]}>Verify Before You Commit.</Text>
          </View>
          <Text style={[s.description, wide && s.descriptionWide]}>Specialized property advocates review title chains, encumbrance certificates, master plan zoning, and agreement clauses. Protect your hard-earned investment with transparent, fixed-price legal assurance.</Text>
          <View style={[s.actions, !wide && s.actionsMobile]}>
            <Pressable accessibilityRole="button" onPress={() => { setScopeTab('packages'); setVerificationOpen(true); }}
              style={({ pressed }) => [s.button, s.primaryButton, pressed && s.pressed]}>
              <Text style={s.primaryLabel}>Start Legal Verification</Text>
              <MaterialCommunityIcons name="arrow-right" size={22} color={colors.legal.background} />
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => Alert.alert('Track Existing Case', 'Case tracking is coming soon.')}
              style={({ pressed }) => [s.button, s.secondaryButton, pressed && s.pressed]}>
              <Text style={s.secondaryLabel}>Track Existing Case</Text>
            </Pressable>
          </View>
        </View>
        <View style={s.benefits}>
          {benefits.map((benefit) => (
            <View key={benefit.title} style={s.benefit}>
              <View style={s.icon}><MaterialCommunityIcons name={benefit.icon} size={28} color={colors.legal.accent} /></View>
              <Text style={s.benefitTitle}>{benefit.title}</Text>
            </View>
          ))}
        </View>
        <LegalPackages />
        <LegalProcess />
        <View style={s.comparisonSection}>
          <View style={s.comparisonHeading}>
            <Text style={s.comparisonEyebrow}>ADVANTAGE</Text>
            <Text accessibilityRole="header" style={s.comparisonTitle}>Why GatedPlus Legal?</Text>
            <Text style={s.description}>How GatedPlus modernized real estate legal advisory compared to traditional methods.</Text>
          </View>
          {!wide && <Text style={s.tableHint}>Swipe to compare →</Text>}
          <View style={s.tableFrame}>
            <ScrollView horizontal showsHorizontalScrollIndicator={!wide}>
              <View style={{ width: Math.max(820, Math.min(width - spacing.md * 2, 1200 - spacing.md * 2)) }}>
                <View style={[s.tableRow, s.tableHeader]}>
                  <View style={s.featureCell}><Text style={s.tableHeaderText}>FEATURE</Text></View>
                  <View style={[s.comparisonCell, s.highlightHeader]}><Text style={[s.tableHeaderText, s.accent]}>GATEDPLUS LEGAL</Text></View>
                  <View style={s.comparisonCell}><Text style={s.tableHeaderText}>TRADITIONAL LAWYER</Text></View>
                </View>
                {legalComparison.map((row) => (
                  <View key={row.feature} style={s.tableRow}>
                    <View style={s.featureCell}><Text style={s.tableText}>{row.feature}</Text></View>
                    <View style={[s.comparisonCell, s.highlightCell]}><Text style={[s.tableText, s.gatedPlusText]}>{row.gatedPlus}</Text></View>
                    <View style={s.comparisonCell}><Text style={s.tableText}>{row.traditional}</Text></View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      <Modal visible={verificationOpen} animationType="slide" onRequestClose={() => setVerificationOpen(false)}>
        <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
          <StatusBar style="light" />
          <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
            <Pressable accessibilityRole="button" accessibilityLabel="Back to legal overview" style={s.back} onPress={() => setVerificationOpen(false)}>
              <MaterialCommunityIcons name="arrow-left" size={20} color={colors.legal.muted} />
              <Text style={s.backLabel}>Legal overview</Text>
            </Pressable>
            <View style={s.hero}>
              <View style={s.badge}>
                <MaterialCommunityIcons name="shield-outline" size={18} color={colors.legal.accent} />
                <Text style={[s.badgeText, s.scopeBadgeText]}>COMPREHENSIVE PROPERTY LEGAL SERVICES</Text>
              </View>
              <Text accessibilityRole="header" style={[s.heading, wide && s.scopeHeadingWide]}>Choose Your Legal Verification Scope</Text>
              <Text style={s.description}>Select all-in-one curated packages or bespoke single-service legal scrutinies conducted by verified High Court advocates.</Text>
              <View style={[s.actions, !wide && s.actionsMobile]}>
                <Pressable accessibilityRole="tab" accessibilityState={{ selected: scopeTab === 'packages' }}
                  onPress={() => setScopeTab('packages')} style={[s.button, scopeTab === 'packages' ? s.primaryButton : s.secondaryButton]}>
                  <Text style={scopeTab === 'packages' ? s.primaryLabel : s.secondaryLabel}>Legal Packages (Recommended)</Text>
                </Pressable>
                <Pressable accessibilityRole="tab" accessibilityState={{ selected: scopeTab === 'individual' }}
                  onPress={() => setScopeTab('individual')} style={[s.button, scopeTab === 'individual' ? s.primaryButton : s.secondaryButton]}>
                  <Text style={scopeTab === 'individual' ? s.primaryLabel : s.secondaryLabel}>Individual Legal Services</Text>
                </Pressable>
              </View>
            </View>
            {scopeTab === 'packages' ? <LegalPackages hideHeader showSummary /> : (
              <View style={s.individualGrid}>
                {individualLegalServices.map((service) => (
                  <View key={service.title} style={s.individualCard}>
                    <Text accessibilityRole="header" style={s.compactServiceTitle}>{service.title}</Text>
                    <View style={s.compactPriceRow}>
                      <Text style={s.compactCurrency}>₹</Text>
                      <Text style={s.compactPrice}>{service.price}</Text>
                    </View>
                    <Pressable accessibilityRole="button" accessibilityLabel={`Select ${service.title}`}
                      onPress={() => setSelectedService(service)}
                      style={({ pressed }) => [s.button, s.secondaryButton, s.selectService, pressed && s.pressed]}>
                      <Text style={s.compactButtonLabel}>Select Service</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
          <Modal visible={selectedService !== null} transparent animationType="fade" onRequestClose={() => setSelectedService(null)}>
            <View style={s.serviceOverlay}>
              <View style={s.serviceDialog} accessibilityViewIsModal>
                <View style={s.serviceDialogHeader}>
                  <Text style={s.secondaryLabel}>Service details</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel="Close service details" style={s.serviceClose} onPress={() => setSelectedService(null)}>
                    <MaterialCommunityIcons name="close" size={24} color={colors.white} />
                  </Pressable>
                </View>
                <ScrollView contentContainerStyle={s.serviceDialogContent}>
                  {selectedService && <>
                    <Text accessibilityRole="header" style={s.individualTitle}>{selectedService.title}</Text>
                    <Text style={s.individualDescription}>{selectedService.description}</Text>
                    <View style={s.individualPriceRow}>
                      <Text style={s.individualCurrency}>₹</Text>
                      <Text style={s.individualPrice}>{selectedService.price}</Text>
                    </View>
                    <View style={s.turnaround}>
                      <MaterialCommunityIcons name="clock-outline" size={18} color={colors.legal.accent} />
                      <Text style={s.tableText}><Text style={s.gatedPlusText}>{selectedService.days} {selectedService.days === 1 ? 'Day' : 'Days'}</Text> Turnaround</Text>
                    </View>
                    <Text style={s.individualDescription}>{selectedService.details}</Text>
                  </>}
                </ScrollView>
                <Pressable accessibilityRole="button" onPress={() => setSelectedService(null)} style={[s.button, s.primaryButton, s.serviceDone]}>
                  <Text style={s.primaryLabel}>Done</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

export { LegalPage };

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.legal.background },
  content: { width: '100%', maxWidth: 1200, alignSelf: 'center', padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.lg },
  back: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start', minHeight: 44 },
  backLabel: { ...typography.label, color: colors.legal.muted },
  hero: { alignItems: 'center', gap: spacing.xl, paddingBottom: spacing.lg },
  badge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.primaryDark, backgroundColor: colors.legal.accentSoft, borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  badgeText: { ...typography.caption, fontWeight: '800', color: colors.legal.accent, letterSpacing: 0.5 },
  headings: { gap: spacing.sm, maxWidth: 1100 },
  heading: { ...typography.hero, textAlign: 'center', color: colors.white, fontWeight: '800' },
  headingWide: { fontSize: 56, lineHeight: 68 },
  accent: { color: colors.legal.accent },
  description: { ...typography.body, textAlign: 'center', color: colors.legal.muted, maxWidth: 1000 },
  descriptionWide: { fontSize: 22, lineHeight: 36 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, justifyContent: 'center' },
  actionsMobile: { flexDirection: 'column', width: '100%', maxWidth: 420 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, minHeight: 64, borderRadius: radii.md },
  primaryButton: { backgroundColor: colors.legal.accent },
  primaryLabel: { ...typography.body, fontWeight: '800', color: colors.legal.background },
  secondaryButton: { backgroundColor: colors.legal.secondary, borderWidth: 1, borderColor: colors.legal.secondaryBorder },
  secondaryLabel: { ...typography.body, fontWeight: '700', color: colors.white },
  benefits: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  benefit: { flexBasis: '45%', flexGrow: 1, flexShrink: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.legal.border, borderRadius: radii.lg, backgroundColor: colors.legal.surface, padding: spacing.md, minHeight: 140 },
  icon: { width: 50, height: 50, borderRadius: radii.md, backgroundColor: colors.legal.accentSoft, alignItems: 'center', justifyContent: 'center' },
  benefitTitle: { ...typography.label, fontWeight: '800', color: colors.white, textAlign: 'center' },
  pressed: { opacity: 0.75 },
  comparisonSection: { marginTop: spacing.xxl, gap: spacing.md },
  comparisonHeading: { alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg },
  comparisonEyebrow: { ...typography.label, fontWeight: '800', letterSpacing: 1, color: colors.legal.accent },
  comparisonTitle: { ...typography.hero, fontWeight: '800', color: colors.white, textAlign: 'center' },
  tableHint: { ...typography.caption, color: colors.legal.muted },
  tableFrame: { borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.legal.surface },
  tableRow: { flexDirection: 'row', alignItems: 'stretch', borderBottomWidth: 1, borderBottomColor: colors.legal.border },
  tableHeader: { backgroundColor: colors.legal.featured },
  featureCell: { width: '20%', padding: spacing.lg, justifyContent: 'center' },
  comparisonCell: { width: '40%', padding: spacing.lg, justifyContent: 'center' },
  highlightHeader: { backgroundColor: colors.legal.border },
  highlightCell: { backgroundColor: colors.legal.secondary },
  tableHeaderText: { ...typography.label, fontWeight: '800', color: colors.white },
  tableText: { ...typography.small, lineHeight: 24, color: colors.white },
  gatedPlusText: { fontWeight: '700' },
  scopeHeadingWide: { fontSize: 44, lineHeight: 56 },
  scopeBadgeText: { flexShrink: 1, textAlign: 'center' },
  individualGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg, marginTop: spacing.lg, alignItems: 'stretch' },
  individualCard: { width: '48.5%', padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.legal.border, borderRadius: radii.lg, backgroundColor: colors.legal.surface },
  individualTitle: { ...typography.h2, fontWeight: '800', color: colors.white },
  individualDescription: { ...typography.small, lineHeight: 24, color: colors.legal.muted },
  individualPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: spacing.md, marginBottom: spacing.sm },
  individualCurrency: { ...typography.h2, fontWeight: '800', color: colors.legal.accent },
  individualPrice: { fontSize: 40, lineHeight: 48, fontWeight: '800', color: colors.white },
  turnaround: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.legal.secondaryBorder, paddingVertical: spacing.lg, marginBottom: spacing.sm },
  selectService: { marginTop: 'auto', paddingHorizontal: spacing.xs, paddingVertical: spacing.sm, minHeight: 44 },
  compactServiceTitle: { ...typography.label, color: colors.white, fontWeight: '800' },
  compactPriceRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', marginVertical: spacing.sm },
  compactCurrency: { ...typography.h3, color: colors.legal.accent, fontWeight: '800' },
  compactPrice: { ...typography.h2, color: colors.white, fontWeight: '800' },
  compactButtonLabel: { ...typography.caption, color: colors.white, fontWeight: '700', textAlign: 'center' },
  serviceOverlay: { flex: 1, backgroundColor: colors.legal.background, justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  serviceDialog: { width: '100%', maxWidth: 640, maxHeight: '90%', flexShrink: 1, backgroundColor: colors.legal.surface, borderWidth: 1, borderColor: colors.legal.border, borderRadius: radii.xl, overflow: 'hidden' },
  serviceDialogHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.legal.border },
  serviceClose: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  serviceDialogContent: { padding: spacing.lg, gap: spacing.md },
  serviceDone: { margin: spacing.md },
});
