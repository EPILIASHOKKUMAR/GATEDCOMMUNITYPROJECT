import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/theme";

export type ProjectItem = {
  id: string;
  title: string;
  tag: string;
  location: string;
  category: "Apartments" | "Villas" | "Commercial" | "Plots";
  configuration: string;
  price: string;
  image: string;
  clubhouseSqFt?: string;
  highlights: {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    text: string;
  }[];
  possession?: string;
  rating?: string;
  purpose?: "Buy" | "Rent" | "Commercial";
};

export const FEATURED_PROJECTS_DATA: ProjectItem[] = [
  {
    id: "1",
    title: "Anuhar Apple Towers",
    tag: "FEATURED PROJECT",
    location: "Pocharam, Hyderabad",
    category: "Apartments",
    configuration: "2, 2.5 & 3 BHK Apartments",
    price: "Price on Request",
    image: "https://online.fliphtml5.com/kojwp/xuwj/files/shot.jpg",
    clubhouseSqFt: "50,000 sq. ft.",
    possession: "Dec 2026",
    rating: "4.9 ★",
    highlights: [
      { icon: "domain", text: "50,000 sq. ft. clubhouse" },
      { icon: "pool", text: "Swimming pools & deck" },
      { icon: "dumbbell", text: "Gym & indoor games" },
      { icon: "badminton", text: "Badminton & cricket nets" },
      { icon: "tree-outline", text: "Gardens & jogging track" },
      { icon: "book-open-page-variant-outline", text: "Library & lounge" },
    ],
  },
  {
    id: "2",
    title: "The Royal Palm Villas",
    tag: "LUXURY VILLAS",
    location: "Mokila, Gachibowli Extn, Hyderabad",
    category: "Villas",
    configuration: "4 & 5 BHK Triplex Luxury Villas",
    price: "₹ 3.85 Cr onwards",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    clubhouseSqFt: "35,000 sq. ft.",
    possession: "Ready to Move",
    rating: "4.8 ★",
    highlights: [
      { icon: "home-modern", text: "Private rooftop swimming pool" },
      { icon: "tree", text: "2-acre central landscaped forest" },
      { icon: "car-electric", text: "Dual EV charging in garage" },
      { icon: "solar-power", text: "100% solar power backed" },
      { icon: "shield-check", text: "4-tier biometric security" },
      { icon: "spa-outline", text: "Jacuzzi & wellness spa" },
    ],
  },
  {
    id: "3",
    title: "Prestige Sky Heights",
    tag: "HIGH RISE TOWER",
    location: "Financial District, Nanakramguda, Hyderabad",
    category: "Apartments",
    configuration: "3 & 4 BHK Ultra-Spacious Homes",
    price: "₹ 2.10 Cr - 3.45 Cr",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    clubhouseSqFt: "65,000 sq. ft.",
    possession: "Mid 2027",
    rating: "4.9 ★",
    highlights: [
      { icon: "office-building", text: "Sky deck lounge on 45th floor" },
      { icon: "tennis", text: "Olympic lawn tennis courts" },
      { icon: "food-fork-drink", text: "Fine dining restaurant & cafe" },
      { icon: "movie-open-outline", text: "Private mini theatre (PVR sound)" },
      { icon: "meditation", text: "Zen meditation gardens" },
      { icon: "elevator-passenger", text: "High-speed Mitsubishi elevators" },
    ],
  },
  {
    id: "4",
    title: "Elysian Emerald Enclave",
    tag: "NATURE RETREAT",
    location: "Tellapur, Kollur, Hyderabad",
    category: "Villas",
    configuration: "3 & 4 BHK Duplex Eco Villas",
    price: "₹ 2.45 Cr onwards",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    clubhouseSqFt: "28,000 sq. ft.",
    possession: "Aug 2026",
    rating: "4.7 ★",
    highlights: [
      { icon: "flower-tulip-outline", text: "Botanical gardens & organic farm" },
      { icon: "water-outline", text: "Natural lakefront jogging track" },
      { icon: "yoga", text: "Open-air yoga & amphitheatre" },
      { icon: "basketball", text: "Multi-sport turf court" },
      { icon: "account-child-outline", text: "Safe kids adventure park" },
      { icon: "car-clock", text: "10 mins from ORR Exit 2" },
    ],
  },
  {
    id: "5",
    title: "GatedPlus One Corporate Towers",
    tag: "COMMERCIAL HUB",
    location: "Hitec City, Madhapur, Hyderabad",
    category: "Commercial",
    configuration: "Grade A Office Suites & Retail",
    price: "₹ 1.25 Cr onwards",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    clubhouseSqFt: "40,000 sq. ft.",
    possession: "Mar 2027",
    rating: "4.9 ★",
    highlights: [
      { icon: "domain", text: "IGBC Platinum certified green building" },
      { icon: "coffee-outline", text: "Gourmet food court & coffee hub" },
      { icon: "wifi", text: "Tier 4 dual fiber optic connectivity" },
      { icon: "car-multiple", text: "Automated multi-level parking" },
      { icon: "server", text: "Dedicated data center ready" },
      { icon: "shield-account", text: "Smart turnstiles with AI safety" },
    ],
  },
  {
    id: "6", title: "My Home Avatar", tag: "GATED COMMUNITY", location: "Narsingi, Hyderabad", category: "Apartments", configuration: "2, 3 & 4 BHK Apartments", price: "₹ 1.15 Cr onwards", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", possession: "Ready to Move", rating: "4.8 ★", highlights: [
      { icon: "pool", text: "Swimming pool" }, { icon: "dumbbell", text: "Fitness centre" }, { icon: "tree", text: "Landscaped greens" }, { icon: "shield-check", text: "24/7 security" },
    ],
  },
  {
    id: "7", title: "Aparna Sarovar Zenith", tag: "PREMIUM HOMES", location: "Nallagandla, Hyderabad", category: "Apartments", configuration: "2, 3 & 4 BHK Apartments", price: "₹ 1.28 Cr onwards", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80", possession: "Ready to Move", rating: "4.8 ★", highlights: [
      { icon: "pool", text: "Infinity pool" }, { icon: "run", text: "Jogging track" }, { icon: "tennis", text: "Sports courts" }, { icon: "home-group", text: "Clubhouse" },
    ],
  },
  {
    id: "8", title: "Rajapushpa Provincia", tag: "NEW LAUNCH", location: "Narsingi, Hyderabad", category: "Apartments", configuration: "3 & 4 BHK Apartments", price: "₹ 1.65 Cr onwards", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80", possession: "Dec 2027", rating: "4.7 ★", highlights: [
      { icon: "domain", text: "Modern high-rise living" }, { icon: "pool", text: "Resort-style pool" }, { icon: "leaf", text: "Open green spaces" }, { icon: "home-group", text: "Residents clubhouse" },
    ],
  },
  {
    id: "9", title: " kokapet Lakefront Residences", tag: "LAKEFRONT LIVING", location: "Kokapet, Hyderabad", category: "Apartments", configuration: "3 & 4 BHK Apartments", price: "₹ 1.90 Cr onwards", image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80", possession: "Jun 2028", rating: "4.7 ★", highlights: [
      { icon: "water", text: "Lake views" }, { icon: "pool", text: "Swimming pool" }, { icon: "yoga", text: "Wellness spaces" }, { icon: "shield-check", text: "Gated security" },
    ],
  },
  {
    id: "10", title: "Saket Pranamam", tag: "FAMILY HOMES", location: "Miyapur, Hyderabad", category: "Apartments", configuration: "2 & 3 BHK Apartments", price: "₹ 82 L onwards", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", possession: "Ready to Move", rating: "4.6 ★", highlights: [
      { icon: "pool", text: "Swimming pool" }, { icon: "run", text: "Walking track" }, { icon: "basketball", text: "Sports facilities" }, { icon: "school", text: "Family-friendly" },
    ],
  },
  {
    id: "11", title: "Sri Aditya Le Grandiose", tag: "LUXURY LIVING", location: "Kokapet, Hyderabad", category: "Apartments", configuration: "3 & 4 BHK Apartments", price: "₹ 1.75 Cr onwards", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80", possession: "Mar 2027", rating: "4.8 ★", highlights: [
      { icon: "city-variant", text: "City skyline views" }, { icon: "pool", text: "Leisure pool" }, { icon: "dumbbell", text: "Fitness studio" }, { icon: "tree", text: "Garden spaces" },
    ],
  },
  {
    id: "12", title: "Greenmark Mayfair Apartments", tag: "URBAN HOMES", location: "Kondapur, Hyderabad", category: "Apartments", configuration: "2 & 3 BHK Apartments", price: "₹ 1.05 Cr onwards", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80", possession: "Ready to Move", rating: "4.6 ★", highlights: [
      { icon: "train", text: "Easy city access" }, { icon: "pool", text: "Pool & deck" }, { icon: "home-group", text: "Community spaces" }, { icon: "shield-check", text: "Secure entry" },
    ],
  },
  {
    id: "13", title: "The Botanika", tag: "LUXURY RESIDENCES", location: "Kokapet, Hyderabad", category: "Apartments", configuration: "3 & 4 BHK Apartments", price: "₹ 2.20 Cr onwards", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80", possession: "Ready to Move", rating: "4.8 ★", highlights: [
      { icon: "leaf", text: "Botanical landscapes" }, { icon: "pool", text: "Rooftop pool" }, { icon: "spa", text: "Wellness facilities" }, { icon: "home-group", text: "Luxury clubhouse" },
    ],
  },
  {
    id: "14", title: "Aurobindo Kohinoor", tag: "SIGNATURE TOWERS", location: "Hitec City, Hyderabad", category: "Apartments", configuration: "2, 3 & 4 BHK Apartments", price: "₹ 1.45 Cr onwards", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80", possession: "Dec 2026", rating: "4.7 ★", highlights: [
      { icon: "office-building", text: "Close to business hubs" }, { icon: "pool", text: "Swimming pool" }, { icon: "dumbbell", text: "Modern gym" }, { icon: "tree", text: "Green courtyards" },
    ],
  },
  {
    id: "15", title: "Vertex Kingston", tag: "CONTEMPORARY HOMES", location: "Kokapet, Hyderabad", category: "Apartments", configuration: "3 & 4 BHK Apartments", price: "₹ 1.35 Cr onwards", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", possession: "Jun 2027", rating: "4.6 ★", highlights: [
      { icon: "pool", text: "Family pool" }, { icon: "run", text: "Jogging paths" }, { icon: "home-group", text: "Clubhouse" }, { icon: "shield-check", text: "Gated community" },
    ],
  },
];

