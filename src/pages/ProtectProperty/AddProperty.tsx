import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PropertyForm } from "./components/PropertyForm";
import { usePropertyStore } from "./propertyStore";
import { colors, spacing, radii, typography } from "@/theme";

export function AddProperty() {
  const router = useRouter();
  const { addProperty } = usePropertyStore();
  const [saving, setSaving] = useState(false);

  const handleSave = async (propertyData: any) => {
    setSaving(true);
    try {
      const created = await addProperty(propertyData);

      Alert.alert(
        "Property Saved!",
        `"${created.name}" has been successfully added to your properties. Would you like to activate protection now?`,
        [
          {
            text: "View Saved Properties",
            style: "cancel",
            onPress: () => router.replace("/saved-properties" as any),
          },
          {
            text: "Activate Protection",
            onPress: () =>
              router.replace({
                pathname: "/payment" as any,
                params: { propertyId: created.id },
              }),
          },
        ]
      );
    } catch {
      Alert.alert("Error", "Could not save property. Please try again.");
    } finally {
      setSaving(false);
    }
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
          <Text style={styles.headerTitle}>Add Property</Text>
          <Text style={styles.headerSubtitle}>
            Enter land & boundary details for security
          </Text>
        </View>

        <View style={styles.headerBadge}>
          <MaterialCommunityIcons
            name="shield-plus"
            size={18}
            color={colors.primary}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <PropertyForm
          onSave={handleSave}
          onCancel={() => router.back()}
          saving={saving}
        />
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
  headerBadge: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: spacing.md,
  },
});

export default AddProperty;

