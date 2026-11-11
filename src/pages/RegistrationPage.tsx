import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, radii, spacing, typography } from '@/theme';

type Icon = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type Party = { name: string; mobile: string; email: string; idType: string; idNumber: string };
const emptyParty = (): Party => ({ name: '', mobile: '', email: '', idType: 'Aadhaar Card', idNumber: '' });
const idProofOptions = ['Aadhaar Card', 'PAN Card', 'Passport', 'Voter ID', 'Driving License'];
const uploadDocuments = [
  { title: 'Sale Agreement', required: true },
  { title: 'ID Proof', required: true },
  { title: 'Address Proof', required: true },
  { title: 'Property Documents', required: true },
  { title: 'Other Supporting Documents', required: false },
];
const highlights: { title: string; description: string; icon: Icon }[] = [
  { title: 'Guided Registration Process', description: 'Step-by-step assistance with deed preparation, required documents, and the property registration process.', icon: 'file-document-outline' },
  { title: 'Document Verification', description: 'Thorough scrutiny of link deeds, ownership papers, and supporting documents before registration.', icon: 'check-circle-outline' },
  { title: 'Registration Assistance', description: 'Dedicated on-ground executive for appointment coordination and registration-day support.', icon: 'calendar-blank-outline' },
  { title: 'Dedicated Support', description: 'Continuous status tracking, proactive updates, and assistance throughout your registration journey.', icon: 'account-check-outline' },
];

const registrationSteps = [
  { title: 'Submit Request', description: 'Provide your property and party details along with copies of available documents online.' },
  { title: 'Verify Documents', description: 'Our registration specialists verify all title deeds, tax records, and stamp duty requirements.' },
  { title: 'Schedule Appointment', description: 'We assign a dedicated executive and book your preferred date & slot at the local Sub-Registrar Office.' },
  { title: 'Complete Registration', description: 'Meet your executive at the SRO office for biometric signing, stamp sealing, and instant deed collection.' },
];

const keyDocuments = [
  { title: 'Sale Agreement / Draft Deed', description: 'Draft deed with precise schedule of boundaries & consideration.' },
  { title: 'Prior Title Link Deeds', description: 'Past registered title deeds establishing chain of ownership.' },
  { title: 'Encumbrance Certificate (EC)', description: 'EC showing recorded encumbrances or mortgages on the property.' },
  { title: 'Property Tax & Utility Receipts', description: 'Latest property tax challan and electricity/water bills.' },
  { title: 'Aadhaar & PAN of Parties', description: 'Government photo identity and PAN of seller & buyer.' },
  { title: 'Khata / Patta Passbook', description: 'Revenue records and municipality/panchayat Khata extract.' },
];

const documentChecklist = [
  { title: 'Primary Transaction Deeds', documents: [
    { title: 'Draft Sale Deed / Agreement of Sale', description: 'Prepared on legal stamp paper with exact boundary schedule & consideration amount.' },
    { title: 'Prior Title Deeds (Link Documents)', description: 'Continuous 30-year chain of title ownership deeds establishing clear lineage.' },
    { title: 'Development Agreement / GPA', description: 'Required if purchasing directly from a builder or developer with landowner power of attorney.' },
  ] },
  { title: 'Revenue & Ownership Records', documents: [
    { title: 'Encumbrance Certificate (EC)', description: 'EC from the Sub-Registrar covering the applicable period for review of registered mortgages or charges.' },
    { title: 'Khata Certificate & Extract / Patta Passbook', description: 'Municipal Khata (A-Khata/B-Khata/ROR-1B) in the name of the present owner, as applicable.' },
    { title: 'Latest Property Tax Paid Receipts', description: 'Recent municipal or Gram Panchayat property tax payment challan.' },
    { title: 'Building Sanction Plan / Layout Approval', description: 'HMDA, GHMC, DTCP, or BDA approved sanctioned layout / building plan, as applicable.' },
  ] },
  { title: 'Parties Identification & KYC', documents: [
    { title: 'Aadhaar Card of Seller & Buyer', description: 'Original Aadhaar cards for biometric identity authentication at the SRO office.' },
    { title: 'PAN Card / Form 60', description: 'PAN details or Form 60, where applicable, for the transaction.' },
    { title: 'Passport Size Photographs', description: '2 passport-size color photographs of each executing party.' },
    { title: 'Two Identifiable Witnesses with ID', description: 'Two adult witnesses with valid Aadhaar/Voter IDs present on registration day.' },
  ] },
];

