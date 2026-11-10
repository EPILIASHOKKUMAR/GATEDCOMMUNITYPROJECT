import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';

const groupOptions = [
  {
    id: 1,
    title: 'Build With Others',
    subtitle: 'Start a property project with people who share your goals.',
    description:
      'Create a collaborative group, define your project goals, location and budget, and connect with potential partners.',
    icon: 'account-multiple-plus-outline',
    button: 'Create a Group',
  },
  {
    id: 2,
    title: 'Explore Communities',
    subtitle: 'Discover existing groups and connect with members.',
    description:
      'Browse property communities, explore their project details and connect with groups that match your interests.',
    icon: 'compass-outline',
    button: 'Explore Groups',
  },
  {
    id: 3,
    title: 'Build With My Property',
    subtitle: 'Find partners for a property you already own.',
    description:
      'Share your property details, explain your development requirements and connect with interested investors or developers.',
    icon: 'home-city-outline',
    button: 'Add My Property',
  },
];

export default function CommunityGroupsPage() {
  const router = useRouter();

  const handleOption = (title: string) => {
    Alert.alert(
      title,
      'This feature is currently a demo. We will build its complete functionality next.'
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={25}
            color={colors.navy}
          />
        </Pressable>

        <View>
          <Text style={styles.heading}>Community Groups</Text>
          <Text style={styles.subtitle}>
            Collaborate and grow together
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>
            Build Better Together
          </Text>

          <Text style={styles.bannerDescription}>
            Connect with property owners, investors and developers.
            Find people and opportunities for your next project.
          </Text>

          <MaterialCommunityIcons
            name="account-group"
            size={48}
            color="#15966F"
            style={styles.bannerIcon}
          />
        </View>

        <Text style={styles.sectionTitle}>
          What would you like to do?
        </Text>

        {groupOptions.map(option => (
          <View key={option.id} style={styles.optionCard}>
            <View style={styles.optionTop}>
              <View style={styles.optionIcon}>
                <MaterialCommunityIcons
                  name={option.icon as any}
                  size={29}
                  color="#15966F"
                />
              </View>

              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>
                  {option.title}
                </Text>

                <Text style={styles.optionSubtitle}>
                  {option.subtitle}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>
              {option.description}
            </Text>

            <Pressable
              style={styles.actionButton}
              onPress={() => handleOption(option.title)}
            >
              <Text style={styles.actionButtonText}>
                {option.button}
              </Text>

              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        ))}

        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color="#15966F"
          />

          <Text style={styles.infoText}>
            You can create or join property groups and collaborate
            with other community members.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7EDF2',
  },
  backButton: {
    marginRight: 14,
    padding: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.navy,
  },
  subtitle: {
    fontSize: 12,
    color: '#7A8794',
    marginTop: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 35,
  },
  banner: {
    backgroundColor: '#EAF5F1',
    borderRadius: 15,
    padding: 18,
    marginBottom: 23,
  },
  bannerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.navy,
  },
  bannerDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: '#657482',
    marginTop: 8,
    paddingRight: 35,
  },
  bannerIcon: {
    position: 'absolute',
    right: 14,
    top: 18,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 13,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E9EEF3',
  },
  optionTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 49,
    height: 49,
    borderRadius: 12,
    backgroundColor: '#EAF5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
  },
  optionSubtitle: {
    fontSize: 11,
    color: '#778491',
    lineHeight: 17,
    marginTop: 5,
  },
  description: {
    fontSize: 12,
    color: '#657482',
    lineHeight: 19,
    marginTop: 14,
    marginBottom: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15966F',
    borderRadius: 9,
    padding: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 13,
    borderRadius: 10,
    gap: 9,
    marginTop: 5,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: '#657482',
    lineHeight: 18,
  },
});