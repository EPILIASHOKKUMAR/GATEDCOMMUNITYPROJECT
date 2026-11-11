import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import Slider from '@react-native-community/slider';

const financialHighlights = [
  { value: '8.35%*', label: 'Lowest Starting Interest Rate' },
  { value: 'Up to 30 Yrs', label: 'Flexible Loan Tenures' },
  { value: '90%', label: 'Maximum Property Funding' },
  { value: '6+ Top Banks', label: 'Verified Lending Partners' },
];

type FinancialIcon = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
const financialServices: { title: string; description: string; rate: string; maxYears: number; action: string; icon: FinancialIcon; popular?: boolean }[] = [
  { title: 'Home Loan (Purchase)', description: 'Financing for ready-to-move and under-construction apartments, villas, and independent houses in verified communities.', rate: '8.35%', maxYears: 30, action: 'Apply for Home Loan', icon: 'home', popular: true },
  { title: 'Property / Plot Loan', description: 'Tailored financing for purchasing residential plots, layout land, and gated parcel investments with fast documentation.', rate: '8.65%', maxYears: 20, action: 'Apply for Property Loan', icon: 'office-building' },
  { title: 'Home Construction Loan', description: 'Tranche-based milestone financing to construct your dream house or villa on owned residential land or gated plot.', rate: '8.50%', maxYears: 25, action: 'Apply for Construction Loan', icon: 'hammer' },
  { title: 'Loan Against Property (LAP)', description: 'Unlock high-value liquidity for personal or business growth by mortgaging your existing residential or commercial property.', rate: '9.25%', maxYears: 15, action: 'Apply for LAP', icon: 'hand-coin-outline' },
];

function calculateMonthlyEmi(amount: number, annualRate: number, tenureYears: number) {
  const months = tenureYears * 12;
  if (annualRate === 0) return amount / months;
  const rate = annualRate / 1200;
  const growth = Math.pow(1 + rate, months);
  return amount * rate * growth / (growth - 1);
}

const formatRupees = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

const partnerBanks = [
  { name: 'Apex Premier Bank', category: 'BANK', mark: 'HDFC', rate: '8.35%' },
  { name: 'Axis Bank Home Loans', category: 'PRIVATE BANK', mark: 'AXIS', rate: '8.45%' },
  { name: 'Bajaj Housing Finance Limited', category: 'HOUSING FINANCE COMPANY', mark: 'BAJA', rate: '8.45%' },
  { name: 'HDFC Bank Home Loans', category: 'PRIVATE BANK', mark: 'HDFC', rate: '8.35%' },
  { name: 'Horizon Financial Bank', category: 'BANK', mark: 'ICIC', rate: '8.35%' },
  { name: 'ICICI Bank Home Finance', category: 'PRIVATE BANK', mark: 'ICIC', rate: '8.40%' },
  { name: 'National Trust Housing Finance', category: 'NBFC', mark: 'SBI_', rate: '8.35%' },
  { name: 'PNB Housing Finance', category: 'HOUSING FINANCE COMPANY', mark: 'PNB_', rate: '8.50%' },
  { name: 'Sandbox Partner Bank', category: 'BANK', mark: 'MOCK', rate: '8.35%' },
  { name: 'State Bank of India (SBI Home Loans)', category: 'PUBLIC BANK', mark: 'SBI', rate: '8.40%' },
  { name: 'Test Provider 798003', category: 'PUBLIC BANK', mark: 'TEST', rate: '8.35%' },
  { name: 'Test Provider a76b1d', category: 'PUBLIC BANK', mark: 'TEST', rate: '8.35%' },
];

