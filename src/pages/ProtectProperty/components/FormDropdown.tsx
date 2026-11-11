import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, radii, typography } from "@/theme";

interface FormDropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (option: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  error?: string;
}

export const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  value,
  options,
  onSelect,
  placeholder,
  required = false,
  icon,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.asterisk}> *</Text>}
        </Text>
      </View>

      <Pressable
        style={[
          styles.selector,
          error ? styles.selectorError : null,
        ]}
        onPress={() => setModalVisible(true)}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={value ? colors.primary : colors.textMuted}
            style={styles.fieldIcon}
          />
        )}
        <Text
          style={[
            styles.valueText,
            !value && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {value || placeholder || `Select ${label.toLowerCase()}`}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={22}
          color={colors.textMuted}
        />
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color={colors.navy}
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            >
              {options.map((option) => {
                const isSelected = option === value;
                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => {
                      onSelect(option);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={colors.primary}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: "600",
    color: colors.navy,
  },
  asterisk: {
    color: colors.error,
    fontWeight: "700",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.sm + 4,
    minHeight: 48,
  },
  selectorError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  fieldIcon: {
    marginRight: 8,
  },
  valueText: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  errorText: {
    fontSize: typography.caption.fontSize,
    color: colors.error,
    marginTop: 4,
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(16, 43, 70, 0.55)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
    color: colors.navy,
  },
  closeBtn: {
    padding: 6,
  },
  optionsList: {
    marginTop: spacing.xs,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    marginBottom: 4,
  },
  optionItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    fontWeight: "700",
    color: colors.primaryDark,
  },
});

export default FormDropdown;

