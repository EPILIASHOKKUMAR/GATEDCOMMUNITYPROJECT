import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BottomNavBar } from '@/components/BottomNavBar';
import { ServicesCarousel } from '@/components/ServicesCarousel';
import { propertyServices, type PropertyService } from '@/constants/services';
import { colors, radii, shadows, spacing, typography } from '@/theme';

export default function ServicesPage() {
  const router = useRouter();

  function selectService(service: PropertyService) {
    if (service.title === 'Protect My Property') router.push('/protect');
    else if (service.title === 'Legal') router.push('/legal');
    else if (service.title === 'Registration Help') router.push('/registration');
    else if (service.title === 'Financial Help') router.push('/financial');
    else Alert.alert(service.title, 'Coming soon');
  }

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      <View style={s.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to previous page" style={s.back}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/home')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.navy} />
        </Pressable>
        <Text style={s.pageTitle}>Services</Text>
      </View>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <ServicesCarousel />
        <View style={s.services}>
          <Text style={s.eyebrow}>HOW CAN WE HELP?</Text>
          <Text accessibilityRole="header" style={s.sectionTitle}>Property Services</Text>
          <Text style={s.body}>Choose the support you need for your property.</Text>
          <View style={s.grid}>
            {propertyServices.map((service) => (
              <Pressable key={service.title} accessibilityRole="button" accessibilityLabel={service.title}
                onPress={() => selectService(service)} style={({ pressed }) => [s.card, pressed && s.pressed]}>
                <View style={s.icon}><MaterialCommunityIcons name={service.icon} size={28} color={colors.primary} /></View>
                <Text style={s.cardTitle}>{service.title}</Text>
                <Text style={s.body}>{service.description}</Text>
                <View style={s.cardAction}>
                  <Text style={s.actionLabel}>Explore service</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color={colors.primary} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNavBar activeTab="services" />
    </SafeAreaView>
  );
}

export { ServicesPage };

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  topBar: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.primarySoft },
  pageTitle: { ...typography.h3, color: colors.navy },
  content: { width: '100%', maxWidth: 1100, alignSelf: 'center', padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.xl },
  eyebrow: { ...typography.caption, fontWeight: '700', color: colors.primary, letterSpacing: 1 },
  body: { ...typography.small, color: colors.textSecondary },
  services: { gap: spacing.sm },
  sectionTitle: { ...typography.h2, color: colors.navy },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  card: { flexBasis: '46%', flexGrow: 1, minWidth: 220, padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, gap: spacing.md, ...shadows.card },
  icon: { width: 56, height: 56, borderRadius: radii.lg, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { ...typography.h3, color: colors.navy },
  cardAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: spacing.sm },
  actionLabel: { ...typography.label, color: colors.primary },
  pressed: { opacity: 0.7 },
});
