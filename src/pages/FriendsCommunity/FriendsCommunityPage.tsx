
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
  BackHandler,
  TextInput,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import CreateCommunityForm from "./CreateCommunityForm";
import UnfinishedPropertyOwner from "./UnfinishedPropertyOwner";

type ActiveScreen =
  | "home"
  | "build-options"
  | "create"
  | "unfinished"
  | "explore"
  | "property";

type Opportunity = {
  id: number;
  title: string;
  location: string;
  zone: string;
  propertyType: string;
  description: string;
  members: string;
  status: string;
};

const communityData: Opportunity[] = [
  {
    id: 1,
    title: "Green Valley Community",
    location: "Kondapur, Hyderabad",
    zone: "West Hyderabad",
    propertyType: "Open Plot",
    description: "A group looking to purchase land and develop a residential community.",
    members: "8 Members",
    status: "Forming Group",
  },
  {
    id: 2,
    title: "Urban Living Community",
    location: "Kompally, Hyderabad",
    zone: "North Hyderabad",
    propertyType: "Apartment",
    description: "Like-minded people planning a shared residential development.",
    members: "6 Members",
    status: "Open for Members",
  },
  {
    id: 3,
    title: "Sunrise Land Project",
    location: "Uppal, Hyderabad",
    zone: "East Hyderabad",
    propertyType: "Open Plot",
    description: "Explore an opportunity to pool resources and develop land together.",
    members: "5 Members",
    status: "Forming Group",
  },
];

const buildGroupData: Opportunity[] = [
  {
    id: 4,
    title: "Residential Project – Phase 1",
    location: "Miyapur, Hyderabad",
    zone: "West Hyderabad",
    propertyType: "Apartment",
    description: "An under-construction residential property seeking co-investors.",
    members: "Seeking Partners",
    status: "Under Construction",
  },
  {
    id: 5,
    title: "Villa Completion Project",
    location: "Shamshabad, Hyderabad",
    zone: "South Hyderabad",
    propertyType: "Luxury Villa",
    description: "A partially completed villa project looking for finishing capital.",
    members: "Seeking Co-investors",
    status: "Partially Completed",
  },
  {
    id: 6,
    title: "Commercial Building Project",
    location: "Begumpet, Hyderabad",
    zone: "Central Hyderabad",
    propertyType: "Commercial",
    description: "An unfinished commercial property seeking collaboration.",
    members: "Seeking Partners",
    status: "Under Construction",
  },
];

const zones = [
  "ALL",
  "West Hyderabad",
  "North Hyderabad",
  "East Hyderabad",
  "South Hyderabad",
  "Central Hyderabad",
];

const propertyTypes = [
  "ALL",
  "Apartment",
  "Luxury Villa",
  "Open Plot",
  "Commercial",
];

