
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Easing,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { BottomNavBar } from "@/components/BottomNavBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

type ReferralType = "OWNER" | "CUSTOMER";

interface Props {
  onOpenReferModal?: (type: ReferralType) => void;
}

type ReferralStatus = "Pending" | "Contacted" | "Completed";
type ReferralFilter = "All Status" | ReferralStatus;
type ReferralTypeFilter = "All Types" | "Owner" | "Customer";

type ReferralRecord = {
  id: number;
  name: string;
  type: "Owner" | "Customer";
  property: string;
  status: ReferralStatus;
};

const referralRecords: ReferralRecord[] = [
  {
    id: 1,
    name: "Rahul Kumar",
    type: "Owner",
    property: "2 BHK Apartment",
    status: "Pending",
  },
  {
    id: 2,
    name: "Priya Sharma",
    type: "Customer",
    property: "3 BHK Apartment",
    status: "Contacted",
  },
  {
    id: 3,
    name: "Arjun Reddy",
    type: "Owner",
    property: "Independent House",
    status: "Completed",
  },
];

const rewardStats = [
  { label: "TOTAL EARNED", value: "₹0", note: "Sign in to track real earnings", icon: "cash-multiple" as const },
  { label: "PENDING REWARDS", value: "₹0", note: "Sign in to track real earnings", icon: "timer-sand" as const },
  { label: "PAID REWARDS", value: "₹0", note: "Sign in to track real earnings", icon: "credit-card-outline" as const },
  { label: "SUCCESSFUL DEALS", value: "0", note: "Sign in to track real earnings", icon: "trophy-outline" as const },
];

const steps = [
  {
    number: "01",
    icon: "account-plus-outline" as const,
    title: "Choose Who to Refer",
  },
  {
    number: "02",
    icon: "file-document-edit-outline" as const,
    title: "Submit Basic Details",
  },
  {
    number: "03",
    icon: "account-tie-outline" as const,
    title: "Specialist Follow-Up",
  },
  {
    number: "04",
    icon: "handshake-outline" as const,
    title: "Deal Closure",
  },
  {
    number: "05",
    icon: "gift-outline" as const,
    title: "Receive Cash Reward",
  },
];

