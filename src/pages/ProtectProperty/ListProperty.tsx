import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomNavBar } from "@/components/BottomNavBar";
import { usePropertyStore, PropertyItem } from "./propertyStore";
import { colors, spacing, radii, typography } from "@/theme";

export function ListProperty() {
  const router = useRouter();
  const { properties, refresh, loading } = usePropertyStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Pending" | "Not protected">("All");

  const filteredProperties = useMemo(() => {
    const q = search.trim().toLowerCase();
    return properties.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.surveyNumber.toLowerCase().includes(q);

      const matchesFilter =
        filter === "All" || p.protectionStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [properties, search, filter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={colors.navy}
          />
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>All Properties</Text>
          <Text style={styles.headerSubtitle}>
            {properties.length} properties registered
          </Text>
        </View>

        <Pressable
          style={styles.addBtn}
          onPress={() => router.push("/add-property" as any)}
        >
          <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.textMuted}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, survey # or area..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* FILTER CHIPS */}
      <View style={styles.chipsRow}>
        {(["All", "Active", "Pending", "Not protected"] as const).map((chip) => {
          const isSelected = filter === chip;
          const count =
            chip === "All"
              ? properties.length
              : properties.filter((p) => p.protectionStatus === chip).length;

          return (
            <Pressable
              key={chip}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => setFilter(chip)}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextActive]}
              >
                {chip === "Active" ? "Protected" : chip} ({count})
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* PROPERTIES LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {filteredProperties.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons
                name="home-search-outline"
                size={40}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No Properties Found</Text>
            <Text style={styles.emptyDesc}>
              {search
                ? `No properties match "${search}"`
                : "You don't have any properties matching this filter."}
            </Text>
            <Pressable
              style={styles.emptyActionBtn}
              onPress={() => router.push("/add-property" as any)}
            >
              <MaterialCommunityIcons
                name="plus"
                size={18}
                color={colors.white}
              />
              <Text style={styles.emptyActionText}>Add New Property</Text>
            </Pressable>
          </View>
        ) : (
          filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onActivate={() =>
                router.push({
                  pathname: "/payment" as any,
                  params: { propertyId: property.id },
                })
              }
              onViewReports={() =>
                router.push({
                  pathname: "/property-reports" as any,
                  params: { propertyId: property.id },
                })
              }
            />
          ))
        )}
      </ScrollView>

      <BottomNavBar activeTab="protect" />
    </SafeAreaView>
  );
}

function PropertyCard({
  property,
  onActivate,
  onViewReports,
}: {
  property: PropertyItem;
  onActivate: () => void;
  onViewReports: () => void;
}) {
  const isProtected = property.protectionStatus === "Active";
  const isPending = property.protectionStatus === "Pending";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name={
              property.type === "Farm Land"
                ? "sprout"
                : property.type === "Residential Plot"
                ? "home-city"
                : "terrain"
            }
            size={24}
            color={colors.primary}
          />
        </View>

        <View style={styles.cardHeaderInfo}>
          <Text style={styles.cardTitle}>{property.name}</Text>
          <Text style={styles.cardSub}>{property.type}</Text>
        </View>

        <View
          style={[
            styles.statusPill,
            isProtected
              ? styles.statusProtected
              : isPending
              ? styles.statusPending
              : styles.statusUnprotected,
          ]}
        >
          <MaterialCommunityIcons
            name={
              isProtected
                ? "shield-check"
                : isPending
                ? "clock-outline"
                : "shield-off-outline"
            }
            size={13}
            color={
              isProtected
                ? colors.success
                : isPending
                ? colors.warning
                : colors.textMuted
            }
          />
          <Text
            style={[
              styles.statusPillText,
              isProtected
                ? styles.statusProtectedText
                : isPending
                ? styles.statusPendingText
                : styles.statusUnprotectedText,
            ]}
          >
            {isProtected ? "Protected" : isPending ? "Pending" : "Not Protected"}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="ruler-square"
              size={15}
              color={colors.textMuted}
            />
            <Text style={styles.metaText}>{property.area}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={15}
              color={colors.textMuted}
            />
            <Text style={styles.metaText}>{property.surveyNumber}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="wall"
              size={15}
              color={colors.textMuted}
            />
            <Text style={styles.metaText}>{property.boundaryType}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={16}
            color={colors.primary}
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.address || `${property.village}, ${property.city}`}
          </Text>
        </View>

        {isProtected && property.plan && (
          <View style={styles.planBanner}>
            <MaterialCommunityIcons
              name="shield-star"
              size={16}
              color={colors.primaryDark}
            />
            <Text style={styles.planBannerText}>
              {property.plan.name} ({property.plan.visits})
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        {isProtected ? (
          <>
            <Pressable style={styles.actionOutlineBtn} onPress={onViewReports}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.actionOutlineBtnText}>View Reports</Text>
            </Pressable>
            <View style={styles.activePill}>
              <MaterialCommunityIcons
                name="check-circle"
                size={14}
                color={colors.success}
              />
              <Text style={styles.activePillText}>Live Guard Active</Text>
            </View>
          </>
        ) : (
          <Pressable style={styles.actionSolidBtn} onPress={onActivate}>
            <MaterialCommunityIcons
              name="shield-plus-outline"
              size={16}
              color={colors.white}
            />
            <Text style={styles.actionSolidBtnText}>Activate Protection</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.lg,
  },
  addBtnText: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.white,
  },
  searchSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.xs,
    backgroundColor: colors.surface,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: typography.body.fontSize - 1,
    color: colors.textPrimary,
  },
  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 40,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  cardSub: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  statusProtected: {
    backgroundColor: colors.primaryLight,
  },
  statusProtectedText: {
    color: colors.success,
    fontSize: typography.caption.fontSize - 1,
    fontWeight: "700",
  },
  statusPending: {
    backgroundColor: colors.warningLight,
  },
  statusPendingText: {
    color: colors.warning,
    fontSize: typography.caption.fontSize - 1,
    fontWeight: "700",
  },
  statusUnprotected: {
    backgroundColor: "#F2F4F7",
  },
  statusUnprotectedText: {
    color: colors.textMuted,
    fontSize: typography.caption.fontSize - 1,
    fontWeight: "600",
  },
  statusPillText: {
    fontSize: 11,
  },
  cardBody: {
    marginTop: 12,
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.background,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
  },
  metaText: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    flex: 1,
  },
  planBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.md,
  },
  planBannerText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionOutlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  actionOutlineBtnText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.primary,
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activePillText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.success,
  },
  actionSolidBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
  },
  actionSolidBtnText: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.white,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  emptyDesc: {
    fontSize: typography.body.fontSize - 1,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  emptyActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radii.lg,
  },
  emptyActionText: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.white,
  },
});

export default ListProperty;

