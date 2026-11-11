import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FormField } from "./FormField";
import { FormDropdown } from "./FormDropdown";
import { colors, spacing, radii, typography } from "@/theme";

export interface LocationData {
  state: string;
  district: string;
  city: string;
  village: string;
  pincode: string;
  address: string;
  landmark?: string;
  mapLocation?: string;
}

interface LocationFieldsProps {
  location: LocationData;
  onChange: (key: keyof LocationData, value: string) => void;
  errors?: Partial<Record<keyof LocationData, string>>;
}

const INDIAN_STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
];

export const LocationFields: React.FC<LocationFieldsProps> = ({
  location,
  onChange,
  errors = {},
}) => {
  const handleQuickLocate = () => {
    onChange("state", "Telangana");
    onChange("district", "Rangareddy");
    onChange("city", "Hyderabad");
    onChange("village", "Mokila");
    onChange("pincode", "501503");
    onChange("mapLocation", "17.4435° N, 78.3772° E");
    if (!location.landmark) {
      onChange("landmark", "Near Shankarpally Road");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.gpsBanner} onPress={handleQuickLocate}>
        <View style={styles.gpsIconWrap}>
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={18}
            color={colors.primary}
          />
        </View>
        <View style={styles.gpsTextWrap}>
          <Text style={styles.gpsTitle}>Auto-detect / Use Current Location</Text>
          <Text style={styles.gpsSub}>
            Tap to autofill state, district, city & GPS coordinates
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={colors.primary}
        />
      </Pressable>

      <FormDropdown
        label="State"
        value={location.state}
        options={INDIAN_STATES}
        onSelect={(val) => onChange("state", val)}
        required
        icon="map"
        error={errors.state}
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <FormField
            label="District"
            value={location.district}
            onChangeText={(val) => onChange("district", val)}
            placeholder="e.g. Rangareddy"
            required
            error={errors.district}
          />
        </View>
        <View style={styles.half}>
          <FormField
            label="City / Town"
            value={location.city}
            onChangeText={(val) => onChange("city", val)}
            placeholder="e.g. Hyderabad"
            required
            error={errors.city}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <FormField
            label="Village / Locality"
            value={location.village}
            onChangeText={(val) => onChange("village", val)}
            placeholder="e.g. Mokila"
            required
            error={errors.village}
          />
        </View>
        <View style={styles.half}>
          <FormField
            label="Pincode"
            value={location.pincode}
            onChangeText={(val) => onChange("pincode", val)}
            placeholder="6-digit code"
            keyboardType="number-pad"
            required
            error={errors.pincode}
          />
        </View>
      </View>

      <FormField
        label="Complete Property Address"
        value={location.address}
        onChangeText={(val) => onChange("address", val)}
        placeholder="Plot No., Street, Enclave or Survey road"
        multiline
        numberOfLines={2}
        icon="home-map-marker"
        required
        error={errors.address}
      />

      <FormField
        label="Prominent Landmark"
        value={location.landmark || ""}
        onChangeText={(val) => onChange("landmark", val)}
        placeholder="Near School, Highway, Lake or Temple"
        icon="flag-outline"
        error={errors.landmark}
      />

      <FormField
        label="GPS Coordinates / Map Link (Optional)"
        value={location.mapLocation || ""}
        onChangeText={(val) => onChange("mapLocation", val)}
        placeholder="e.g. 17.4435° N, 78.3772° E"
        icon="map-marker-radius-outline"
        error={errors.mapLocation}
        helperText="Geo-tagging ensures accurate audit inspection boundaries"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  gpsBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  gpsIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  gpsTextWrap: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  gpsSub: {
    fontSize: typography.caption.fontSize - 1,
    color: colors.textSecondary,
    marginTop: 1,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
});

export default LocationFields;

