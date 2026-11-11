import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomNavBar } from "@/components/BottomNavBar";
import { usePropertyStore, InspectionReport } from "./propertyStore";
import { colors, spacing, radii, typography } from "@/theme";

export function PropertyReports() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyId?: string }>();
  const { reports, properties, refresh, loading } = usePropertyStore();

  const [search, setSearch] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    params.propertyId || "All"
  );
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [activeReportModal, setActiveReportModal] = useState<InspectionReport | null>(null);

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter((r) => {
      const matchesProp =
        selectedPropertyId === "All" || r.propertyId === selectedPropertyId;
      const matchesSev =
        severityFilter === "All" || r.severity === severityFilter;
      const matchesSearch =
        !q ||
        r.propertyName.toLowerCase().includes(q) ||
        r.agentName.toLowerCase().includes(q) ||
        r.notes.toLowerCase().includes(q) ||
        r.propertyLocation.toLowerCase().includes(q);

      return matchesProp && matchesSev && matchesSearch;
    });
  }, [reports, selectedPropertyId, severityFilter, search]);

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
          <Text style={styles.headerTitle}>Visit Reports</Text>
          <Text style={styles.headerSubtitle}>
            GPS-verified physical inspection audits
          </Text>
        </View>

        <View style={styles.auditBadge}>
          <MaterialCommunityIcons
            name="file-check-outline"
            size={20}
            color={colors.primary}
          />
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.textMuted}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports by notes, property, agent..."
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

      {/* PROPERTY SELECTOR HORIZONTAL SCROLL */}
      <View style={styles.filterStrip}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <Pressable
            style={[
              styles.filterPill,
              selectedPropertyId === "All" && styles.filterPillActive,
            ]}
            onPress={() => setSelectedPropertyId("All")}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedPropertyId === "All" && styles.filterPillTextActive,
              ]}
            >
              All Properties ({reports.length})
            </Text>
          </Pressable>

          {properties.map((p) => {
            const count = reports.filter((r) => r.propertyId === p.id).length;
            const isSelected = selectedPropertyId === p.id;
            return (
              <Pressable
                key={p.id}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                ]}
                onPress={() => setSelectedPropertyId(p.id)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextActive,
                  ]}
                >
                  {p.name} ({count})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* SEVERITY CHIPS */}
      <View style={styles.sevChipsRow}>
        {["All", "NORMAL", "WARNING"].map((sev) => {
          const isSelected = severityFilter === sev;
          return (
            <Pressable
              key={sev}
              style={[
                styles.sevChip,
                isSelected && styles.sevChipActive,
              ]}
              onPress={() => setSeverityFilter(sev)}
            >
              <Text
                style={[
                  styles.sevChipText,
                  isSelected && styles.sevChipTextActive,
                ]}
              >
                {sev === "All" ? "All Severities" : sev}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* REPORTS LIST */}
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
        {filteredReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="file-search-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitle}>No Reports Found</Text>
            <Text style={styles.emptyDesc}>
              No inspection reports match the current filters.
            </Text>
          </View>
        ) : (
          filteredReports.map((report) => (
            <Pressable
              key={report.id}
              style={styles.reportCard}
              onPress={() => setActiveReportModal(report)}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardHeaderInfo}>
                  <Text style={styles.cardTitle}>{report.propertyName}</Text>
                  <Text style={styles.cardLocation}>
                    {report.propertyLocation}
                  </Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    report.status === "VERIFIED"
                      ? styles.badgeVerified
                      : styles.badgeReview,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      report.status === "VERIFIED"
                        ? "check-circle"
                        : "clock-outline"
                    }
                    size={12}
                    color={
                      report.status === "VERIFIED"
                        ? colors.success
                        : colors.warning
                    }
                  />
                  <Text
                    style={[
                      styles.badgeText,
                      report.status === "VERIFIED"
                        ? styles.badgeTextVerified
                        : styles.badgeTextReview,
                    ]}
                  >
                    {report.status}
                  </Text>
                </View>
              </View>

              {/* DATE & AGENT */}
              <View style={styles.metaStrip}>
                <View style={styles.metaRow}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={15}
                    color={colors.textMuted}
                  />
                  <Text style={styles.metaText}>{report.date}</Text>
                </View>
                <View style={styles.metaRow}>
                  <MaterialCommunityIcons
                    name="account-check"
                    size={15}
                    color={colors.textMuted}
                  />
                  <Text style={styles.metaText}>{report.agentName}</Text>
                </View>
              </View>

              {/* GPS COORDINATES */}
              <View style={styles.gpsRow}>
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={15}
                  color={colors.primary}
                />
                <Text style={styles.gpsText}>{report.coordinates}</Text>
              </View>

              {/* NOTES */}
              <Text style={styles.notesText} numberOfLines={2}>
                {`"${report.notes}"`}
              </Text>

              {/* AUDIT CHECKLIST PILLS */}
              <View style={styles.checkPillsRow}>
                {report.checks.map((chk, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.checkPill,
                      chk.passed ? styles.checkPassed : styles.checkFailed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={chk.passed ? "check" : "alert-circle-outline"}
                      size={12}
                      color={chk.passed ? colors.success : colors.error}
                    />
                    <Text
                      style={[
                        styles.checkPillText,
                        chk.passed
                          ? styles.checkPassedText
                          : styles.checkFailedText,
                      ]}
                    >
                      {chk.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* FOOTER */}
              <View style={styles.cardFooter}>
                <Text style={styles.viewDetailsText}>
                  View Full Audit & Photos
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color={colors.primary}
                />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* DETAIL MODAL */}
      <Modal
        visible={!!activeReportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveReportModal(null)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Inspection Audit</Text>
                <Text style={styles.modalSubtitle}>
                  {activeReportModal?.propertyName}
                </Text>
              </View>
              <Pressable
                onPress={() => setActiveReportModal(null)}
                style={styles.modalCloseBtn}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.navy}
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}
            >
              {activeReportModal && (
                <>
                  <View style={styles.modalInfoCard}>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Audit Date:</Text>
                      <Text style={styles.modalInfoVal}>
                        {activeReportModal.date}
                      </Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Field Inspector:</Text>
                      <Text style={styles.modalInfoVal}>
                        {activeReportModal.agentName} ({activeReportModal.agentBadge})
                      </Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>GPS Geo-tag:</Text>
                      <Text style={styles.modalInfoVal}>
                        {activeReportModal.coordinates}
                      </Text>
                    </View>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Status:</Text>
                      <Text
                        style={[
                          styles.modalInfoVal,
                          {
                            color:
                              activeReportModal.status === "VERIFIED"
                                ? colors.success
                                : colors.warning,
                          },
                        ]}
                      >
                        {activeReportModal.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modalSectionTitle}>Inspector Remarks</Text>
                  <View style={styles.modalNotesBox}>
                    <Text style={styles.modalNotes}>
                      {activeReportModal.notes}
                    </Text>
                  </View>

                  <Text style={styles.modalSectionTitle}>Safety Checklist</Text>
                  <View style={styles.modalChecksList}>
                    {activeReportModal.checks.map((chk, i) => (
                      <View key={i} style={styles.modalCheckItem}>
                        <MaterialCommunityIcons
                          name={chk.passed ? "check-circle" : "close-circle"}
                          size={18}
                          color={chk.passed ? colors.success : colors.error}
                        />
                        <Text style={styles.modalCheckText}>{chk.label}</Text>
                      </View>
                    ))}
                  </View>

                  {activeReportModal.photos.length > 0 && (
                    <>
                      <Text style={styles.modalSectionTitle}>
                        Photographic Verification
                      </Text>
                      <View style={styles.photosGrid}>
                        {activeReportModal.photos.map((photo) => (
                          <View key={photo.id} style={styles.photoCard}>
                            <Image
                              source={{ uri: photo.url }}
                              style={styles.photoImg}
                            />
                            <Text style={styles.photoTitle}>
                              {photo.title}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

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
  auditBadge: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  searchSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 2,
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
  filterStrip: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.white,
    fontWeight: "700",
  },
  sevChipsRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  sevChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  sevChipActive: {
    backgroundColor: colors.primaryLight,
  },
  sevChipText: {
    fontSize: typography.caption.fontSize - 1,
    fontWeight: "600",
    color: colors.textMuted,
  },
  sevChipTextActive: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 40,
    gap: spacing.md,
  },
  reportCard: {
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
    gap: 10,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  cardLocation: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  badgeVerified: {
    backgroundColor: colors.primaryLight,
  },
  badgeReview: {
    backgroundColor: colors.warningLight,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  badgeTextVerified: {
    color: colors.success,
  },
  badgeTextReview: {
    color: colors.warning,
  },
  metaStrip: {
    flexDirection: "row",
    gap: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: typography.caption.fontSize - 1,
    color: colors.textSecondary,
  },
  gpsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    alignSelf: "flex-start",
  },
  gpsText: {
    fontSize: typography.caption.fontSize - 1,
    fontWeight: "600",
    color: colors.primaryDark,
  },
  notesText: {
    fontSize: typography.caption.fontSize,
    color: colors.textPrimary,
    lineHeight: 18,
    fontStyle: "italic",
  },
  checkPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  checkPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
  },
  checkPassed: {
    backgroundColor: "#F0FDF4",
  },
  checkFailed: {
    backgroundColor: "#FEF2F2",
  },
  checkPillText: {
    fontSize: 10,
    fontWeight: "600",
  },
  checkPassedText: {
    color: colors.success,
  },
  checkFailedText: {
    color: colors.error,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viewDetailsText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.primary,
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
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    marginTop: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  modalSubtitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalScroll: {
    padding: spacing.lg,
    gap: 14,
    paddingBottom: 40,
  },
  modalInfoCard: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 8,
  },
  modalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalInfoLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  modalInfoVal: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.navy,
  },
  modalSectionTitle: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.navy,
    marginTop: 6,
  },
  modalNotesBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 12,
  },
  modalNotes: {
    fontSize: typography.body.fontSize - 1,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  modalChecksList: {
    gap: 8,
  },
  modalCheckItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalCheckText: {
    fontSize: typography.body.fontSize - 1,
    color: colors.textPrimary,
  },
  photosGrid: {
    gap: 12,
  },
  photoCard: {
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoImg: {
    width: "100%",
    height: 180,
    backgroundColor: colors.background,
  },
  photoTitle: {
    padding: 10,
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.navy,
    backgroundColor: colors.surface,
  },
});

export default PropertyReports;