export default function ReferralHomeScreen({
  onOpenReferModal,
}: Props) {
  const router = useRouter();
  const [activitySearch, setActivitySearch] = useState("");
  const [activityFilter, setActivityFilter] =
    useState<ReferralFilter>("All Status");
  const [activityTypeFilter, setActivityTypeFilter] =
    useState<ReferralTypeFilter>("All Types");
  const coinRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(coinRotation, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [coinRotation]);

  const filteredReferrals = useMemo(() => {
    const query = activitySearch.trim().toLowerCase();

    return referralRecords.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.property.toLowerCase().includes(query);

      const matchesStatus =
        activityFilter === "All Status" || item.status === activityFilter;
      const matchesType =
        activityTypeFilter === "All Types" || item.type === activityTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [activitySearch, activityFilter, activityTypeFilter]);

  const handleReferral = (type: ReferralType) => {
    if (onOpenReferModal) {
      onOpenReferModal(type);
    } else {
      Alert.alert(
        type === "OWNER" ? "Refer a Property" : "Refer a Customer",
        "The referral form will be connected here."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
    <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={25} color="#142238" />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Refer & Earn</Text>
          <Text style={styles.headerSubtitle}>Earn rewards with every referral</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* PREMIUM REFERRAL HERO */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="gift-outline" size={20} color="#D99A12" />
            <Text style={styles.badgeText}>GATEDPLUS REWARD PROGRAM</Text>
          </View>

          <View style={styles.heroMainRow}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>
                Start a New Referral
              </Text>
              <Text style={styles.heroDescription}>
                Earn up to <Text style={styles.rewardText}>₹25,000</Text> per deal
              </Text>
            </View>

            {/* Gift and spinning reward coin - no house graphic */}
            <View style={styles.rewardIllustration}>
              <View style={styles.rewardIllustrationGlow} />
              <View style={styles.giftBackground}>
                <MaterialCommunityIcons name="gift" size={49} color="#E5A000" />
              </View>
              <Animated.View
                style={[
                  styles.coin,
                  {
                    transform: [
                      { perspective: 500 },
                      { rotateY: coinRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) },
                    ],
                  },
                ]}
              >
                <MaterialCommunityIcons name="currency-inr" size={22} color="#9A6500" />
              </Animated.View>
              <View style={styles.sparkleTwo}>
                <MaterialCommunityIcons name="star-four-points" size={11} color="#079653" />
              </View>
            </View>
          </View>

          <View style={styles.heroActions}>
            <Pressable
              onPress={() => handleReferral("OWNER")}
              style={({ pressed }) => [styles.heroPrimaryButton, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="office-building" size={18} color="#FFFFFF" />
              <Text style={styles.heroPrimaryButtonText} numberOfLines={1}>Refer a Property</Text>
              <MaterialCommunityIcons name="arrow-right" size={17} color="#FFFFFF" />
            </Pressable>
            <Pressable
              onPress={() => handleReferral("CUSTOMER")}
              style={({ pressed }) => [styles.heroSecondaryButton, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="account-outline" size={18} color="#087D4A" />
              <Text style={styles.heroSecondaryButtonText} numberOfLines={1}>Refer a Customer</Text>
              <MaterialCommunityIcons name="arrow-right" size={17} color="#087D4A" />
            </Pressable>
          </View>
        </View>

        {/* FOUR REWARD SUMMARY CARDS */}
        <View style={styles.statsGrid}>
          {rewardStats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={styles.statCardTop}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <MaterialCommunityIcons name={stat.icon} size={21} color="#079653" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statSubtitle}>🔒 {stat.note}</Text>
            </View>
          ))}
        </View>

        {/* HOW IT WORKS */}

        <View style={styles.howSection}>

          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />

            <View>
              <Text style={styles.sectionTitle}>
                How It Works
              </Text>

              <Text style={styles.sectionSubtitle}>
                Your referral journey in 5 simple steps
              </Text>
            </View>

          </View>

          {/* VERTICAL TIMELINE */}

          {steps.map((step, index) => (

            <View
              key={step.number}
              style={styles.stepWrapper}
            >

              {/* TIMELINE */}

              <View style={styles.timeline}>

                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>
                    {step.number}
                  </Text>
                </View>

                {index !== steps.length - 1 && (
                  <View style={styles.timelineLine} />
                )}

              </View>

              {/* STEP CARD */}

              <View style={styles.stepCard}>

                <View style={styles.stepIcon}>
                  <MaterialCommunityIcons
                    name={step.icon}
                    size={29}
                    color="#079653"
                  />
                </View>

                <View style={styles.stepInformation}>

                  <Text style={styles.stepTitle}>
                    {step.title}
                  </Text>

                </View>

              </View>

            </View>

          ))}

        </View>

        {/* YOUR ACTIVITY DASHBOARD - added from the previous implementation */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />
            <View>
              <Text style={styles.sectionTitle}>Your Activity Dashboard</Text>
              <Text style={styles.sectionSubtitle}>
                Track your submitted referrals and their progress
              </Text>
            </View>
          </View>

          <TextInput
            style={styles.activitySearch}
            placeholder="Search by name or property type..."
            placeholderTextColor="#8A96A5"
            value={activitySearch}
            onChangeText={setActivitySearch}
          />

          <Text style={styles.activityFilterHeading}>Referral Type</Text>
          <View style={styles.activityFilterRow}>
            {(["All Types", "Owner", "Customer"] as ReferralTypeFilter[]).map((type) => {
              const active = activityTypeFilter === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setActivityTypeFilter(type)}
                  style={[
                    styles.activityFilterButton,
                    active && styles.activityFilterButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.activityFilterText,
                      active && styles.activityFilterTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.activityFilterHeading}>Referral Status</Text>
          <View style={styles.activityFilterRow}>
            {(["All Status", "Pending", "Contacted", "Completed"] as ReferralFilter[]).map((status) => {
              const active = activityFilter === status;
              return (
                <Pressable
                  key={status}
                  onPress={() => setActivityFilter(status)}
                  style={[
                    styles.activityFilterButton,
                    active && styles.activityFilterButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.activityFilterText,
                      active && styles.activityFilterTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filteredReferrals.length > 0 ? (
            filteredReferrals.map((item) => (
              <View key={item.id} style={styles.activityLeadCard}>
                <View style={styles.activityLeadTop}>
                  <Text style={styles.activityLeadName}>{item.name}</Text>
                  <Text style={styles.activityLeadType}>{item.type}</Text>
                </View>
                <Text style={styles.activityLeadProperty}>{item.property}</Text>
                <Text
                  style={[
                    styles.activityLeadStatus,
                    item.status === "Completed" && styles.completedStatus,
                    item.status === "Pending" && styles.pendingStatus,
                  ]}
                >
                  Status: {item.status}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.activityEmptyCard}>
              <MaterialCommunityIcons
                name="clipboard-text-search-outline"
                size={30}
                color="#8A96A5"
              />
              <Text style={styles.activityEmptyText}>
                No referrals found.
              </Text>
            </View>
          )}
        </View>

      </ScrollView>

      <BottomNavBar activeTab="menu" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  // MAIN CONTAINER

  container: {
    flex: 1,
    backgroundColor: "#F8FBF9",
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9EEF3',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    flex: 1,
    marginLeft: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#142238',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#778397',
    marginTop: 2,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },

  // PREMIUM HERO SECTION
  heroCard: {
    backgroundColor: "#E7F8EF",
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 17,
    paddingBottom: 17,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#CDEEDC",
    shadowColor: "#087D4A",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    gap: 8,
    marginBottom: 15,
  },
  badgeText: {
    color: "#078747",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.65,
  },
  heroMainRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 132,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 2,
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#142238",
    lineHeight: 29,
    letterSpacing: -0.65,
    flexShrink: 1,
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 21,
    color: "#526176",
    marginTop: 9,
    fontWeight: "700",
  },
  rewardText: {
    color: "#078747",
    fontWeight: "900",
    fontSize: 17,
  },
  rewardIllustration: {
    width: 112,
    height: 126,
    marginLeft: 3,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  rewardIllustrationGlow: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#D0F2DF",
  },
  giftBackground: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: "#FFF8E7",
    borderWidth: 1,
    borderColor: "#F7E7BC",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-7deg" }],
    zIndex: 1,
  },
  coin: {
    position: "absolute",
    right: 0,
    bottom: 5,
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "#F9C94E",
    borderWidth: 3,
    borderColor: "#FFE7A0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
    elevation: 4,
  },
  sparkleTwo: {
    position: "absolute",
    bottom: 13,
    left: 4,
  },
  heroActions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 13,
  },
  heroPrimaryButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 49,
    borderRadius: 14,
    paddingHorizontal: 9,
    backgroundColor: "#079653",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    elevation: 3,
    shadowColor: "#087D4A",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  heroPrimaryButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    flexShrink: 1,
  },
  heroSecondaryButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 49,
    borderRadius: 14,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.3,
    borderColor: "#B9E6CD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  heroSecondaryButtonText: {
    color: "#087D4A",
    fontSize: 10,
    fontWeight: "900",
    flexShrink: 1,
  },
  // HOW IT WORKS

  howSection: {
    marginBottom: 15,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 22,
  },

  headingLine: {
    width: 5,
    height: 35,
    borderRadius: 5,
    backgroundColor: "#079653",
  },

  sectionTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#152238",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#778397",
    marginTop: 3,
  },

  // TIMELINE

  stepWrapper: {
    flexDirection: "row",
    minHeight: 82,
  },

  timeline: {
    width: 48,
    alignItems: "center",
  },

  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#079653",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  numberText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  timelineLine: {
    position: "absolute",
    top: 40,
    bottom: 0,
    width: 2,
    backgroundColor: "#A9E8C4",
  },

  // STEP CARD

  stepCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EDF3EF",
    elevation: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  stepIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8F8EF",
    justifyContent: "center",
    alignItems: "center",
  },

  stepInformation: {
    flex: 1,
    marginLeft: 12,
  },

  stepTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#172238",
    lineHeight: 21,
  },


  // REWARD SUMMARY CARDS
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 26,
  },
  statCard: {
    width: "48%",
    flexGrow: 1,
    minHeight: 116,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9F0EC",
    padding: 14,
    elevation: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.035,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  statCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statLabel: {
    flex: 1,
    color: "#778397",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.25,
  },
  statValue: {
    color: "#142238",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 10,
  },
  statSubtitle: {
    color: "#8A96A5",
    fontSize: 9,
    marginTop: 7,
  },

  // YOUR ACTIVITY DASHBOARD
  activitySection: {
    marginTop: 18,
    marginBottom: 20,
  },
  activitySearch: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5ECE8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 13,
    color: "#172238",
    marginBottom: 17,
  },
  activityFilterHeading: {
    color: "#526176",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 9,
  },
  activityFilterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 16,
  },
  activityFilterButton: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5ECE8",
  },
  activityFilterButtonActive: {
    backgroundColor: "#E7F8EF",
    borderColor: "#079653",
  },
  activityFilterText: {
    color: "#718096",
    fontSize: 11,
    fontWeight: "600",
  },
  activityFilterTextActive: {
    color: "#078747",
    fontWeight: "800",
  },
  activityLeadCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9F0EC",
    marginBottom: 10,
  },
  activityLeadTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  activityLeadName: {
    color: "#172238",
    fontSize: 14,
    fontWeight: "800",
  },
  activityLeadType: {
    color: "#078747",
    backgroundColor: "#E7F8EF",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    fontSize: 10,
    fontWeight: "700",
  },
  activityLeadProperty: {
    color: "#778397",
    fontSize: 12,
    marginBottom: 8,
  },
  activityLeadStatus: {
    color: "#2866CF",
    fontSize: 11,
    fontWeight: "800",
  },
  completedStatus: {
    color: "#078747",
  },
  pendingStatus: {
    color: "#C18419",
  },
  activityEmptyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9F0EC",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  activityEmptyText: {
    color: "#778397",
    fontSize: 13,
  },
  pressed: {
    opacity: 0.78,
  },

});

export { ReferralHomeScreen as ReferAndEarnPage };
