import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, radii, typography } from "@/theme";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  helperText?: string;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  icon,
  keyboardType = "default",
  error,
  helperText,
  multiline = false,
  numberOfLines = 1,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.asterisk}> *</Text>}
        </Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          error ? styles.inputError : null,
          !editable && styles.disabledInput,
        ]}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={error ? colors.error : colors.textMuted}
            style={styles.fieldIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            multiline && { minHeight: numberOfLines * 24, textAlignVertical: "top" },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          autoCapitalize="sentences"
        />
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.sm + 4,
    minHeight: 48,
  },
  multilineContainer: {
    paddingVertical: spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: "#F2F4F7",
  },
  fieldIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
    paddingVertical: 8,
  },
  errorText: {
    fontSize: typography.caption.fontSize,
    color: colors.error,
    marginTop: 4,
    marginLeft: 2,
  },
  helperText: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: 4,
    marginLeft: 2,
  },
});

export default FormField;

