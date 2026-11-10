
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const initialRequests = [
  { id: 1, name: 'Rahul Kumar', location: 'Hyderabad', initials: 'RK' },
  { id: 2, name: 'Sandeep Reddy', location: 'Secunderabad', initials: 'SR' },
];

const suggestions = [
  { id: 3, name: 'Arjun Sharma', location: 'Hyderabad', initials: 'AS' },
  { id: 4, name: 'Priya Reddy', location: 'Medchal', initials: 'PR' },
];

const initialFriends = [
  { id: 5, name: 'Kiran Kumar', location: 'Hyderabad', initials: 'KK' },
  { id: 6, name: 'Naveen Reddy', location: 'Kukatpally', initials: 'NR' },
];

export default function MyFriendsPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState(initialRequests);
  const [friends, setFriends] = useState(initialFriends);
  const [sentRequests, setSentRequests] = useState<number[]>([]);

  const acceptRequest = (person: typeof initialRequests[number]) => {
    setFriends([...friends, person]);
    setRequests(requests.filter(item => item.id !== person.id));
  };

  const rejectRequest = (id: number) => {
    setRequests(requests.filter(item => item.id !== id));
  };

  const sendRequest = (id: number) => {
    setSentRequests([...sentRequests, id]);
  };

  const filteredFriends = friends.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color="#142D42"
          />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.heading}>My Friends</Text>
          <Text style={styles.subtitle}>
            Connect with GatedPlus members
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons
            name="magnify"
            size={22}
            color="#8996A3"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* FRIEND REQUESTS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          <Text style={styles.count}>{requests.length}</Text>
        </View>

        {requests.length === 0 ? (
          <Text style={styles.emptyText}>No pending requests.</Text>
        ) : (
          requests.map(person => (
            <View style={styles.personCard} key={person.id}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {person.initials}
                </Text>
              </View>

              <View style={styles.personInfo}>
                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.location}>
                  {person.location}
                </Text>
              </View>

              <View style={styles.requestButtons}>
                <Pressable
                  style={styles.acceptButton}
                  onPress={() => acceptRequest(person)}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={19}
                    color="#FFFFFF"
                  />
                </Pressable>

                <Pressable
                  style={styles.rejectButton}
                  onPress={() => rejectRequest(person.id)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={19}
                    color="#D9534F"
                  />
                </Pressable>
              </View>
            </View>
          ))
        )}

        {/* SUGGESTED FRIENDS */}
        <Text style={styles.sectionTitle}>People You May Know</Text>

        {suggestions.map(person => (
          <View style={styles.personCard} key={person.id}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {person.initials}
              </Text>
            </View>

            <View style={styles.personInfo}>
              <Text style={styles.personName}>{person.name}</Text>
              <Text style={styles.location}>
                {person.location}
              </Text>
            </View>

            <Pressable
              style={[
                styles.connectButton,
                sentRequests.includes(person.id) &&
                  styles.sentButton,
              ]}
              disabled={sentRequests.includes(person.id)}
              onPress={() => sendRequest(person.id)}
            >
              <Text style={styles.connectText}>
                {sentRequests.includes(person.id)
                  ? 'Sent'
                  : 'Connect'}
              </Text>
            </Pressable>
          </View>
        ))}

        {/* MY CONNECTIONS */}
        <Text style={styles.sectionTitle}>My Connections</Text>

        {filteredFriends.length === 0 ? (
          <Text style={styles.emptyText}>No friends found.</Text>
        ) : (
          filteredFriends.map(person => (
            <View style={styles.personCard} key={person.id}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {person.initials}
                </Text>
              </View>

              <View style={styles.personInfo}>
                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.location}>
                  {person.location}
                </Text>
              </View>

              <View style={styles.connectedBadge}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={16}
                  color="#15966F"
                />
                <Text style={styles.connectedText}>Connected</Text>
              </View>
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
    padding: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#E9EEF3',
    gap: 15,
  },
  headerText: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#142D42',
  },
  subtitle: {
    fontSize: 12,
    color: '#8996A3',
    marginTop: 3,
  },
  content: {
    padding: 16,
    paddingBottom: 35,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 13,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5EAF0',
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 9,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#142D42',
    marginBottom: 13,
    marginTop: 10,
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
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 13,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: '#E9EEF3',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EAF5F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15966F',
  },
  personInfo: {
    flex: 1,
    marginLeft: 11,
  },
  personName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#142D42',
  },
  location: {
    fontSize: 12,
    color: '#8996A3',
    marginTop: 4,
  },
  requestButtons: {
    flexDirection: 'row',
    gap: 7,
  },
  acceptButton: {
    backgroundColor: '#15966F',
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#FCEEEE',
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#15966F',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  sentButton: {
    backgroundColor: '#8996A3',
  },
  connectText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectedText: {
    fontSize: 10,
    color: '#15966F',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    color: '#8996A3',
    marginBottom: 15,
  },
});
