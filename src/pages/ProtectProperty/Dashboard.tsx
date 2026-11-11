import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomNavBar } from "@/components/BottomNavBar";
import { usePropertyStore } from "./propertyStore";
import { colors, spacing, radii, typography } from "@/theme";

export function Dashboard() {
  const router = useRouter();
  const { properties, reports } = usePropertyStore();

  const activeCount = properties.filter((p) => p.protectionStatus === "Active").length;
  const verifiedReports = reports.filter((r) => r.status === "VERIFIED").length;

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
          <Text style={styles.headerTitle}>Protection Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Property security management hub
          </Text>
        </View>

        <Pressable
          style={styles.bellButton}
          onPress={() => router.push("/property-reports" as any)}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={22}
            color={colors.navy}
          />
          {reports.some((r) => r.severity === "WARNING") && (
            <View style={styles.unreadDot} />
          )}
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons
                name="shield-check"
                size={14}
                color={colors.white}
              />
              <Text style={styles.heroBadgeText}>GATEDPLUS SHIELD 24/7</Text>
            </View>

            <Text style={styles.heroTitle}>
              Real-Time Security{"\n"}& Physical Audits
            </Text>

            <Text style={styles.heroSubtitle}>
              Protect your valuable open land, farm lands and villa plots with GPS-verified field inspections.
            </Text>

            <Pressable
              style={styles.heroBtn}
              onPress={() => router.push("/add-property" as any)}
            >
              <MaterialCommunityIcons
                name="plus"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.heroBtnText}>Add New Property</Text>
            </Pressable>
          </View>

          <View style={styles.heroIconBox}>
            <MaterialCommunityIcons
              name="shield-home"
              size={80}
              color="rgba(255,255,255,0.2)"
            />
          </View>
        </View>

        {/* METRICS */}
        <Text style={styles.sectionTitle}>Security Overview</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: colors.primaryLight }]}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={22}
                color={colors.primary}
              />
            </View>
            <Text style={styles.metricNumber}>{activeCount}</Text>
            <Text style={styles.metricLabel}>Active Shields</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: colors.blueLight }]}>
              <MaterialCommunityIcons
                name="home-city-outline"
                size={22}
                color={colors.blue}
              />
            </View>
            <Text style={styles.metricNumber}>{properties.length}</Text>
            <Text style={styles.metricLabel}>Total Properties</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: "#FFF8EF" }]}>
              <MaterialCommunityIcons
                name="clipboard-check-outline"
                size={22}
                color={colors.warning}
              />
            </View>
            <Text style={styles.metricNumber}>{verifiedReports}</Text>
            <Text style={styles.metricLabel}>Audits Verified</Text>
          </View>
        </View>

        {/* 4 PRIMARY HUBS */}
        <Text style={styles.sectionTitle}>Protection Modules</Text>
        <View style={styles.modulesGrid}>
          <Pressable
            style={styles.moduleCard}
            onPress={() => router.push("/add-property" as any)}
          >
            <View style={[styles.moduleIcon, { backgroundColor: colors.primaryLight }]}>
              <MaterialCommunityIcons
                name="home-plus-outline"
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={styles.moduleTitle}>Add Property</Text>
            <Text style={styles.moduleSub}>Register new plot or land</Text>
          </Pressable>

          <Pressable
            style={styles.moduleCard}
            onPress={() => router.push("/saved-properties" as any)}
          >
            <View style={[styles.moduleIcon, { backgroundColor: colors.blueLight }]}>
              <MaterialCommunityIcons
                name="bookmark-outline"
                size={24}
                color={colors.blue}
              />
            </View>
            <Text style={styles.moduleTitle}>Saved Properties</Text>
            <Text style={styles.moduleSub}>
              {properties.length} properties logged
            </Text>
          </Pressable>

          <Pressable
            style={styles.moduleCard}
            onPress={() => router.push("/active-protection" as any)}
          >
            <View style={[styles.moduleIcon, { backgroundColor: "#DCFCE7" }]}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={24}
                color={colors.success}
              />
            </View>
            <Text style={styles.moduleTitle}>Active Protection</Text>
            <Text style={styles.moduleSub}>
              {activeCount} properties active
            </Text>
          </Pressable>

          <Pressable
            style={styles.moduleCard}
            onPress={() => router.push("/property-reports" as any)}
          >
            <View style={[styles.moduleIcon, { backgroundColor: "#F3E8FF" }]}>
              <MaterialCommunityIcons
                name="file-document-check-outline"
                size={24}
                color="#8B5CC7"
              />
            </View>
            <Text style={styles.moduleTitle}>Visit Reports</Text>
            <Text style={styles.moduleSub}>
              {reports.length} inspection logs
            </Text>
          </Pressable>
        </View>

        {/* RECENT INSPECTIONS PREVIEW */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Latest Inspection Logs</Text>
          <Pressable onPress={() => router.push("/property-reports" as any)}>
            <Text style={styles.viewAllText}>View All ({reports.length})</Text>
          </Pressable>
        </View>

        {reports.slice(0, 2).map((rep) => (
          <Pressable
            key={rep.id}
            style={styles.reportPreviewCard}
            onPress={() =>
              router.push({
                pathname: "/property-reports" as any,
                params: { propertyId: rep.propertyId },
              })
            }
          >
            <View style={styles.reportIconCircle}>
              <MaterialCommunityIcons
                name="clipboard-check"
                size={20}
                color={rep.severity === "WARNING" ? colors.warning : colors.primary}
              />
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportPropertyName}>{rep.propertyName}</Text>
              <Text style={styles.reportDateAgent}>
                {rep.date} • {rep.agentName}
              </Text>
              <Text style={styles.reportNotes} numberOfLines={1}>
                {rep.notes}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={colors.textMuted}
            />
          </Pressable>
        ))}
      </ScrollView>

      <BottomNavBar activeTab="protect" />
    </SafeAreaView>
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
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 40,
    gap: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.md + 2,
    flexDirection: "row",
    overflow: "hidden",
    position: "relative",
  },
  heroContent: {
    flex: 1,
    zIndex: 1,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    gap: 4,
  },
  heroBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.white,
    marginTop: 10,
    lineHeight: 26,
  },
  heroSubtitle: {
    fontSize: typography.caption.fontSize,
    color: "rgba(255,255,255,0.85)",
    marginTop: 6,
    lineHeight: 18,
  },
  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.lg,
    gap: 6,
    marginTop: 14,
  },
  heroBtnText: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  heroIconBox: {
    position: "absolute",
    right: -10,
    bottom: -15,
  },
  sectionTitle: {
    fontSize: typography.label.fontSize + 1,
    fontWeight: "700",
    color: colors.navy,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.primary,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.sm + 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  metricNumber: {
    fontSize: typography.h2.fontSize,
    fontWeight: "800",
    color: colors.navy,
  },
  metricLabel: {
    fontSize: typography.caption.fontSize - 1,
    color: colors.textSecondary,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  modulesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  moduleCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  moduleIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  moduleSub: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: 2,
  },
  reportPreviewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportIconCircle: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  reportInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reportPropertyName: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  reportDateAgent: {
    fontSize: typography.caption.fontSize - 1,
    color: colors.textSecondary,
    marginTop: 1,
  },
  reportNotes: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: 4,
  },
});

export default Dashboard;
