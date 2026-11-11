
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type FormData = {
  communityName: string;
  description: string;
  communityType: string;
  projectPurpose: string;
  targetMembers: string;
  timeline: string;
  location: string;
  propertyType: string;
  plotSize: string;
  expectedUnits: string;
  services: string[];
  minBudget: string;
  maxBudget: string;
  fundingStatus: string;
  investmentPreference: string;
  amenities: string;
  privacy: string;
};

type TextFieldKey = Exclude<keyof FormData, "services">;

const initialForm: FormData = {
  communityName: "",
  description: "",
  communityType: "Residential",
  projectPurpose: "Build a new community",
  targetMembers: "",
  timeline: "Within 6 months",
  location: "",
  propertyType: "Open Plot",
  plotSize: "",
  expectedUnits: "",
  services: [],
  minBudget: "",
  maxBudget: "",
  fundingStatus: "Planning to raise funds",
  investmentPreference: "Individual contribution",
  amenities: "",
  privacy: "Public",
};

const serviceOptions = [
  "Open Plots",
  "Legal Audit",
  "Property Registration",
  "Finding Members",
  "Construction",
  "Property Verification",
  "Architecture & Design",
  "Loan Assistance",
];

type Props = {
  onBack: () => void;
};

export default function CreateCommunityForm({ onBack }: Props) {
  const [form, setForm] = useState<FormData>(initialForm);

  const [showReview, setShowReview] = useState(false);

  const updateField = (key: TextFieldKey, value: string) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const toggleService = (service: string) => {
    setForm((previous) => ({
      ...previous,
      services: previous.services.includes(service)
        ? previous.services.filter((item) => item !== service)
        : [...previous.services, service],
    }));
  };

  const handleReview = () => {
    if (!form.communityName.trim()) {
      Alert.alert("Required", "Please enter a project name.");
      return;
    }

    if (!form.location.trim()) {
      Alert.alert("Required", "Please enter the project location.");
      return;
    }

    if (!form.targetMembers.trim()) {
      Alert.alert("Required", "Please enter the required number of members.");
      return;
    }

    if (
      !Number.isFinite(Number(form.targetMembers)) ||
      Number(form.targetMembers) <= 0
    ) {
      Alert.alert("Invalid value", "Enter a valid number of members.");
      return;
    }

    setShowReview(true);
  };

  const handleContinue = () => {
    Alert.alert(
      "Form Completed",
      "Your project details are ready. Backend submission will be connected in the next step.",
      [
        {
          text: "OK",
          onPress: () => setShowReview(false),
        },
      ]
    );
  };

  const renderInput = (
    label: string,
    key: TextFieldKey,
    placeholder: string,
    multiline = false,
    keyboardType: "default" | "numeric" = "default"
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={form[key]}
        onChangeText={(value) => updateField(key, value)}
        placeholder={placeholder}
        placeholderTextColor="#9AA6B2"
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderChoices = (
    label: string,
    key: TextFieldKey,
    options: string[]
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.choiceContainer}>
        {options.map((option) => {
          const selected = form[key] === option;

          return (
            <Pressable
              key={option}
              onPress={() => updateField(key, option)}
              style={[
                styles.choice,
                selected && styles.choiceSelected,
              ]}
            >
              <Text
                style={[
                  styles.choiceText,
                  selected && styles.choiceTextSelected,
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

  // REVIEW SCREEN
  if (showReview) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => setShowReview(false)}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color="#183047"
            />
          </Pressable>

          <Text style={styles.headerTitle}>Review Project</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.reviewContent}>
          <View style={styles.reviewIcon}>
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              size={35}
              color="#16845F"
            />
          </View>

          <Text style={styles.reviewTitle}>Review Your Details</Text>
          <Text style={styles.reviewSubtitle}>
            Check your project information before continuing.
          </Text>

          <View style={styles.reviewCard}>
            <ReviewRow label="Project Name" value={form.communityName} />
            <ReviewRow label="Description" value={form.description} />
            <ReviewRow label="Community Type" value={form.communityType} />
            <ReviewRow label="Project Purpose" value={form.projectPurpose} />
            <ReviewRow label="Target Members" value={form.targetMembers} />
            <ReviewRow label="Timeline" value={form.timeline} />
            <ReviewRow label="Location" value={form.location} />
            <ReviewRow label="Property Type" value={form.propertyType} />
            <ReviewRow label="Plot Size" value={form.plotSize} />
            <ReviewRow label="Expected Units" value={form.expectedUnits} />
            <ReviewRow
              label="Required Services"
              value={form.services.join(", ")}
            />
            <ReviewRow label="Minimum Budget" value={form.minBudget} />
            <ReviewRow label="Maximum Budget" value={form.maxBudget} />
            <ReviewRow label="Funding Status" value={form.fundingStatus} />
            <ReviewRow
              label="Investment Preference"
              value={form.investmentPreference}
            />
            <ReviewRow label="Amenities" value={form.amenities} />
            <ReviewRow label="Privacy" value={form.privacy} />
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={handleContinue}
          >
            <Text style={styles.primaryButtonText}>
              Review & Continue
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => setShowReview(false)}
          >
            <Text style={styles.secondaryButtonText}>
              Edit Details
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // CREATE PROJECT FORM
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color="#183047"
            />
          </Pressable>

          <Text style={styles.headerTitle}>Create New Project</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.formContent}
        >
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>BUILD WITH OTHERS</Text>
            <Text style={styles.pageTitle}>
              Create Your{"\n"}
              <Text style={styles.greenText}>Community Project</Text>
            </Text>
            <Text style={styles.subtitle}>
              Share your idea, define your requirements and connect
              with people who want to build together.
            </Text>
          </View>

          {/* SECTION 1: BASIC DETAILS */}
          <Section
            number="01"
            title="Basic Details"
            description="Tell people about your project."
          />

          {renderInput("Community / Project Name *", "communityName", "Enter project name")}
          {renderInput("Project Description", "description", "Describe your project and your idea...", true)}

          {renderChoices(
            "Community Type",
            "communityType",
            ["Residential", "Commercial", "Mixed Use", "Other"]
          )}

          {/* SECTION 2: GROUP REQUIREMENTS */}
          <Section
            number="02"
            title="Group Requirements"
            description="Define the people and purpose of your project."
          />

          {renderChoices(
            "Project Purpose",
            "projectPurpose",
            [
              "Build a new community",
              "Buy property together",
              "Joint investment",
              "Other",
            ]
          )}

          {renderInput(
            "Required Number of Members *",
            "targetMembers",
            "Example: 20",
            false,
            "numeric"
          )}

          {renderChoices(
            "Expected Timeline",
            "timeline",
            ["Within 3 months", "Within 6 months", "Within 1 year", "Flexible"]
          )}

          {/* SECTION 3: PROPERTY AND LOCATION */}
          <Section
            number="03"
            title="Property & Location"
            description="Share the preferred property details."
          />

          {renderInput("Preferred Location *", "location", "Enter city, area or locality")}

          {renderChoices(
            "Property Type",
            "propertyType",
            ["Open Plot", "Apartment", "Villa", "Land", "Other"]
          )}

          {renderInput(
            "Required Plot Size",
            "plotSize",
            "Example: 200 sq. yards"
          )}

          {renderInput(
            "Expected Number of Units",
            "expectedUnits",
            "Enter expected units",
            false,
            "numeric"
          )}

          {/* SECTION 4: REQUIRED SERVICES */}
          <Section
            number="04"
            title="Required Services"
            description="Select the services you may need."
          />

          <View style={styles.serviceContainer}>
            {serviceOptions.map((service) => {
              const selected = form.services.includes(service);

              return (
                <Pressable
                  key={service}
                  onPress={() => toggleService(service)}
                  style={[
                    styles.serviceItem,
                    selected && styles.serviceItemSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      selected
                        ? "checkbox-marked"
                        : "checkbox-blank-outline"
                    }
                    size={21}
                    color={selected ? "#16845F" : "#8795A2"}
                  />
                  <Text
                    style={[
                      styles.serviceText,
                      selected && styles.serviceTextSelected,
                    ]}
                  >
                    {service}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* SECTION 5: FINANCIAL REQUIREMENTS */}
          <Section
            number="05"
            title="Financial Requirements"
            description="Provide an approximate investment range."
          />

          {renderInput(
            "Minimum Budget Per Member",
            "minBudget",
            "Example: 500000",
            false,
            "numeric"
          )}

          {renderInput(
            "Maximum Budget Per Member",
            "maxBudget",
            "Example: 1000000",
            false,
            "numeric"
          )}

          {renderChoices(
            "Funding Status",
            "fundingStatus",
            [
              "Planning to raise funds",
              "Funds partially available",
              "Funds available",
              "Not decided",
            ]
          )}

          {renderChoices(
            "Investment Preference",
            "investmentPreference",
            [
              "Individual contribution",
              "Equal contribution",
              "Flexible contribution",
              "Not decided",
            ]
          )}

          {/* SECTION 6: COMMUNITY DETAILS */}
          <Section
            number="06"
            title="Community Details & Privacy"
            description="Add preferences and choose who can view your project."
          />

          {renderInput(
            "Amenities / Additional Requirements",
            "amenities",
            "Example: Parking, clubhouse, security, garden...",
            true
          )}

          {renderChoices(
            "Project Visibility",
            "privacy",
            ["Public", "Members Only"]
          )}

          <View style={styles.note}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color="#16845F"
            />
            <Text style={styles.noteText}>
              Your information will be used to prepare your project
              details. You can review the information before continuing.
            </Text>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={handleReview}
          >
            <Text style={styles.primaryButtonText}>
              Review Project Details
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={onBack}>
            <Text style={styles.cancelButtonText}>Go Back</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// SECTION HEADING COMPONENT
function Section({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionNumber}>
        <Text style={styles.sectionNumberText}>{number}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
    </View>
  );
}

// REVIEW ROW COMPONENT
function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>
        {value.trim() ? value : "Not provided"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 58,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F4",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F2F6F4",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#183047",
  },

  formContent: {
    paddingBottom: 35,
  },

  intro: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 22,
  },

  eyebrow: {
    color: "#16845F",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  pageTitle: {
    color: "#183047",
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "900",
  },

  greenText: {
    color: "#16845F",
  },

  subtitle: {
    color: "#687887",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 19,
    marginTop: 23,
    marginBottom: 15,
    gap: 12,
  },

  sectionNumber: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#E8F6EF",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionNumberText: {
    color: "#16845F",
    fontSize: 13,
    fontWeight: "900",
  },

  sectionTitle: {
    color: "#183047",
    fontSize: 16,
    fontWeight: "900",
  },

  sectionDescription: {
    color: "#82909C",
    fontSize: 11,
    marginTop: 4,
  },

  field: {
    marginHorizontal: 19,
    marginBottom: 17,
  },

  label: {
    color: "#34495B",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    minHeight: 49,
    borderWidth: 1,
    borderColor: "#E1E8EB",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: "#183047",
    backgroundColor: "#FFFFFF",
    fontSize: 13,
  },

  multilineInput: {
    minHeight: 95,
    paddingTop: 13,
  },

  choiceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  choice: {
    borderWidth: 1,
    borderColor: "#E1E8EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },

  choiceSelected: {
    borderColor: "#16845F",
    backgroundColor: "#E8F6EF",
  },

  choiceText: {
    color: "#687887",
    fontSize: 11,
    fontWeight: "700",
  },

  choiceTextSelected: {
    color: "#16845F",
  },

  serviceContainer: {
    marginHorizontal: 19,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  serviceItem: {
    width: "48%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#E1E8EB",
    borderRadius: 11,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  serviceItemSelected: {
    borderColor: "#16845F",
    backgroundColor: "#E8F6EF",
  },

  serviceText: {
    color: "#687887",
    fontSize: 10,
    fontWeight: "700",
    flex: 1,
  },

  serviceTextSelected: {
    color: "#16845F",
  },

  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginHorizontal: 19,
    marginTop: 18,
    padding: 13,
    backgroundColor: "#F0F8F4",
    borderRadius: 12,
  },

  noteText: {
    flex: 1,
    color: "#61776C",
    fontSize: 11,
    lineHeight: 18,
  },

  primaryButton: {
    minHeight: 52,
    backgroundColor: "#16845F",
    borderRadius: 13,
    marginHorizontal: 19,
    marginTop: 23,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  cancelButton: {
    alignItems: "center",
    padding: 15,
  },

  cancelButtonText: {
    color: "#71808D",
    fontSize: 13,
    fontWeight: "700",
  },

  // REVIEW SCREEN
  reviewContent: {
    padding: 20,
    paddingBottom: 35,
  },

  reviewIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#E8F6EF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 18,
  },

  reviewTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#183047",
    textAlign: "center",
    marginTop: 17,
  },

  reviewSubtitle: {
    fontSize: 12,
    color: "#71808D",
    textAlign: "center",
    marginTop: 7,
    marginBottom: 22,
  },

  reviewCard: {
    borderWidth: 1,
    borderColor: "#E8EEF0",
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },

  reviewRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F4",
  },

  reviewLabel: {
    fontSize: 11,
    color: "#84919C",
    fontWeight: "700",
  },

  reviewValue: {
    fontSize: 13,
    color: "#183047",
    fontWeight: "700",
    marginTop: 5,
    lineHeight: 19,
  },

  secondaryButton: {
    alignItems: "center",
    padding: 15,
  },

  secondaryButtonText: {
    color: "#16845F",
    fontSize: 13,
    fontWeight: "800",
  },
});
