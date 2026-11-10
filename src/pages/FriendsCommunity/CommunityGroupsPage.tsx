
import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';

type Screen = 'menu' | 'create' | 'explore' | 'property';

type Community = {
  id: number;
  name: string;
  location: string;
  category: string;
  members: number;
  description: string;
};

const sampleCommunities: Community[] = [
  {
    id: 1,
    name: 'Hyderabad Property Developers',
    location: 'Hyderabad',
    category: 'Residential',
    members: 125,
    description: 'A community for people interested in residential development.',
  },
  {
    id: 2,
    name: 'Land Investment Partners',
    location: 'Secunderabad',
    category: 'Land Investment',
    members: 86,
    description: 'Connect with people interested in land investment projects.',
  },
  {
    id: 3,
    name: 'Commercial Property Network',
    location: 'Miyapur',
    category: 'Commercial',
    members: 64,
    description: 'Explore commercial property development opportunities.',
  },
];

export default function CommunityGroupsPage() {
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>('menu');
  const [search, setSearch] = useState('');
  const [joinedIds, setJoinedIds] = useState<number[]>([]);

  const [groupForm, setGroupForm] = useState({
    name: '',
    location: '',
    category: 'Residential',
    budget: '',
    members: '',
    description: '',
  });

  const [propertyForm, setPropertyForm] = useState({
    propertyName: '',
    location: '',
    propertyType: 'Residential',
    area: '',
    requirement: '',
  });

  const filteredCommunities = useMemo(() => {
    const value = search.toLowerCase().trim();

    return sampleCommunities.filter(item =>
      `${item.name} ${item.location} ${item.category}`
        .toLowerCase()
        .includes(value)
    );
  }, [search]);

  const goBack = () => {
    if (screen !== 'menu') {
      setScreen('menu');
    } else {
      router.back();
    }
  };

  const updateGroup = (key: keyof typeof groupForm, value: string) => {
    setGroupForm(previous => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateProperty = (
    key: keyof typeof propertyForm,
    value: string
  ) => {
    setPropertyForm(previous => ({
      ...previous,
      [key]: value,
    }));
  };

  // BUILD WITH OTHERS SUBMISSION
  const createGroup = () => {
    if (!groupForm.name.trim() || !groupForm.location.trim()) {
      Alert.alert(
        'Missing Details',
        'Please enter a project name and location.'
      );
      return;
    }

    Alert.alert(
      'Project Details Submitted',
      'Your project form is working. Data is not permanently saved yet because backend integration has not been added.',
      [
        {
          text: 'OK',
          onPress: () => {
            setGroupForm({
              name: '',
              location: '',
              category: 'Residential',
              budget: '',
              members: '',
              description: '',
            });

            setScreen('menu');
          },
        },
      ]
    );
  };

  // BUILD WITH MY PROPERTY SUBMISSION
  const submitProperty = () => {
    if (
      !propertyForm.propertyName.trim() ||
      !propertyForm.location.trim()
    ) {
      Alert.alert(
        'Missing Details',
        'Please enter your property name and location.'
      );
      return;
    }

    Alert.alert(
      'Property Details Submitted',
      'Your property form is working. Data is not permanently saved yet because backend integration has not been added.',
      [
        {
          text: 'OK',
          onPress: () => {
            setPropertyForm({
              propertyName: '',
              location: '',
              propertyType: 'Residential',
              area: '',
              requirement: '',
            });

            setScreen('menu');
          },
        },
      ]
    );
  };

  // JOIN OR LEAVE COMMUNITY
  const toggleJoin = (community: Community) => {
    const alreadyJoined = joinedIds.includes(community.id);

    setJoinedIds(previous =>
      alreadyJoined
        ? previous.filter(id => id !== community.id)
        : [...previous, community.id]
    );

    Alert.alert(
      alreadyJoined ? 'Left Community' : 'Joined Community',
      alreadyJoined
        ? `You left ${community.name}.`
        : `You joined ${community.name}.`
    );
  };

  // COMMON HEADER
  const renderHeader = (title: string) => (
    <View style={styles.header}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={colors.navy}
        />
      </Pressable>

      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );

  // COMMON INPUT FIELD
  const renderField = (
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (value: string) => void,
    multiline = false,
    keyboardType: 'default' | 'numeric' = 'default'
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA5B1"
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
      />
    </View>
  );

  // COMMON PROPERTY TYPE SELECTOR
  const renderCategorySelector = (
    selected: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>Property Type</Text>

      <View style={styles.categoryRow}>
        {['Residential', 'Commercial', 'Land'].map(item => (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
            style={[
              styles.categoryChip,
              selected === item && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selected === item && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  // ==========================================
  // SCREEN 1: MAIN COMMUNITY GROUPS MENU
  // ==========================================

  if (screen === 'menu') {
    return (
      <SafeAreaView style={styles.screen}>
        {renderHeader('Community Groups')}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <MaterialCommunityIcons
                name="account-group"
                size={34}
                color="#15966F"
              />
            </View>

            <Text style={styles.bannerTitle}>
              Build Better Together
            </Text>

            <Text style={styles.bannerDescription}>
              Connect, collaborate and discover property opportunities.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            Choose an Option
          </Text>

          {/* BUILD WITH OTHERS */}

          <Pressable
            style={styles.menuCard}
            onPress={() => setScreen('create')}
          >
            <View style={styles.menuIcon}>
              <MaterialCommunityIcons
                name="account-multiple-plus-outline"
                size={27}
                color="#15966F"
              />
            </View>

            <Text style={styles.menuTitle}>
              Build With Others
            </Text>

            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#84919E"
            />
          </Pressable>

          {/* EXPLORE COMMUNITIES */}

          <Pressable
            style={styles.menuCard}
            onPress={() => setScreen('explore')}
          >
            <View style={styles.menuIcon}>
              <MaterialCommunityIcons
                name="compass-outline"
                size={27}
                color="#15966F"
              />
            </View>

            <Text style={styles.menuTitle}>
              Explore Communities
            </Text>

            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#84919E"
            />
          </Pressable>

          {/* BUILD WITH MY PROPERTY */}

          <Pressable
            style={styles.menuCard}
            onPress={() => setScreen('property')}
          >
            <View style={styles.menuIcon}>
              <MaterialCommunityIcons
                name="home-city-outline"
                size={27}
                color="#15966F"
              />
            </View>

            <Text style={styles.menuTitle}>
              Build With My Property
            </Text>

            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#84919E"
            />
          </Pressable>

          <View style={styles.infoBox}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color="#15966F"
            />

            <Text style={styles.infoText}>
              Find partners, create projects and connect with property communities.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // SCREEN 2: BUILD WITH OTHERS
  // ==========================================

  if (screen === 'create') {
    return (
      <SafeAreaView style={styles.screen}>
        {renderHeader('Build With Others')}

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.formContent}
          >
            <View style={styles.formIntro}>
              <View style={styles.formIntroIcon}>
                <MaterialCommunityIcons
                  name="account-multiple-plus-outline"
                  size={28}
                  color="#15966F"
                />
              </View>

              <View style={styles.formIntroText}>
                <Text style={styles.formTitle}>
                  Create a Project Group
                </Text>

                <Text style={styles.formSubtitle}>
                  Find people and collaborate on your project.
                </Text>
              </View>
            </View>

            {renderField(
              'Project Name *',
              'Enter your project name',
              groupForm.name,
              value => updateGroup('name', value)
            )}

            {renderField(
              'Project Location *',
              'Enter city or area',
              groupForm.location,
              value => updateGroup('location', value)
            )}

            {renderCategorySelector(
              groupForm.category,
              value => updateGroup('category', value)
            )}

            {renderField(
              'Estimated Budget',
              'Enter budget (e.g. 5000000)',
              groupForm.budget,
              value => updateGroup('budget', value),
              false,
              'numeric'
            )}

            {renderField(
              'Required Members',
              'Number of members',
              groupForm.members,
              value => updateGroup('members', value),
              false,
              'numeric'
            )}

            {renderField(
              'Project Description',
              'Describe your project and requirements',
              groupForm.description,
              value => updateGroup('description', value),
              true
            )}

            <Pressable
              style={styles.primaryButton}
              onPress={createGroup}
            >
              <Text style={styles.primaryButtonText}>
                Create Project Group
              </Text>

              <MaterialCommunityIcons
                name="arrow-right"
                size={19}
                color="#FFFFFF"
              />
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // SCREEN 3: EXPLORE COMMUNITIES
  // ==========================================

  if (screen === 'explore') {
    return (
      <SafeAreaView style={styles.screen}>
        {renderHeader('Explore Communities')}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.searchBox}>
            <MaterialCommunityIcons
              name="magnify"
              size={22}
              color="#84919E"
            />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search communities or locations"
              placeholderTextColor="#929EAA"
              style={styles.searchInput}
            />
          </View>

          <Text style={styles.sectionTitle}>
            Available Communities
          </Text>

          {filteredCommunities.length === 0 ? (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons
                name="account-search-outline"
                size={35}
                color="#9AA5B1"
              />

              <Text style={styles.emptyText}>
                No communities found.
              </Text>
            </View>
          ) : (
            filteredCommunities.map(community => {
              const joined = joinedIds.includes(community.id);

              return (
                <View key={community.id} style={styles.communityCard}>
                  <View style={styles.communityTop}>
                    <View style={styles.communityIcon}>
                      <MaterialCommunityIcons
                        name="account-group-outline"
                        size={26}
                        color="#15966F"
                      />
                    </View>

                    <View style={styles.communityInfo}>
                      <Text style={styles.communityName}>
                        {community.name}
                      </Text>

                      <Text style={styles.communityMeta}>
                        <MaterialCommunityIcons
                          name="map-marker-outline"
                          size={13}
                        />
                        {' '}{community.location}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.communityDescription}>
                    {community.description}
                  </Text>

                  <View style={styles.communityFooter}>
                    <View>
                      <Text style={styles.memberCount}>
                        {community.members} members
                      </Text>

                      <Text style={styles.categoryLabel}>
                        {community.category}
                      </Text>
                    </View>

                    <Pressable
                      style={[
                        styles.joinButton,
                        joined && styles.joinedButton,
                      ]}
                      onPress={() => toggleJoin(community)}
                    >
                      <Text
                        style={[
                          styles.joinButtonText,
                          joined && styles.joinedButtonText,
                        ]}
                      >
                        {joined ? 'Joined' : 'Join'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // SCREEN 4: BUILD WITH MY PROPERTY
  // ==========================================

  return (
    <SafeAreaView style={styles.screen}>
      {renderHeader('Build With My Property')}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.formContent}
        >
          <View style={styles.formIntro}>
            <View style={styles.formIntroIcon}>
              <MaterialCommunityIcons
                name="home-city-outline"
                size={28}
                color="#15966F"
              />
            </View>

            <View style={styles.formIntroText}>
              <Text style={styles.formTitle}>
                Add Your Property
              </Text>

              <Text style={styles.formSubtitle}>
                Share your property and find suitable partners.
              </Text>
            </View>
          </View>

          {renderField(
            'Property Name *',
            'Enter property name',
            propertyForm.propertyName,
            value => updateProperty('propertyName', value)
          )}

          {renderField(
            'Property Location *',
            'Enter city or area',
            propertyForm.location,
            value => updateProperty('location', value)
          )}

          {renderCategorySelector(
            propertyForm.propertyType,
            value => updateProperty('propertyType', value)
          )}

          {renderField(
            'Property Area',
            'Enter area (e.g. 2000 sq. ft.)',
            propertyForm.area,
            value => updateProperty('area', value)
          )}

          {renderField(
            'What Are You Looking For?',
            'Describe the partners or investment you need',
            propertyForm.requirement,
            value => updateProperty('requirement', value),
            true
          )}

          <Pressable
            style={styles.primaryButton}
            onPress={submitProperty}
          >
            <Text style={styles.primaryButtonText}>
              Submit Property Details
            </Text>

            <MaterialCommunityIcons
              name="arrow-right"
              size={19}
              color="#FFFFFF"
            />
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9EEF2',
  },

  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.navy,
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  banner: {
    backgroundColor: '#EAF5F1',
    borderRadius: 17,
    padding: 19,
    marginBottom: 25,
  },

  bannerIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  bannerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.navy,
  },

  bannerDescription: {
    fontSize: 13,
    color: '#657482',
    lineHeight: 20,
    marginTop: 7,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 14,
  },

  menuCard: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9EEF2',
    elevation: 2,
  },

  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: '#EAF5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  menuTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 9,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#657482',
    lineHeight: 18,
  },

  formContent: {
    padding: 17,
    paddingBottom: 40,
  },

  formIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },

  formIntroIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EAF5F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  formIntroText: {
    flex: 1,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.navy,
  },

  formSubtitle: {
    fontSize: 12,
    color: '#84919E',
    marginTop: 4,
  },

  field: {
    marginBottom: 19,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 9,
  },

  input: {
    minHeight: 49,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E6EC',
    borderRadius: 11,
    paddingHorizontal: 13,
    fontSize: 13,
    color: colors.navy,
  },

  multilineInput: {
    height: 105,
    paddingTop: 13,
  },

  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },

  categoryChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E6EC',
    backgroundColor: '#FFFFFF',
  },

  categoryChipActive: {
    backgroundColor: '#EAF5F1',
    borderColor: '#15966F',
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#657482',
  },

  categoryTextActive: {
    color: '#15966F',
  },

  primaryButton: {
    minHeight: 51,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15966F',
    borderRadius: 12,
    gap: 9,
    marginTop: 8,
    elevation: 2,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  searchBox: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E6EC',
    paddingHorizontal: 13,
    marginBottom: 23,
  },

  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: 13,
    color: colors.navy,
  },

  communityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#E9EEF2',
    elevation: 1,
  },

  communityTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  communityIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#EAF5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  communityInfo: {
    flex: 1,
  },

  communityName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.navy,
  },

  communityMeta: {
    fontSize: 11,
    color: '#84919E',
    marginTop: 5,
  },

  communityDescription: {
    fontSize: 12,
    color: '#657482',
    lineHeight: 18,
    marginTop: 13,
  },

  communityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF1F4',
  },

  memberCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },

  categoryLabel: {
    fontSize: 10,
    color: '#84919E',
    marginTop: 4,
  },

  joinButton: {
    backgroundColor: '#15966F',
    borderRadius: 9,
    paddingHorizontal: 21,
    paddingVertical: 9,
  },

  joinButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  joinedButton: {
    backgroundColor: '#EAF5F1',
    borderWidth: 1,
    borderColor: '#15966F',
  },

  joinedButtonText: {
    color: '#15966F',
  },

  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 30,
  },

  emptyText: {
    color: '#84919E',
    fontSize: 13,
    marginTop: 10,
  },
});
