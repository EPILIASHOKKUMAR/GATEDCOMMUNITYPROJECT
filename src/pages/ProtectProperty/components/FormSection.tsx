import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, radii, typography } from "@/theme";

interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon && (
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
          </View>
        )}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: 2,
  },
  content: {
    gap: spacing.sm,
  },
});

export default FormSection;