export default function FriendsCommunityPage() {
  const router = useRouter();

  const [activeScreen, setActiveScreen] =
    useState<ActiveScreen>("home");

  // Android hardware back navigation
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (activeScreen === "create") {
          setActiveScreen("build-options");
          return true;
        }

        if (activeScreen === "unfinished") {
          setActiveScreen("build-options");
          return true;
        }

        if (
          activeScreen === "build-options" ||
          activeScreen === "explore" ||
          activeScreen === "property"
        ) {
          setActiveScreen("home");
          return true;
        }

        return false;
      }
    );

    return () => subscription.remove();
  }, [activeScreen]);

  const handleFeaturePress = (id: string) => {
    switch (id) {
      case "others":
        setActiveScreen("build-options");
        break;

      case "explore":
        setActiveScreen("explore");
        break;

      case "property":
        setActiveScreen("property");
        break;

      default:
        break;
    }
  };

  // Existing Create Community Form
  if (activeScreen === "create") {
    return (
      <CreateCommunityForm
        onBack={() => setActiveScreen("build-options")}
      />
    );
  }

  // Existing Unfinished Property Owner Form
  if (activeScreen === "unfinished") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <UnfinishedPropertyOwner
          onBack={() => setActiveScreen("build-options")}
        />
      </SafeAreaView>
    );
  }

  // Explore Communities - Category 1 only
  if (activeScreen === "explore") {
    return (
      <OpportunityListScreen
        type="community"
        onBack={() => setActiveScreen("home")}
        onStart={() => setActiveScreen("build-options")}
      />
    );
  }

  // Build With My Property - Category 2 only
  if (activeScreen === "property") {
    return (
      <OpportunityListScreen
        type="property"
        onBack={() => setActiveScreen("home")}
        onStart={() => setActiveScreen("build-options")}
      />
    );
  }

  // Build With Others Options
  if (activeScreen === "build-options") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Pressable
            onPress={() => setActiveScreen("home")}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#222222"
            />
          </Pressable>

          <Text style={styles.headerTitle}>Build With Others</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.optionsContent}
        >
          <Text style={styles.optionsIntro}>
            Choose how you want to start your property project.
          </Text>

          <Pressable
            style={styles.optionCard}
            onPress={() => setActiveScreen("create")}
          >
            <View style={styles.optionIcon}>
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={30}
                color="#2E7D32"
              />
            </View>

            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>
                Start a New Project
              </Text>

              <Text style={styles.optionDescription}>
                Create a new property project and find people
                interested in building together.
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={25}
              color="#666666"
            />
          </Pressable>

          <Pressable
            style={styles.optionCard}
            onPress={() => setActiveScreen("unfinished")}
          >
            <View style={styles.optionIcon}>
              <MaterialCommunityIcons
                name="home-edit-outline"
                size={30}
                color="#2E7D32"
              />
            </View>

            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>
                Unfinished Property Owner
              </Text>

              <Text style={styles.optionDescription}>
                Find people to collaborate with on unfinished
                property projects.
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={25}
              color="#666666"
            />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Friends Community Home
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#222222"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Friends Community
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.homeContent}
      >
        <Text style={styles.homeTitle}>Build Together</Text>

        <Text style={styles.homeDescription}>
          Connect with people, explore communities and build
          property projects together.
        </Text>

        <Pressable
          style={styles.homeFeatureCard}
          onPress={() => handleFeaturePress("others")}
        >
          <View style={styles.homeFeatureIcon}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={30}
              color="#2E7D32"
            />
          </View>

          <View style={styles.homeFeatureText}>
            <Text style={styles.optionTitle}>Build With Others</Text>
            <Text style={styles.optionDescription}>
              Start a project and collaborate with others.
            </Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#666666"
          />
        </Pressable>

        <Pressable
          style={styles.homeFeatureCard}
          onPress={() => handleFeaturePress("explore")}
        >
          <View style={styles.homeFeatureIcon}>
            <MaterialCommunityIcons
              name="earth"
              size={30}
              color="#2E7D32"
            />
          </View>

          <View style={styles.homeFeatureText}>
            <Text style={styles.optionTitle}>
              Explore Communities
            </Text>
            <Text style={styles.optionDescription}>
              Discover Friends Communities and meet like-minded people.
            </Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#666666"
          />
        </Pressable>

        <Pressable
          style={styles.homeFeatureCard}
          onPress={() => handleFeaturePress("property")}
        >
          <View style={styles.homeFeatureIcon}>
            <MaterialCommunityIcons
              name="home-city-outline"
              size={30}
              color="#2E7D32"
            />
          </View>

          <View style={styles.homeFeatureText}>
            <Text style={styles.optionTitle}>
              Build With My Property
            </Text>
            <Text style={styles.optionDescription}>
              Discover property-linked group building opportunities.
            </Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#666666"
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------------------------------------
// REUSABLE OPPORTUNITY LIST SCREEN
// --------------------------------------------------

type OpportunityListProps = {
  type: "community" | "property";
  onBack: () => void;
  onStart: () => void;
};

