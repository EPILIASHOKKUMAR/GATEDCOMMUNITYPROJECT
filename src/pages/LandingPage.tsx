import { useState } from "react";
import {
  Alert,
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

import { colors } from "@/theme";
import {
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "@/utils/validators";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

const C = {
  green: colors.green,
  darkGreen: colors.darkGreen,
  navy: colors.navy,
  blue: colors.blue,
  background: colors.background,
  white: colors.white,
  text: colors.textPrimary,
  muted: colors.textMuted,
  border: colors.border,
  paleGreen: colors.paleGreen,
};

function GatedPlusLogo() {
  return (
    <View style={styles.logoCircle}>
      <Svg width={170} height={170} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="roofGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#00A875" />
            <Stop offset="1" stopColor="#075D49" />
          </LinearGradient>

          <LinearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#398BFF" />
            <Stop offset="1" stopColor="#263FC4" />
          </LinearGradient>

          <LinearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFD77A" />
            <Stop offset="1" stopColor="#E9A93E" />
          </LinearGradient>
        </Defs>

        <Circle cx="100" cy="100" r="91" fill="#F3FAF7" />
        <Circle cx="100" cy="100" r="79" fill="#FFFFFF" />

        <Circle
          cx="100"
          cy="100"
          r="76"
          fill="none"
          stroke="#DCEFE7"
          strokeWidth="1.5"
        />

        <Circle cx="35" cy="78" r="4" fill="#28B987" />
        <Circle cx="164" cy="70" r="5" fill="#EAB54E" />
        <Circle cx="158" cy="139" r="3.5" fill="#4C86E9" />
        <Circle cx="43" cy="139" r="3" fill="#EAB54E" />

        <Path
          d="M48 91 L100 43 L152 91 L152 151 Q152 157 146 157 L54 157 Q48 157 48 151 Z"
          fill="#0A6049"
          opacity="0.12"
          transform="translate(0 5)"
        />

        <Path
          d="M42 91 L100 39 L158 91 L149 101 L100 57 L51 101 Z"
          fill="url(#roofGradient)"
        />

        <Path
          d="M53 88 L100 47 L147 88"
          fill="none"
          stroke="#7DE0B9"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <Path
          d="M57 96 L100 60 L143 96 L143 151 L57 151 Z"
          fill="#FFFFFF"
          stroke="#087A58"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        <Rect
          x="65"
          y="99"
          width="70"
          height="45"
          rx="5"
          fill="#EAF7F1"
        />

        <Rect
          x="63"
          y="91"
          width="74"
          height="49"
          rx="12"
          fill="url(#blueGradient)"
        />

        <SvgText
          x="100"
          y="124"
          fontSize="29"
          fontWeight="900"
          textAnchor="middle"
          fill="#FFFFFF"
          letterSpacing="-2"
        >
          GP
        </SvgText>

        <Rect
          x="91"
          y="141"
          width="18"
          height="16"
          rx="3"
          fill="url(#goldGradient)"
        />

        <Circle cx="104" cy="149" r="1.5" fill="#8B5A16" />

        <Path
          d="M57 153 H143"
          stroke="#087A58"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <Circle cx="151" cy="48" r="10" fill="#FFF3D8" />

        <Path
          d="M151 41 L153 46 L159 48 L153 50 L151 56 L149 50 L143 48 L149 46 Z"
          fill="#E8AE43"
        />
      </Svg>
    </View>
  );
}

export default function LandingPage() {
  const router = useRouter();

  // LOGIN FORM
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // REGISTER POPUP
  const [registerVisible, setRegisterVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // LOGIN: ACCEPT ANY NON-EMPTY EMAIL AND PASSWORD
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Missing Details",
        "Please enter your email and password."
      );
      return;
    }

    // Temporary testing login. No backend authentication.
    router.replace("/home");
  };

  // FORGOT PASSWORD
  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset functionality will be connected later."
    );
  };

  // OPEN REGISTER POPUP
  const handleRegisterOpen = () => {
    setRegisterVisible(true);
  };

  // CLOSE REGISTER POPUP
  const handleRegisterClose = () => {
    setRegisterVisible(false);
  };

  // CREATE ACCOUNT
  const handleCreateAccount = () => {
    const cleanName = fullName.trim();
    const cleanEmail = registerEmail.trim();
    const cleanPhone = phone.trim();

    const nameErr = validateName(cleanName);
    if (nameErr) {
      Alert.alert("Name required", nameErr);
      return;
    }

    const emailErr = validateEmail(cleanEmail);
    if (emailErr) {
      Alert.alert("Invalid email", emailErr);
      return;
    }

    const phoneErr = validatePhone(cleanPhone);
    if (phoneErr) {
      Alert.alert("Invalid phone number", phoneErr);
      return;
    }

    const passErr = validatePassword(registerPassword, 8);
    if (passErr) {
      Alert.alert("Weak password", passErr);
      return;
    }

    const confirmErr = validateConfirm(confirmPassword, registerPassword);
    if (confirmErr) {
      Alert.alert("Password mismatch", confirmErr);
      return;
    }

    // Temporary registration only. No account is saved yet.
    Alert.alert(
      "Registration UI completed",
      "The registration form is ready. Backend registration will be connected later.",
      [
        {
          text: "Continue to Login",
          onPress: () => {
            setEmail(cleanEmail);
            setPassword("");
            setRegisterVisible(false);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
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
          {/* TOP BRAND NAME */}
          <View style={styles.brandHeader}>
            <View style={styles.wordmark}>
              <Text style={styles.wordmarkGated}>Gated</Text>
              <Text style={styles.wordmarkPlus}>Plus</Text>
              <View style={styles.wordmarkDot} />
            </View>

            <Text style={styles.brandCaption}>
              PROPERTY & COMMUNITY PLATFORM
            </Text>
          </View>

          {/* GP HOUSE LOGO */}
          <View style={styles.logoSection}>
            <GatedPlusLogo />
          </View>

          {/* LOGIN CARD */}
          <View style={styles.loginCard}>
            <View style={styles.headingArea}>
              <View style={styles.headingAccent} />

              <Text style={styles.heading}>
                Login to get started
              </Text>

              <Text style={styles.description}>
                Welcome back! Enter your account details to continue.
              </Text>
            </View>

            {/* EMAIL */}
            <View style={styles.field}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>

              <View style={styles.inputBox}>
                <View style={styles.inputIconBox}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={21}
                    color={C.green}
                  />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#9AA9BA"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </View>
            </View>

            {/* PASSWORD */}
            <View style={styles.field}>
              <Text style={styles.label}>PASSWORD</Text>

              <View style={styles.inputBox}>
                <View style={styles.inputIconBox}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={21}
                    color={C.green}
                  />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9AA9BA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />

                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={C.muted}
                  />
                </Pressable>
              </View>
            </View>

            {/* REMEMBER ME + FORGOT PASSWORD */}
            <View style={styles.optionsRow}>
              <Pressable
                style={styles.rememberRow}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxActive,
                  ]}
                >
                  {rememberMe && (
                    <MaterialCommunityIcons
                      name="check"
                      size={14}
                      color="#FFFFFF"
                    />
                  )}
                </View>

                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>

              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            {/* SIGN IN */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.signInButton,
                pressed && styles.signInPressed,
              ]}
            >
              <Text style={styles.signInText}>Sign In</Text>

              <View style={styles.arrowCircle}>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={19}
                  color={C.green}
                />
              </View>
            </Pressable>

            {/* REGISTER LINK */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>
                Don't have an account?
              </Text>

              <Pressable onPress={handleRegisterOpen}>
                <Text style={styles.registerLink}>Register</Text>
              </Pressable>
            </View>

            {/* SECURITY */}
            <View style={styles.securityBox}>
              <MaterialCommunityIcons
                name="shield-check"
                size={19}
                color={C.green}
              />

              <Text style={styles.securityText}>
                Secure login. Your information stays protected.
              </Text>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <View style={styles.footerDecoration}>
              <View style={styles.footerLine} />

              <MaterialCommunityIcons
                name="home-city-outline"
                size={19}
                color={C.green}
              />

              <View style={styles.footerLine} />
            </View>

            <Text style={styles.footerText}>
              GatedPlus · Welcome to your community
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* REGISTER POPUP */}
      <Modal
        visible={registerVisible}
        transparent
        animationType="fade"
        onRequestClose={handleRegisterClose}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalKeyboard}
          >
            <View style={styles.registerModal}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* POPUP HEADER */}
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>
                      Create Account
                    </Text>

                    <Text style={styles.modalSubtitle}>
                      Join the GatedPlus community
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleRegisterClose}
                    style={styles.closeButton}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={22}
                      color={C.navy}
                    />
                  </Pressable>
                </View>

                <View style={styles.modalAccent} />

                {/* FULL NAME */}
                <View style={styles.modalField}>
                  <Text style={styles.label}>FULL NAME</Text>

                  <View style={styles.inputBox}>
                    <View style={styles.inputIconBox}>
                      <MaterialCommunityIcons
                        name="account-outline"
                        size={21}
                        color={C.green}
                      />
                    </View>

                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor="#9AA9BA"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                      textContentType="name"
                    />
                  </View>
                </View>

                {/* EMAIL */}
                <View style={styles.modalField}>
                  <Text style={styles.label}>EMAIL ADDRESS</Text>

                  <View style={styles.inputBox}>
                    <View style={styles.inputIconBox}>
                      <MaterialCommunityIcons
                        name="email-outline"
                        size={21}
                        color={C.green}
                      />
                    </View>

                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="#9AA9BA"
                      value={registerEmail}
                      onChangeText={setRegisterEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="emailAddress"
                    />
                  </View>
                </View>

                {/* PHONE */}
                <View style={styles.modalField}>
                  <Text style={styles.label}>PHONE NUMBER</Text>

                  <View style={styles.inputBox}>
                    <View style={styles.inputIconBox}>
                      <MaterialCommunityIcons
                        name="phone-outline"
                        size={21}
                        color={C.green}
                      />
                    </View>

                    <TextInput
                      style={styles.input}
                      placeholder="Enter 10-digit mobile number"
                      placeholderTextColor="#9AA9BA"
                      value={phone}
                      onChangeText={(value) =>
                        setPhone(value.replace(/\D/g, "").slice(0, 10))
                      }
                      keyboardType="phone-pad"
                      maxLength={10}
                      textContentType="telephoneNumber"
                    />
                  </View>
                </View>

                {/* PASSWORD */}
                <View style={styles.modalField}>
                  <Text style={styles.label}>PASSWORD</Text>

                  <View style={styles.inputBox}>
                    <View style={styles.inputIconBox}>
                      <MaterialCommunityIcons
                        name="lock-outline"
                        size={21}
                        color={C.green}
                      />
                    </View>

                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor="#9AA9BA"
                      value={registerPassword}
                      onChangeText={setRegisterPassword}
                      secureTextEntry={!showRegisterPassword}
                      autoCapitalize="none"
                      textContentType="newPassword"
                    />

                    <Pressable
                      style={styles.eyeButton}
                      onPress={() =>
                        setShowRegisterPassword(!showRegisterPassword)
                      }
                    >
                      <MaterialCommunityIcons
                        name={
                          showRegisterPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={22}
                        color={C.muted}
                      />
                    </Pressable>
                  </View>

                  <Text style={styles.helperText}>
                    Use at least 8 characters.
                  </Text>
                </View>

                {/* CONFIRM PASSWORD */}
                <View style={styles.modalField}>
                  <Text style={styles.label}>CONFIRM PASSWORD</Text>

                  <View style={styles.inputBox}>
                    <View style={styles.inputIconBox}>
                      <MaterialCommunityIcons
                        name="lock-check-outline"
                        size={21}
                        color={C.green}
                      />
                    </View>

                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#9AA9BA"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showRegisterPassword}
                      autoCapitalize="none"
                      textContentType="newPassword"
                    />
                  </View>
                </View>

                {/* CREATE ACCOUNT */}
                <Pressable
                  onPress={handleCreateAccount}
                  style={({ pressed }) => [
                    styles.createButton,
                    pressed && styles.signInPressed,
                  ]}
                >
                  <Text style={styles.createButtonText}>
                    Create Account
                  </Text>

                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={21}
                    color="#FFFFFF"
                  />
                </Pressable>

                {/* BACK TO LOGIN */}
                <View style={styles.modalBottomRow}>
                  <Text style={styles.modalBottomText}>
                    Already have an account?
                  </Text>

                  <Pressable onPress={handleRegisterClose}>
                    <Text style={styles.modalLoginLink}>Login</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 21,
    paddingTop: 27,
    paddingBottom: 25,
  },

  // BRAND
  brandHeader: {
    alignItems: "center",
    marginBottom: 17,
  },

  wordmark: {
    flexDirection: "row",
    alignItems: "center",
  },

  wordmarkGated: {
    color: C.darkGreen,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.8,
  },

  wordmarkPlus: {
    color: C.navy,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.8,
  },

  wordmarkDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#E6B34F",
    marginLeft: 4,
    marginTop: -20,
  },

  brandCaption: {
    fontSize: 9,
    color: C.muted,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 3,
  },

  // LOGO
  logoSection: {
    alignItems: "center",
    marginBottom: 22,
  },

  logoCircle: {
    width: 184,
    height: 184,
    borderRadius: 92,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D9EEE5",
    shadowColor: "#0B7755",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 7,
  },

  // LOGIN CARD
  loginCard: {
    backgroundColor: C.white,
    borderRadius: 23,
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 23,
    borderWidth: 1,
    borderColor: "#E3EAF2",
    shadowColor: "#183B5B",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 4,
  },

  headingArea: {
    marginBottom: 27,
  },

  headingAccent: {
    width: 38,
    height: 4,
    borderRadius: 5,
    backgroundColor: C.green,
    marginBottom: 13,
  },

  heading: {
    fontSize: 25,
    color: C.navy,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  description: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  // INPUTS
  field: {
    marginBottom: 21,
  },

  label: {
    color: C.navy,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 10,
  },

  inputBox: {
    height: 58,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },

  inputIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.paleGreen,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  input: {
    flex: 1,
    height: "100%",
    color: C.text,
    fontSize: 13,
    fontWeight: "500",
  },

  eyeButton: {
    padding: 7,
  },

  // LOGIN OPTIONS
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 19,
    height: 19,
    borderWidth: 1.3,
    borderColor: "#C6D3E0",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  checkboxActive: {
    backgroundColor: C.green,
    borderColor: C.green,
  },

  rememberText: {
    color: C.muted,
    fontSize: 12,
  },

  forgotText: {
    color: C.green,
    fontSize: 12,
    fontWeight: "800",
  },

  // SIGN IN
  signInButton: {
    height: 59,
    borderRadius: 14,
    backgroundColor: C.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },

  signInPressed: {
    backgroundColor: C.darkGreen,
    transform: [{ scale: 0.99 }],
  },

  signInText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "900",
    marginRight: 13,
  },

  arrowCircle: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },

  // REGISTER LINK
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 4,
  },

  registerText: {
    color: C.muted,
    fontSize: 13,
  },

  registerLink: {
    color: C.green,
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 5,
  },

  // SECURITY
  securityBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  securityText: {
    color: C.muted,
    fontSize: 10,
    marginLeft: 7,
  },

  // FOOTER
  footer: {
    alignItems: "center",
    marginTop: 25,
  },

  footerDecoration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 9,
  },

  footerLine: {
    width: 43,
    height: 1,
    backgroundColor: "#C8DED5",
  },

  footerText: {
    fontSize: 10,
    color: C.muted,
    fontWeight: "500",
  },

  // REGISTER MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(8, 27, 45, 0.58)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 17,
    paddingVertical: 25,
  },

  modalKeyboard: {
    width: "100%",
    maxHeight: "92%",
    justifyContent: "center",
  },

  registerModal: {
    backgroundColor: C.white,
    borderRadius: 23,
    paddingHorizontal: 21,
    paddingTop: 23,
    paddingBottom: 20,
    maxHeight: "100%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: C.navy,
  },

  modalSubtitle: {
    color: C.muted,
    fontSize: 12,
    marginTop: 5,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    justifyContent: "center",
  },

  modalAccent: {
    width: 43,
    height: 4,
    borderRadius: 5,
    backgroundColor: C.green,
    marginBottom: 20,
  },

  modalField: {
    marginBottom: 16,
  },

  helperText: {
    color: C.muted,
    fontSize: 10,
    marginTop: 6,
    marginLeft: 3,
  },

  createButton: {
    height: 55,
    borderRadius: 13,
    backgroundColor: C.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 5,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 4,
  },

  createButtonText: {
    color: C.white,
    fontSize: 15,
    fontWeight: "900",
  },

  modalBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 19,
    marginBottom: 5,
  },

  modalBottomText: {
    color: C.muted,
    fontSize: 12,
  },

  modalLoginLink: {
    color: C.green,
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 5,
  },
});

export { LandingPage, LandingPage as LoginScreen };
