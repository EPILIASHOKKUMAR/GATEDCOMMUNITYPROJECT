import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  Animated,
  Easing,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

type ReferralType = "OWNER" | "CUSTOMER";
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

const initialReferralRecords: ReferralRecord[] = [
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
  { number: "01", icon: "account-plus-outline" as const, title: "Choose Who to Refer" },
  { number: "02", icon: "file-document-edit-outline" as const, title: "Submit Basic Details" },
  { number: "03", icon: "account-tie-outline" as const, title: "Specialist Follow-Up" },
  { number: "04", icon: "handshake-outline" as const, title: "Deal Closure" },
  { number: "05", icon: "gift-outline" as const, title: "Receive Cash Reward" },
];

const propertyTypes = [
  { label: "Apartment / Flat", icon: "office-building" as const },
  { label: "Independent House", icon: "home-outline" as const },
  { label: "Villa", icon: "home-variant-outline" as const },
  { label: "Commercial Space", icon: "storefront-outline" as const },
  { label: "Plot", icon: "map-marker-radius-outline" as const },
];

const budgetOptions = [
  "Below ₹10,000",
  "₹10,000 - ₹20,000",
  "₹20,000 - ₹30,000",
  "₹30,000 - ₹50,000",
  "₹50,000 - ₹75,000",
  "₹75,000 - ₹1 Lakh",
  "₹1 Lakh - ₹2 Lakhs",
  "Above ₹2 Lakhs",
];

