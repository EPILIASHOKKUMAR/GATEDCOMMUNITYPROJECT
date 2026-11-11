
import React, { useState } from "react";
import {
  Alert,
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  onBack: () => void;
};

const GREEN = "#2E7D32";

const stages = [
  "Foundation",
  "Structure",
  "Brickwork",
  "Plastering",
  "Electrical/Plumbing",
  "Finishing",
  "Almost Complete",
  "Other",
];

const propertyTypes = [
  "Unfinished Residential Villa",
  "Unfinished Apartment / Flat Complex",
  "Unfinished Commercial Building",
  "Unfinished Builder Floor",
  "Unfinished Shop / Showroom",
  "Unfinished Plotted Development",
  "Unfinished Industrial / Warehouse",
];

const dealTypes = [
  "Investment Partnership",
  "Joint Development",
  "Sale",
  "Revenue Sharing",
  "Other",
];

const amenityOptions = [
  "Lift Shaft Ready",
  "Swimming Pool Provision",
  "Solar Rooftop Provision",
  "100% Power Backup Ready",
  "Car Parking Stilt",
  "Gated Community Security",
  "Clubhouse Provision",
  "Rainwater Harvesting",
  "CCTV Conduit Piping",
];

const initialData = {
  title: "",
  property_type: "Unfinished Residential Villa",
  construction_type: "RCC Framed Structure",
  current_stage: "Structure",
  completion_percentage: "65",
  year_started: "2023",
  year_stopped: "2025",
  reason_stopped: "",

  state: "Telangana",
  city: "Hyderabad",
  locality: "",
  address: "",
  landmarks: "",
  road_access: "",
  land_area: "",
  land_area_unit: "sq.yds",
  built_up_area: "",
  num_floors: "3",
  num_units: "1",
  bedrooms: "4",
  parking_spaces: "2",
  amenities: ["Lift Shaft Ready", "Car Parking Stilt"] as string[],
  completion_requirements: "",

  estimated_original_cost: "",
  amount_invested: "",
  estimated_amount_required: "",
  outstanding_liabilities: "",
  expected_completed_value: "",
  owner_expected_deal_amount: "",
  preferred_deal_type: "Investment Partnership",
};

type FormData = typeof initialData;

type DocumentItem = {
  document_type: string;
  name: string;
  is_confidential: boolean;
};

const documentTypes = [
  "Sanction Plan / Approval",
  "Architectural Drawing",
  "Cost Estimate / BOQ",
  "Structural Stability Report",
  "Other Reference",
];