function OpportunityListScreen({
  type,
  onBack,
  onStart,
}: OpportunityListProps) {
  const isCommunity = type === "community";

  const data = isCommunity ? communityData : buildGroupData;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState("ALL");
  const [selectedPropertyType, setSelectedPropertyType] =
    useState("ALL");

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState<"zone" | "property">(
    "zone"
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.propertyType.toLowerCase().includes(search);

      const matchesZone =
        selectedZone === "ALL" || item.zone === selectedZone;

      const matchesProperty =
        selectedPropertyType === "ALL" ||
        item.propertyType === selectedPropertyType;

      return matchesSearch && matchesZone && matchesProperty;
    });
  }, [data, searchTerm, selectedZone, selectedPropertyType]);

  const openDropdown = (dropdown: "zone" | "property") => {
    setDropdownType(dropdown);
    setDropdownVisible(true);
  };

  const dropdownOptions =
    dropdownType === "zone" ? zones : propertyTypes;

  const currentValue =
    dropdownType === "zone"
      ? selectedZone
      : selectedPropertyType;

  const selectOption = (value: string) => {
    if (dropdownType === "zone") {
      setSelectedZone(value);
    } else {
      setSelectedPropertyType(value);
    }

    setDropdownVisible(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedZone("ALL");
    setSelectedPropertyType("ALL");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#222222"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          {isCommunity ? "Explore Communities" : "Build With My Property"}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
      >
        {/* Page Header */}
        <View style={styles.pageHeading}>
          <Text style={styles.tag}>COMMUNITY DISCOVERY</Text>

          <Text style={styles.pageTitle}>
            {isCommunity
              ? "Explore Communities"
              : "Build With a Group"}
          </Text>

          <Text style={styles.pageSubtitle}>
            {isCommunity
              ? "Join like-minded groups pooling resources to buy land and build together."
              : "Discover unfinished and under-construction properties seeking co-buyers and investors."}
          </Text>

          <Pressable style={styles.startButton} onPress={onStart}>
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.startButtonText}>
              Start a Community
            </Text>
          </Pressable>
        </View>

        {/* Category Heading */}
        <View style={styles.categoryHeading}>
          <Text
            style={[
              styles.categoryBadge,
              !isCommunity && styles.orangeBadge,
            ]}
          >
            {isCommunity
              ? "CATEGORY 1 — PEOPLE FIRST"
              : "CATEGORY 2 — PROPERTY FIRST"}
          </Text>

          <Text style={styles.categoryTitle}>
            {isCommunity
              ? "Friends Communities"
              : "Build With a Group"}
          </Text>

          <Text style={styles.categoryDescription}>
            {isCommunity
              ? "Start from scratch with people who want to pool capital and develop property together."
              : "Property-linked opportunities for people interested in co-buying, investing and completing projects."}
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons
            name="magnify"
            size={21}
            color="#777777"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, locality or features..."
            placeholderTextColor="#999999"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {searchTerm.length > 0 && (
            <Pressable onPress={() => setSearchTerm("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color="#777777"
              />
            </Pressable>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          <Pressable
            style={styles.filterSelect}
            onPress={() => openDropdown("zone")}
          >
            <View>
              <Text style={styles.filterLabel}>ZONE</Text>
              <Text style={styles.filterValue}>
                {selectedZone === "ALL" ? "All Zones" : selectedZone}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#555555"
            />
          </Pressable>

          <Pressable
            style={styles.filterSelect}
            onPress={() => openDropdown("property")}
          >
            <View>
              <Text style={styles.filterLabel}>PROPERTY TYPE</Text>
              <Text style={styles.filterValue}>
                {selectedPropertyType === "ALL"
                  ? "All Types"
                  : selectedPropertyType}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#555555"
            />
          </Pressable>
        </View>

        {/* Results */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>
            Showing{" "}
            <Text style={styles.resultsNumber}>
              {filteredData.length}
            </Text>{" "}
            opportunities
          </Text>

          {(searchTerm ||
            selectedZone !== "ALL" ||
            selectedPropertyType !== "ALL") && (
            <Pressable onPress={resetFilters}>
              <Text style={styles.resetText}>Reset Filters</Text>
            </Pressable>
          )}
        </View>

        {/* Opportunity Cards */}
        {filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="home-search-outline"
              size={45}
              color="#A5A5A5"
            />

            <Text style={styles.emptyTitle}>
              No Opportunities Found
            </Text>

            <Text style={styles.emptyDescription}>
              Try changing your search or filters.
            </Text>

            <Pressable onPress={resetFilters}>
              <Text style={styles.resetText}>Clear Filters</Text>
            </Pressable>
          </View>
        ) : (
          filteredData.map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              isCommunity={isCommunity}
            />
          ))
        )}
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <Pressable
            style={styles.dropdownModal}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {dropdownType === "zone" ? "Zone" : "Property Type"}
              </Text>

              <Pressable onPress={() => setDropdownVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={23}
                  color="#333333"
                />
              </Pressable>
            </View>

            {dropdownOptions.map((option) => (
              <Pressable
                key={option}
                style={styles.dropdownOption}
                onPress={() => selectOption(option)}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    currentValue === option && styles.selectedOptionText,
                  ]}
                >
                  {option === "ALL"
                    ? dropdownType === "zone"
                      ? "All Zones"
                      : "All Types"
                    : option}
                </Text>

                {currentValue === option && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#2E7D32"
                  />
                )}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// --------------------------------------------------
// OPPORTUNITY CARD
// --------------------------------------------------

type OpportunityCardProps = {
  item: Opportunity;
  isCommunity: boolean;
};

function OpportunityCard({
  item,
  isCommunity,
}: OpportunityCardProps) {
  return (
    <View style={styles.opportunityCard}>
      <View style={styles.cardTopRow}>
        <View
          style={[
            styles.cardIcon,
            !isCommunity && styles.orangeCardIcon,
          ]}
        >
          <MaterialCommunityIcons
            name={isCommunity ? "account-group-outline" : "home-city-outline"}
            size={27}
            color={isCommunity ? "#2E7D32" : "#EA580C"}
          />
        </View>

        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={15}
              color="#777777"
            />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.cardDescription}>
        {item.description}
      </Text>

      <View style={styles.cardInfoRow}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="home-outline"
            size={16}
            color="#666666"
          />
          <Text style={styles.infoText}>{item.propertyType}</Text>
        </View>

        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="account-outline"
            size={16}
            color="#666666"
          />
          <Text style={styles.infoText}>{item.members}</Text>
        </View>
      </View>

      <View style={styles.cardBottomRow}>
        <Text
          style={[
            styles.statusText,
            !isCommunity && styles.orangeStatusText,
          ]}
        >
          {item.status}
        </Text>

        <Pressable
          style={styles.viewDetailsButton}
          onPress={() =>
            Alert.alert(
              "Opportunity Details",
              "Detailed opportunity information and backend connection will be added next."
            )
          }
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={16}
            color="#2E7D32"
          />
        </Pressable>
      </View>
    </View>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  headerTitle: {
    color: "#222222",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },

  homeContent: {
    padding: 20,
    paddingBottom: 35,
  },

  homeTitle: {
    color: "#222222",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },

  homeDescription: {
    color: "#666666",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },

  homeFeatureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 17,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  homeFeatureIcon: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  homeFeatureText: {
    flex: 1,
    marginLeft: 14,
  },

  optionsContent: {
    padding: 20,
    paddingBottom: 35,
  },

  optionsIntro: {
    color: "#666666",
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 22,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 17,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  optionTextContainer: {
    flex: 1,
  },

  optionTitle: {
    color: "#222222",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  optionDescription: {
    color: "#666666",
    fontSize: 13,
    lineHeight: 19,
  },

  // Opportunity screen
  listContent: {
    padding: 18,
    paddingBottom: 40,
  },

  pageHeading: {
    marginBottom: 23,
  },

  tag: {
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 9,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#222222",
    marginBottom: 8,
  },

  pageSubtitle: {
    fontSize: 13,
    lineHeight: 21,
    color: "#666666",
  },

  startButton: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 9,
    marginTop: 16,
  },

  startButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  categoryHeading: {
    marginBottom: 17,
  },

  categoryBadge: {
    color: "#2E7D32",
    backgroundColor: "#E8F5E9",
    overflow: "hidden",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    fontWeight: "800",
    fontSize: 10,
    marginBottom: 10,
  },

  orangeBadge: {
    color: "#C2410C",
    backgroundColor: "#FFF0E6",
  },

  categoryTitle: {
    color: "#222222",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 7,
  },

  categoryDescription: {
    color: "#666666",
    fontSize: 13,
    lineHeight: 20,
  },

  searchBox: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 13,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#222222",
    fontSize: 13,
    paddingVertical: 8,
  },

  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  filterSelect: {
    flex: 1,
    minHeight: 60,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  filterLabel: {
    color: "#888888",
    fontSize: 9,
    fontWeight: "700",
    marginBottom: 5,
  },

  filterValue: {
    color: "#222222",
    fontSize: 12,
    fontWeight: "600",
  },

  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  resultsText: {
    fontSize: 13,
    color: "#666666",
  },

  resultsNumber: {
    color: "#222222",
    fontWeight: "800",
  },

  resetText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "700",
  },

  opportunityCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 13,
    padding: 15,
    marginBottom: 13,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardIcon: {
    height: 46,
    width: 46,
    borderRadius: 11,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  orangeCardIcon: {
    backgroundColor: "#FFF0E6",
  },

  cardTitleContainer: {
    flex: 1,
  },

  cardTitle: {
    color: "#222222",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 5,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationText: {
    color: "#777777",
    fontSize: 11,
    marginLeft: 3,
  },

  cardDescription: {
    color: "#666666",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 13,
    marginBottom: 13,
  },

  cardInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    color: "#666666",
    fontSize: 11,
    marginLeft: 4,
  },

  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  statusText: {
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "700",
  },

  orangeStatusText: {
    color: "#EA580C",
  },

  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  viewDetailsText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "700",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 45,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
  },

  emptyTitle: {
    color: "#222222",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },

  emptyDescription: {
    color: "#777777",
    fontSize: 12,
    marginTop: 6,
    marginBottom: 14,
  },

  // Dropdown modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 25,
  },

  dropdownModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 17,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    marginBottom: 5,
  },

  modalTitle: {
    color: "#222222",
    fontSize: 16,
    fontWeight: "700",
  },

  dropdownOption: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  dropdownOptionText: {
    color: "#444444",
    fontSize: 14,
  },

  selectedOptionText: {
    color: "#2E7D32",
    fontWeight: "700",
  },
});