export default function RegistrationPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const columns = width >= 1100 ? 4 : width >= 650 ? 2 : 1;
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [assistanceOpen, setAssistanceOpen] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  function changeStep(step: number) {
    setConfirmed(false);
    setFormStep(step);
    formScroll.current?.scrollTo({ y: 0, animated: false });
  }
  const formScroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [parties, setParties] = useState<Party[]>(() => [emptyParty(), emptyParty()]);
  const [partyErrors, setPartyErrors] = useState<Record<string, string>>({});
  const [partyDropdown, setPartyDropdown] = useState<number | null>(null);
  const [attachments, setAttachments] = useState<Record<string, DocumentPicker.DocumentPickerAsset & { attachedOn: string }>>({});
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const previewAsset = previewDocument ? attachments[previewDocument] : undefined;
  const [documentErrors, setDocumentErrors] = useState<Record<string, string>>({});
  const [documentsAttempted, setDocumentsAttempted] = useState(false);
  const [picking, setPicking] = useState<string | null>(null);
  const pickerBusy = useRef(false);
  async function pickDocument(title: string) {
    if (pickerBusy.current) return;
    pickerBusy.current = true;
    setPicking(title);
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], copyToCacheDirectory: true, multiple: false });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset) return;
      if (!/\.(pdf|jpe?g|png|docx)$/i.test(asset.name)) {
        setDocumentErrors((previous) => ({ ...previous, [title]: 'Choose a PDF, JPG, PNG, or DOCX file.' }));
        return;
      }
      const size = asset.size ?? asset.file?.size;
      if (size === undefined || size <= 0 || size > 15 * 1024 * 1024) {
        setDocumentErrors((previous) => ({ ...previous, [title]: 'Choose a non-empty file up to 15 MB with a readable size.' }));
        return;
      }
      const attachedOn = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' });
      setAttachments((previous) => ({ ...previous, [title]: { ...asset, size, attachedOn } }));
      setDocumentErrors((previous) => ({ ...previous, [title]: '' }));
    } catch {
      setDocumentErrors((previous) => ({ ...previous, [title]: 'Could not read this file. Please try again.' }));
    } finally {
      pickerBusy.current = false;
      setPicking(null);
    }
  }
  function continueDocuments() {
    setDocumentsAttempted(true);
    const missing: Record<string, string> = {};
    uploadDocuments.forEach((document) => { if (document.required && !attachments[document.title]) missing[document.title] = 'Please attach this required document.'; });
    setDocumentErrors(missing);
    if (Object.keys(missing).length) {
      formScroll.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    changeStep(3);
  }
  function updateParty(index: number, key: keyof Party, value: string) {
    setParties((previous) => previous.map((party, position) => position === index ? { ...party, [key]: value } : party));
    setPartyErrors((previous) => ({ ...previous, [`${index}.${key}`]: '', ...(key === 'idType' ? { [`${index}.idNumber`]: '' } : {}) }));
  }
  function continueParties() {
    const nextErrors: Record<string, string> = {};
    parties.forEach((party, index) => {
      if (!party.name.trim()) nextErrors[`${index}.name`] = 'Enter the full legal name.';
      if (!/^[6-9]\d{9}$/.test(party.mobile)) nextErrors[`${index}.mobile`] = 'Enter a valid 10-digit mobile number.';
      if (party.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(party.email.trim())) nextErrors[`${index}.email`] = 'Enter a valid email address.';
      const validId = party.idType === 'Aadhaar Card' ? /^\d{12}$/.test(party.idNumber)
        : party.idType === 'PAN Card' ? /^[A-Z]{5}\d{4}[A-Z]$/.test(party.idNumber)
        : /^[A-Z0-9][A-Z0-9 /-]{3,23}[A-Z0-9]$/.test(party.idNumber.trim());
      if (!validId) nextErrors[`${index}.idNumber`] = party.idType === 'Aadhaar Card' ? 'Enter a 12-digit Aadhaar number.' : party.idType === 'PAN Card' ? 'Enter a valid 10-character PAN.' : `Enter your ${party.idType} number as printed on the document.`;
    });
    setPartyErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setPartyDropdown(null);
    setFormStep(2);
    formScroll.current?.scrollTo({ y: 0, animated: false });
  }
  const [property, setProperty] = useState({ registrationType: 'Sale Registration', propertyType: 'Apartment / Flat', address: '', survey: '', area: '', district: 'Hyderabad', mandal: '', city: 'Hyderabad', state: 'Telangana', pin: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof property, string>>>({});
  const [dropdown, setDropdown] = useState<'registrationType' | 'propertyType' | null>(null);
  const propertyFields: { key: keyof typeof property; label: string; placeholder: string }[] = [
    { key: 'survey', label: 'Survey / Plot Number', placeholder: 'e.g. Survey No. 84/A or Plot 12' },
    { key: 'area', label: 'Property Area', placeholder: 'e.g. 1,850 Sq. Ft or 300 Sq. Yards' },
    { key: 'district', label: 'District', placeholder: 'District' },
    { key: 'mandal', label: 'Mandal', placeholder: 'e.g. Serilingampally / Gandipet' },
    { key: 'city', label: 'Village / City', placeholder: 'Village / City' },
    { key: 'state', label: 'State', placeholder: 'State' },
    { key: 'pin', label: 'PIN Code', placeholder: '6-digit PIN code' },
  ];
  function updateProperty(key: keyof typeof property, value: string) {
    setProperty((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }
  function continueProperty() {
    const nextErrors: typeof errors = {};
    for (const key of Object.keys(property) as (keyof typeof property)[]) {
      if (!property[key].trim()) nextErrors[key] = 'This field is required.';
    }
    if (property.pin && !/^[1-9]\d{5}$/.test(property.pin)) nextErrors.pin = 'Enter a valid 6-digit PIN code.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setDropdown(null);
    setFormStep(1);
    formScroll.current?.scrollTo({ y: 0, animated: false });
  }

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.heroBackground}>
          <View style={s.container}>
            <Pressable accessibilityRole="button" accessibilityLabel="Back to services" style={s.back}
              onPress={() => router.canGoBack() ? router.back() : router.replace('/services')}>
              <MaterialCommunityIcons name="arrow-left" size={20} color={colors.navy} />
              <Text style={s.backText}>Services</Text>
            </Pressable>
            <View style={s.hero}>
              <View style={s.badge}>
                <MaterialCommunityIcons name="shield-outline" size={16} color={colors.primary} />
                <Text style={s.badgeText}>REAL ESTATE REGISTRATION SERVICES</Text>
              </View>
              <Text accessibilityRole="header" style={[s.title, wide && s.titleWide]}>Registration Help</Text>
              <Text style={[s.intro, wide && s.introWide]}>Get professional assistance with your property registration process, document verification, appointment coordination, and registration-day support.</Text>
              <View style={[s.actions, !wide && s.actionsMobile]}>
                <Pressable accessibilityRole="button" onPress={() => setAssistanceOpen(true)}
                  style={({ pressed }) => [s.button, s.primaryButton, pressed && s.pressed]}>
                  <MaterialCommunityIcons name="file-document-outline" size={20} color={colors.white} />
                  <Text style={s.primaryLabel}>Get Registration Assistance</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => Alert.alert('Track My Request', 'Registration request tracking is coming soon.')}
                  style={({ pressed }) => [s.button, s.secondaryButton, pressed && s.pressed]}>
                  <MaterialCommunityIcons name="magnify" size={20} color={colors.navy} />
                  <Text style={s.secondaryLabel}>Track My Request</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <View style={[s.container, s.highlights]}>
          <Text accessibilityRole="header" style={s.sectionTitle}>Our Service Highlights</Text>
          <Text style={s.sectionDescription}>End-to-end legal and on-ground coordination designed for smooth, stress-free property registry.</Text>
          <View style={s.grid}>
            {highlights.map((highlight) => (
              <View key={highlight.title} style={s.highlightCard}>
                <View style={s.icon}><MaterialCommunityIcons name={highlight.icon} size={24} color={colors.primary} /></View>
                <Text accessibilityRole="header" style={s.highlightTitle}>{highlight.title}</Text>
                <Text style={s.highlightDescription}>{highlight.description}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={s.processBackground}>
          <View style={[s.container, s.process]}>
            <Text accessibilityRole="header" style={s.sectionTitle}>How It Works</Text>
            <Text style={s.sectionDescription}>Four simple steps from request submission to final registered deed collection.</Text>
            <View style={s.grid}>
              {registrationSteps.map((step, index) => (
                <View key={step.title} style={[s.card, { width: columns === 4 ? '23.5%' : columns === 2 ? '48.5%' : '100%' }]}>
                  <View style={s.stepNumber}><Text style={s.stepNumberText}>{index + 1}</Text></View>
                  <Text accessibilityRole="header" style={s.cardTitle}>{step.title}</Text>
                  <Text style={s.cardDescription}>{step.description}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={[s.container, s.documentsSection]}>
          <View style={s.documentsPanel}>
            <View style={s.documentsHeader}>
              <View style={s.documentsHeadingCopy}>
                <Text accessibilityRole="header" style={s.cardTitle}>Key Required Documents</Text>
                <Text style={s.cardDescription}>Commonly required paperwork for standard property sale and transfer registrations.</Text>
              </View>
              <Pressable accessibilityRole="button" onPress={() => setChecklistOpen(true)} style={[s.button, s.secondaryButton]}>
                <Text style={s.secondaryLabel}>View Full List</Text>
              </Pressable>
            </View>
            <View style={s.grid}>
              {keyDocuments.map((document) => (
                <View key={document.title} style={[s.documentItem, { width: width >= 1000 ? '32.3%' : width >= 650 ? '48.5%' : '100%' }]}>
                  <MaterialCommunityIcons name="check-circle-outline" size={20} color={colors.primary} />
                  <View style={s.documentCopy}>
                    <Text style={s.highlightTitle}>{document.title}</Text>
                    <Text style={s.cardDescription}>{document.description}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={[s.helpBar, !wide && s.helpBarMobile]}>
              <View style={s.helpMessage}>
              <MaterialCommunityIcons name="help-circle-outline" size={24} color={colors.primary} />
              <Text style={s.helpText}>Need assistance gathering or verifying your property documents?</Text>
              </View>
              <Pressable accessibilityRole="button" style={[s.button, s.primaryButton, !wide && s.helpButtonMobile]} onPress={() => setAssistanceOpen(true)}>
                <Text style={s.primaryLabel}>Get Started Now</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color={colors.white} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal visible={assistanceOpen} animationType="slide" onRequestClose={() => { setDropdown(null); setAssistanceOpen(false); }}>
        <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
          <KeyboardAvoidingView style={s.formScreen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView ref={formScroll} keyboardShouldPersistTaps="handled" contentContainerStyle={s.formContent}>
              <View style={s.stepper}>
                <View style={s.stepperLine} />
                <View style={[s.stepperProgress, { width: `${formStep * 25}%` }]} />
                {['Property', 'Parties', 'Documents', 'Review'].map((label, index) => (
                  <View key={label} style={s.stepperItem} accessibilityLabel={`${index + 1}. ${label}${index === formStep ? ', current step' : index < formStep ? ', completed' : ''}`}>
                    <View style={[s.stepCircle, index <= formStep && s.currentCircle, index === formStep && s.activeCircle]}>{index < formStep ? <MaterialCommunityIcons name="check" size={22} color={colors.white} /> : <Text style={[s.stepText, index === formStep && s.currentStepText]}>{index + 1}</Text>}</View>
                    <Text style={[s.stepLabel, index < formStep && s.completedLabel, index === formStep && s.currentLabel]}>{index + 1}. {label}</Text>
                  </View>
                ))}
              </View>
              <View style={s.formPanel}>
                <Text accessibilityRole="header" style={s.sectionTitle}>{['Step 1 — Property Details', 'Step 2 — Party Details', 'Step 3 — Document Upload', 'Step 4 — Review & Submit'][formStep]}</Text>
                <Text style={s.cardDescription}>{['Enter the property location, survey number, and registration type.', 'Provide verified details for the Seller / Owner and Buyer.', 'Upload clear scanned copies or photos of the required property paperwork (PDF, JPG, PNG, DOCX up to 15 MB).', 'Review the details of your registration assistance request before final submission.'][formStep]}</Text>
                <View style={s.formDivider} />
                {formStep === 2 && documentsAttempted && uploadDocuments.some((document) => document.required && !attachments[document.title]) && (
                  <View style={s.documentWarning} accessibilityRole="alert" accessibilityLiveRegion="assertive">
                    <MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.error} />
                    <Text style={s.documentWarningText}>Please upload all required documents (Sale Agreement, ID Proof, Address Proof, Property Documents) to continue.</Text>
                  </View>
                )}
                {formStep === 0 ? <View style={s.formGrid}>
                  {(['registrationType', 'propertyType'] as const).map((key) => (
                    <View key={key} style={[s.field, wide && s.halfField]}>
                      <Text style={s.fieldLabel}>{key === 'registrationType' ? 'Registration Type' : 'Property Type'} <Text style={s.required}>*</Text></Text>
                      <Pressable accessibilityRole="button" accessibilityLabel={key === 'registrationType' ? 'Registration Type' : 'Property Type'} accessibilityState={{ expanded: dropdown === key }} onPress={() => setDropdown(dropdown === key ? null : key)} style={s.select}>
                        <Text style={s.inputText}>{property[key]}</Text><MaterialCommunityIcons name="chevron-down" size={20} color={colors.navy} />
                      </Pressable>
                      {dropdown === key && <View style={s.options}>
                        {(key === 'registrationType' ? ['Sale Registration', 'Gift Registration', 'Partition Registration', 'Other'] : ['Apartment / Flat', 'Independent House / Villa', 'Plot / Land', 'Commercial Property', 'Agricultural Land']).map((option) => (
                          <Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: property[key] === option }} onPress={() => { updateProperty(key, option); setDropdown(null); }} style={s.option}>
                            <Text style={s.inputText}>{option}</Text>
                          </Pressable>
                        ))}
                      </View>}
                    </View>
                  ))}
                  <View style={s.field}>
                    <Text style={s.fieldLabel}>Property Address <Text style={s.required}>*</Text></Text>
                    <TextInput accessibilityLabel="Property Address, required" value={property.address} onChangeText={(value) => updateProperty('address', value)} placeholder="Complete property address with flat/house number and street name" placeholderTextColor={colors.textMuted} multiline style={[s.input, s.addressInput, !!errors.address && s.invalidInput]} />
                    {!!errors.address && <Text accessibilityRole="alert" style={s.errorText}>{errors.address}</Text>}
                  </View>
                  {propertyFields.map((field) => (
                    <View key={field.key} style={[s.field, wide && s.halfField]}>
                      <Text style={s.fieldLabel}>{field.label} <Text style={s.required}>*</Text></Text>
                      <TextInput accessibilityLabel={`${field.label}, required`} value={property[field.key]} onChangeText={(value) => updateProperty(field.key, field.key === 'pin' ? value.replace(/\D/g, '') : value)} placeholder={field.placeholder} placeholderTextColor={colors.textMuted} keyboardType={field.key === 'pin' ? 'number-pad' : 'default'} maxLength={field.key === 'pin' ? 6 : undefined} style={[s.input, !!errors[field.key] && s.invalidInput]} />
                      {!!errors[field.key] && <Text accessibilityRole="alert" style={s.errorText}>{errors[field.key]}</Text>}
                    </View>
                  ))}
                </View> : formStep === 1 ? <View style={s.partyGroups}>
                  {parties.map((party, index) => (
                    <View key={index} style={s.partyPanel}>
                      <View style={s.partyHeader}>
                        <Text accessibilityRole="header" style={s.cardTitle}>{index === 0 ? 'Seller / Owner Details' : index === 1 ? 'Buyer Details' : 'Additional Party Details'}</Text>
                        <Text style={s.partyBadge}>Party {index + 1}</Text>
                        {index > 1 && <Pressable accessibilityRole="button" accessibilityLabel={`Remove party ${index + 1}`} style={s.close} onPress={() => { setParties((previous) => previous.filter((_, position) => position !== index)); setPartyErrors({}); setPartyDropdown(null); }}><MaterialCommunityIcons name="close" size={22} color={colors.textMuted} /></Pressable>}
                      </View>
                      <View style={s.formGrid}>
                        {(['name', 'mobile', 'email', 'idType', 'idNumber'] as const).map((key) => {
                          const label = { name: 'Full Name', mobile: 'Mobile Number', email: 'Email Address (Optional)', idType: 'ID Proof Type', idNumber: 'ID Proof Number' }[key];
                          const error = partyErrors[`${index}.${key}`];
                          return (
                            <View key={key} style={[s.field, wide && key !== 'idNumber' && s.halfField]}>
                              <Text style={s.fieldLabel}>{label} {key !== 'email' && <Text style={s.required}>*</Text>}</Text>
                              {key === 'idType' ? <>
                                <Pressable accessibilityRole="button" accessibilityLabel={`Party ${index + 1} ID Proof Type`} accessibilityState={{ expanded: partyDropdown === index }} style={s.select} onPress={() => setPartyDropdown(partyDropdown === index ? null : index)}>
                                  <Text style={s.inputText}>{party.idType}</Text><MaterialCommunityIcons name="chevron-down" size={20} color={colors.navy} />
                                </Pressable>
                                {partyDropdown === index && <View style={s.options}>{idProofOptions.map((option) => <Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: party.idType === option }} style={s.option} onPress={() => { updateParty(index, 'idType', option); updateParty(index, 'idNumber', ''); setPartyDropdown(null); }}><Text style={s.inputText}>{option}</Text></Pressable>)}</View>}
                              </> : <TextInput accessibilityLabel={`Party ${index + 1} ${label}`} value={party[key]}
                                onChangeText={(value) => updateParty(index, key, key === 'mobile' || (key === 'idNumber' && party.idType === 'Aadhaar Card') ? value.replace(/\D/g, '') : key === 'idNumber' ? value.toUpperCase() : value)}
                                placeholder={key === 'name' ? 'Full legal name as in ID proof' : key === 'mobile' ? '10-digit mobile number' : key === 'email' ? `${index === 0 ? 'seller' : 'buyer'}@example.com` : party.idType === 'Aadhaar Card' ? '12-digit Aadhaar number' : party.idType === 'PAN Card' ? '10-character PAN' : `${party.idType} number`}
                                placeholderTextColor={colors.textMuted} style={[s.input, s.partyInput, !!error && s.invalidInput]}
                                keyboardType={key === 'mobile' || (key === 'idNumber' && party.idType === 'Aadhaar Card') ? 'number-pad' : key === 'email' ? 'email-address' : 'default'}
                                autoCapitalize={key === 'email' ? 'none' : key === 'idNumber' ? 'characters' : 'words'} autoCorrect={key === 'name'}
                                maxLength={key === 'mobile' ? 10 : key === 'idNumber' ? party.idType === 'Aadhaar Card' ? 12 : party.idType === 'PAN Card' ? 10 : 25 : undefined} />}
                              {!!error && <Text accessibilityRole="alert" style={s.errorText}>{error}</Text>}
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                  <Pressable accessibilityRole="button" onPress={() => { setParties((previous) => [...previous, emptyParty()]); setPartyDropdown(null); }} style={[s.button, s.addParty]}>
                    <MaterialCommunityIcons name="plus" size={20} color={colors.primary} /><Text style={s.addPartyLabel}>Add Another Party</Text>
                  </Pressable>
                </View> : formStep === 2 ? <View style={s.uploadTable}>
                  {wide && <View style={[s.uploadRow, s.uploadHeader]}>
                    <Text style={[s.fieldLabel, s.uploadName]}>DOCUMENT</Text>
                    <Text style={[s.fieldLabel, s.uploadMeta]}>REQUIRED</Text>
                    <Text style={[s.fieldLabel, s.uploadMeta]}>STATUS</Text>
                    <Text style={[s.fieldLabel, s.uploadAction]}>ACTION</Text>
                  </View>}
                  {uploadDocuments.map((document) => {
                    const asset = attachments[document.title];
                    return <View key={document.title} style={[s.uploadRow, !wide && s.uploadRowMobile]}>
                      <View style={wide ? s.uploadName : s.field}>
                        <Text style={s.cardTitle}>{document.title}</Text>
                        <Text style={s.cardDescription}>{asset ? `${asset.name} (${((asset.size ?? 0) / 1024 / 1024).toFixed(2)} MB)` : 'No document attached'}</Text>
                        {!!documentErrors[document.title] && <Text accessibilityRole="alert" style={s.errorText}>{documentErrors[document.title]}</Text>}
                      </View>
                      <Text style={[s.highlightTitle, wide && s.uploadMeta, document.required && s.required]}>{document.required ? 'Required' : 'Optional'}</Text>
                      <View style={wide ? s.uploadMeta : undefined}><Text style={[s.uploadStatus, asset ? s.attachedStatus : s.pendingStatus]}>{asset ? 'Uploaded' : 'Pending'}</Text></View>
                      <View style={[s.uploadButtons, wide && s.uploadAction]}>
                        {!!asset && <Pressable accessibilityRole="button" accessibilityLabel={`View ${document.title}`} style={s.fileAction} onPress={() => setPreviewDocument(document.title)}>
                          <MaterialCommunityIcons name="eye-outline" size={18} color={colors.blue} /><Text style={s.fileActionText}>View</Text>
                        </Pressable>}
                        <Pressable accessibilityRole="button" accessibilityLabel={`${asset ? 'Replace' : 'Upload'} ${document.title}`} disabled={picking !== null} onPress={() => pickDocument(document.title)} style={[s.uploadButton, picking !== null && s.pressed]}>
                          <MaterialCommunityIcons name="upload-outline" size={18} color={colors.primary} /><Text style={s.addPartyLabel}>{picking === document.title ? 'Opening…' : asset ? 'Replace' : 'Upload'}</Text>
                        </Pressable>
                        {!!asset && <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${document.title}`} style={s.fileAction} onPress={() => { setAttachments((previous) => { const next = { ...previous }; delete next[document.title]; return next; }); setDocumentErrors((previous) => ({ ...previous, [document.title]: '' })); }}><Text style={s.removeText}>Remove</Text></Pressable>}
                      </View>
                    </View>;
                  })}
                </View> : <View style={s.partyGroups}>
                  <View style={s.partyPanel}>
                    <View style={s.reviewHeading}>
                      <Text accessibilityRole="header" style={s.cardTitle}>Registration & Property Details</Text>
                      <Pressable accessibilityRole="button" accessibilityLabel="Edit property details" onPress={() => changeStep(0)} style={s.reviewEdit}><MaterialCommunityIcons name="pencil-outline" size={18} color={colors.primary} /><Text style={s.addPartyLabel}>Edit</Text></Pressable>
                    </View>
                    <View style={s.formGrid}>
                      {[{ label: 'Registration Type', value: property.registrationType }, { label: 'Property Type', value: property.propertyType }, { label: 'Property Address', value: property.address }, ...propertyFields.map((field) => ({ label: field.label, value: property[field.key] }))].map((field) => (
                        <View key={field.label} style={[s.field, wide && field.label !== 'Property Address' && s.halfField]}><Text style={s.reviewLabel}>{field.label.toUpperCase()}</Text><Text selectable style={s.inputText}>{field.value || 'Not provided'}</Text></View>
                      ))}
                    </View>
                  </View>
                  <View style={s.partyPanel}>
                    <View style={s.reviewHeading}>
                      <Text accessibilityRole="header" style={s.cardTitle}>Party Details</Text>
                      <Pressable accessibilityRole="button" accessibilityLabel="Edit party details" onPress={() => changeStep(1)} style={s.reviewEdit}><MaterialCommunityIcons name="pencil-outline" size={18} color={colors.primary} /><Text style={s.addPartyLabel}>Edit</Text></Pressable>
                    </View>
                    {parties.map((party, index) => <View key={index} style={s.reviewParty}>
                      <Text accessibilityRole="header" style={s.fieldLabel}>{index === 0 ? 'Seller / Owner' : index === 1 ? 'Buyer' : `Additional Party ${index + 1}`}</Text>
                      <View style={s.formGrid}>
                        {[
                          { label: 'Full Name', value: party.name },
                          { label: 'Mobile Number', value: party.mobile },
                          { label: 'Email Address', value: party.email },
                          { label: 'ID Proof Type', value: party.idType },
                          { label: 'ID Proof Number', value: party.idNumber },
                        ].map((field) => <View key={field.label} style={[s.field, wide && s.halfField]}>
                          <Text style={s.reviewLabel}>{field.label.toUpperCase()}</Text>
                          <Text selectable style={s.inputText}>{field.value || 'Not provided (optional)'}</Text>
                        </View>)}
                      </View>
                    </View>)}
                  </View>
                  <View style={s.partyPanel}>
                    <View style={s.reviewHeading}>
                      <Text accessibilityRole="header" style={s.cardTitle}>Uploaded Documents ({Object.keys(attachments).length}/{uploadDocuments.length})</Text>
                      <Pressable accessibilityRole="button" accessibilityLabel="Edit documents" onPress={() => changeStep(2)} style={s.reviewEdit}><MaterialCommunityIcons name="pencil-outline" size={18} color={colors.primary} /><Text style={s.addPartyLabel}>Edit</Text></Pressable>
                    </View>
                    {uploadDocuments.map((document) => <View key={document.title} style={s.reviewDocument}>
                      <View style={s.documentCopy}>
                        <Text style={s.fieldLabel}>{document.title}{document.required && <Text style={s.required}> *</Text>}</Text>
                        <Text selectable style={s.cardDescription}>{attachments[document.title]?.name ?? 'Not attached (optional)'}</Text>
                        {!!attachments[document.title] && <Text style={s.cardDescription}>{((attachments[document.title].size ?? 0) / 1024 / 1024).toFixed(2)} MB • Uploaded on {attachments[document.title].attachedOn}</Text>}
                      </View>
                      {!!attachments[document.title] && <Text style={[s.uploadStatus, s.attachedStatus]}>Uploaded</Text>}
                    </View>)}
                  </View>
                  <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: confirmed }} onPress={() => setConfirmed((value) => !value)} style={s.confirmation}>
                    <MaterialCommunityIcons name={confirmed ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color={colors.primary} />
                    <Text style={s.confirmationText}>I confirm that the information and documents provided are genuine and correct to the best of my knowledge.</Text>
                  </Pressable>
                </View>}
                <View style={s.formDivider} />
                <View style={s.formFooter}>
                  <Pressable accessibilityRole="button" onPress={() => { setDropdown(null); setPartyDropdown(null); if (formStep > 0) changeStep(formStep - 1); else setAssistanceOpen(false); }} style={[s.button, s.secondaryButton]}>
                    <MaterialCommunityIcons name="arrow-left" size={18} color={colors.navy} /><Text style={s.secondaryLabel}>Back</Text>
                  </Pressable>
                  <Pressable accessibilityRole="button" disabled={picking !== null || (formStep === 3 && !confirmed)} onPress={formStep === 0 ? continueProperty : formStep === 1 ? continueParties : formStep === 2 ? continueDocuments : () => Alert.alert('Submission coming soon', 'Your request has not been sent. Server submission is not connected yet.')} style={[s.button, s.primaryButton, formStep === 3 && !confirmed && s.pressed]}>
                    <Text style={s.primaryLabel}>{formStep === 3 ? 'Submit Registration Request' : 'Continue'}</Text><MaterialCommunityIcons name={formStep === 3 ? 'check' : 'arrow-right'} size={18} color={colors.white} />
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <Modal visible={previewAsset !== undefined} transparent animationType="fade" onRequestClose={() => setPreviewDocument(null)}>
            <View style={s.modalOverlay}>
              <SafeAreaView edges={['top', 'bottom']} style={s.modalPanel} accessibilityViewIsModal>
                <View style={s.modalHeader}>
                  <Text accessibilityRole="header" style={s.modalTitle}>{previewDocument} — Preview</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel="Close preview" style={s.close} onPress={() => setPreviewDocument(null)}>
                    <MaterialCommunityIcons name="close" size={24} color={colors.textMuted} />
                  </Pressable>
                </View>
                <ScrollView contentContainerStyle={s.modalContent}>
                  {previewAsset && <View style={s.previewBox}>
                    <MaterialCommunityIcons name="file-document-outline" size={56} color={colors.primary} />
                    <Text style={s.previewName}>{previewAsset.name}</Text>
                    <Text style={s.previewMeta}>File Size: {((previewAsset.size ?? 0) / 1024 / 1024).toFixed(2)} MB • Uploaded on {previewAsset.attachedOn}</Text>
                    <Text style={[s.uploadStatus, s.previewStatus]}>Status: Uploaded</Text>
                    <Text style={s.previewMeta}>Attached locally. Not yet submitted.</Text>
                  </View>}
                  <Pressable accessibilityRole="button" style={[s.button, s.primaryButton, s.gotIt]} onPress={() => setPreviewDocument(null)}>
                    <Text style={s.primaryLabel}>Close Preview</Text>
                  </Pressable>
                </ScrollView>
              </SafeAreaView>
            </View>
          </Modal>
        </SafeAreaView>
      </Modal>
      <Modal visible={checklistOpen} transparent animationType="fade" onRequestClose={() => setChecklistOpen(false)}>
        <View style={s.modalOverlay}>
          <SafeAreaView edges={['top', 'bottom']} style={s.modalPanel} accessibilityViewIsModal>
            <View style={s.modalHeader}>
              <MaterialCommunityIcons name="file-document-outline" size={26} color={colors.primary} />
              <Text accessibilityRole="header" style={s.modalTitle}>Comprehensive Property Registration Checklist</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close document checklist" onPress={() => setChecklistOpen(false)} style={s.close}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textMuted} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={s.modalContent} showsVerticalScrollIndicator>
              <Text style={s.cardDescription}>Keep original copies of these documents ready along with two photocopies each for the Sub-Registrar Office verification.</Text>
              {documentChecklist.map((group) => (
                <View key={group.title} style={s.checklistGroup}>
                  <View style={s.groupHeading}>
                    <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                    <Text accessibilityRole="header" style={s.highlightTitle}>{group.title}</Text>
                  </View>
                  {group.documents.map((document) => (
                    <View key={document.title} style={s.checklistItem}>
                      <Text style={s.highlightTitle}>{document.title}</Text>
                      <Text style={s.cardDescription}>{document.description}</Text>
                    </View>
                  ))}
                </View>
              ))}
              <Pressable accessibilityRole="button" onPress={() => setChecklistOpen(false)} style={[s.button, s.primaryButton, s.gotIt]}>
                <Text style={s.primaryLabel}>Got It</Text>
              </Pressable>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export { RegistrationPage };

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundAlt },
  container: { width: '100%', maxWidth: 1200, alignSelf: 'center', paddingHorizontal: spacing.lg },
  heroBackground: { backgroundColor: colors.primarySoft, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start', minHeight: 44, marginTop: spacing.sm },
  backText: { ...typography.label, color: colors.navy },
  hero: { paddingTop: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  badge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start', backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.pill },
  badgeText: { ...typography.caption, fontWeight: '700', color: colors.primary, flexShrink: 1 },
  title: { ...typography.hero, color: colors.navyDark, fontWeight: '800' },
  titleWide: { fontSize: 48, lineHeight: 58 },
  intro: { ...typography.body, color: colors.textSecondary, maxWidth: 850 },
  introWide: { fontSize: 20, lineHeight: 32 },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  actionsMobile: { flexDirection: 'column', maxWidth: 420 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, minHeight: 52, borderRadius: radii.sm },
  primaryButton: { backgroundColor: colors.primary },
  secondaryButton: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  primaryLabel: { ...typography.label, color: colors.white, flexShrink: 1 },
  secondaryLabel: { ...typography.label, color: colors.navy },
  highlights: { paddingTop: spacing.xl, paddingBottom: spacing.xl, gap: spacing.sm },
  processBackground: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  process: { paddingVertical: spacing.xxl, gap: spacing.md },
  stepNumber: { width: 36, height: 36, borderRadius: radii.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { ...typography.label, color: colors.white, fontWeight: '800' },
  highlightCard: { width: '48.5%', padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.white, gap: spacing.sm },
  highlightTitle: { ...typography.label, color: colors.navyDark, fontWeight: '700' },
  highlightDescription: { ...typography.caption, color: colors.textMuted },
  sectionTitle: { ...typography.h1, color: colors.navyDark, fontWeight: '800' },
  sectionDescription: { ...typography.body, color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md, marginTop: spacing.lg, alignItems: 'stretch' },
  card: { padding: spacing.lg, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.white, gap: spacing.md },
  icon: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { ...typography.h3, color: colors.navyDark, fontWeight: '700' },
  cardDescription: { ...typography.small, lineHeight: 24, color: colors.textMuted },
  pressed: { opacity: 0.7 },
  documentsSection: { paddingVertical: spacing.xl },
  documentsPanel: { padding: spacing.lg, backgroundColor: colors.white, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  documentsHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md },
  documentsHeadingCopy: { flexGrow: 1, flexShrink: 1, flexBasis: 280, gap: spacing.sm },
  documentItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.backgroundAlt, borderRadius: radii.md, padding: spacing.md },
  documentCopy: { flex: 1, gap: spacing.xs },
  helpBar: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundAlt, marginTop: spacing.md },
  helpBarMobile: { flexDirection: 'column', alignItems: 'stretch' },
  helpMessage: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, flexGrow: 1, flexShrink: 1 },
  helpText: { ...typography.small, color: colors.navy, flex: 1 },
  helpButtonMobile: { width: '100%', paddingHorizontal: spacing.sm },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.textSecondary, padding: spacing.md },
  modalPanel: { width: '100%', maxWidth: 780, maxHeight: '95%', flexShrink: 1, backgroundColor: colors.white, borderRadius: radii.lg, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { ...typography.h3, color: colors.navyDark, flex: 1 },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  modalContent: { padding: spacing.lg, gap: spacing.lg },
  checklistGroup: { gap: spacing.sm },
  groupHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  checklistItem: { padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, backgroundColor: colors.backgroundAlt, gap: spacing.xs },
  gotIt: { alignSelf: 'flex-end' },
  formScreen: { flex: 1 },
  formContent: { padding: spacing.md, paddingBottom: spacing.xl, width: '100%', maxWidth: 1200, alignSelf: 'center', gap: spacing.xl },
  stepper: { flexDirection: 'row', paddingVertical: spacing.md },
  stepperLine: { position: 'absolute', top: 38, left: '12.5%', right: '12.5%', height: 1, backgroundColor: colors.border },
  stepperProgress: { position: 'absolute', top: 38, left: '12.5%', height: 2, backgroundColor: colors.primary },
  activeCircle: { borderWidth: 4, borderColor: colors.primaryLight },
  completedLabel: { color: colors.primary },
  reviewHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  reviewEdit: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, minHeight: 44 },
  reviewLabel: { ...typography.caption, color: colors.textMuted },
  reviewParty: { gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  reviewDocument: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, backgroundColor: colors.white },
  confirmation: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderColor: colors.primaryLight, borderRadius: radii.md, backgroundColor: colors.primarySoft },
  confirmationText: { ...typography.small, color: colors.primaryDark, flex: 1 },
  stepperItem: { width: '25%', alignItems: 'center', gap: spacing.sm },
  stepCircle: { width: 44, height: 44, borderRadius: radii.pill, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  currentCircle: { backgroundColor: colors.primary, borderColor: colors.primaryLight },
  stepText: { ...typography.label, color: colors.textMuted },
  currentStepText: { color: colors.white },
  stepLabel: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  currentLabel: { color: colors.navyDark, fontWeight: '700' },
  formPanel: { padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.white },
  formDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  formGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg },
  field: { width: '100%', gap: spacing.sm },
  halfField: { width: '48.5%' },
  fieldLabel: { ...typography.label, color: colors.navy },
  required: { color: colors.error },
  input: { ...typography.body, color: colors.navyDark, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radii.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.md, minHeight: 52 },
  inputText: { ...typography.body, color: colors.navyDark, flexShrink: 1 },
  addressInput: { minHeight: 100, textAlignVertical: 'top' },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radii.sm, padding: spacing.md, minHeight: 52 },
  options: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, backgroundColor: colors.backgroundAlt },
  option: { padding: spacing.md, minHeight: 44 },
  invalidInput: { borderColor: colors.error },
  errorText: { ...typography.caption, color: colors.error },
  formFooter: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm, flexWrap: 'wrap' },
  partyGroups: { gap: spacing.lg },
  partyPanel: { padding: spacing.lg, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.backgroundAlt, gap: spacing.lg },
  partyHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  partyBadge: { ...typography.caption, fontWeight: '700', color: colors.navy, backgroundColor: colors.border, borderRadius: radii.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  partyInput: { backgroundColor: colors.white },
  addParty: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary },
  addPartyLabel: { ...typography.label, color: colors.primary },
  uploadTable: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, overflow: 'hidden' },
  uploadRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  uploadHeader: { backgroundColor: colors.backgroundAlt },
  uploadRowMobile: { flexWrap: 'wrap', gap: spacing.md },
  uploadName: { width: '36%', gap: spacing.xs, paddingRight: spacing.sm },
  uploadMeta: { width: '16%' },
  uploadAction: { width: '32%' },
  uploadButtons: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs },
  uploadButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, minHeight: 44, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.primaryLight, backgroundColor: colors.primarySoft },
  uploadStatus: { ...typography.caption, fontWeight: '700', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.pill, alignSelf: 'flex-start' },
  attachedStatus: { color: colors.blue, backgroundColor: colors.blueLight },
  fileAction: { minHeight: 44, paddingHorizontal: spacing.sm, alignItems: 'center', justifyContent: 'center' },
  fileActionText: { ...typography.caption, color: colors.blue },
  removeText: { ...typography.caption, color: colors.error },
  previewBox: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderStrong, borderRadius: radii.md, backgroundColor: colors.backgroundAlt, padding: spacing.lg, paddingVertical: spacing.xxl, alignItems: 'center', gap: spacing.md },
  previewName: { ...typography.h3, color: colors.navyDark, textAlign: 'center' },
  previewMeta: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  previewStatus: { color: colors.primary, backgroundColor: colors.primaryLight, alignSelf: 'center' },
  pendingStatus: { color: colors.warning, backgroundColor: colors.warningLight },
  documentWarning: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderColor: colors.error, borderRadius: radii.sm, backgroundColor: colors.errorLight },
  documentWarningText: { ...typography.small, color: colors.error, flex: 1 },
});
