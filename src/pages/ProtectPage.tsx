import React, { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const C = {
  green: "#07845B",
  darkGreen: "#006747",
  navy: "#102B46",
  blue: "#2375D5",
  background: "#F0F6FC",
  white: "#FFFFFF",
  text: "#142B43",
  muted: "#7B8BA0",
  border: "#E5ECF3",
  lightGreen: "#EAF7F1",
  lightBlue: "#EDF4FF",
  orange: "#E99B32",
};

export default function ProtectPage() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const [location, setLocation] = useState("");

  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "My Residential Plot",
      location: "Hyderabad, Telangana",
      status: "Protected",
      icon: "home-city",
    },
  ]);

  const handleAddProperty = () => {
    if (!propertyName.trim() || !location.trim()) {
      Alert.alert("Missing Details", "Please enter all property details.");
      return;
    }

    const newProperty = {
      id: Date.now(),
      name: propertyName,
      location: location,
      status: "Pending",
      icon: "home-city",
    };

    setProperties([...properties, newProperty]);

    setPropertyName("");
    setLocation("");
    setModalVisible(false);

    Alert.alert("Success", "Demo property added successfully!");
  };

  const handleAction = (name: string) => {
    Alert.alert(
      name,
      `${name} screen will be implemented next.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color={C.navy}
            />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              Protect My Property
            </Text>
            <Text style={styles.headerSubtitle}>
              Property safety management
            </Text>
          </View>

          <Pressable
            style={styles.notificationButton}
            onPress={() => handleAction("Notifications")}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={23}
              color={C.navy}
            />
          </Pressable>
        </View>

        {/* HERO SECTION */}

        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons
                name="shield-check"
                size={14}
                color={C.white}
              />
              <Text style={styles.heroBadgeText}>
                GATEDPLUS PROTECTION
              </Text>
            </View>

            <Text style={styles.heroTitle}>
              Your Property,{"\n"}Our Responsibility.
            </Text>

            <Text style={styles.heroDescription}>
              Secure your valuable property with regular
              inspections and reliable protection.
            </Text>

            <Pressable
              style={styles.addPropertyButton}
              onPress={() => setModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={C.green}
              />
              <Text style={styles.addPropertyButtonText}>
                Add Property
              </Text>
            </Pressable>
          </View>

          <View style={styles.heroIconContainer}>
            <MaterialCommunityIcons
              name="shield-home"
              size={92}
              color="#A6E6CE"
            />
          </View>
        </View>

        {/* STATISTICS */}

        <Text style={styles.sectionTitle}>
          Overview
        </Text>

        <View style={styles.statsContainer}>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: C.lightBlue }]}>
              <MaterialCommunityIcons
                name="home-city-outline"
                size={23}
                color={C.blue}
              />
            </View>

            <Text style={styles.statNumber}>
              {properties.length}
            </Text>

            <Text style={styles.statLabel}>
              Total Properties
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: C.lightGreen }]}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={23}
                color={C.green}
              />
            </View>

            <Text style={styles.statNumber}>
              {properties.filter(p => p.status === "Protected").length}
            </Text>

            <Text style={styles.statLabel}>
              Protected
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#FFF4E5" }]}>
              <MaterialCommunityIcons
                name="clipboard-clock-outline"
                size={23}
                color={C.orange}
              />
            </View>

            <Text style={styles.statNumber}>
              {properties.filter(p => p.status === "Pending").length}
            </Text>

            <Text style={styles.statLabel}>
              Pending
            </Text>
          </View>

        </View>

        {/* QUICK ACTIONS */}

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.actionsGrid}>

          <ActionCard
            icon="home-search-outline"
            title="My Properties"
            subtitle="View your properties"
            color={C.blue}
            onPress={() => handleAction("My Properties")}
          />

          <ActionCard
            icon="shield-star-outline"
            title="Protection Plans"
            subtitle="Explore available plans"
            color={C.green}
            onPress={() => handleAction("Protection Plans")}
          />

          <ActionCard
            icon="file-document-outline"
            title="Reports"
            subtitle="View inspection reports"
            color="#8B5CC7"
            onPress={() => handleAction("Reports")}
          />

          <ActionCard
            icon="shield-check-outline"
            title="Active Protection"
            subtitle="Manage protection"
            color="#D68B29"
            onPress={() => handleAction("Active Protection")}
          />

        </View>

        {/* MY PROPERTIES */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            My Properties
          </Text>

          <Pressable onPress={() => handleAction("All Properties")}>
            <Text style={styles.viewAllText}>
              View All
            </Text>
          </Pressable>
        </View>

        {properties.map((property) => (
          <Pressable
            key={property.id}
            style={styles.propertyCard}
            onPress={() => handleAction(property.name)}
          >
            <View style={styles.propertyIcon}>
              <MaterialCommunityIcons
                name="home-city"
                size={30}
                color={C.green}
              />
            </View>

            <View style={styles.propertyDetails}>
              <Text style={styles.propertyName}>
                {property.name}
              </Text>

              <View style={styles.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={15}
                  color={C.muted}
                />

                <Text style={styles.propertyLocation}>
                  {property.location}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  property.status === "Protected"
                    ? styles.protectedBadge
                    : styles.pendingBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    property.status === "Protected"
                      ? styles.protectedText
                      : styles.pendingText,
                  ]}
                >
                  {property.status}
                </Text>
              </View>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={25}
              color={C.muted}
            />
          </Pressable>
        ))}

        {/* RECENT ACTIVITY */}

        <Text style={styles.sectionTitle}>
          Recent Activity
        </Text>

        <View style={styles.activityCard}>

          <ActivityItem
            icon="shield-check"
            title="Protection Service Active"
            description="Your property is under protection."
            time="Recently"
            color={C.green}
          />

          <View style={styles.activityDivider} />

          <ActivityItem
            icon="clipboard-check-outline"
            title="Property Inspection"
            description="Inspection records will appear here."
            time="Upcoming"
            color={C.blue}
          />

          <View style={styles.activityDivider} />

          <ActivityItem
            icon="file-document-outline"
            title="Reports and Updates"
            description="Track your property reports."
            time="Updates"
            color="#8B5CC7"
          />

        </View>

        {/* FOOTER */}

        <Text style={styles.footerText}>
          Powered by GatedPlus
        </Text>

      </ScrollView>

      {/* ADD PROPERTY MODAL */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add New Property
              </Text>

              <Pressable
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={25}
                  color={C.navy}
                />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>
              Property Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter property name"
              placeholderTextColor={C.muted}
              value={propertyName}
              onChangeText={setPropertyName}
            />

            <Text style={styles.inputLabel}>
              Property Location
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter property location"
              placeholderTextColor={C.muted}
              value={location}
              onChangeText={setLocation}
            />

            <Pressable
              style={styles.submitButton}
              onPress={handleAddProperty}
            >
              <Text style={styles.submitButtonText}>
                Add Property
              </Text>
            </Pressable>

          </View>
        </View>
      </Modal>

      {/* BOTTOM NAVIGATION rendered in layout */}
    </SafeAreaView>
  );
}

// QUICK ACTION COMPONENT

function ActionCard({
  icon,
  title,
  subtitle,
  color,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.actionCard}
      onPress={onPress}
    >
      <View
        style={[
          styles.actionIcon,
          { backgroundColor: color + "15" },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={27}
          color={color}
        />
      </View>

      <Text style={styles.actionTitle}>
        {title}
      </Text>

      <Text style={styles.actionSubtitle}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

// ACTIVITY COMPONENT

function ActivityItem({
  icon,
  title,
  description,
  time,
  color,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  return (
    <View style={styles.activityItem}>
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: color + "15" },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={color}
        />
      </View>

      <View style={styles.activityDetails}>
        <Text style={styles.activityTitle}>
          {title}
        </Text>

        <Text style={styles.activityDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.activityTime}>
        {time}
      </Text>
    </View>
  );
}

export { ProtectPage, ProtectPage as ProtectScreen };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 90,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.navy,
  },

  headerSubtitle: {
    fontSize: 12,
    color: C.muted,
    marginTop: 3,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },

  heroCard: {
    backgroundColor: C.darkGreen,
    borderRadius: 20,
    padding: 20,
    marginTop: 12,
    overflow: "hidden",
    minHeight: 255,
    flexDirection: "row",
  },

  heroContent: {
    flex: 1,
    zIndex: 1,
  },

  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF20",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },

  heroBadgeText: {
    color: C.white,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  heroTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: C.white,
    marginTop: 17,
    lineHeight: 32,
  },

  heroDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: "#D4F0E4",
    marginTop: 8,
    maxWidth: 220,
  },

  addPropertyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    backgroundColor: C.white,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 17,
    gap: 5,
  },

  addPropertyButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.darkGreen,
  },

  heroIconContainer: {
    position: "absolute",
    right: -13,
    bottom: 25,
    opacity: 0.8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.navy,
    marginTop: 25,
    marginBottom: 14,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 12,
    minHeight: 120,
  },

  statIcon: {
    width: 39,
    height: 39,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  statNumber: {
    fontSize: 23,
    fontWeight: "800",
    color: C.navy,
    marginTop: 10,
  },

  statLabel: {
    fontSize: 10,
    color: C.muted,
    marginTop: 3,
  },

  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  actionCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: C.white,
    borderRadius: 15,
    padding: 15,
    minHeight: 135,
  },

  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  actionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.navy,
    marginTop: 12,
  },

  actionSubtitle: {
    fontSize: 10,
    color: C.muted,
    marginTop: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.green,
  },

  propertyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },

  propertyIcon: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: C.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },

  propertyDetails: {
    flex: 1,
    marginLeft: 12,
  },

  propertyName: {
    fontSize: 14,
    fontWeight: "700",
    color: C.navy,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 3,
  },

  propertyLocation: {
    fontSize: 11,
    color: C.muted,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },

  protectedBadge: {
    backgroundColor: C.lightGreen,
  },

  pendingBadge: {
    backgroundColor: "#FFF4E5",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },

  protectedText: {
    color: C.green,
  },

  pendingText: {
    color: "#B8791E",
  },

  activityCard: {
    backgroundColor: C.white,
    borderRadius: 15,
    paddingHorizontal: 14,
  },

  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  activityIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  activityDetails: {
    flex: 1,
    marginLeft: 11,
  },

  activityTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.navy,
  },

  activityDescription: {
    fontSize: 10,
    color: C.muted,
    marginTop: 4,
  },

  activityTime: {
    fontSize: 9,
    color: C.muted,
  },

  activityDivider: {
    height: 1,
    backgroundColor: C.border,
  },

  footerText: {
    textAlign: "center",
    color: C.muted,
    fontSize: 11,
    marginTop: 25,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    padding: 20,
  },

  modalContainer: {
    backgroundColor: C.white,
    padding: 22,
    borderRadius: 18,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: C.navy,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 13,
    fontSize: 14,
    color: C.text,
  },

  submitButton: {
    backgroundColor: C.green,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },

  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.white,
  },
});
