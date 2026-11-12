import { ServicesPanel } from '@/components/ServicesPanel';
import { colors, radii } from '@/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Icon = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type Card = { title: string; icon: Icon; description: string; wide?: boolean };
type Category = { title: string; icon: Icon; groups: { title: string; cards: Card[] }[] };

const categories: Category[] = [
  {
    title: 'Post Property',
    icon: 'home-plus-outline',
    groups: [
      {
        title: 'List your property',
        cards: [
          {
            title: 'Sell Property',
            icon: 'home-plus-outline',
            description: 'Create a listing to introduce your property to potential buyers.',
          },
          {
            title: 'Rent Property',
            icon: 'key-plus',
            description: 'Share your rental property with people looking for their next home.',
          },
        ],
      },
      {
        title: 'Give your listing more visibility',
        cards: [
          {
            title: 'Owner Plans',
            icon: 'crown-outline',
            description: 'Explore listing options designed for property owners.',
          },
          {
            title: 'Builder Plans',
            icon: 'hard-hat',
            description: 'Explore options for showcasing your residential projects.',
          },
        ],
      },
    ],
  },
  {
    title: 'Protect My Property',
    icon: 'shield-check-outline',
    groups: [
      {
        title: 'Care for your property',
        cards: [
          {
            title: 'Property Monitoring',
            icon: 'shield-home-outline',
            description: 'Keep track of your property with regular monitoring.',
          },
          {
            title: 'Site Visits',
            icon: 'map-marker-check-outline',
            description: 'Explore scheduled visits to check on your property.',
          },
          {
            title: 'Property Reports',
            icon: 'file-document-outline',
            description: 'Stay informed with property status updates and inspection reports.',
            wide: true,
          },
        ],
      },
    ],
  },
  {
    title: 'Refer & Earn',
    icon: 'gift-outline',
    groups: [
      {
        title: 'Share GatedPlus with friends',
        cards: [
          {
            title: 'Invite Friends',
            icon: 'account-plus-outline',
            description: 'Invite your friends to discover properties and services on GatedPlus.',
          },
          {
            title: 'My Referrals',
            icon: 'account-multiple-check-outline',
            description: 'Track your referrals once the referral programme launches.',
          },
          {
            title: 'Rewards & Benefits',
            icon: 'gift-outline',
            description: 'Referral rewards, programme terms and eligibility will be available when the service launches.',
            wide: true,
          },
        ],
      },
    ],
  },
  {
    title: 'Friends Community',
    icon: 'account-group-outline',
    groups: [
      {
        title: 'Better living, together',
        cards: [
          {
            title: 'My Friends',
            icon: 'account-group-outline',
            description: 'Connect with friends and discover your community.',
          },
          {
            title: 'Community Events',
            icon: 'calendar-heart',
            description: 'Explore opportunities to meet your neighbours and take part in local events.',
          },
          {
            title: 'Community Groups',
            icon: 'home-group',
            description: 'Discover neighbourhood groups and connect with people in your community.',
            wide: true,
          },
        ],
      },
    ],
  },
  {
    title: 'Services',
    icon: 'view-grid-outline',
    groups: [],
  },
];

