// app/(auth)/forgot-password.tsx

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
import { useRouter } from "expo-router";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import CustomAlert from "@components/CustomAlert";

export default function ForgotPassword() {
  const router = useRouter();
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  const [email, setEmail] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      setHasError(true);
      setAlertData({
        title: "Error",
        message: "Please enter your email address.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    if (!isValidEmail(email)) {
      setHasError(true);
      setAlertData({
        title: "Error",
        message: "Please enter a valid email address.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    Keyboard.dismiss();

    try {
      // TODO: Replace with actual API call
      // const response = await sendPasswordResetLink({ email });

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAlertData({
        title: "Success",
        message: "Password reset link sent to your email.",
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
          : "Failed to send reset link. Please try again.";
      setHasError(true);
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
            Forgot Password
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your email address below to receive a password reset link.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Email Address
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: hasError ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setHasError(false);
              }}
              editable={!isLoading}
              accessibilityLabel="Email address input"
              accessibilityHint="Enter your email to receive a password reset link"
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.continueButton,
          {
            backgroundColor:
              !isValidEmail(email) || isLoading
                ? colors.border
                : colors.primary,
            opacity: isLoading ? 0.7 : 1,
          },
        ]}
        onPress={handleSendResetLink}
        disabled={!isValidEmail(email) || isLoading}
        accessibilityLabel="Send reset link"
        accessibilityRole="button"
        accessibilityState={{ disabled: !isValidEmail(email) || isLoading }}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text
            style={[
              styles.continueButtonText,
              {
                color: !isValidEmail(email)
                  ? colors.textTertiary
                  : colors.background,
              },
            ]}
          >
            Send Reset Link
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
