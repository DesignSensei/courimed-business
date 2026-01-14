// app/(auth)/accept-terms.tsx

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";
import { useState } from "react";
import CustomAlert from "@components/CustomAlert";

export default function AcceptTerms() {
  const router = useRouter();
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleContinue = () => {
    if (!accepted) return; // Button disabled anyway

    setAlertData({
      title: "Create Account",
      message: "Are you sure you want to create your business account?",
      onConfirm: async () => {
        setAlertVisible(false);
        setIsLoading(true);

        try {
          // TODO: Replace with real API call (e.g., create account)
          await new Promise((resolve) => setTimeout(resolve, 1500));

          router.push("/loading-screen"); // Or your success route
        } catch (error) {
          setAlertData({
            title: "Error",
            message:
              error instanceof Error
                ? error.message
                : "Failed to create account. Please try again.",
            onConfirm: () => setAlertVisible(false),
          });
          setAlertVisible(true);
        } finally {
          setIsLoading(false);
        }
      },
    });
    setAlertVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
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

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Terms & Conditions
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Please review our Terms of Service and Privacy Policy before
            proceeding.
          </Text>
        </View>

        <View style={[styles.termsContainer, { borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => {
              // TODO: Open Terms of Service (e.g., WebView or external link)
            }}
            accessibilityLabel="View Terms of Service"
            accessibilityRole="link"
          >
            <View style={[styles.iconBg, { backgroundColor: colors.card }]}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.termsLabel, { color: colors.text }]}>
              Terms of Service
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => {
              // TODO: Open Privacy Policy
            }}
            accessibilityLabel="View Privacy Policy"
            accessibilityRole="link"
          >
            <View style={[styles.iconBg, { backgroundColor: colors.card }]}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.termsLabel, { color: colors.text }]}>
              Privacy Policy
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAccepted(!accepted)}
          accessibilityLabel="Agree to terms and conditions"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: accepted ? colors.primary : colors.border,
                backgroundColor: accepted ? colors.primary : "transparent",
              },
            ]}
          >
            {accepted && (
              <Ionicons name="checkmark" size={18} color={colors.background} />
            )}
          </View>
          <Text style={[styles.checkboxLabel, { color: colors.text }]}>
            I agree to Courimed's{" "}
            <Text style={{ color: colors.primary }}>Terms & Conditions</Text>.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.continueButton,
          {
            backgroundColor:
              !accepted || isLoading ? colors.border : colors.primary,
            opacity: isLoading ? 0.7 : 1,
          },
        ]}
        onPress={handleContinue}
        disabled={!accepted || isLoading}
        accessibilityLabel="Create account"
        accessibilityRole="button"
        accessibilityState={{ disabled: !accepted || isLoading }}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text
            style={[
              styles.continueButtonText,
              {
                color: !accepted ? colors.textTertiary : colors.background,
              },
            ]}
          >
            Create Account
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
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 100, // Space for button
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.nunitoBold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.nunitoRegular,
  },
  termsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  termsLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.nunitoSemiBold,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.nunitoSemiBold,
    lineHeight: 20,
  },
  continueButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: Fonts.nunitoBold,
  },
});