export default function FinancialPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const serviceColumns = width >= 1100 ? 4 : width >= 650 ? 2 : 1;
  const pageScroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const calculatorY = useRef(0);
  const [calculatorAmount, setCalculatorAmount] = useState(5000000);
  const [calculatorRate, setCalculatorRate] = useState(8.5);
  const [calculatorYears, setCalculatorYears] = useState(20);
  const calculatorEmi = calculateMonthlyEmi(calculatorAmount, calculatorRate, calculatorYears);
  const totalPayable = calculatorEmi * calculatorYears * 12;
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [loanAmount, setLoanAmount] = useState('5000000');
  const [years, setYears] = useState(20);
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [amountError, setAmountError] = useState('');
  const applicationScroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const selectedService = financialServices[serviceIndex];
  const principal = Number(loanAmount);
  const months = years * 12;
  const emi = principal > 0 && Number.isFinite(principal) ? calculateMonthlyEmi(principal, parseFloat(selectedService.rate), years) : 0;
  const formattedEmi = Math.round(emi).toLocaleString('en-IN');
  function selectLoan(index: number) {
    setServiceIndex(index);
    setYears((previous) => Math.min(previous, financialServices[index].maxYears));
  }
  function openApplication(index = serviceIndex, initialStep = 0) {
    selectLoan(index);
    setStep(initialStep);
    setApplicationOpen(true);
  }
  function nextStep() {
    if (step === 0) {
      setStep(1);
      applicationScroll.current?.scrollTo({ y: 0, animated: false });
      return;
    }
    if (!Number.isSafeInteger(principal) || principal <= 0) {
      setAmountError('Enter a valid loan amount greater than zero.');
      applicationScroll.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    setAmountError('');
    Alert.alert('Loan details ready', 'The Property Info step is coming soon. Your entries remain in this form; no application has been submitted.');
  }

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView ref={pageScroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to services" style={s.back}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/services')}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.financial.muted} />
          <Text style={s.backLabel}>Services</Text>
        </Pressable>
        <View style={s.hero}>
          <View style={s.badge}>
            <MaterialCommunityIcons name="shield-half-full" size={20} color={colors.financial.accent} />
            <Text style={s.badgeText}>GatedPlus Financial Advisory & Loans</Text>
          </View>
          <Text accessibilityRole="header" style={[s.heading, wide && s.headingWide]}>Empowering Your Property Dreams with <Text style={s.accent}>Smart Financing</Text></Text>
          <Text style={[s.description, wide && s.descriptionWide]}>Get instant access to verified home loans, plot financing, construction loans, and loan against property from India’s top banking & NBFC institutions.</Text>
          <View style={[s.actions, !wide && s.actionsMobile]}>
            <Pressable accessibilityRole="button" onPress={() => openApplication()}
              style={({ pressed }) => [s.button, s.primaryButton, pressed && s.pressed]}>
              <Text style={s.buttonText}>Apply for Financial Help</Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color={colors.white} />
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => Alert.alert('My Financial Requests', 'Financial request tracking is coming soon.')}
              style={({ pressed }) => [s.button, s.secondaryButton, pressed && s.pressed]}>
              <MaterialCommunityIcons name="format-list-bulleted" size={22} color={colors.white} />
              <Text style={s.buttonText}>My Financial Requests</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => pageScroll.current?.scrollTo({ y: calculatorY.current, animated: true })}
              style={({ pressed }) => [s.button, s.secondaryButton, pressed && s.pressed]}>
              <MaterialCommunityIcons name="calculator-variant-outline" size={22} color={colors.white} />
              <Text style={s.buttonText}>Calculate EMI</Text>
            </Pressable>
          </View>
        </View>
        <View style={s.highlights}>
          {financialHighlights.map((highlight) => (
            <View key={highlight.label} style={[s.highlight, { width: wide ? '23%' : '48%' }]}>
              <Text style={s.highlightValue}>{highlight.value}</Text>
              <Text style={s.highlightLabel}>{highlight.label}</Text>
            </View>
          ))}
        </View>
        <Text style={s.note}>*Illustrative lending highlights. Rates, funding, tenure and partner availability are subject to lender confirmation and eligibility.</Text>
        <View style={s.servicesSection}>
          <Text accessibilityRole="header" style={s.servicesTitle}>Select a Financial Assistance Service</Text>
          <Text style={s.servicesIntro}>Choose from our initial specialized financing products tailored for gated communities, villas, apartments, and land buyers.</Text>
          <View style={s.serviceGrid}>
            {financialServices.map((service, index) => (
              <View key={service.title} style={[s.serviceCard, { width: serviceColumns === 4 ? '23.5%' : serviceColumns === 2 ? '48.5%' : '100%' }, service.popular && s.popularCard]}>
                <View style={s.serviceTop}>
                  <View style={s.serviceIcon}><MaterialCommunityIcons name={service.icon} size={32} color={colors.financial.primary} /></View>
                  {service.popular && <Text style={s.popularBadge}>Most Popular</Text>}
                </View>
                <Text accessibilityRole="header" style={s.serviceTitle}>{service.title}</Text>
                <Text style={s.serviceDescription}>{service.description}</Text>
                <View style={s.serviceBottom}>
                  <View style={s.loanTerms}>
                    <View style={s.term}><Text style={s.termLabel}>INTEREST RATE</Text><Text style={s.termValue}>From {service.rate} p.a.</Text></View>
                    <View style={s.term}><Text style={s.termLabel}>MAX TENURE</Text><Text style={s.termValue}>{service.maxYears} Years</Text></View>
                  </View>
                  <Pressable accessibilityRole="button" accessibilityLabel={service.action}
                    onPress={() => openApplication(index)}
                    style={({ pressed }) => [s.button, s.applyButton, pressed && s.primaryButton]}>
                    {({ pressed }) => <>
                      <Text style={[s.applyLabel, pressed && s.applyLabelPressed]}>{service.action}</Text>
                      <MaterialCommunityIcons name="arrow-right" size={24} color={pressed ? colors.white : colors.financial.primary} />
                    </>}
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
          <Text style={s.servicesNote}>Illustrative rates and tenures shown for comparison; actual offers depend on lender confirmation and eligibility.</Text>
        </View>
        <View style={s.servicesSection} onLayout={(event) => { calculatorY.current = event.nativeEvent.layout.y; }}>
          <Text accessibilityRole="header" style={s.servicesTitle}>Interactive Loan EMI Calculator</Text>
          <Text style={s.servicesIntro}>Plan your budget and estimate your monthly obligations with adjustable interest rates.</Text>
          <View style={[s.calculatorPanel, !wide && s.calculatorStack]}>
            <View style={s.calculatorControls}>
              <View style={s.calculatorField}>
                <View style={s.calculatorLabelRow}><Text style={s.fieldLabel}>Loan Amount (INR)</Text><Text style={s.calculatorValue}>{formatRupees(calculatorAmount)}</Text></View>
                <Slider accessibilityLabel="Calculator loan amount in rupees" minimumValue={500000} maximumValue={50000000} step={50000} value={calculatorAmount} onValueChange={setCalculatorAmount} minimumTrackTintColor={colors.financial.primary} maximumTrackTintColor={colors.borderStrong} thumbTintColor={colors.financial.primary} style={s.tenureSlider} />
                <View style={s.rangeLabels}><Text style={s.choiceDescription}>₹5 Lakh</Text><Text style={s.choiceDescription}>₹5 Crore</Text></View>
              </View>
              <View style={s.calculatorField}>
                <View style={s.calculatorLabelRow}><Text style={s.fieldLabel}>Interest Rate (% p.a.)</Text><Text style={s.calculatorValue}>{calculatorRate.toFixed(2).replace(/0$/, '')}%</Text></View>
                <Slider accessibilityLabel="Calculator annual interest rate" minimumValue={7.5} maximumValue={15} step={0.05} value={calculatorRate} onValueChange={(value) => setCalculatorRate(Number(value.toFixed(2)))} minimumTrackTintColor={colors.financial.primary} maximumTrackTintColor={colors.borderStrong} thumbTintColor={colors.financial.primary} style={s.tenureSlider} />
                <View style={s.rangeLabels}><Text style={s.choiceDescription}>7.5%</Text><Text style={s.choiceDescription}>15.0%</Text></View>
              </View>
              <View style={s.calculatorField}>
                <View style={s.calculatorLabelRow}><Text style={s.fieldLabel}>Loan Tenure (Years)</Text><Text style={s.calculatorValue}>{calculatorYears} {calculatorYears === 1 ? 'Year' : 'Years'}</Text></View>
                <Slider accessibilityLabel="Calculator loan tenure in years" minimumValue={1} maximumValue={30} step={1} value={calculatorYears} onValueChange={setCalculatorYears} minimumTrackTintColor={colors.financial.primary} maximumTrackTintColor={colors.borderStrong} thumbTintColor={colors.financial.primary} style={s.tenureSlider} />
                <View style={s.rangeLabels}><Text style={s.choiceDescription}>1 Year</Text><Text style={s.choiceDescription}>30 Years</Text></View>
              </View>
            </View>
            <View style={s.calculatorResult}>
              <Text style={s.resultHeading}>ESTIMATED MONTHLY EMI</Text>
              <Text style={s.resultEmi}>{formatRupees(calculatorEmi)}</Text>
              <View style={s.resultTotals}>
                {[{ label: 'Principal Amount', value: calculatorAmount }, { label: 'Total Interest', value: totalPayable - calculatorAmount }, { label: 'Total Payable', value: totalPayable }].map((item) => (
                  <View key={item.label} style={s.resultTotal}><Text style={s.resultTotalLabel}>{item.label}</Text><Text style={s.resultTotalValue}>{formatRupees(item.value)}</Text></View>
                ))}
              </View>
            </View>
          </View>
          <Text style={s.servicesNote}>Illustrative estimate at your selected rate. Excludes fees, insurance and rate changes; this is not a lender offer.</Text>
        </View>
        <View style={s.servicesSection}>
          <Text accessibilityRole="header" style={s.servicesTitle}>Partner Banks & Lending Institutions</Text>
          <Text style={s.servicesIntro}>GatedPlus partners with India’s leading public and private banks to ensure maximum loan approval rates.</Text>
          <View style={s.partnerGrid}>
            {partnerBanks.map((bank) => (
              <View key={bank.name} style={[s.partnerCard, { width: width >= 1100 ? '32.2%' : width >= 700 ? '48.5%' : '100%' }]}>
                <View style={s.bankMark}><Text style={s.bankMarkText}>{bank.mark}</Text></View>
                <View style={s.bankCopy}>
                  <Text style={s.bankName}>{bank.name}</Text>
                  <Text style={s.bankCategory}>{bank.category}</Text>
                </View>
                <View style={s.bankRateBlock}>
                  <Text style={s.bankRate}>{bank.rate}*</Text>
                  <Text style={s.bankRateLabel}>Min Rate</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={s.servicesNote}>*Sample provider list and indicative rates from the reference design, including test entries. Availability, partnerships and final rates require confirmation.</Text>
        </View>
      </ScrollView>
      <Modal visible={applicationOpen} animationType="slide" onRequestClose={() => setApplicationOpen(false)}>
        <SafeAreaView style={s.applicationScreen} edges={['top', 'bottom']}>
          <StatusBar style="dark" />
          <KeyboardAvoidingView style={s.applicationScreen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView ref={applicationScroll} keyboardShouldPersistTaps="handled" contentContainerStyle={s.applicationContent}>
              <View style={s.stepper}>
                <View style={s.stepLine} />
                {['Service', 'Loan Details', 'Property', 'Review'].map((label, index) => (
                  <View key={label} style={s.stepItem} accessibilityLabel={`${label}${index === step ? ', current step' : index < step ? ', completed' : ''}`}>
                    <View style={[s.stepCircle, index === step && s.activeStep, index < step && s.completeStep]}>
                      {index < step ? <MaterialCommunityIcons name="check" size={24} color={colors.white} /> : <Text style={[s.stepNumber, index === step && s.stepNumberActive]}>{index + 1}</Text>}
                    </View>
                    <Text style={[s.stepLabel, index === step && s.selectedStepLabel]}>{label}</Text>
                  </View>
                ))}
              </View>
              <View style={s.applicationPanel}>
                <Text accessibilityRole="header" style={s.formTitle}>{step === 0 ? 'Select Financial Assistance Type' : 'Loan Amount & Preferred Tenure'}</Text>
                <Text style={s.serviceDescription}>{step === 0 ? 'Choose the financing solution that best aligns with your real-estate needs.' : 'Specify your requested financing amount and target repayment duration.'}</Text>
                {step === 0 ? <View style={s.serviceGrid}>
                  {financialServices.map((service, index) => (
                    <Pressable key={service.title} accessibilityRole="radio" accessibilityState={{ checked: serviceIndex === index }}
                      onPress={() => selectLoan(index)} style={[s.loanChoice, { width: width >= 650 ? '48.5%' : '100%' }, serviceIndex === index && s.selectedChoice]}>
                      <MaterialCommunityIcons name={service.icon} size={28} color={colors.financial.primary} />
                      <View style={s.choiceCopy}>
                        <Text style={s.choiceTitle}>{service.title}</Text>
                        <Text style={s.choiceDescription}>{service.description}</Text>
                        <Text style={s.choiceRate}>Rates from {service.rate} p.a. • Up to {service.maxYears} Yrs</Text>
                      </View>
                    </Pressable>
                  ))}
                </View> : <View style={s.loanFields}>
                  <Text style={s.choiceTitle}>{selectedService.title}</Text>
                  <View style={s.field}>
                    <Text style={s.fieldLabel}>Requested Loan Amount (INR) <Text style={s.required}>*</Text></Text>
                    <TextInput accessibilityLabel="Requested Loan Amount in INR, required" value={loanAmount} onChangeText={(value) => { setLoanAmount(value.replace(/\D/g, '')); setAmountError(''); }} keyboardType="number-pad" maxLength={12} placeholder="Enter loan amount" placeholderTextColor={colors.textMuted} style={[s.input, !!amountError && s.invalidInput]} />
                    {!!amountError && <Text accessibilityRole="alert" style={s.required}>{amountError}</Text>}
                    <View style={s.presets}>
                      {[{ label: '₹25 Lakh', value: 2500000 }, { label: '₹50 Lakh', value: 5000000 }, { label: '₹75 Lakh', value: 7500000 }, { label: '₹1 Crore', value: 10000000 }, { label: '₹2 Crore', value: 20000000 }].map((preset) => (
                        <Pressable key={preset.value} accessibilityRole="button" accessibilityState={{ selected: principal === preset.value }} style={[s.preset, principal === preset.value && s.primaryButton]} onPress={() => { setLoanAmount(String(preset.value)); setAmountError(''); }}>
                          <Text style={[s.presetLabel, principal === preset.value && s.stepNumberActive]}>{preset.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={s.field}>
                    <Text style={s.fieldLabel}>Preferred Tenure: {years} {years === 1 ? 'Year' : 'Years'} ({months} Months)</Text>
                    <Slider key={selectedService.title} accessibilityLabel="Preferred loan tenure in years" minimumValue={1} maximumValue={selectedService.maxYears} step={1} value={years} onValueChange={(value) => setYears(Math.min(selectedService.maxYears, Math.max(1, Math.round(value))))} minimumTrackTintColor={colors.financial.primary} maximumTrackTintColor={colors.borderStrong} thumbTintColor={colors.financial.primary} style={s.tenureSlider} />
                    <View style={s.rangeLabels}><Text style={s.choiceDescription}>1 Year</Text><Text style={s.choiceDescription}>{selectedService.maxYears} Years (Max)</Text></View>
                  </View>
                  <View style={s.emiBox}>
                    <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
                    <Text style={s.emiText}>Indicative Monthly EMI: <Text style={s.bold}>₹{formattedEmi}</Text> @ ~{selectedService.rate} p.a.</Text>
                  </View>
                  <Text style={s.choiceDescription}>Estimate based on the displayed illustrative rate; actual lender offers may vary.</Text>
                  <View style={s.field}>
                    <Text style={s.fieldLabel}>Loan Purpose / Requirement Details (Optional)</Text>
                    <TextInput accessibilityLabel="Loan Purpose, optional" value={purpose} onChangeText={setPurpose} placeholder="e.g. Purchase of 3BHK flat in Green Glen Layout" placeholderTextColor={colors.textMuted} style={s.input} />
                  </View>
                  <View style={s.field}>
                    <Text style={s.fieldLabel}>Special Notes / Preferences for Advisor (Optional)</Text>
                    <TextInput accessibilityLabel="Special Notes, optional" value={notes} onChangeText={setNotes} multiline placeholder="e.g. Looking for zero prepayment charges and flexible disbursement tranches." placeholderTextColor={colors.textMuted} style={[s.input, s.notesInput]} />
                  </View>
                </View>}
                <View style={s.formFooter}>
                  <Pressable accessibilityRole="button" style={s.button} onPress={() => { if (step === 0) setApplicationOpen(false); else { setStep(0); applicationScroll.current?.scrollTo({ y: 0, animated: false }); } }}>
                    <MaterialCommunityIcons name="arrow-left" size={22} color={colors.navy} /><Text style={s.fieldLabel}>{step === 0 ? 'Cancel' : 'Back'}</Text>
                  </Pressable>
                  <Pressable accessibilityRole="button" style={[s.button, s.primaryButton]} onPress={nextStep}>
                    <Text style={s.buttonText}>{step === 0 ? 'Continue' : 'Next: Property Info'}</Text><MaterialCommunityIcons name="arrow-right" size={22} color={colors.white} />
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

export { FinancialPage };

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.financial.background },
  content: { width: '100%', maxWidth: 1400, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl, gap: spacing.xl },
  back: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start', minHeight: 44 },
  backLabel: { ...typography.label, color: colors.financial.muted },
  hero: { gap: spacing.lg },
  badge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.financial.badge, borderColor: colors.financial.badgeBorder, borderWidth: 1, borderRadius: radii.pill },
  badgeText: { ...typography.label, color: colors.financial.accent, flexShrink: 1 },
  heading: { ...typography.hero, fontWeight: '800', color: colors.white },
  headingWide: { fontSize: 54, lineHeight: 66 },
  accent: { color: colors.financial.accent },
  description: { ...typography.body, lineHeight: 28, color: colors.financial.muted, maxWidth: 850 },
  descriptionWide: { fontSize: 22, lineHeight: 36 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md, marginBottom: spacing.lg },
  actionsMobile: { flexDirection: 'column', alignItems: 'stretch' },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, minHeight: 60, borderRadius: radii.md },
  primaryButton: { backgroundColor: colors.financial.primary },
  secondaryButton: { backgroundColor: colors.financial.surface, borderWidth: 1, borderColor: colors.financial.border },
  buttonText: { ...typography.body, color: colors.white, fontWeight: '700', flexShrink: 1 },
  highlights: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg, borderTopWidth: 1, borderTopColor: colors.financial.border, paddingTop: spacing.xl },
  highlight: { gap: spacing.sm },
  highlightValue: { ...typography.hero, color: colors.white, fontWeight: '800' },
  highlightLabel: { ...typography.small, color: colors.financial.muted },
  note: { ...typography.caption, color: colors.financial.muted },
  pressed: { opacity: 0.75 },
  servicesSection: { backgroundColor: colors.backgroundAlt, marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl, gap: spacing.lg },
  servicesTitle: { ...typography.hero, fontWeight: '800', color: colors.navyDark, textAlign: 'center' },
  servicesIntro: { ...typography.body, lineHeight: 28, color: colors.textMuted, textAlign: 'center', maxWidth: 760, alignSelf: 'center' },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg, marginTop: spacing.lg, alignItems: 'stretch' },
  serviceCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, gap: spacing.lg },
  popularCard: { borderColor: colors.financial.accent },
  serviceTop: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  serviceIcon: { width: 64, height: 64, borderRadius: radii.lg, backgroundColor: colors.errorLight, alignItems: 'center', justifyContent: 'center' },
  popularBadge: { ...typography.caption, color: colors.financial.primary, backgroundColor: colors.errorLight, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, fontWeight: '700' },
  serviceTitle: { ...typography.h2, fontWeight: '700', color: colors.navyDark },
  serviceDescription: { ...typography.body, lineHeight: 28, color: colors.textMuted },
  serviceBottom: { marginTop: 'auto', paddingTop: spacing.md, gap: spacing.lg },
  loanTerms: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, backgroundColor: colors.backgroundAlt, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md },
  term: { flexGrow: 1, gap: spacing.xs },
  termLabel: { ...typography.caption, color: colors.textMuted },
  termValue: { ...typography.small, fontWeight: '700', color: colors.navyDark },
  applyButton: { paddingHorizontal: spacing.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.financial.accent },
  applyLabel: { ...typography.body, fontWeight: '600', color: colors.financial.primary, flex: 1, textAlign: 'center' },
  applyLabelPressed: { color: colors.white },
  servicesNote: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  applicationScreen: { flex: 1, backgroundColor: colors.backgroundAlt },
  applicationContent: { padding: spacing.md, paddingBottom: spacing.xl, width: '100%', maxWidth: 1100, alignSelf: 'center', gap: spacing.xl },
  stepper: { flexDirection: 'row', paddingVertical: spacing.md },
  stepLine: { position: 'absolute', top: 40, left: '12.5%', right: '12.5%', height: 2, backgroundColor: colors.border },
  stepItem: { width: '25%', alignItems: 'center', gap: spacing.sm },
  stepCircle: { width: 48, height: 48, borderRadius: radii.pill, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  activeStep: { backgroundColor: colors.financial.primary, borderWidth: 4, borderColor: colors.errorLight },
  completeStep: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepNumber: { ...typography.h3, color: colors.textMuted },
  stepNumberActive: { color: colors.white },
  stepLabel: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  selectedStepLabel: { color: colors.financial.primary, fontWeight: '700' },
  applicationPanel: { padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, gap: spacing.lg },
  formTitle: { ...typography.hero, color: colors.navyDark, fontWeight: '800' },
  loanChoice: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.lg, borderRadius: radii.lg, borderWidth: 2, borderColor: colors.border, gap: spacing.md },
  selectedChoice: { borderColor: colors.financial.primary, backgroundColor: colors.errorLight },
  choiceCopy: { flex: 1, gap: spacing.sm },
  choiceTitle: { ...typography.h3, color: colors.navyDark, fontWeight: '700' },
  choiceDescription: { ...typography.small, lineHeight: 24, color: colors.textMuted },
  choiceRate: { ...typography.small, color: colors.primaryDark, fontWeight: '700' },
  loanFields: { gap: spacing.lg },
  field: { gap: spacing.sm },
  fieldLabel: { ...typography.body, color: colors.navyDark, fontWeight: '600' },
  required: { ...typography.caption, color: colors.error },
  input: { ...typography.body, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, color: colors.navyDark, minHeight: 56 },
  invalidInput: { borderColor: colors.error },
  notesInput: { minHeight: 116, textAlignVertical: 'top' },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  preset: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 44, justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  presetLabel: { ...typography.small, color: colors.navy },
  tenureSlider: { width: '100%', height: 44 },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  emiBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primaryLight },
  emiText: { ...typography.body, color: colors.primaryDark, flex: 1 },
  bold: { fontWeight: '700' },
  formFooter: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.lg, marginTop: spacing.md },
  calculatorPanel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, borderRadius: radii.xl, backgroundColor: colors.white, marginTop: spacing.lg },
  calculatorStack: { flexDirection: 'column', alignItems: 'stretch' },
  calculatorControls: { flex: 1, gap: spacing.xl, minWidth: 0 },
  calculatorField: { gap: spacing.sm },
  calculatorLabelRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  calculatorValue: { ...typography.body, fontWeight: '700', color: colors.navyDark, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, backgroundColor: colors.backgroundAlt },
  calculatorResult: { flex: 1, minWidth: 0, borderRadius: radii.xl, backgroundColor: colors.financial.background, padding: spacing.lg, paddingVertical: spacing.xxl, alignItems: 'center', gap: spacing.lg },
  resultHeading: { ...typography.body, color: colors.financial.muted, textAlign: 'center', letterSpacing: 1 },
  resultEmi: { fontSize: 44, lineHeight: 56, color: colors.white, fontWeight: '800', textAlign: 'center' },
  resultTotals: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.financial.border, paddingTop: spacing.lg },
  resultTotal: { alignItems: 'center', gap: spacing.sm, flexGrow: 1 },
  resultTotalLabel: { ...typography.caption, color: colors.financial.muted },
  resultTotalValue: { ...typography.h3, color: colors.white, fontWeight: '700' },
  partnerGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg, marginTop: spacing.lg, alignItems: 'stretch' },
  partnerCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, minHeight: 140, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg },
  bankMark: { width: 56, height: 60, backgroundColor: colors.backgroundAlt, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  bankMarkText: { ...typography.h3, fontWeight: '800', color: colors.navy },
  bankCopy: { flex: 1, minWidth: 0, gap: spacing.sm },
  bankName: { ...typography.body, fontWeight: '700', color: colors.navyDark },
  bankCategory: { ...typography.caption, color: colors.textMuted },
  bankRateBlock: { alignItems: 'flex-end', gap: spacing.sm },
  bankRate: { ...typography.h3, fontWeight: '800', color: colors.primaryDark },
  bankRateLabel: { ...typography.caption, color: colors.textMuted },
});
