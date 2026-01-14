// app/(business-onboarding)/contact-person.tsx

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";
import { useState } from "react";
import CustomAlert from "@components/CustomAlert";
import BottomSheetPicker from "@components/BottomSheetPicker";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

type Frequency = "Daily" | "Weekly" | "As Needed";

const frequencyOptions: Frequency[] = ["Daily", "Weekly", "As Needed"];

const deliveryVolumeOptionsMap: Record<Frequency, string[]> = {
  Daily: [
    "Less than 5 deliveries per day",
    "5-10 deliveries per day",
    "More than 10 deliveries per day",
  ],
  Weekly: [
    "Less than 20 deliveries per week",
    "20-50 deliveries per week",
    "More than 50 deliveries per week",
  ],
  "As Needed": ["As needed (variable volume)"],
};

const paymentOptions = [
  "Pay-per-Delivery",
  "Wallet System",
  "Credit Invoicing (Monthly)",
];

export default function ContactPerson() {
  const router = useRouter();
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("NG");
  const [country, setCountry] = useState<Country | null>(null);

  const [deliveryFrequency, setDeliveryFrequency] = useState<Frequency | "">(
    ""
  );
  const [deliveryVolume, setDeliveryVolume] = useState("");
  const [paymentPreference, setPaymentPreference] = useState("");

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

  // Simple validation errors
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    if (!firstName.trim()) newErrors.firstName = true;
    if (!lastName.trim()) newErrors.lastName = true;
    if (!email.trim()) newErrors.email = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!deliveryFrequency) newErrors.deliveryFrequency = true;
    if (!deliveryVolume) newErrors.deliveryVolume = true;
    if (!paymentPreference) newErrors.paymentPreference = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      setAlertData({
        title: "Required Fields",
        message: "Please fill in all required information.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // TODO: Replace with real API call / registration step
      await new Promise((resolve) => setTimeout(resolve, 1400));

      router.push({
        pathname: "/(auth)/accept-terms",
        params: {
          email: encodeURIComponent(email),
          phone: encodeURIComponent(phone),
          firstName: encodeURIComponent(firstName),
          lastName: encodeURIComponent(lastName),
        },
      });
    } catch (error) {
      setAlertData({
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    phone.trim() &&
    deliveryFrequency &&
    deliveryVolume &&
    paymentPreference;

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

        <Text style={[styles.title, { color: colors.text }]}>
          Contact Person & Preferences
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Tell us about your primary contact and how you'd like to work with us
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Primary Contact Person
          </Text>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={[styles.label, { color: colors.text }]}>
                First Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.firstName
                      ? colors.error
                      : colors.border,
                    backgroundColor: colors.card,
                    color: colors.text,
                  },
                ]}
                placeholder="e.g. John"
                placeholderTextColor={colors.textTertiary}
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  setErrors((prev) => ({ ...prev, firstName: false }));
                }}
              />
            </View>

            <View style={styles.half}>
              <Text style={[styles.label, { color: colors.text }]}>
                Last Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.lastName ? colors.error : colors.border,
                    backgroundColor: colors.card,
                    color: colors.text,
                  },
                ]}
                placeholder="e.g. Doe"
                placeholderTextColor={colors.textTertiary}
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  setErrors((prev) => ({ ...prev, lastName: false }));
                }}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Email Address *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.email ? colors.error : colors.border,
                  backgroundColor: colors.card,
                  color: colors.text,
                },
              ]}
              placeholder="e.g. contact@yourbusiness.com"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: false }));
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Phone Number *
            </Text>
            <View
              style={[
                styles.phoneContainer,
                {
                  borderColor: errors.phone ? colors.error : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withCallingCodeButton
                withFlag
                withCountryNameButton={false}
                withCallingCode
                onSelect={(c) => {
                  setCountryCode(c.cca2);
                  setCountry(c);
                }}
                containerButtonStyle={[
                  styles.countryButton,
                  { backgroundColor: colors.card },
                ]}
              >
                <View style={styles.countryDisplay}>
                  <Text style={{ color: colors.text }}>
                    +{country?.callingCode?.[0] || "234"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={colors.textSecondary}
                  />
                </View>
              </CountryPicker>

              <TextInput
                style={[styles.phoneInput, { color: colors.text }]}
                placeholder="701 234 5678"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text.replace(/\D/g, ""));
                  setErrors((prev) => ({ ...prev, phone: false }));
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Delivery & Payment Preferences
          </Text>

          <View style={styles.inputGroup}>
            <BottomSheetPicker
              label="Delivery Frequency"
              value={deliveryFrequency}
              options={frequencyOptions}
              onSelect={(val) => {
                setDeliveryFrequency(val as Frequency);
                setDeliveryVolume("");
                setErrors((prev) => ({ ...prev, deliveryFrequency: false }));
              }}
              required
            />
          </View>

          <View style={styles.inputGroup}>
            <BottomSheetPicker
              label="Typical Delivery Volume"
              value={deliveryVolume}
              options={
                deliveryFrequency
                  ? deliveryVolumeOptionsMap[deliveryFrequency]
                  : []
              }
              onSelect={(val) => {
                setDeliveryVolume(val);
                setErrors((prev) => ({ ...prev, deliveryVolume: false }));
              }}
              required
              disabled={!deliveryFrequency}
            />
          </View>

          <View style={styles.inputGroup}>
            <BottomSheetPicker
              label="Preferred Payment Method"
              value={paymentPreference}
              options={paymentOptions}
              onSelect={(val) => {
                setPaymentPreference(val);
                setErrors((prev) => ({ ...prev, paymentPreference: false }));
              }}
              required
            />
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
        onPress={handleContinue}
        disabled={!isFormValid || isLoading}
        accessibilityLabel="Continue to terms acceptance"
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
            Continue
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
    paddingBottom: 120,
  },
  backButton: {
    alignSelf: "flex-start",
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
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.nunitoBold,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  half: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.nunitoSemiBold,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.nunitoRegular,
    borderWidth: 1,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  countryButton: {
    paddingHorizontal: 12,
    height: "100%",
    justifyContent: "center",
  },
  countryDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  phoneInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: Fonts.nunitoRegular,
  },
  continueButton: {
    height: 52,
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