export default function MenuPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [detail, setDetail] = useState<Card | null>(null);
  const content = useRef<React.ComponentRef<typeof ScrollView>>(null);

  function selectCategory(index: number) {
    setSelected(index);
    content.current?.scrollTo({ y: 0, animated: false });
  }

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.heading}>All Categories</Text>
        <Text style={s.subtitle}>Discover more with GatedPlus</Text>
      </View>
      <View style={s.body}>
        <ScrollView style={s.sidebar} showsVerticalScrollIndicator={false}>
          {categories.map((category, index) => (
            <Pressable
              key={category.title}
              accessibilityRole="tab"
              accessibilityState={{ selected: selected === index }}
              accessibilityLabel={category.title}
              onPress={() => selectCategory(index)}
              style={[s.category, selected === index && s.categoryActive]}
            >
              <MaterialCommunityIcons
                name={category.icon}
                size={28}
                color={selected === index ? colors.primary : '#74818C'}
              />
              <Text
                style={[
                  s.categoryLabel,
                  selected === index && s.categoryLabelActive,
                ]}
              >
                {category.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView
          ref={content}
          style={s.content}
          contentContainerStyle={s.contentInner}
          showsVerticalScrollIndicator={false}
        >
          {selected === 4 ? <ServicesPanel onSelect={(service) => {
            if (service.title === 'Protect My Property') router.push('/protect');
            else if (service.title === 'Legal') router.push('/legal');
            else if (service.title === 'Registration Help') router.push('/registration');
            else if (service.title === 'Financial Help') router.push('/financial');
            else setDetail(service);
          }} /> : categories[selected].groups.map((group) => (
            <View key={group.title} style={s.group}>
              <Text style={s.groupTitle}>{group.title}</Text>
              <View style={s.grid}>
                {group.cards.map((card, index) => (
                  <Pressable
                    key={card.title}
                    accessibilityRole="button"
                    accessibilityLabel={card.title}
                   
onPress={() => {
  if (selected === 1) {
    router.push('/protect');
  } else if (selected === 3) {
    if (card.title === 'My Friends') {
      router.push('/my-friends' as any);
    } else if (card.title === 'Community Events') {
      router.push('/community-events' as any);
    } else if (card.title === 'Community Groups') {
      router.push('/community-groups' as any);
    }
  } else {
    setDetail(card);
  }
}}

                    style={({ pressed }) => [
                      s.card,
                      card.wide && s.wideCard,
                      pressed && s.pressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={card.icon}
                      size={28}
                      color={index % 2 ? colors.blue : colors.primary}
                    />
                    <Text style={s.cardTitle}>{card.title}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* BOTTOM NAVIGATION rendered in layout */}
      <Modal
        visible={detail !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDetail(null)}
      >
        <View style={s.overlay}>
          <View style={s.dialog} accessibilityViewIsModal>
            {detail && (
              <>
                <MaterialCommunityIcons name={detail.icon} size={36} color={colors.primary} />
                <Text style={s.dialogTitle}>{detail.title}</Text>
                <Text style={s.description}>Coming soon</Text>
              </>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={() => setDetail(null)}
              style={s.closeButton}
            >
              <Text style={s.closeLabel}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5ECF3',
  },
  heading: { fontSize: 22, fontWeight: '700', color: colors.navy },
  subtitle: { fontSize: 12, color: colors.textMuted, marginTop: 5 },
  body: { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: '29%',
    maxWidth: 180,
    flexGrow: 0,
    backgroundColor: '#F4F6F7',
    borderRightWidth: 1,
    borderRightColor: '#E5ECF3',
  },
  category: {
    minHeight: 106,
    paddingHorizontal: 8,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E6EA',
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  categoryActive: { backgroundColor: colors.white, borderLeftColor: colors.primary },
  categoryLabel: { textAlign: 'center', color: '#63707C', fontSize: 12, lineHeight: 18 },
  categoryLabelActive: { color: colors.primary, fontWeight: '700' },
  content: { flex: 1 },
  contentInner: { paddingHorizontal: 12, paddingTop: 23, paddingBottom: 90 },
  group: { marginBottom: 28 },
  groupTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 16,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '47%',
    flexGrow: 1,
    minHeight: 116,
    backgroundColor: '#EFF7FC',
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 17,
    gap: 14,
  },
  wideCard: { width: '100%' },
  cardTitle: { color: colors.navy, fontSize: 13, lineHeight: 19, fontWeight: '500' },
  pressed: { opacity: 0.65 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16,43,70,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    padding: 26,
    borderRadius: 22,
  },
  dialogTitle: { color: colors.navy, fontSize: 22, fontWeight: '700', marginTop: 16 },
  description: { color: '#63707C', fontSize: 15, lineHeight: 23, marginTop: 12 },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    padding: 14,
    marginTop: 22,
  },
  closeLabel: { color: colors.white, fontWeight: '700' },
});

export { MenuPage, MenuPage as MenuScreen };

