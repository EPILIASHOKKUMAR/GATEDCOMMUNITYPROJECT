import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  usePropertyStore,
  PROTECTION_PLANS,
  PropertyPlan,
} from "./propertyStore";
import { colors, spacing, radii, typography } from "@/theme";

export function PaymentPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ propertyId?: string }>();
  const { properties, activatePlan } = usePropertyStore();

  const selectedProperty =
    properties.find((p) => p.id === params.propertyId) || properties[0];

  const [selectedPlan, setSelectedPlan] = useState<PropertyPlan>(
    PROTECTION_PLANS[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NET_BANKING">("UPI");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{
    txId: string;
    amount: string;
    date: string;
  } | null>(null);

  const handlePay = async () => {
    if (!selectedProperty) {
      Alert.alert("No Property Selected", "Please select a property first.");
      return;
    }

    setProcessing(true);
    try {
      await activatePlan(selectedProperty.id, selectedPlan);

      const generatedReceipt = {
        txId: `GP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: selectedPlan.formattedTotal,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setReceipt(generatedReceipt);
    } catch {
      Alert.alert("Payment Failed", "Transaction could not be completed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (receipt) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark" />

        <ScrollView
          contentContainerStyle={styles.successContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successIconWrap}>
            <MaterialCommunityIcons
              name="check-circle"
              size={64}
              color={colors.success}
            />
          </View>

          <Text style={styles.successTitle}>Protection Activated!</Text>
          <Text style={styles.successSub}>
            Your property is now shielded under 24/7 GatedPlus surveillance.
          </Text>

          {/* RECEIPT CARD */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptProperty}>{selectedProperty?.name}</Text>
              <Text style={styles.receiptPlanBadge}>
                {selectedPlan.name}
              </Text>
            </View>

            <View style={styles.receiptDivider} />

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLbl}>Transaction ID</Text>
              <Text style={styles.receiptValBold}>{receipt.txId}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLbl}>Paid Date & Time</Text>
              <Text style={styles.receiptVal}>{receipt.date}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLbl}>Payment Method</Text>
              <Text style={styles.receiptVal}>{paymentMethod}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLbl}>Inspection Schedule</Text>
              <Text style={styles.receiptVal}>{selectedPlan.frequencyText}</Text>
            </View>

            <View style={styles.receiptDivider} />

            <View style={styles.receiptRow}>
              <Text style={styles.receiptTotalLbl}>Total Paid (incl. GST)</Text>
              <Text style={styles.receiptTotalVal}>{receipt.amount}</Text>
            </View>
          </View>

          <Pressable
            style={styles.doneBtn}
            onPress={() => router.replace("/active-protection" as any)}
          >
            <Text style={styles.doneBtnText}>View Active Protection Hub</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={18}
              color={colors.white}
            />
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => router.replace("/protect" as any)}
          >
            <Text style={styles.secondaryBtnText}>Back to Protect Home</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Activate Protection</Text>
          <Text style={styles.headerSubtitle}>
            Choose subscription plan & payment
          </Text>
        </View>

        <View style={styles.sslBadge}>
          <MaterialCommunityIcons
            name="lock-check"
            size={18}
            color={colors.primary}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TARGET PROPERTY */}
        {selectedProperty && (
          <View style={styles.targetPropertyCard}>
            <View style={styles.targetIcon}>
              <MaterialCommunityIcons
                name="home-city"
                size={22}
                color={colors.primary}
              />
            </View>
            <View style={styles.targetInfo}>
              <Text style={styles.targetLabel}>SECURING PROPERTY</Text>
              <Text style={styles.targetName}>{selectedProperty.name}</Text>
              <Text style={styles.targetLocation}>
                {selectedProperty.area} • {selectedProperty.city}
              </Text>
            </View>
          </View>
        )}

        {/* PLAN CARDS */}
        <Text style={styles.sectionTitle}>1. Select Protection Plan</Text>

        {PROTECTION_PLANS.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          return (
            <Pressable
              key={plan.id}
              style={[
                styles.planCard,
                isSelected && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan(plan)}
            >
              <View style={styles.planCardTop}>
                <View>
                  <View style={styles.planTagRow}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    {plan.tag && (
                      <View style={styles.planTag}>
                        <Text style={styles.planTagText}>{plan.tag}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.planVisits}>{plan.visits}</Text>
                </View>

                <View style={styles.planPriceBox}>
                  <Text style={styles.planPrice}>{plan.formattedPrice}</Text>
                  <Text style={styles.planCycle}>+18% GST / mo</Text>
                </View>
              </View>

              <Text style={styles.planDesc}>{plan.description}</Text>

              <View style={styles.benefitList}>
                {plan.benefits.slice(0, 3).map((b, i) => (
                  <View key={i} style={styles.benefitItem}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={15}
                      color={colors.primary}
                    />
                    <Text style={styles.benefitText}>{b}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}

        {/* PAYMENT METHOD */}
        <Text style={styles.sectionTitle}>2. Payment Method</Text>
        <View style={styles.methodsRow}>
          {[
            { id: "UPI", label: "UPI", icon: "cellphone-check" as const },
            { id: "CARD", label: "Card", icon: "credit-card-outline" as const },
            { id: "NET_BANKING", label: "NetBanking", icon: "bank-outline" as const },
          ].map((m) => {
            const isSelected = paymentMethod === m.id;
            return (
              <Pressable
                key={m.id}
                style={[
                  styles.methodOption,
                  isSelected && styles.methodOptionActive,
                ]}
                onPress={() => setPaymentMethod(m.id as any)}
              >
                <MaterialCommunityIcons
                  name={m.icon}
                  size={20}
                  color={isSelected ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.methodText,
                    isSelected && styles.methodTextActive,
                  ]}
                >
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* PRICE SUMMARY */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Breakdown</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLbl}>Plan Cost ({selectedPlan.name})</Text>
            <Text style={styles.summaryVal}>{selectedPlan.formattedPrice}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLbl}>GST @ 18%</Text>
            <Text style={styles.summaryVal}>₹{selectedPlan.gstAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLbl}>Total Payable</Text>
            <Text style={styles.summaryTotalVal}>{selectedPlan.formattedTotal}</Text>
          </View>
        </View>

        {/* PAY BUTTON */}
        <Pressable
          style={[styles.payButton, processing && styles.payButtonDisabled]}
          onPress={handlePay}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={20}
                color={colors.white}
              />
              <Text style={styles.payButtonText}>
                Pay {selectedPlan.formattedTotal} & Activate Guard
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>
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
  sslBadge: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 40,
    gap: spacing.md,
  },
  targetPropertyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  targetIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  targetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  targetLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  targetName: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  targetLocation: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.label.fontSize + 1,
    fontWeight: "700",
    color: colors.navy,
    marginTop: 4,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  planCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  planTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planName: {
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  planTag: {
    backgroundColor: colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  planTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.white,
  },
  planVisits: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginTop: 2,
  },
  planPriceBox: {
    alignItems: "flex-end",
  },
  planPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  planCycle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  planDesc: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  benefitList: {
    marginTop: 10,
    gap: 6,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  benefitText: {
    fontSize: typography.caption.fontSize,
    color: colors.navy,
  },
  methodsRow: {
    flexDirection: "row",
    gap: 10,
  },
  methodOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  methodText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  methodTextActive: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  summaryTitle: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.navy,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLbl: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.navy,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  summaryTotalLbl: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  summaryTotalVal: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 4,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "700",
    color: colors.white,
  },
  successContent: {
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
  },
  successIconWrap: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: "800",
    color: colors.navy,
    textAlign: "center",
  },
  successSub: {
    fontSize: typography.body.fontSize - 1,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  receiptCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    gap: 10,
  },
  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  receiptProperty: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "700",
    color: colors.navy,
    flex: 1,
  },
  receiptPlanBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  receiptLbl: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
  },
  receiptVal: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.navy,
  },
  receiptValBold: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    color: colors.primary,
  },
  receiptTotalLbl: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  receiptTotalVal: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  doneBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    marginBottom: 12,
  },
  doneBtnText: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.white,
  },
  secondaryBtn: {
    paddingVertical: 10,
  },
  secondaryBtnText: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    fontWeight: "600",
  },
});

export default PaymentPage;

