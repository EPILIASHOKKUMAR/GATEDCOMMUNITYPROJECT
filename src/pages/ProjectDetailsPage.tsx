import React from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "@/theme";
import { FEATURED_PROJECTS_DATA } from "./FeaturedProjectsPage";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const project = FEATURED_PROJECTS_DATA.find((item) => item.id === id);

  if (!project) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.notFound}>
          <MaterialCommunityIcons name="home-search-outline" size={48} color={colors.primary} />
          <Text style={styles.notFoundTitle}>Project not found</Text>
          <Text style={styles.notFoundText}>This project may no longer be available.</Text>
          <Pressable style={styles.backToProjects} onPress={() => router.back()}>
            <Text style={styles.backToProjectsText}>Back to projects</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Image source={{ uri: project.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.imageShade} />
          <Pressable style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Go back">
            <MaterialCommunityIcons name="arrow-left" size={22} color="#172238" />
          </Pressable>
          <View style={styles.heroBadges}>
            <View style={styles.tagBadge}><Text style={styles.tagText}>{project.tag}</Text></View>
            {project.rating && <View style={styles.ratingBadge}><MaterialCommunityIcons name="star" size={14} color="#F6C453" /><Text style={styles.ratingText}>{project.rating.replace("★", "").trim()}</Text></View>}
          </View>
          <Pressable
            style={styles.shareButton}
            onPress={() => Alert.alert("Share project", `Share ${project.title} with your friends.`)}
            accessibilityLabel="Share project"
          >
            <MaterialCommunityIcons name="share-variant" size={19} color="#172238" />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.titleBlock}>
            <View style={styles.categoryPill}><Text style={styles.categoryText}>{project.category}</Text></View>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker" size={18} color={colors.primary} />
              <Text style={styles.locationText}>{project.location}</Text>
            </View>
          </View>

          <View style={styles.priceCard}>
            <View>
              <Text style={styles.eyebrow}>PRICE</Text>
              <Text style={styles.price}>{project.price}</Text>
            </View>
            {project.possession && <View style={styles.possessionBlock}>
              <Text style={styles.eyebrow}>POSSESSION</Text>
              <Text style={styles.possession}>{project.possession}</Text>
            </View>}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Home overview</Text>
            <Text style={styles.configuration}>{project.configuration}</Text>
            <View style={styles.overviewGrid}>
              <View style={styles.overviewItem}>
                <View style={styles.overviewIcon}><MaterialCommunityIcons name="home-city-outline" size={20} color={colors.primary} /></View>
                <View><Text style={styles.overviewLabel}>Property type</Text><Text style={styles.overviewValue}>{project.category}</Text></View>
              </View>
              <View style={styles.overviewItem}>
                <View style={styles.overviewIcon}><MaterialCommunityIcons name="calendar-check-outline" size={20} color={colors.primary} /></View>
                <View><Text style={styles.overviewLabel}>Possession</Text><Text style={styles.overviewValue}>{project.possession || "Contact for details"}</Text></View>
              </View>
              {project.clubhouseSqFt && <View style={styles.overviewItem}>
                <View style={styles.overviewIcon}><MaterialCommunityIcons name="domain" size={20} color={colors.primary} /></View>
                <View><Text style={styles.overviewLabel}>Clubhouse</Text><Text style={styles.overviewValue}>{project.clubhouseSqFt}</Text></View>
              </View>}
              {project.rating && <View style={styles.overviewItem}>
                <View style={styles.overviewIcon}><MaterialCommunityIcons name="star-outline" size={20} color={colors.primary} /></View>
                <View><Text style={styles.overviewLabel}>Project rating</Text><Text style={styles.overviewValue}>{project.rating}</Text></View>
              </View>}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project highlights</Text>
            <Text style={styles.sectionSubtitle}>Explore the features available at {project.title}.</Text>
            <View style={styles.highlightsList}>
              {project.highlights.map((highlight, index) => (
                <View key={`${highlight.text}-${index}`} style={styles.highlightRow}>
                  <View style={styles.highlightIcon}><MaterialCommunityIcons name={highlight.icon} size={19} color={colors.primary} /></View>
                  <Text style={styles.highlightText}>{highlight.text}</Text>
                  <MaterialCommunityIcons name="check-circle" size={17} color="#21A366" />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.contactCard}>
            <View style={styles.contactIcon}><MaterialCommunityIcons name="headset" size={22} color={colors.primary} /></View>
            <View style={styles.contactCopy}>
              <Text style={styles.contactTitle}>Interested in this project?</Text>
              <Text style={styles.contactText}>Talk to our team for more information.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}><Text style={styles.eyebrow}>STARTING FROM</Text><Text style={styles.bottomPriceText}>{project.price}</Text></View>
        <Pressable
          style={styles.enquiryButton}
          onPress={() => Alert.alert("Request information", `Our team can help you learn more about ${project.title}.`)}
        >
          <Text style={styles.enquiryText}>Get in touch</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9F8" },
  scrollContent: { paddingBottom: 24 },
  hero: { height: 290, backgroundColor: "#DCE7E0" },
  heroImage: { width: "100%", height: "100%" },
  imageShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(12, 25, 20, 0.16)" },
  backButton: { position: "absolute", top: 14, left: 16, width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.95)", alignItems: "center", justifyContent: "center" },
  shareButton: { position: "absolute", top: 14, right: 16, width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.95)", alignItems: "center", justifyContent: "center" },
  heroBadges: { position: "absolute", left: 16, bottom: 16, flexDirection: "row", alignItems: "center", gap: 8 },
  tagBadge: { backgroundColor: "#087D4A", borderRadius: 8, paddingHorizontal: 11, paddingVertical: 7 },
  tagText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900", letterSpacing: 0.6 },
  ratingBadge: { backgroundColor: "rgba(15,23,42,0.82)", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 7, flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  content: { paddingHorizontal: 18 },
  titleBlock: { paddingTop: 20, paddingBottom: 17 },
  categoryPill: { alignSelf: "flex-start", backgroundColor: "#E6F5EC", borderRadius: 7, paddingHorizontal: 9, paddingVertical: 5, marginBottom: 8 },
  categoryText: { color: "#087D4A", fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.4 },
  projectTitle: { color: "#152238", fontSize: 24, lineHeight: 30, fontWeight: "900", letterSpacing: -0.4 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8 },
  locationText: { color: "#667386", fontSize: 13, fontWeight: "600", flex: 1 },
  priceCard: { backgroundColor: "#FFFFFF", borderRadius: 17, borderWidth: 1, borderColor: "#E7ECE9", padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", shadowColor: "#10251A", shadowOpacity: 0.04, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  eyebrow: { color: "#7D8997", fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  price: { color: "#087D4A", fontSize: 18, fontWeight: "900", marginTop: 5 },
  possessionBlock: { alignItems: "flex-end", paddingLeft: 10 },
  possession: { color: "#152238", fontSize: 13, fontWeight: "800", marginTop: 6 },
  section: { marginTop: 25 },
  sectionTitle: { color: "#152238", fontSize: 18, fontWeight: "900", letterSpacing: -0.2 },
  configuration: { color: "#566579", fontSize: 14, lineHeight: 21, marginTop: 7, fontWeight: "600" },
  overviewGrid: { backgroundColor: "#FFFFFF", borderRadius: 17, borderWidth: 1, borderColor: "#E7ECE9", marginTop: 13, padding: 6, flexDirection: "row", flexWrap: "wrap" },
  overviewItem: { width: "50%", minHeight: 74, flexDirection: "row", alignItems: "center", paddingHorizontal: 8, gap: 9 },
  overviewIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#ECF7F0", alignItems: "center", justifyContent: "center" },
  overviewLabel: { color: "#8792A0", fontSize: 10, fontWeight: "600" },
  overviewValue: { color: "#253448", fontSize: 12, fontWeight: "800", marginTop: 3, flexShrink: 1 },
  sectionSubtitle: { color: "#788494", fontSize: 12, lineHeight: 18, marginTop: 5 },
  highlightsList: { marginTop: 12, backgroundColor: "#FFFFFF", borderRadius: 17, borderWidth: 1, borderColor: "#E7ECE9", paddingHorizontal: 14 },
  highlightRow: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: 1, borderBottomColor: "#F0F3F1" },
  highlightIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#ECF7F0", alignItems: "center", justifyContent: "center" },
  highlightText: { color: "#344256", fontSize: 12, fontWeight: "600", flex: 1 },
  contactCard: { marginTop: 23, backgroundColor: "#EAF6EF", borderRadius: 17, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  contactIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  contactCopy: { flex: 1 },
  contactTitle: { color: "#1D3B2A", fontSize: 13, fontWeight: "800" },
  contactText: { color: "#617467", fontSize: 11, marginTop: 3 },
  bottomBar: { backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E8EDEA", paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  bottomPrice: { flex: 1 },
  bottomPriceText: { color: "#172238", fontSize: 13, fontWeight: "900", marginTop: 4 },
  enquiryButton: { minHeight: 48, borderRadius: 14, backgroundColor: "#087D4A", paddingHorizontal: 17, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  enquiryText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  notFoundTitle: { color: "#172238", fontSize: 20, fontWeight: "900", marginTop: 14 },
  notFoundText: { color: "#718096", fontSize: 13, marginTop: 6 },
  backToProjects: { marginTop: 20, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, backgroundColor: "#087D4A" },
  backToProjectsText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
});
