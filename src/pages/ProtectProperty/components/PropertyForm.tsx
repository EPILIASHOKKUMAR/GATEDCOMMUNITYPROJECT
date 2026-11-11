import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { FormDropdown } from "./FormDropdown";
import { LocationFields, LocationData } from "./LocationFields";
import { PropertyItem } from "../propertyStore";
import { colors, spacing, radii, typography } from "@/theme";

const PROPERTY_TYPES = [
  "Residential Plot",
  "Open Land",
  "Farm Land",
  "Commercial Plot",
];

const OWNERSHIP_TYPES = [
  "Individual",
  "Joint Ownership",
  "Company",
  "Trust",
  "Inherited",
];

const BOUNDARY_TYPES = [
  "Compound Wall",
  "Fencing",
  "Natural Boundary",
  "Open Boundary",
];

const STATUS_OPTIONS = [
  "Vacant",
  "Under Construction",
  "Agricultural Use",
  "Rented",
];

const SAMPLE_DOC_NAMES = [
  "Sale Deed",
  "Registration Copy",
  "Survey Sketch",
  "Latest Tax Receipt",
];

interface PropertyFormProps {
  initial?: Partial<PropertyItem>;
  onSave: (data: any) => Promise<void> | void;
  onCancel: () => void;
  saving?: boolean;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initial,
  onSave,
  onCancel,
  saving = false,
}) => {
  const [name, setName] = useState(initial?.name || "");
  const [type, setType] = useState(initial?.type || PROPERTY_TYPES[0]);
  const [area, setArea] = useState(initial?.area || "");
  const [surveyNumber, setSurveyNumber] = useState(
    initial?.surveyNumber || ""
  );
  const [registrationNumber, setRegistrationNumber] = useState(
    initial?.registrationNumber || ""
  );
  const [ownershipType, setOwnershipType] = useState(
    initial?.ownershipType || OWNERSHIP_TYPES[0]
  );
  const [boundaryType, setBoundaryType] = useState(
    initial?.boundaryType || BOUNDARY_TYPES[0]
  );
  const [propertyStatus, setPropertyStatus] = useState(
    initial?.propertyStatus || STATUS_OPTIONS[0]
  );

  const [location, setLocation] = useState<LocationData>({
    state: initial?.state || "Telangana",
    district: initial?.district || "Rangareddy",
    city: initial?.city || "Hyderabad",
    village: initial?.village || "Mokila",
    pincode: initial?.pincode || "501503",
    address: initial?.address || "",
    landmark: initial?.landmark || "",
    mapLocation: initial?.mapLocation || "",
  });

  const [uploadedDocs, setUploadedDocs] = useState<string[]>(
    initial?.documents ? Object.keys(initial.documents) : []
  );
  const [photoCount, setPhotoCount] = useState(initial?.media?.length || 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLocationChange = (key: keyof LocationData, value: string) => {
    setLocation((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const toggleDoc = (docName: string) => {
    if (uploadedDocs.includes(docName)) {
      setUploadedDocs(uploadedDocs.filter((d) => d !== docName));
    } else {
      setUploadedDocs([...uploadedDocs, docName]);
    }
  };

  const handleAddSamplePhoto = () => {
    if (photoCount >= 5) {
      Alert.alert("Limit Reached", "You can upload up to 5 photos.");
      return;
    }
    setPhotoCount((c) => c + 1);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Property name is required";
    if (!area.trim()) newErrors.area = "Land area is required";
    if (!surveyNumber.trim()) newErrors.surveyNumber = "Survey number is required";
    if (!location.state.trim()) newErrors.state = "State is required";
    if (!location.district.trim()) newErrors.district = "District is required";
    if (!location.city.trim()) newErrors.city = "City is required";
    if (!location.village.trim()) newErrors.village = "Village / locality is required";
    if (!location.pincode.trim() || location.pincode.length < 6)
      newErrors.pincode = "Valid 6-digit pincode is required";
    if (!location.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert(
        "Missing Required Details",
        "Please fill in all mandatory fields before saving."
      );
      return;
    }

    const payload = {
      name: name.trim(),
      type,
      area: area.trim(),
      surveyNumber: surveyNumber.trim(),
      registrationNumber: registrationNumber.trim(),
      ownershipType,
      boundaryType,
      propertyStatus,
      ...location,
      media: photoCount > 0
        ? [
            {
              id: "photo-1",
              name: "Boundary Entrance",
              url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
            },
          ]
        : [],
      documents: uploadedDocs.reduce<Record<string, string[]>>((acc, d) => {
        acc[d] = [`${d.toLowerCase().replace(/\s+/g, "_")}.pdf`];
        return acc;
      }, {}),
    };

    await onSave(payload);
  };

  return (
    <View style={styles.container}>
      {/* 1. Property Information */}
      <FormSection
        title="Property Information"
        subtitle="Basic identification and ownership details"
        icon="home-city-outline"
      >
        <FormField
          label="Property Name"
          value={name}
          onChangeText={(v) => {
            setName(v);
            if (errors.name) setErrors((e) => ({ ...e, name: "" }));
          }}
          placeholder="e.g. Silver Valley Villa Plot"
          required
          icon="tag-text-outline"
          error={errors.name}
        />

        <FormDropdown
          label="Property Type"
          value={type}
          options={PROPERTY_TYPES}
          onSelect={setType}
          required
          icon="shape-outline"
        />

        <FormField
          label="Land Area"
          value={area}
          onChangeText={(v) => {
            setArea(v);
            if (errors.area) setErrors((e) => ({ ...e, area: "" }));
          }}
          placeholder="e.g. 1,200 Sq. Yards or 2.5 Acres"
          required
          icon="ruler-square"
          error={errors.area}
        />

        <FormField
          label="Survey / Plot Number"
          value={surveyNumber}
          onChangeText={(v) => {
            setSurveyNumber(v);
            if (errors.surveyNumber)
              setErrors((e) => ({ ...e, surveyNumber: "" }));
          }}
          placeholder="e.g. SY-482/2B or Plot 42"
          required
          icon="file-document-outline"
          error={errors.surveyNumber}
        />

        <FormField
          label="Registration Number (Optional)"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
          placeholder="e.g. REG-2023-TS-9812"
          icon="shield-key-outline"
        />

        <FormDropdown
          label="Ownership Type"
          value={ownershipType}
          options={OWNERSHIP_TYPES}
          onSelect={setOwnershipType}
          required
          icon="account-outline"
        />
      </FormSection>

      {/* 2. Location Section */}
      <FormSection
        title="Property Location"
        subtitle="Detailed geo-coordinates and address"
        icon="map-marker-radius-outline"
      >
        <LocationFields
          location={location}
          onChange={handleLocationChange}
          errors={errors as any}
        />
      </FormSection>

      {/* 3. Property Condition & Boundaries */}
      <FormSection
        title="Physical Condition & Boundaries"
        subtitle="Current status on the ground"
        icon="fence"
      >
        <FormDropdown
          label="Boundary Type"
          value={boundaryType}
          options={BOUNDARY_TYPES}
          onSelect={setBoundaryType}
          required
          icon="wall"
        />

        <FormDropdown
          label="Current Property Status"
          value={propertyStatus}
          options={STATUS_OPTIONS}
          onSelect={setPropertyStatus}
          required
          icon="progress-clock"
        />
      </FormSection>

      {/* 4. Photos & Evidence */}
      <FormSection
        title="Property Photos (Optional)"
        subtitle="Visual verification for field agents"
        icon="camera-outline"
      >
        <Pressable style={styles.photoPicker} onPress={handleAddSamplePhoto}>
          <MaterialCommunityIcons
            name="camera-plus-outline"
            size={28}
            color={colors.primary}
          />
          <Text style={styles.photoPickerTitle}>
            {photoCount > 0 ? `${photoCount} Photos Attached` : "Add Property Photos"}
          </Text>
          <Text style={styles.photoPickerSub}>
            Tap to capture or upload boundary, marker stone or gate photos
          </Text>
        </Pressable>

        {photoCount > 0 && (
          <View style={styles.photoTagsRow}>
            {Array.from({ length: photoCount }).map((_, idx) => (
              <View key={idx} style={styles.photoBadge}>
                <MaterialCommunityIcons
                  name="image-outline"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.photoBadgeText}>Photo #{idx + 1}</Text>
                <Pressable onPress={() => setPhotoCount((c) => Math.max(0, c - 1))}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={16}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </FormSection>

      {/* 5. Documents */}
      <FormSection
        title="Property Documents (Optional)"
        subtitle="Encrypted in your secure vault"
        icon="file-lock-outline"
      >
        <View style={styles.docGrid}>
          {SAMPLE_DOC_NAMES.map((docName) => {
            const isAttached = uploadedDocs.includes(docName);
            return (
              <Pressable
                key={docName}
                style={[styles.docItem, isAttached && styles.docItemActive]}
                onPress={() => toggleDoc(docName)}
              >
                <MaterialCommunityIcons
                  name={isAttached ? "check-circle" : "file-outline"}
                  size={20}
                  color={isAttached ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.docItemText,
                    isAttached && styles.docItemTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {docName}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FormSection>

      {/* Actions */}
      <View style={styles.actionRow}>
        <Pressable
          style={styles.cancelBtn}
          onPress={onCancel}
          disabled={saving}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={[styles.submitBtn, saving && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Save Property</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color={colors.white}
              />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },
  photoPicker: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  photoPickerTitle: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.primaryDark,
    marginTop: 6,
  },
  photoPickerSub: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
  photoTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  photoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  photoBadgeText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.navy,
  },
  docGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "48%",
  },
  docItemActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  docItemText: {
    fontSize: typography.small.fontSize - 1,
    color: colors.textPrimary,
    flex: 1,
  },
  docItemTextActive: {
    fontWeight: "700",
    color: colors.primaryDark,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: typography.label.fontSize,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    height: 50,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    fontSize: typography.label.fontSize,
    fontWeight: "700",
    color: colors.white,
  },
});

export default PropertyForm;

