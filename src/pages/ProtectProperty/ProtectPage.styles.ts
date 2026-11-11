
import { StyleSheet } from "react-native";


export const C = {
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

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 35,
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
