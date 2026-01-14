// app/(auth)/sign-up.tsx

import { useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "@components/CustomAlert";

export default function Signup() {
  const router = useRouter();
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("NG");
  const [country, setCountry] = useState<Country | null>(null);
  const [withCallingCode, setWithCallingCode] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSignup = async () => {
    if (!firstName || !lastName || !phone || !email) {
      setAlertData({
        title: "Missing Info",
        message: "Phone and email are required.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      router.push({
        pathname: "/two-factor",
        params: {
          email: encodeURIComponent(email),
          phone: encodeURIComponent(phone),
          firstName: encodeURIComponent(firstName),
          lastName: encodeURIComponent(lastName),
        },
      });
    }, 1000);
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
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>

        <View style={styles.topContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Let's get started
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your mobile number and email address and we'll send a 6-digit
            code to confirm it. SMS rates may apply.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              First name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="e.g. John"
              placeholderTextColor={colors.textTertiary}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Last name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="e.g. Doe"
              placeholderTextColor={colors.textTertiary}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Email address
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="e.g. user@example.com"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Phone number
            </Text>
            <View
              style={[
                styles.phoneRow,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <TouchableOpacity style={styles.countryWrapper}>
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withCallingCodeButton
                  withFlag
                  withCountryNameButton={false}
                  withCallingCode
                  onSelect={(country) => {
                    setCountryCode(country.cca2);
                    setCountry(country);
                  }}
                  containerButtonStyle={styles.countryPicker}
                />
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={colors.textSecondary}
                  style={styles.dropdownIcon}
                />
              </TouchableOpacity>

              <TextInput
                style={[styles.phoneInput, { color: colors.text }]}
                placeholder="e.g. 7012345678"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Referral code (optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="e.g. REF123"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="characters"
              value={referralCode}
              onChangeText={setReferralCode}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={handleSignup}
        >
          <Text
            style={[styles.continueButtonText, { color: colors.background }]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>

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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: 40,
  },
  topContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.nunitoBold,
    marginBottom: 10,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.nunitoRegular,
    textAlign: "left",
    marginBottom: 30,
    paddingRight: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.nunitoSemiBold,
    marginBottom: 6,
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
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 50,
    width: "100%",
  },
  countryPicker: {
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.nunitoRegular,
  },
  bottomContainer: {
    marginTop: 30,
  },
  continueButton: {
    width: "100%",
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
  backButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backButtonIcon: {
    fontSize: 24,
  },
  countryWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  dropdownIcon: {
    marginLeft: -8,
  },
});
