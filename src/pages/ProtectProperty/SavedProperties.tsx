import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomNavBar } from "@/components/BottomNavBar";
import { usePropertyStore, PropertyItem } from "./propertyStore";
import { colors, spacing, radii, typography } from "@/theme";

export function SavedProperties() {
  const router = useRouter();
  const { properties, deleteProperty, refresh, loading } = usePropertyStore();
  const [activeTab, setActiveTab] = useState<"All" | "Protected" | "Unprotected">("All");

  const filteredProperties = properties.filter((p) => {
    if (activeTab === "Protected") return p.protectionStatus === "Active";
    if (activeTab === "Unprotected") return p.protectionStatus !== "Active";
    return true;
  });

  const handleDelete = (property: PropertyItem) => {
    Alert.alert(
      "Delete Property",
      `Are you sure you want to remove "${property.name}"? This will delete all records and cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProperty(property.id);
              Alert.alert("Deleted", "Property removed successfully.");
            } catch {
              Alert.alert("Error", "Could not delete property.");
            }
          },
        },
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Saved Properties</Text>
          <Text style={styles.headerSubtitle}>
            protect-my-property / properties
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

      {/* STATS STRIP */}
      <View style={styles.statsStrip}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{properties.length}</Text>
          <Text style={styles.statLbl}>Total Saved</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: colors.success }]}>
            {properties.filter((p) => p.protectionStatus === "Active").length}
          </Text>
          <Text style={styles.statLbl}>Protected</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: colors.warning }]}>
            {properties.filter((p) => p.protectionStatus !== "Active").length}
          </Text>
          <Text style={styles.statLbl}>Unprotected</Text>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        {(["All", "Protected", "Unprotected"] as const).map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[styles.tab, isSelected && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabText, isSelected && styles.tabTextActive]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* LIST */}
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
            <MaterialCommunityIcons
              name="home-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitle}>No Properties Found</Text>
            <Text style={styles.emptyDesc}>
              {activeTab === "Protected"
                ? "You have no properties under active protection yet."
                : "No properties saved yet."}
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
              <Text style={styles.emptyActionText}>Add Your First Property</Text>
            </Pressable>
          </View>
        ) : (
          filteredProperties.map((property) => (
            <SavedCard
              key={property.id}
              property={property}
              onActivate={() =>
                router.push({
                  pathname: "/payment" as any,
                  params: { propertyId: property.id },
                })
              }
              onReports={() =>
                router.push({
                  pathname: "/property-reports" as any,
                  params: { propertyId: property.id },
                })
              }
              onActiveProtection={() =>
                router.push("/active-protection" as any)
              }
              onDelete={() => handleDelete(property)}
            />
          ))
        )}
      </ScrollView>

      <BottomNavBar activeTab="protect" />
    </SafeAreaView>
  );
}

function SavedCard({
  property,
  onActivate,
  onReports,
  onActiveProtection,
  onDelete,
}: {
  property: PropertyItem;
  onActivate: () => void;
  onReports: () => void;
  onActiveProtection: () => void;
  onDelete: () => void;
}) {
  const isProtected = property.protectionStatus === "Active";

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardIconBox}>
          <MaterialCommunityIcons
            name={isProtected ? "shield-check" : "home-city-outline"}
            size={24}
            color={isProtected ? colors.primary : colors.navy}
          />
        </View>

        <View style={styles.cardHeaderInfo}>
          <Text style={styles.cardTitle}>{property.name}</Text>
          <Text style={styles.cardSub}>
            {property.type} • {property.area}
          </Text>
        </View>

        <Pressable style={styles.deleteBtn} onPress={onDelete}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            color={colors.error}
          />
        </Pressable>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Survey Number:</Text>
          <Text style={styles.detailValue}>{property.surveyNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ownership:</Text>
          <Text style={styles.detailValue}>{property.ownershipType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Boundary Type:</Text>
          <Text style={styles.detailValue}>{property.boundaryType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={styles.detailValue}>{property.propertyStatus}</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <MaterialCommunityIcons
          name="map-marker"
          size={16}
          color={colors.primary}
        />
        <Text style={styles.addressText} numberOfLines={2}>
          {property.address || `${property.village}, ${property.city}`}
          {property.landmark ? ` (Landmark: ${property.landmark})` : ""}
        </Text>
      </View>

      {isProtected && property.plan && (
        <View style={styles.activePlanBox}>
          <View style={styles.activePlanLeft}>
            <MaterialCommunityIcons
              name="shield-check"
              size={18}
              color={colors.success}
            />
            <View>
              <Text style={styles.activePlanTitle}>{property.plan.name}</Text>
              <Text style={styles.activePlanSubtitle}>
                {property.plan.visits} • Guard assigned
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.managePlanBtn}
            onPress={onActiveProtection}
          >
            <Text style={styles.managePlanText}>Manage</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.actionRow}>
        {isProtected ? (
          <>
            <Pressable style={styles.reportsBtn} onPress={onReports}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.reportsBtnText}>Visit Reports</Text>
            </Pressable>

            <Pressable
              style={styles.activeBtn}
              onPress={onActiveProtection}
            >
              <MaterialCommunityIcons
                name="shield-account-outline"
                size={16}
                color={colors.white}
              />
              <Text style={styles.activeBtnText}>Protection Live</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.activateBtn} onPress={onActivate}>
            <MaterialCommunityIcons
              name="shield-check"
              size={18}
              color={colors.white}
            />
            <Text style={styles.activateBtnText}>
              Protect This Property (From ₹1,999/mo)
            </Text>
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
  statsStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statVal: {
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  statLbl: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: 8,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconBox: {
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
  deleteBtn: {
    padding: 8,
  },
  detailsGrid: {
    marginTop: 12,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: 10,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  detailValue: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.navy,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 10,
  },
  addressText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  activePlanBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primaryLight,
    borderRadius: radii.md,
    padding: 10,
    marginTop: 10,
  },
  activePlanLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activePlanTitle: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  activePlanSubtitle: {
    fontSize: typography.caption.fontSize - 1,
    color: colors.textSecondary,
  },
  managePlanBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.md,
  },
  managePlanText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.primary,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reportsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  reportsBtnText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.primary,
  },
  activeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
  },
  activeBtnText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.white,
  },
  activateBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
  },
  activateBtnText: {
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
  emptyTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
    color: colors.navy,
    marginTop: 12,
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

export default SavedProperties;