export default function UnfinishedPropertyOwner({ onBack }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [error, setError] = useState("");

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleAmenity = (item: string) => {
    const selected = formData.amenities.includes(item);

    updateField(
      "amenities",
      selected
        ? formData.amenities.filter((a) => a !== item)
        : [...formData.amenities, item]
    );
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        setError("Please enter the project title.");
        return false;
      }

      const percentage = Number(formData.completion_percentage);

      if (
        !Number.isFinite(percentage) ||
        percentage < 0 ||
        percentage > 99
      ) {
        setError("Completion percentage must be between 0 and 99.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.city.trim()) {
        setError("Please enter the city.");
        return false;
      }

      if (!formData.locality.trim()) {
        setError("Please enter the locality.");
        return false;
      }
    }

    if (currentStep === 3) {
      if (
        !formData.estimated_amount_required ||
        Number(formData.estimated_amount_required) <= 0
      ) {
        setError("Please enter the estimated amount required.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const previousStep = () => {
    if (currentStep === 1) {
      onBack();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const addDocument = () => {
    setDocuments((prev) => [
      ...prev,
      {
        document_type: "Sanction Plan / Approval",
        name: "",
        is_confidential: false,
      },
    ]);
  };

  const updateDocument = (
    index: number,
    field: keyof DocumentItem,
    value: any
  ) => {
    setDocuments((prev) =>
      prev.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc
      )
    );
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const formatAmount = (value: string) => {
    const amount = Number(value || 0);
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const submitForm = () => {
    if (!validateStep()) return;

    Alert.alert(
      "UI Preview",
      "Your form is ready. Backend submission and media uploads will be connected in the next stage.",
      [{ text: "OK" }]
    );
  };

  const Field = ({
    label,
    value,
    onChange,
    placeholder,
    keyboardType = "default",
    multiline = false,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    multiline?: boolean;
  }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor="#999999"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );

  const ChoiceGroup = ({
    label,
    options,
    selected,
    onSelect,
  }: {
    label: string;
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
  }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.choiceContainer}>
        {options.map((option) => {
          const active = selected === option;

          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={[
                styles.choice,
                active && styles.choiceActive,
              ]}
            >
              <Text
                style={[
                  styles.choiceText,
                  active && styles.choiceTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const SectionHeader = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle: string;
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <SectionHeader
              title="Tell Us About the Project"
              subtitle="Provide the basic details and current construction progress."
            />

            <Field
              label="Project / Property Title *"
              value={formData.title}
              onChange={(v) => updateField("title", v)}
              placeholder="e.g. Kondapur 5-BHK Villa Project"
            />

            <ChoiceGroup
              label="Property Category *"
              options={propertyTypes}
              selected={formData.property_type}
              onSelect={(v) => updateField("property_type", v)}
            />

            <Field
              label="Construction Type"
              value={formData.construction_type}
              onChange={(v) => updateField("construction_type", v)}
              placeholder="e.g. RCC Framed Structure"
            />

            <ChoiceGroup
              label="Current Construction Stage"
              options={stages}
              selected={formData.current_stage}
              onSelect={(v) => updateField("current_stage", v)}
            />

            <View style={styles.field}>
              <View style={styles.progressHeading}>
                <Text style={styles.label}>
                  Completion Percentage
                </Text>
                <Text style={styles.progressValue}>
                  {formData.completion_percentage}%
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.max(
                        0,
                        Math.min(99, Number(formData.completion_percentage) || 0)
                      )}%`,
                    },
                  ]}
                />
              </View>

              <TextInput
                style={styles.input}
                value={formData.completion_percentage}
                onChangeText={(v) =>
                  updateField("completion_percentage", v)
                }
                keyboardType="numeric"
                placeholder="Enter completion percentage"
              />
            </View>

            <Field
              label="Year Construction Started"
              value={formData.year_started}
              onChange={(v) => updateField("year_started", v)}
              keyboardType="numeric"
            />

            <Field
              label="Year Construction Stopped"
              value={formData.year_stopped}
              onChange={(v) => updateField("year_stopped", v)}
              keyboardType="numeric"
            />

            <Field
              label="Reason Construction Stopped"
              value={formData.reason_stopped}
              onChange={(v) => updateField("reason_stopped", v)}
              multiline
              placeholder="Explain why construction work was paused"
            />
          </>
        );

      case 2:
        return (
          <>
            <SectionHeader
              title="Location & Property Details"
              subtitle="Enter the property location, dimensions and available facilities."
            />

            <Field
              label="State"
              value={formData.state}
              onChange={(v) => updateField("state", v)}
            />

            <Field
              label="City *"
              value={formData.city}
              onChange={(v) => updateField("city", v)}
            />

            <Field
              label="Locality / Area *"
              value={formData.locality}
              onChange={(v) => updateField("locality", v)}
            />

            <Field
              label="Address"
              value={formData.address}
              onChange={(v) => updateField("address", v)}
              multiline
            />

            <Field
              label="Nearby Landmark"
              value={formData.landmarks}
              onChange={(v) => updateField("landmarks", v)}
            />

            <Field
              label="Road Access"
              value={formData.road_access}
              onChange={(v) => updateField("road_access", v)}
              placeholder="e.g. 40 ft Wide Road"
            />

            <Field
              label="Land Area"
              value={formData.land_area}
              onChange={(v) => updateField("land_area", v)}
              keyboardType="numeric"
            />

            <ChoiceGroup
              label="Land Area Unit"
              options={["sq.yds", "sq.ft", "acres"]}
              selected={formData.land_area_unit}
              onSelect={(v) => updateField("land_area_unit", v)}
            />

            <Field
              label="Built-up Area (sq. ft)"
              value={formData.built_up_area}
              onChange={(v) => updateField("built_up_area", v)}
              keyboardType="numeric"
            />

            <Field
              label="Number of Floors"
              value={formData.num_floors}
              onChange={(v) => updateField("num_floors", v)}
              keyboardType="numeric"
            />

            <Field
              label="Number of Units"
              value={formData.num_units}
              onChange={(v) => updateField("num_units", v)}
              keyboardType="numeric"
            />

            <Field
              label="Bedrooms"
              value={formData.bedrooms}
              onChange={(v) => updateField("bedrooms", v)}
              keyboardType="numeric"
            />

            <Field
              label="Parking Spaces"
              value={formData.parking_spaces}
              onChange={(v) => updateField("parking_spaces", v)}
              keyboardType="numeric"
            />

            <View style={styles.field}>
              <Text style={styles.label}>
                Site Provisions & Amenities
              </Text>

              <View style={styles.choiceContainer}>
                {amenityOptions.map((item) => {
                  const active = formData.amenities.includes(item);

                  return (
                    <Pressable
                      key={item}
                      onPress={() => toggleAmenity(item)}
                      style={[
                        styles.choice,
                        active && styles.choiceActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          active && styles.choiceTextActive,
                        ]}
                      >
                        {active ? "✓  " : "+  "}
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Field
              label="Completion Requirements"
              value={formData.completion_requirements}
              onChange={(v) =>
                updateField("completion_requirements", v)
              }
              multiline
              placeholder="List the remaining construction work"
            />
          </>
        );

      case 3:
        return (
          <>
            <SectionHeader
              title="Financial Requirements"
              subtitle="Share the estimated investment and funding needed to complete the project."
            />

            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>
                Financial Information
              </Text>
              <Text style={styles.noticeText}>
                These are owner-provided estimates. Final commercial
                terms should be verified and legally documented
                between the parties.
              </Text>
            </View>

            <Field
              label="Estimated Original Project Cost (₹)"
              value={formData.estimated_original_cost}
              onChange={(v) =>
                updateField("estimated_original_cost", v)
              }
              keyboardType="numeric"
            />

            <Field
              label="Amount Already Invested (₹)"
              value={formData.amount_invested}
              onChange={(v) => updateField("amount_invested", v)}
              keyboardType="numeric"
            />

            <Field
              label="Amount Required to Complete (₹) *"
              value={formData.estimated_amount_required}
              onChange={(v) =>
                updateField("estimated_amount_required", v)
              }
              keyboardType="numeric"
            />

            <Field
              label="Outstanding Loans / Liabilities (₹)"
              value={formData.outstanding_liabilities}
              onChange={(v) =>
                updateField("outstanding_liabilities", v)
              }
              keyboardType="numeric"
            />

            <Field
              label="Expected Completed Market Value (₹)"
              value={formData.expected_completed_value}
              onChange={(v) =>
                updateField("expected_completed_value", v)
              }
              keyboardType="numeric"
            />

            <Field
              label="Owner Expected Deal Amount (₹)"
              value={formData.owner_expected_deal_amount}
              onChange={(v) =>
                updateField("owner_expected_deal_amount", v)
              }
              keyboardType="numeric"
            />

            <ChoiceGroup
              label="Preferred Deal Structure"
              options={dealTypes}
              selected={formData.preferred_deal_type}
              onSelect={(v) =>
                updateField("preferred_deal_type", v)
              }
            />
          </>
        );

      case 4:
        return (
          <>
            <SectionHeader
              title="Photos & Documents"
              subtitle="Add construction photos and supporting document references."
            />

            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>
                Document Privacy
              </Text>
              <Text style={styles.noticeText}>
                Original property title documents are not required
                during initial posting. Sensitive records should be
                shared only during verified legal due diligence.
              </Text>
            </View>

            <View style={styles.uploadBox}>
              <Text style={styles.uploadIcon}>＋</Text>
              <Text style={styles.uploadTitle}>
                Add Construction Photos
              </Text>
              <Text style={styles.uploadSubtitle}>
                Upload site photos to show the current construction
                progress.
              </Text>
              <Pressable
                style={styles.secondaryButton}
                onPress={() =>
                  Alert.alert(
                    "Photo Upload",
                    "Image picker and Cloudinary upload will be connected in the next stage."
                  )
                }
              >
                <Text style={styles.secondaryButtonText}>
                  Select Photos
                </Text>
              </Pressable>
            </View>

            <View style={styles.documentHeader}>
              <Text style={styles.label}>
                Supplementary Documents
              </Text>
              <Pressable onPress={addDocument}>
                <Text style={styles.addText}>+ Add Document</Text>
              </Pressable>
            </View>

            {documents.length === 0 && (
              <Text style={styles.helperText}>
                No documents added. You can add document references
                if available.
              </Text>
            )}

            {documents.map((doc, index) => (
              <View key={index} style={styles.documentCard}>
                <View style={styles.documentTop}>
                  <Text style={styles.documentTitle}>
                    Document {index + 1}
                  </Text>
                  <Pressable onPress={() => removeDocument(index)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>

                <ChoiceGroup
                  label="Document Type"
                  options={documentTypes}
                  selected={doc.document_type}
                  onSelect={(v) =>
                    updateDocument(index, "document_type", v)
                  }
                />

                <Field
                  label="Document Name / Reference"
                  value={doc.name}
                  onChange={(v) =>
                    updateDocument(index, "name", v)
                  }
                  placeholder="Enter document name"
                />

                <Pressable
                  style={styles.confidentialRow}
                  onPress={() =>
                    updateDocument(
                      index,
                      "is_confidential",
                      !doc.is_confidential
                    )
                  }
                >
                  <View
                    style={[
                      styles.checkbox,
                      doc.is_confidential && styles.checkboxActive,
                    ]}
                  >
                    {doc.is_confidential && (
                      <Text style={styles.checkboxTick}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.confidentialText}>
                    Mark as confidential
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.secondaryButton}
                  onPress={() =>
                    Alert.alert(
                      "Document Upload",
                      "File selection and upload will be connected later."
                    )
                  }
                >
                  <Text style={styles.secondaryButtonText}>
                    Upload Document
                  </Text>
                </Pressable>
              </View>
            ))}
          </>
        );

      case 5:
        return (
          <>
            <SectionHeader
              title="Review Your Project"
              subtitle="Check your details before submitting the unfinished property."
            />

            <View style={styles.reviewCard}>
              <Text style={styles.reviewBadge}>
                UNFINISHED PROPERTY
              </Text>

              <Text style={styles.reviewTitle}>
                {formData.title || "Your Property Project"}
              </Text>

              <Text style={styles.reviewLocation}>
                {formData.locality}, {formData.city}, {formData.state}
              </Text>

              <View style={styles.reviewProgress}>
                <View style={styles.progressHeading}>
                  <Text style={styles.label}>
                    Construction Completion
                  </Text>
                  <Text style={styles.progressValue}>
                    {formData.completion_percentage}%
                  </Text>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.max(
                          0,
                          Math.min(
                            99,
                            Number(formData.completion_percentage) || 0
                          )
                        )}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.helperText}>
                  Current Stage: {formData.current_stage}
                </Text>
              </View>

              <View style={styles.reviewDivider} />

              <Text style={styles.reviewSectionTitle}>
                Property Details
              </Text>
              <ReviewRow
                label="Property Type"
                value={formData.property_type}
              />
              <ReviewRow
                label="Construction Type"
                value={formData.construction_type}
              />
              <ReviewRow
                label="Land Area"
                value={
                  formData.land_area
                    ? `${formData.land_area} ${formData.land_area_unit}`
                    : "Not provided"
                }
              />
              <ReviewRow
                label="Built-up Area"
                value={formData.built_up_area || "Not provided"}
              />
              <ReviewRow
                label="Floors"
                value={formData.num_floors || "Not provided"}
              />

              <View style={styles.reviewDivider} />

              <Text style={styles.reviewSectionTitle}>
                Financial Summary
              </Text>
              <ReviewRow
                label="Amount Required"
                value={formatAmount(formData.estimated_amount_required)}
                highlight
              />
              <ReviewRow
                label="Amount Invested"
                value={formatAmount(formData.amount_invested)}
              />
              <ReviewRow
                label="Expected Completed Value"
                value={formatAmount(formData.expected_completed_value)}
              />
              <ReviewRow
                label="Outstanding Liabilities"
                value={formatAmount(formData.outstanding_liabilities)}
              />
              <ReviewRow
                label="Deal Structure"
                value={formData.preferred_deal_type}
              />

              <View style={styles.reviewDivider} />

              <Text style={styles.reviewSectionTitle}>
                Additional Information
              </Text>
              <ReviewRow
                label="Selected Amenities"
                value={
                  formData.amenities.length
                    ? formData.amenities.join(", ")
                    : "None selected"
                }
              />
              <ReviewRow
                label="Document References"
                value={String(documents.length)}
              />
            </View>

            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>
                What Happens Next?
              </Text>
              <Text style={styles.noticeText}>
                1. Your project details are reviewed.
                {"\n\n"}
                2. Verification may be required before the opportunity
                is shared with interested investors.
                {"\n\n"}
                3. Introductions and commercial discussions can take
                place after verification.
              </Text>
            </View>

            <View style={styles.groupBox}>
              <Text style={styles.groupTitle}>
                Build This Project With a Group
              </Text>
              <Text style={styles.groupDescription}>
                Connect this unfinished property with people who may
                want to join, invest, or help complete the project.
              </Text>
              <Text style={styles.helperText}>
                Group creation and project linking will be connected
                after the backend integration.
              </Text>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  const ReviewRow = ({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: string;
    highlight?: boolean;
  }) => (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text
        style={[
          styles.reviewValue,
          highlight && styles.reviewHighlight,
        ]}
      >
        {value}
      </Text>
    </View>
  );

  const stepNames = [
    "Project Basics",
    "Property Details",
    "Financial",
    "Documents",
    "Review",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={previousStep} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.topTitle}>Unfinished to Finished</Text>

        <View style={{ width: 55 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>
            Complete Your Property Details
          </Text>
          <Text style={styles.introSubtitle}>
            Share your unfinished project and explore opportunities
            to complete it.
          </Text>
        </View>

        <View style={styles.stepper}>
          {stepNames.map((name, index) => {
            const step = index + 1;
            const active = currentStep === step;
            const completed = currentStep > step;

            return (
              <View key={name} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    (active || completed) && styles.stepCircleActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      (active || completed) && styles.stepNumberActive,
                    ]}
                  >
                    {completed ? "✓" : step}
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.stepLabel,
                    active && styles.stepLabelActive,
                  ]}
                >
                  {name}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.stepCount}>
          STEP {currentStep} OF 5
        </Text>

        <View style={styles.formCard}>
          {renderStep()}

          {error !== "" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.actions}>
            {currentStep > 1 && (
              <Pressable
                style={styles.previousButton}
                onPress={previousStep}
              >
                <Text style={styles.previousButtonText}>Back</Text>
              </Pressable>
            )}

            {currentStep < 5 ? (
              <Pressable
                style={styles.nextButton}
                onPress={nextStep}
              >
                <Text style={styles.nextButtonText}>
                  Continue →
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.nextButton}
                onPress={submitForm}
              >
                <Text style={styles.nextButtonText}>
                  Submit Project
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 65,
  },
  backArrow: {
    fontSize: 30,
    color: GREEN,
    marginRight: 4,
  },
  backText: {
    color: GREEN,
    fontSize: 14,
    fontWeight: "600",
  },
  topTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222222",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 35,
  },
  intro: {
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#222222",
    marginBottom: 7,
  },
  introSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "#666666",
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  stepItem: {
    flex: 1,
    alignItems: "center",
  },
  stepCircle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  stepCircleActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  stepNumber: {
    color: "#777777",
    fontSize: 12,
    fontWeight: "700",
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepLabel: {
    color: "#888888",
    fontSize: 9,
    marginTop: 6,
    textAlign: "center",
  },
  stepLabelActive: {
    color: GREEN,
    fontWeight: "700",
  },
  stepCount: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 9,
    letterSpacing: 1,
  },
  formCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 19,
    color: "#222222",
    fontWeight: "800",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#777777",
    lineHeight: 19,
  },
  field: {
    marginBottom: 17,
  },
  label: {
    fontSize: 13,
    color: "#333333",
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },
  multiline: {
    minHeight: 90,
  },
  choiceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  choice: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  choiceActive: {
    borderColor: GREEN,
    backgroundColor: "#E8F5E9",
  },
  choiceText: {
    fontSize: 12,
    color: "#555555",
  },
  choiceTextActive: {
    color: GREEN,
    fontWeight: "700",
  },
  progressHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressValue: {
    color: GREEN,
    fontWeight: "800",
    fontSize: 15,
  },
  progressTrack: {
    height: 9,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: GREEN,
    borderRadius: 10,
  },
  notice: {
    backgroundColor: "#F0F8F0",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    borderRadius: 10,
    padding: 13,
    marginBottom: 18,
  },
  noticeTitle: {
    color: GREEN,
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 6,
  },
  noticeText: {
    color: "#555555",
    fontSize: 12,
    lineHeight: 19,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#81C784",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F8FCF8",
    marginBottom: 22,
  },
  uploadIcon: {
    fontSize: 32,
    color: GREEN,
    marginBottom: 7,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333333",
    marginBottom: 6,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: "#777777",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 13,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 17,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: GREEN,
    fontWeight: "700",
    fontSize: 13,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  addText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "800",
  },
  helperText: {
    fontSize: 12,
    color: "#888888",
    lineHeight: 18,
    marginTop: 5,
  },
  documentCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  documentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  documentTitle: {
    fontWeight: "800",
    color: "#333333",
  },
  removeText: {
    color: "#C62828",
    fontSize: 12,
    fontWeight: "700",
  },
  confidentialRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    height: 19,
    width: 19,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderRadius: 4,
    marginRight: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  checkboxTick: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  confidentialText: {
    color: "#555555",
    fontSize: 12,
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  reviewBadge: {
    color: GREEN,
    backgroundColor: "#E8F5E9",
    alignSelf: "flex-start",
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 12,
  },
  reviewTitle: {
    fontSize: 19,
    color: "#222222",
    fontWeight: "800",
    marginBottom: 5,
  },
  reviewLocation: {
    fontSize: 12,
    color: "#777777",
    marginBottom: 17,
  },
  reviewProgress: {
    marginBottom: 12,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 15,
  },
  reviewSectionTitle: {
    color: "#333333",
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 12,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  reviewLabel: {
    flex: 1,
    fontSize: 12,
    color: "#777777",
  },
  reviewValue: {
    flex: 1,
    fontSize: 12,
    color: "#333333",
    fontWeight: "600",
    textAlign: "right",
  },
  reviewHighlight: {
    color: GREEN,
    fontWeight: "800",
  },
  groupBox: {
    backgroundColor: "#F0F8F0",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  groupTitle: {
    color: GREEN,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },
  groupDescription: {
    color: "#555555",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },
  errorBox: {
    backgroundColor: "#FFF1F0",
    borderWidth: 1,
    borderColor: "#FFCCCC",
    borderRadius: 8,
    padding: 11,
    marginTop: 5,
    marginBottom: 12,
  },
  errorText: {
    color: "#B42318",
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 15,
  },
  previousButton: {
    flex: 1,
    minHeight: 47,
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  previousButtonText: {
    color: GREEN,
    fontWeight: "700",
    fontSize: 14,
  },
  nextButton: {
    flex: 2,
    minHeight: 47,
    backgroundColor: GREEN,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
