// app/(auth)/reset-password.tsx

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import CustomAlert from "@components/CustomAlert";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPassword() {
  const router = useRouter();
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  const { token } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setAlertData({
        title: "Invalid Link",
        message:
          "This password reset link is invalid. Please request a new one.",
        onConfirm: () => {
          setAlertVisible(false);
          router.push("/forgot-password");
        },
      });
      setAlertVisible(true);
    }
  }, [token]);

  const validatePassword = () => {
    if (!password || !confirmPassword) {
      setPasswordError(!password);
      setConfirmPasswordError(!confirmPassword);
      setAlertData({
        title: "Error",
        message: "Please fill in both fields.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return false;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(true);
      setAlertData({
        title: "Error",
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setAlertData({
        title: "Error",
        message: "Passwords do not match.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // TODO: Replace with actual API call
      // const response = await resetPassword({ token, password });

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAlertData({
        title: "Success",
        message: "Your password has been reset successfully.",
        onConfirm: () => {
          setAlertVisible(false);
          setTimeout(() => {
            router.push("/login");
          }, 500);
        },
      });
      setAlertVisible(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.";
      setAlertData({
        title: "Error",
        message: errorMessage,
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    password && confirmPassword && password.length >= MIN_PASSWORD_LENGTH;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Reset Password
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your new password below. Minimum of {MIN_PASSWORD_LENGTH}{" "}
            characters.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              New password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: passwordError ? colors.error : colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                placeholder="Enter new password"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError(false);
                }}
                editable={!isLoading}
                accessibilityLabel="New password input"
                accessibilityHint={`Enter a new password with at least ${MIN_PASSWORD_LENGTH} characters`}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
                accessibilityRole="button"
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Confirm new password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: confirmPasswordError
                      ? colors.error
                      : colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                placeholder="Re-enter new password"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError(false);
                }}
                editable={!isLoading}
                accessibilityLabel="Confirm new password input"
                accessibilityHint="Re-enter your new password to confirm"
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                accessibilityLabel={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                accessibilityRole="button"
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.continueButton,
          {
            backgroundColor:
              !isFormValid || isLoading ? colors.border : colors.primary,
            opacity: isLoading ? 0.7 : 1,
          },
        ]}
        onPress={handleResetPassword}
        disabled={!isFormValid || isLoading}
        accessibilityLabel="Reset password"
        accessibilityRole="button"
        accessibilityState={{ disabled: !isFormValid || isLoading }}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text
            style={[
              styles.continueButtonText,
              {
                color: !isFormValid ? colors.textTertiary : colors.background,
              },
            ]}
          >
            Reset Password
          </Text>
        )}
      </TouchableOpacity>

      <CustomAlert
        isVisible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        onConfirm={alertData.onConfirm}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    marginTop: 20,
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.nunitoBold,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.nunitoRegular,
    marginBottom: 30,
    paddingRight: 10,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.nunitoSemiBold,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.nunitoRegular,
    borderWidth: 1,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  iconButton: {
    position: "absolute",
    right: 20,
    top: 15,
  },
  continueButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    minHeight: 50,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: Fonts.nunitoBold,
  },
});