export default function FeaturedProjectsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("All Cities");
  const [locality, setLocality] = useState("All Localities");
  const [purpose, setPurpose] = useState("All Purposes");
  const [propertyType, setPropertyType] = useState("All Types");
  const [budget, setBudget] = useState("Any Budget");
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const [likedProjects, setLikedProjects] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedProjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredProjects = FEATURED_PROJECTS_DATA.filter((item) => {
    const numericPrice = Number(item.price.replace(/[^0-9.]/g, ""));
    const amount = item.price.includes("L") ? numericPrice / 100 : numericPrice;
    const matchesFilter = propertyType === "All Types" || item.category === propertyType;
    const matchesCity = city === "All Cities" || item.location.toLowerCase().includes(city.toLowerCase());
    const matchesLocality = locality === "All Localities" || item.location.toLowerCase().includes(locality.toLowerCase());
    const matchesPurpose = purpose === "All Purposes" || (purpose === "Commercial" ? item.category === "Commercial" : purpose === "Buy" && item.category !== "Commercial");
    const matchesBudget = budget === "Any Budget" || (budget === "Under ₹1 Cr" ? amount < 1 : budget === "₹1–2 Cr" ? amount >= 1 && amount < 2 : amount >= 2);
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesCity && matchesLocality && matchesPurpose && matchesBudget && matchesSearch;
  });
  const filterOptions: Record<string, string[]> = {
    City: ["All Cities", "Hyderabad"],
    Locality: ["All Localities", "Pocharam", "Mokila", "Financial District", "Tellapur", "Hitec City", "Narsingi", "Nallagandla", "Kokapet", "Miyapur", "Kondapur"],
    Purpose: ["All Purposes", "Buy", "Rent", "Commercial"],
    Type: ["All Types", "Apartments", "Villas", "Commercial", "Plots"],
    Budget: ["Any Budget", "Under ₹1 Cr", "₹1–2 Cr", "₹2 Cr+"],
  };
  const filterValues: Record<string, string> = { City: city, Locality: locality, Purpose: purpose, Type: propertyType, Budget: budget };
  const setFilterValue = (filter: string, value: string) => {
    if (filter === "City") { setCity(value); setLocality("All Localities"); }
    if (filter === "Locality") setLocality(value);
    if (filter === "Purpose") setPurpose(value);
    if (filter === "Type") setPropertyType(value);
    if (filter === "Budget") setBudget(value);
    setActivePicker(null);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* ── TOP HEADER ────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.navy} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Featured Projects</Text>
          <Text style={styles.headerSubtitle}>
            {filteredProjects.length} premium residential & commercial hubs
          </Text>
        </View>

        <Pressable
          style={styles.headerActionBtn}
          onPress={() => setActivePicker("City")}
        >
          <MaterialCommunityIcons name="tune-vertical" size={20} color={colors.primary} />
        </Pressable>
      </View>

      {/* ── SEARCH & CATEGORY CHIPS ────────────────────────────────────────── */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={22} color={colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Title, builder, landmark..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {Object.keys(filterOptions).map((filter) => (
            <Pressable key={filter} style={styles.filterChip} onPress={() => setActivePicker(filter)}>
              <Text style={styles.filterLabel}>{filter}</Text>
              <Text style={styles.filterValue} numberOfLines={1}>{filterValues[filter]}</Text>
              <MaterialCommunityIcons name="chevron-down" size={15} color="#64748B" style={styles.filterChevron} />
            </Pressable>
          ))}
          <Pressable style={styles.searchButton} onPress={() => Keyboard.dismiss()}>
            <MaterialCommunityIcons name="magnify" size={17} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </ScrollView>
      </View>

      <Modal visible={!!activePicker} transparent animationType="fade" onRequestClose={() => setActivePicker(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setActivePicker(null)}>
          <View style={styles.filterModal}>
            <Text style={styles.modalTitle}>Select {activePicker?.toLowerCase()}</Text>
            <ScrollView style={{ maxHeight: 360 }}>
              {(activePicker ? filterOptions[activePicker] : []).map((option) => (
                <Pressable key={option} style={styles.optionRow} onPress={() => activePicker && setFilterValue(activePicker, option)}>
                  <Text style={styles.optionText}>{option}</Text>
                  {activePicker && filterValues[activePicker] === option && <MaterialCommunityIcons name="check" size={18} color={colors.primary} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* ── PROJECT LIST ──────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredProjects.map((project) => {
          const isLiked = likedProjects[project.id];
          return (
            <View key={project.id} style={styles.projectCard}>
              {/* Project Image Banner */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: project.image }}
                  style={styles.projectImage}
                  resizeMode="cover"
                />

                {/* Top Badge Overlay */}
                <View style={styles.badgeRow}>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{project.tag}</Text>
                  </View>

                  {project.rating && (
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingText}>{project.rating}</Text>
                    </View>
                  )}
                </View>

                {/* Like Button */}
                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => toggleLike(project.id)}
                >
                  <MaterialCommunityIcons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={isLiked ? "#E11D48" : "#FFFFFF"}
                  />
                </Pressable>
              </View>

              {/* Project Info Body */}
              <View style={styles.detailsContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                </View>

                {/* Location */}
                <View style={styles.locationRow}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={16}
                    color={colors.primary}
                  />
                  <Text style={styles.locationText}>{project.location}</Text>
                </View>

                {/* Configuration */}
                <Text style={styles.configurationText}>
                  {project.configuration}
                </Text>

                {/* Price & Possession Row */}
                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>{project.price}</Text>
                  </View>
                  {project.possession && (
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.priceLabel}>Possession</Text>
                      <Text style={styles.possessionValue}>{project.possession}</Text>
                    </View>
                  )}
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Highlights Grid */}
                <Text style={styles.highlightsHeader}>Project Highlights</Text>
                <View style={styles.highlightsGrid}>
                  {project.highlights.map((highlight, index) => (
                    <View key={index} style={styles.highlightItem}>
                      <View style={styles.highlightIconWrap}>
                        <MaterialCommunityIcons
                          name={highlight.icon}
                          size={15}
                          color={colors.primary}
                        />
                      </View>
                      <Text style={styles.highlightText} numberOfLines={1}>
                        {highlight.text}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.cardActionsRow}>
                  <Pressable
                    style={styles.brochureButton}
                    onPress={() => Alert.alert("Brochure", `Downloading brochure for ${project.title}...`)}
                  >
                    <MaterialCommunityIcons name="file-download-outline" size={17} color={colors.primary} />
                    <Text style={styles.brochureButtonText}>Brochure</Text>
                  </Pressable>

                  <Pressable
                    style={styles.detailsButton}
                    onPress={() => router.push({ pathname: "/project-details", params: { id: project.id } })}
                  >
                    <Text style={styles.detailsButtonText}>View Details</Text>
                    <MaterialCommunityIcons name="arrow-right" size={17} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // HEADER
  header: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F5",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  headerActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E9F8F1",
    alignItems: "center",
    justifyContent: "center",
  },

  // SEARCH & FILTER
  searchSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F5",
  },
  searchBar: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.navy,
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: "row",
    gap: 7,
    marginTop: 9,
    alignItems: "center",
  },
  filterChip: {
    height: 48,
    minWidth: 112,
    maxWidth: 150,
    paddingHorizontal: 9,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    position: "relative",
  },
  filterLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.35,
  },
  filterValue: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.navy,
    marginTop: 2,
    paddingRight: 12,
  },
  filterChevron: {
    position: "absolute",
    right: 7,
    top: 17,
  },
  searchButton: {
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 9,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    justifyContent: "center",
    padding: 24,
  },
  filterModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
  },
  modalTitle: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  optionRow: {
    minHeight: 46,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    color: colors.navy,
    fontSize: 14,
  },

  // LIST
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 18,
  },

  // PROJECT CARD
  projectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    height: 200,
    width: "100%",
    backgroundColor: "#E2E8F0",
  },
  projectImage: {
    width: "100%",
    height: "100%",
  },
  badgeRow: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  tagBadge: {
    backgroundColor: "rgba(7, 132, 91, 0.92)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  ratingBadge: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  ratingText: {
    color: "#FACC15",
    fontSize: 10,
    fontWeight: "800",
  },
  favoriteButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  // DETAILS
  detailsContainer: {
    padding: 18,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.navy,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  configurationText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primary,
  },
  possessionValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.navy,
  },
  divider: {
    height: 1,
    backgroundColor: "#EDF1F5",
    marginVertical: 14,
  },

  // HIGHLIGHTS
  highlightsHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.navy,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  highlightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "48%",
  },
  highlightIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#E9F8F1",
    alignItems: "center",
    justifyContent: "center",
  },
  highlightText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
    flex: 1,
  },

  // CARD BUTTONS
  cardActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  brochureButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#BFEAD5",
    backgroundColor: "#E9F8F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  brochureButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  detailsButton: {
    flex: 1.6,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
