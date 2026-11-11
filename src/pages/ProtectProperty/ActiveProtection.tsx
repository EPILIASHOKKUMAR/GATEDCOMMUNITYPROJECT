import React from "react";
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

export function ActiveProtection() {
  const router = useRouter();
  const { properties, refresh, loading } = usePropertyStore();

  const activeProperties = properties.filter(
    (p) => p.protectionStatus === "Active"
  );

  const handleRequestInspection = (property: PropertyItem) => {
    Alert.alert(
      "Request Field Visit",
      `Would you like to dispatch an on-ground physical inspection for "${property.name}"? Your assigned agent will be notified immediately.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Dispatch",
          onPress: () => {
            Alert.alert(
              "Inspection Requested",
              `Agent ${property.assignedAgent?.name || "Rajesh Kumar"} has been assigned to visit within 24 hours.`
            );
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
          <Text style={styles.headerTitle}>Active Protection</Text>
          <Text style={styles.headerSubtitle}>
            protect-my-property / active
          </Text>
        </View>

        <View style={styles.activeCountPill}>
          <View style={styles.liveGreenDot} />
          <Text style={styles.activeCountText}>
            {activeProperties.length} Active
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* BANNER */}
        <View style={styles.banner}>
          <MaterialCommunityIcons
            name="shield-check"
            size={28}
            color={colors.primary}
          />
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>
              Real-Time Security Active
            </Text>
            <Text style={styles.bannerDesc}>
              Assigned field officers conduct regular perimeter audits with GPS geo-tagged photo verification.
            </Text>
          </View>
        </View>

        {activeProperties.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="shield-off-outline"
              size={52}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitle}>No Active Protection</Text>
            <Text style={styles.emptyDesc}>
              None of your saved properties are currently subscribed to a protection plan.
            </Text>
            <Pressable
              style={styles.emptyActionBtn}
              onPress={() => router.push("/saved-properties" as any)}
            >
              <MaterialCommunityIcons
                name="shield-plus"
                size={18}
                color={colors.white}
              />
              <Text style={styles.emptyActionText}>
                Select Property to Protect
              </Text>
            </Pressable>
          </View>
        ) : (
          activeProperties.map((property) => (
            <ActivePropertyCard
              key={property.id}
              property={property}
              onRequestInspection={() => handleRequestInspection(property)}
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

function ActivePropertyCard({
  property,
  onRequestInspection,
  onViewReports,
}: {
  property: PropertyItem;
  onRequestInspection: () => void;
  onViewReports: () => void;
}) {
  const agent = property.assignedAgent || {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    badgeId: "GP-SEC-409",
    rating: 4.9,
    verified: true,
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconBox}>
          <MaterialCommunityIcons
            name="shield-home"
            size={24}
            color={colors.primary}
          />
        </View>

        <View style={styles.cardHeaderInfo}>
          <Text style={styles.propertyName}>{property.name}</Text>
          <Text style={styles.propertyMeta}>
            {property.type} • {property.area}
          </Text>
        </View>

        <View style={styles.liveShieldPill}>
          <MaterialCommunityIcons
            name="shield-check"
            size={14}
            color={colors.success}
          />
          <Text style={styles.liveShieldText}>LIVE GUARD</Text>
        </View>
      </View>

      {/* PLAN DETAILS */}
      <View style={styles.planSection}>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Active Subscription:</Text>
          <Text style={styles.planName}>
            {property.plan?.name || "Weekly Plan"}
          </Text>
        </View>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Visit Frequency:</Text>
          <Text style={styles.planValue}>
            {property.plan?.visits || "4 visits / month"}
          </Text>
        </View>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Next Scheduled Audit:</Text>
          <Text style={styles.planValueHighlight}>
            {property.nextVisitDate || "In 4 days"}
          </Text>
        </View>
      </View>

      {/* ASSIGNED AGENT */}
      <View style={styles.agentCard}>
        <View style={styles.agentAvatar}>
          <MaterialCommunityIcons
            name="account-tie-hat"
            size={22}
            color={colors.navy}
          />
        </View>

        <View style={styles.agentDetails}>
          <View style={styles.agentNameRow}>
            <Text style={styles.agentName}>{agent.name}</Text>
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={14}
                color={colors.primary}
              />
              <Text style={styles.verifiedText}>Verified Officer</Text>
            </View>
          </View>
          <Text style={styles.agentSub}>
            Badge ID: {agent.badgeId} • Rating: {agent.rating} ★
          </Text>
        </View>

        <Pressable
          style={styles.callAgentBtn}
          onPress={() =>
            Alert.alert(
              "Contact Agent",
              `Calling field security agent ${agent.name} (${agent.phone})`
            )
          }
        >
          <MaterialCommunityIcons
            name="phone-outline"
            size={18}
            color={colors.primary}
          />
        </Pressable>
      </View>

      {/* ACTIONS */}
      <View style={styles.actionsRow}>
        <Pressable
          style={styles.inspectBtn}
          onPress={onRequestInspection}
        >
          <MaterialCommunityIcons
            name="radar"
            size={16}
            color={colors.navy}
          />
          <Text style={styles.inspectBtnText}>Request Audit</Text>
        </Pressable>

        <Pressable
          style={styles.reportsBtn}
          onPress={onViewReports}
        >
          <MaterialCommunityIcons
            name="file-document-outline"
            size={16}
            color={colors.white}
          />
          <Text style={styles.reportsBtnText}>Audit Reports</Text>
        </Pressable>
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
  activeCountPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  activeCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 40,
    gap: spacing.md,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: 12,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  bannerDesc: {
    fontSize: typography.caption.fontSize - 1,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
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
  propertyName: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  propertyMeta: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: 2,
  },
  liveShieldPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  liveShieldText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.success,
  },
  planSection: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: 12,
    marginTop: 12,
    gap: 6,
  },
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  planName: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  planValue: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.navy,
  },
  planValueHighlight: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.primary,
  },
  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.navyLight,
    alignItems: "center",
    justifyContent: "center",
  },
  agentDetails: {
    flex: 1,
    marginLeft: 10,
  },
  agentNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  agentName: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  verifiedText: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: "600",
  },
  agentSub: {
    fontSize: typography.caption.fontSize - 1,
    color: colors.textMuted,
    marginTop: 2,
  },
  callAgentBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  inspectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  inspectBtnText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  reportsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
  },
  reportsBtnText: {
    fontSize: typography.caption.fontSize,
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

export default ActiveProtection;
