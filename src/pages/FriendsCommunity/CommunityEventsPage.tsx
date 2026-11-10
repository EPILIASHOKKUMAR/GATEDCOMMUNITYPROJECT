import React, { useState } from 'react';
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

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  icon: string;
};

const eventData: Event[] = [
  {
    id: 1,
    title: 'Community Meet-up',
    date: '15 November 2026',
    time: '10:00 AM',
    location: 'Hyderabad',
    description: 'Meet community members and discuss property opportunities.',
    icon: 'account-group-outline',
  },
  {
    id: 2,
    title: 'Property Investment Seminar',
    date: '20 November 2026',
    time: '11:00 AM',
    location: 'Secunderabad',
    description: 'Learn about property investment and development opportunities.',
    icon: 'home-city-outline',
  },
  {
    id: 3,
    title: 'Real Estate Networking',
    date: '28 November 2026',
    time: '4:00 PM',
    location: 'Miyapur',
    description: 'Connect with property owners, investors and developers.',
    icon: 'handshake-outline',
  },
];

export default function CommunityEventsPage() {
  const router = useRouter();

  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);

  const toggleRegistration = (event: Event) => {
    const alreadyRegistered = registeredEvents.includes(event.id);

    if (alreadyRegistered) {
      setRegisteredEvents(previous =>
        previous.filter(id => id !== event.id)
      );

      Alert.alert('Registration Cancelled', `You cancelled ${event.title}.`);
    } else {
      setRegisteredEvents(previous => [...previous, event.id]);

      Alert.alert('Registration Successful', `You registered for ${event.title}.`);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={25} color={colors.navy} />
        </Pressable>

        <View>
          <Text style={styles.heading}>Community Events</Text>
          <Text style={styles.subtitle}>Discover and join community activities</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.banner}>
          <MaterialCommunityIcons
            name="calendar-star"
            size={34}
            color="#15966F"
          />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Stay Connected</Text>
            <Text style={styles.bannerSubtitle}>
              Meet people, share ideas and explore opportunities.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Text style={styles.count}>{eventData.length}</Text>
        </View>

        {eventData.map(event => {
          const isRegistered = registeredEvents.includes(event.id);

          return (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventTop}>
                <View style={styles.eventIcon}>
                  <MaterialCommunityIcons
                    name={event.icon as any}
                    size={27}
                    color="#15966F"
                  />
                </View>

                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>

                  <Text style={styles.eventMeta}>
                    <MaterialCommunityIcons name="calendar-outline" size={13} />
                    {' '}{event.date}
                  </Text>

                  <Text style={styles.eventMeta}>
                    <MaterialCommunityIcons name="clock-outline" size={13} />
                    {' '}{event.time}
                  </Text>

                  <Text style={styles.eventMeta}>
                    <MaterialCommunityIcons name="map-marker-outline" size={13} />
                    {' '}{event.location}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>{event.description}</Text>

              <Pressable
                style={[
                  styles.registerButton,
                  isRegistered && styles.cancelButton,
                ]}
                onPress={() => toggleRegistration(event)}
              >
                <Text
                  style={[
                    styles.registerText,
                    isRegistered && styles.cancelText,
                  ]}
                >
                  {isRegistered ? 'Cancel Registration' : 'Register Now'}
                </Text>
              </Pressable>
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>My Registered Events</Text>

        {registeredEvents.length === 0 ? (
          <Text style={styles.emptyText}>
            You haven't registered for any events yet.
          </Text>
        ) : (
          eventData
            .filter(event => registeredEvents.includes(event.id))
            .map(event => (
              <View key={event.id} style={styles.registeredItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={19}
                  color="#15966F"
                />
                <Text style={styles.registeredText}>{event.title}</Text>
              </View>
            ))
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5F1',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  bannerText: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.navy,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#657482',
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 13,
    marginTop: 8,
  },
  count: {
    backgroundColor: '#EAF5F1',
    color: '#15966F',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E9EEF3',
  },
  eventTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EAF5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 7,
  },
  eventMeta: {
    fontSize: 11,
    color: '#778491',
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: '#657482',
    lineHeight: 19,
    marginTop: 13,
    marginBottom: 13,
  },
  registerButton: {
    backgroundColor: '#15966F',
    borderRadius: 9,
    padding: 12,
    alignItems: 'center',
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#FCEEEE',
  },
  cancelText: {
    color: '#D65B5B',
  },
  emptyText: {
    color: '#8995A1',
    fontSize: 12,
    marginBottom: 18,
  },
  registeredItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 13,
    marginBottom: 9,
    gap: 9,
  },
  registeredText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '600',
  },
});