import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "@/utils/validators";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── BRAND PALETTE (Refined & Modern) ──────────────────────────────────────────
const C = {
  bg: "#F8FAFC",              // Soft off-white luxury canvas
  white: "#FFFFFF",
  primary: "#07845B",         // GatedPlus emerald green
  primaryDark: "#056846",
  primaryLight: "#EDF9F3",
  primaryBorder: "#CDECDD",
  navy: "#0F2642",            // Deep premium navy for headings
  navyMuted: "#475569",       // Refined slate
  textMuted: "#64748B",
  inputBg: "#F8FAFC",
  inputBorder: "#E2E8F0",
  inputFocusBorder: "#07845B",
  borderLight: "#F1F5F9",
};

export default function LandingPage() {
  const router = useRouter();

  // LOGIN STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // REGISTER MODAL STATE
  const [registerVisible, setRegisterVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // HANDLERS
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Details", "Please enter your email and password.");
      return;
    }
    router.replace("/home");
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset instructions will be sent to your registered email/phone.");
  };

  const handleCreateAccount = () => {
    const cleanName = fullName.trim();
    const cleanEmail = registerEmail.trim();
    const cleanPhone = phone.trim();

    const nameErr = validateName(cleanName);
    if (nameErr) { Alert.alert("Name required", nameErr); return; }
    const emailErr = validateEmail(cleanEmail);
    if (emailErr) { Alert.alert("Invalid email", emailErr); return; }
    const phoneErr = validatePhone(cleanPhone);
    if (phoneErr) { Alert.alert("Invalid phone", phoneErr); return; }
    const passErr = validatePassword(registerPassword, 8);
    if (passErr) { Alert.alert("Weak password", passErr); return; }
    const confErr = validateConfirm(confirmPassword, registerPassword);
    if (confErr) { Alert.alert("Password mismatch", confErr); return; }

    Alert.alert(
      "Account Created",
      "Welcome to GatedPlus! You can now sign in with your credentials.",
      [{
        text: "Continue to Sign In",
        onPress: () => {
          setEmail(cleanEmail);
          setPassword("");
          setRegisterVisible(false);
        },
      }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── TOP LOGO (Crisp Transparent Official Vector Mark) ───────── */}
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/gatedplus_official_logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* ── MAIN LOGIN CARD ──────────────────────────────────────────── */}
          <View style={styles.loginCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Sign In</Text>
              <Text style={styles.cardSubtitle}>
                Welcome back! Please enter your details
              </Text>
            </View>

            {/* EMAIL INPUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL OR MOBILE</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                ]}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={emailFocused ? C.primary : "#94A3B8"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter email or mobile number"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* PASSWORD INPUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused,
                ]}
              >
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={passwordFocused ? C.primary : "#94A3B8"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#94A3B8"
                  />
                </Pressable>
              </View>
            </View>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <View style={styles.optionsRow}>
              <Pressable
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && (
                    <MaterialCommunityIcons name="check" size={13} color={C.white} />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </Pressable>

              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </Pressable>
            </View>

            {/* SUBMIT BUTTON */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color={C.white}
                style={{ marginLeft: 6 }}
              />
            </Pressable>

            {/* REGISTER CALLOUT */}
            <View style={styles.registerPromptRow}>
              <Text style={styles.registerPromptText}>Don't have an account? </Text>
              <Pressable onPress={() => setRegisterVisible(true)}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>

          {/* ── SECURITY FOOTER ──────────────────────────────────────────── */}
          <View style={styles.trustBadge}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={16}
              color={C.primary}
            />
            <Text style={styles.trustBadgeText}>
              Bank-grade security & privacy guaranteed
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── REGISTRATION MODAL ───────────────────────────────────────────── */}
      <Modal
        visible={registerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRegisterVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalKeyboardContainer}
          >
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Create an Account</Text>
                  <Text style={styles.modalSubtitle}>Join GatedPlus today</Text>
                </View>
                <Pressable
                  onPress={() => setRegisterVisible(false)}
                  style={styles.modalCloseButton}
                >
                  <MaterialCommunityIcons name="close" size={20} color={C.navy} />
                </Pressable>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* FULL NAME */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FULL NAME</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="account-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter full name"
                      placeholderTextColor="#94A3B8"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* EMAIL */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="email-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter email address"
                      placeholderTextColor="#94A3B8"
                      value={registerEmail}
                      onChangeText={setRegisterEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* PHONE */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="phone-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter 10-digit mobile number"
                      placeholderTextColor="#94A3B8"
                      value={phone}
                      onChangeText={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                </View>

                {/* PASSWORD */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="lock-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="At least 8 characters"
                      placeholderTextColor="#94A3B8"
                      value={registerPassword}
                      onChangeText={setRegisterPassword}
                      secureTextEntry={!showRegisterPassword}
                      autoCapitalize="none"
                    />
                    <Pressable
                      style={styles.eyeButton}
                      onPress={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      <MaterialCommunityIcons
                        name={showRegisterPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#94A3B8"
                      />
                    </Pressable>
                  </View>
                </View>

                {/* CONFIRM PASSWORD */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="lock-check-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Re-enter password"
                      placeholderTextColor="#94A3B8"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showRegisterPassword}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* CREATE BUTTON */}
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,
                    { marginTop: 12 },
                    pressed && styles.primaryButtonPressed,
                  ]}
                  onPress={handleCreateAccount}
                >
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                </Pressable>

                <View style={[styles.registerPromptRow, { marginTop: 16 }]}>
                  <Text style={styles.registerPromptText}>Already have an account? </Text>
                  <Pressable onPress={() => setRegisterVisible(false)}>
                    <Text style={styles.registerLink}>Sign In</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── STYLES (Clean, Smart & Premium) ──────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: "center",
  },

  // TOP LOGO
  topSection: {
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  logoContainer: {
    width: Math.min(320, SCREEN_WIDTH * 0.82),
    height: 155,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },

  // CARD
  loginCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 26,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 4px 18px rgba(15, 23, 42, 0.05)",
      },
    }),
  },
  cardHeader: {
    marginBottom: 22,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: C.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },

  // INPUTS
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: 0.8,
    marginBottom: 7,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: C.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.inputBorder,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: C.inputFocusBorder,
    backgroundColor: C.white,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: C.navy,
    fontWeight: "500",
  },
  eyeButton: {
    padding: 6,
  },

  // OPTIONS
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 22,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: C.white,
  },
  checkboxActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  rememberMeText: {
    fontSize: 13,
    color: C.navyMuted,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.primary,
  },

  // BUTTON
  primaryButton: {
    height: 50,
    backgroundColor: C.primary,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0 3px 10px rgba(7, 132, 91, 0.25)",
      },
    }),
  },
  primaryButtonPressed: {
    backgroundColor: C.primaryDark,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.white,
    letterSpacing: 0.2,
  },

  // REGISTER
  registerPromptRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  registerPromptText: {
    fontSize: 13,
    color: C.textMuted,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: C.primary,
  },

  // FOOTER TRUST
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 22,
  },
  trustBadgeText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },

  // MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalKeyboardContainer: {
    width: "100%",
    maxHeight: "90%",
  },
  modalCard: {
    backgroundColor: C.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 24,
    maxHeight: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: C.navy,
  },
  modalSubtitle: {
    fontSize: 12,
    color: C.textMuted,
    marginTop: 2,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
});

export { LandingPage, LandingPage as LoginScreen };