export default function ReferralHomeScreen() {
  const [activitySearch, setActivitySearch] = useState("");
  const [activityFilter, setActivityFilter] = useState<ReferralFilter>("All Status");
  const [activityTypeFilter, setActivityTypeFilter] = useState<ReferralTypeFilter>("All Types");
  const [referrals, setReferrals] = useState<ReferralRecord[]>(initialReferralRecords);

  // Property Modal States
  const [propertyModalVisible, setPropertyModalVisible] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [ownerMobile, setOwnerMobile] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [ownerNotes, setOwnerNotes] = useState("");

  // Customer Modal States
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [desiredArea, setDesiredArea] = useState("");
  const [customerPropertyType, setCustomerPropertyType] = useState("");
  const [customerBudget, setCustomerBudget] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [budgetDropdownVisible, setBudgetDropdownVisible] = useState(false);

  const coinRotation = useRef(new Animated.Value(0)).current;
  const formIconScale = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    if (!propertyModalVisible && !customerModalVisible) {
      formIconScale.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(formIconScale, { toValue: 1.08, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(formIconScale, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [propertyModalVisible, customerModalVisible, formIconScale]);

  const filteredReferrals = useMemo(() => {
    const query = activitySearch.trim().toLowerCase();

    return referrals.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.property.toLowerCase().includes(query);

      const matchesStatus =
        activityFilter === "All Status" || item.status === activityFilter;
      const matchesType =
        activityTypeFilter === "All Types" || item.type === activityTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [activitySearch, activityFilter, activityTypeFilter, referrals]);

  const handleOpenModal = (type: ReferralType) => {
    if (type === "OWNER") {
      setPropertyModalVisible(true);
    } else {
      setCustomerModalVisible(true);
    }
  };

  const submitPropertyReferral = () => {
    if (!ownerName.trim() || !ownerMobile.trim() || !propertyLocation.trim() || !selectedPropertyType) {
      Alert.alert("Missing Details", "Please fill in all required fields.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(ownerMobile)) {
      Alert.alert("Invalid Mobile Number", "Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    const newRecord: ReferralRecord = {
      id: Date.now(),
      name: ownerName.trim(),
      type: "Owner",
      property: selectedPropertyType,
      status: "Pending",
    };

    setReferrals((prev) => [newRecord, ...prev]);
    setPropertyModalVisible(false);
    setOwnerName("");
    setOwnerMobile("");
    setPropertyLocation("");
    setSelectedPropertyType("");
    setOwnerNotes("");

    Alert.alert("Referral Submitted!", "Your property referral has been added successfully.");
  };

  const submitCustomerReferral = () => {
    if (!customerName.trim() || !customerMobile.trim() || !desiredArea.trim() || !customerPropertyType || !customerBudget) {
      Alert.alert("Missing Details", "Please fill in all required customer details.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(customerMobile)) {
      Alert.alert("Invalid Mobile Number", "Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    const newRecord: ReferralRecord = {
      id: Date.now(),
      name: customerName.trim(),
      type: "Customer",
      property: `${customerPropertyType} - ${customerBudget}`,
      status: "Pending",
    };

    setReferrals((prev) => [newRecord, ...prev]);
    setCustomerModalVisible(false);
    setCustomerName("");
    setCustomerMobile("");
    setDesiredArea("");
    setCustomerPropertyType("");
    setCustomerBudget("");
    setCustomerNotes("");
    setBudgetDropdownVisible(false);

    Alert.alert("Referral Submitted!", "Your customer referral has been added successfully.");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HERO SECTION */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="gift-outline" size={20} color="#D99A12" />
            <Text style={styles.badgeText}>GATEDPLUS REWARD PROGRAM</Text>
          </View>

          <View style={styles.heroMainRow}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Start a New Referral</Text>
              <Text style={styles.heroDescription}>
                Earn up to <Text style={styles.rewardText}>₹25,000</Text> per deal
              </Text>
            </View>

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
            </View>
          </View>

          <View style={styles.heroActions}>
            <Pressable
              onPress={() => handleOpenModal("OWNER")}
              style={({ pressed }) => [styles.heroPrimaryButton, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name="office-building" size={18} color="#FFFFFF" />
              <Text style={styles.heroPrimaryButtonText} numberOfLines={1}>Refer a Property</Text>
              <MaterialCommunityIcons name="arrow-right" size={17} color="#FFFFFF" />
            </Pressable>
            <Pressable
              onPress={() => handleOpenModal("CUSTOMER")}
              style={({ pressed }) => [styles.heroSecondaryButton, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name="account-outline" size={18} color="#087D4A" />
              <Text style={styles.heroSecondaryButtonText} numberOfLines={1}>Refer a Customer</Text>
              <MaterialCommunityIcons name="arrow-right" size={17} color="#087D4A" />
            </Pressable>
          </View>
        </View>

        {/* REWARD SUMMARY CARDS */}
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
              <Text style={styles.sectionTitle}>How It Works</Text>
              <Text style={styles.sectionSubtitle}>Your referral journey in 5 simple steps</Text>
            </View>
          </View>

          {steps.map((step, index) => (
            <View key={step.number} style={styles.stepWrapper}>
              <View style={styles.timeline}>
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>{step.number}</Text>
                </View>
                {index !== steps.length - 1 && <View style={styles.timelineLine} />}
              </View>

              <View style={styles.stepCard}>
                <View style={styles.stepIcon}>
                  <MaterialCommunityIcons name={step.icon} size={29} color="#079653" />
                </View>
                <View style={styles.stepInformation}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ACTIVITY DASHBOARD */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />
            <View>
              <Text style={styles.sectionTitle}>Your Activity Dashboard</Text>
              <Text style={styles.sectionSubtitle}>Track your submitted referrals and their progress</Text>
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
                  style={[styles.activityFilterButton, active && styles.activityFilterButtonActive]}
                >
                  <Text style={[styles.activityFilterText, active && styles.activityFilterTextActive]}>
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
                  style={[styles.activityFilterButton, active && styles.activityFilterButtonActive]}
                >
                  <Text style={[styles.activityFilterText, active && styles.activityFilterTextActive]}>
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
              <MaterialCommunityIcons name="clipboard-text-search-outline" size={30} color="#8A96A5" />
              <Text style={styles.activityEmptyText}>No referrals found.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* REFER PROPERTY MODAL */}
      <Modal
        visible={propertyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPropertyModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalEmeraldHeader}>
              <View style={styles.modalHeaderTopRow}>
                <Animated.View style={[styles.headerIconBox, { transform: [{ scale: formIconScale }] }]}>
                  <MaterialCommunityIcons name="office-building" size={22} color="#079653" />
                </Animated.View>
                <Text style={styles.modalHeaderStepText}>01 / PROPERTY REFERRAL</Text>
                <Pressable onPress={() => setPropertyModalVisible(false)} style={styles.closeIconButton}>
                  <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
                </Pressable>
              </View>
              <Text style={styles.modalHeaderSubtitle}>
                Help property owners connect with verified buyers and tenants through GatedPlus.
              </Text>
              <View style={styles.headerTrustPill}><MaterialCommunityIcons name="shield-check" size={13} color="#BCEFD3" /><Text style={styles.headerTrustText}>PRIVATE & SECURE REFERRAL</Text></View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <Text style={styles.inputLabel}>Owner Full Name *</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="account-outline" size={20} color="#079653" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInputWithIcon}
                  placeholder="Enter owner's full name"
                  placeholderTextColor="#8A96A5"
                  value={ownerName}
                  onChangeText={setOwnerName}
                />
              </View>

              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="phone-outline" size={20} color="#079653" style={styles.fieldIcon} />
                <Text style={styles.countryCode}>+91</Text>
                <View style={styles.verticalDivider} />
                <TextInput
                  style={styles.textInputWithIcon}
                  placeholder="10-digit mobile number"
                  placeholderTextColor="#8A96A5"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={ownerMobile}
                  onChangeText={setOwnerMobile}
                />
              </View>

              {/* Sub-section box */}
              <View style={styles.subInfoBox}>
                <View style={styles.subInfoIconWrap}>
                  <MaterialCommunityIcons name="home-search-outline" size={22} color="#079653" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subInfoTitle}>Property Information</Text>
                  <Text style={styles.subInfoSubtitle}>Tell us about the property you want to refer.</Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>Property Location *</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color="#079653" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInputWithIcon}
                  placeholder="Enter area, city or locality"
                  placeholderTextColor="#8A96A5"
                  value={propertyLocation}
                  onChangeText={setPropertyLocation}
                />
              </View>

              <Text style={styles.inputLabel}>Property Type *</Text>
              <View style={styles.propertyGrid}>
                {propertyTypes.map((item) => {
                  const isSelected = selectedPropertyType === item.label;
                  return (
                    <Pressable
                      key={item.label}
                      style={[styles.propertyGridCard, isSelected && styles.propertyGridCardSelected]}
                      onPress={() => setSelectedPropertyType(item.label)}
                    >
                      <View style={[styles.propertyGridIconWrap, isSelected && styles.propertyGridIconWrapSelected]}>
                        <Animated.View style={isSelected ? { transform: [{ scale: formIconScale }] } : undefined}>
                          <MaterialCommunityIcons name={item.icon} size={24} color={isSelected ? "#079653" : "#526176"} />
                        </Animated.View>
                      </View>
                      <Text style={[styles.propertyGridText, isSelected && styles.propertyGridTextSelected]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
              <TextInput
                style={[styles.textInputWithIcon, styles.textArea]}
                placeholder="Any specific details regarding the property..."
                placeholderTextColor="#8A96A5"
                multiline
                numberOfLines={3}
                value={ownerNotes}
                onChangeText={setOwnerNotes}
              />

              <Pressable
                style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
                onPress={submitPropertyReferral}
              >
                <MaterialCommunityIcons name="send-check-outline" size={19} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit Property Referral</Text>
                <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* REFER CUSTOMER MODAL */}
      <Modal
        visible={customerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCustomerModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalEmeraldHeader}>
              <View style={styles.modalHeaderTopRow}>
                <Animated.View style={[styles.headerIconBox, { transform: [{ scale: formIconScale }] }]}>
                  <MaterialCommunityIcons name="account-outline" size={22} color="#079653" />
                </Animated.View>
                <Text style={styles.modalHeaderStepText}>02 / CUSTOMER REFERRAL</Text>
                <Pressable onPress={() => setCustomerModalVisible(false)} style={styles.closeIconButton}>
                  <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
                </Pressable>
              </View>
              <Text style={styles.modalHeaderSubtitle}>
                Refer home seekers or tenants looking to rent or buy their next ideal home.
              </Text>
              <View style={styles.headerTrustPill}><MaterialCommunityIcons name="shield-check" size={13} color="#BCEFD3" /><Text style={styles.headerTrustText}>PRIVATE & SECURE REFERRAL</Text></View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <Text style={styles.inputLabel}>Customer Full Name *</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="account-outline" size={20} color="#079653" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInputWithIcon}
                  placeholder="Enter customer's full name"
                  placeholderTextColor="#8A96A5"
                  value={customerName}
                  onChangeText={setCustomerName}
                />
              </View>

              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="phone-outline" size={20} color="#079653" style={styles.fieldIcon} />
                <Text style={styles.countryCode}>+91</Text>
                <View style={styles.verticalDivider} />
                <TextInput
                  style={styles.textInputWithIcon}
                  placeholder="10-digit mobile number"
                  placeholderTextColor="#8A96A5"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={customerMobile}
                  onChangeText={setCustomerMobile}
                />
              </View>

              <View style={styles.subInfoBox}>
                <View style={styles.subInfoIconWrap}>
                  <MaterialCommunityIcons name="map-search-outline" size={22} color="#079653" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subInfoTitle}>Requirement Information</Text>
                  <Text style={styles.subInfoSubtitle}>Specify the location and property style needed.</Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>Desired Area / Location *</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color="#079653" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInputWithIcon}
                  placeholder="e.g. Gachibowli, Hyderabad"
                  placeholderTextColor="#8A96A5"
                  value={desiredArea}
                  onChangeText={setDesiredArea}
                />
              </View>

              <Text style={styles.inputLabel}>Property Type Needed *</Text>
              <View style={styles.propertyGrid}>
                {propertyTypes.map((item) => {
                  const isSelected = customerPropertyType === item.label;
                  return (
                    <Pressable
                      key={item.label}
                      style={[styles.propertyGridCard, isSelected && styles.propertyGridCardSelected]}
                      onPress={() => setCustomerPropertyType(item.label)}
                    >
                      <View style={[styles.propertyGridIconWrap, isSelected && styles.propertyGridIconWrapSelected]}>
                        <Animated.View style={isSelected ? { transform: [{ scale: formIconScale }] } : undefined}>
                          <MaterialCommunityIcons name={item.icon} size={24} color={isSelected ? "#079653" : "#526176"} />
                        </Animated.View>
                      </View>
                      <Text style={[styles.propertyGridText, isSelected && styles.propertyGridTextSelected]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>Monthly Budget *</Text>
              <Pressable
                style={styles.dropdownSelector}
                onPress={() => setBudgetDropdownVisible(!budgetDropdownVisible)}
              >
                <MaterialCommunityIcons name="currency-inr" size={20} color="#079653" style={{ marginRight: 8 }} />
                <Text style={[styles.dropdownTextSelected, !customerBudget && { color: "#8A96A5" }]}>
                  {customerBudget || "Select Budget Range"}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#526176" />
              </Pressable>

              {budgetDropdownVisible && (
                <View style={styles.dropdownList}>
                  {budgetOptions.map((budget) => (
                    <Pressable
                      key={budget}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCustomerBudget(budget);
                        setBudgetDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{budget}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
              <TextInput
                style={[styles.textInputWithIcon, styles.textArea]}
                placeholder="Specific preferences or timeline..."
                placeholderTextColor="#8A96A5"
                multiline
                numberOfLines={3}
                value={customerNotes}
                onChangeText={setCustomerNotes}
              />

              <Pressable
                style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
                onPress={submitCustomerReferral}
              >
                <MaterialCommunityIcons name="send-check-outline" size={19} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit Customer Referral</Text>
                <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBF9",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
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
    shadowOffset: { width: 0, height: 2 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "90%",
    paddingBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },
  modalEmeraldHeader: {
    backgroundColor: "#087D4A",
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
  },
  modalHeaderTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  headerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F2FBF6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    shadowColor: "#003D24",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  modalHeaderStepText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  closeIconButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  modalHeaderSubtitle: {
    color: "#E5F5EC",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 15,
    fontWeight: "500",
  },
  headerTrustPill: {
    alignSelf: "flex-start",
    minHeight: 27,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "rgba(0,54,31,0.25)",
    borderWidth: 1,
    borderColor: "rgba(213,247,227,0.15)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTrustText: {
    color: "#D9F3E3",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 22,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1C2B3D",
    marginBottom: 9,
    marginTop: 16,
    letterSpacing: 0.1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
    backgroundColor: "#F8FAF9",
    borderWidth: 1,
    borderColor: "#E3EBE6",
    borderRadius: 16,
    paddingHorizontal: 15,
    shadowColor: "#183B2A",
    shadowOpacity: 0.025,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  fieldIcon: {
    marginRight: 10,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginRight: 8,
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#D1DCD6",
    marginRight: 10,
  },
  textInputWithIcon: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 14,
    color: "#172238",
  },
  textArea: {
    backgroundColor: "#F8FBF9",
    borderWidth: 1,
    borderColor: "#E5ECE8",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 80,
    textAlignVertical: "top",
  },
  subInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF9F3",
    borderWidth: 1,
    borderColor: "#D7EEE0",
    borderRadius: 18,
    padding: 14,
    marginTop: 21,
    marginBottom: 3,
    gap: 13,
  },
  subInfoIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  subInfoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#172238",
  },
  subInfoSubtitle: {
    fontSize: 11,
    color: "#526176",
    marginTop: 2,
  },
  propertyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  propertyGridCard: {
    width: "48%",
    flexGrow: 1,
    minHeight: 118,
    backgroundColor: "#FBFCFB",
    borderWidth: 1,
    borderColor: "#E3EBE6",
    borderRadius: 18,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  propertyGridCardSelected: {
    backgroundColor: "#F0FAF4",
    borderColor: "#079653",
    borderWidth: 1.5,
    shadowColor: "#087D4A",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  propertyGridIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "#F0F5F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E3EBE6",
  },
  propertyGridIconWrapSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BFE5CD",
  },
  propertyGridText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#526176",
    textAlign: "center",
  },
  propertyGridTextSelected: {
    color: "#078747",
    fontWeight: "800",
  },
  dropdownSelector: {
    minHeight: 58,
    backgroundColor: "#F8FAF9",
    borderWidth: 1,
    borderColor: "#E3EBE6",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownTextSelected: {
    color: "#172238",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  dropdownList: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5ECE8",
    borderRadius: 14,
    marginTop: 6,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F3",
  },
  dropdownItemText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#087D4A",
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 24,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#087D4A",
    shadowOpacity: 0.22,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
