// app/(business-onboarding)/business-classification.tsx

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
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";
import { useState } from "react";
import CustomAlert from "@components/CustomAlert";
import BottomSheetPicker from "@components/BottomSheetPicker";
import locationData from "@data/locationData.json";

const REQUIRED_FIELDS = [
  "businessCategory",
  "businessName",
  "locationAlias",
  "countryName",
  "stateName",
  "lgaName",
  "townName",
  "streetAddress",
];

export default function BusinessClassification() {
  const router = useRouter();
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  const [selectedType, setSelectedType] = useState<
    "pharmacy" | "hospital" | "laboratory" | null
  >(null);
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [locationAlias, setLocationAlias] = useState("");
  const [countryName, setCountryName] = useState("Nigeria");
  const [stateName, setStateName] = useState("");
  const [lgaName, setLgaName] = useState("");
  const [townName, setTownName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

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

  // Validation errors
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const countryOptions = locationData.countries || [];
  const statesByCountry = locationData.statesByCountry as Record<
    string,
    string[]
  >;
  const lgasByState = locationData.lgasByState || {};
  const townsByLGA = locationData.townsByLGA || {};

  const stateOptions = statesByCountry[countryName] || [];
  const lgaOptions = lgasByState[stateName] || [];
  const townOptions = townsByLGA[lgaName] || [];

  const businessCategories = {
    pharmacy: [
      "Community Retail Pharmacy",
      "Online Pharmacy",
      "Hospital Pharmacy",
      "Wholesale Pharmacy",
      "Pharmaceutical Distributor",
    ],
    hospital: [
      "General Hospital",
      "Specialist Hospital",
      "Eye Clinic",
      "Dental Clinic",
      "ENT Clinic",
      "Fertility Clinic",
      "Other Clinic",
    ],
    laboratory: ["Diagnostic Laboratory", "Research Laboratory"],
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    REQUIRED_FIELDS.forEach((field) => {
      const value = eval(field); // careful usage — only for this simple case
      if (!value?.trim()) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      setAlertData({
        title: "Incomplete Information",
        message: "Please fill in all required fields.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    if (!selectedType) {
      setAlertData({
        title: "Business Type Required",
        message:
          "Please select your business type (Pharmacy, Hospital, or Laboratory).",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // TODO: Replace with real API call to save business details
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/contact-person");
    } catch (error) {
      setAlertData({
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to proceed. Please try again.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    selectedType &&
    REQUIRED_FIELDS.every((field) => {
      const value = eval(field);
      return !!value?.trim();
    });

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
          Register your Business
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Business Classification
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
          >
            Select your business type
          </Text>

          <View style={styles.tabRow}>
            {(["pharmacy", "hospital", "laboratory"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.tabButton,
                  {
                    borderColor:
                      selectedType === type ? colors.primary : colors.border,
                    backgroundColor:
                      selectedType === type ? colors.primary : colors.card,
                  },
                ]}
                onPress={() => {
                  setSelectedType(type);
                  setBusinessCategory("");
                  setErrors((prev) => ({ ...prev, selectedType: false }));
                }}
                accessibilityLabel={`Select ${type}`}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedType === type }}
              >
                {type === "pharmacy" && (
                  <FontAwesome5
                    name="prescription-bottle-alt"
                    size={18}
                    color={
                      selectedType === type
                        ? colors.background
                        : colors.textSecondary
                    }
                  />
                )}
                {type === "hospital" && (
                  <MaterialIcons
                    name="local-hospital"
                    size={18}
                    color={
                      selectedType === type
                        ? colors.background
                        : colors.textSecondary
                    }
                  />
                )}
                {type === "laboratory" && (
                  <Ionicons
                    name="flask"
                    size={18}
                    color={
                      selectedType === type
                        ? colors.background
                        : colors.textSecondary
                    }
                  />
                )}
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        selectedType === type ? colors.background : colors.text,
                    },
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Business Information
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
          >
            Enter your business category and official name
          </Text>

          <View style={styles.inputGroup}>
            <BottomSheetPicker
              label="Business Category"
              value={businessCategory}
              options={selectedType ? businessCategories[selectedType] : []}
              onSelect={(val) => {
                setBusinessCategory(val);
                setErrors((prev) => ({ ...prev, businessCategory: false }));
              }}
              placeholder="Select category"
              required
              disabled={!selectedType}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Business Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.businessName
                    ? colors.error
                    : colors.border,
                  backgroundColor: colors.card,
                  color: colors.text,
                },
              ]}
              placeholder="e.g. FaithMed Pharmacy"
              placeholderTextColor={colors.textTertiary}
              value={businessName}
              onChangeText={(text) => {
                setBusinessName(text);
                setErrors((prev) => ({ ...prev, businessName: false }));
              }}
              accessibilityLabel="Business name"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Business Address
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
          >
            For pickups & delivery — additional locations can be added later
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Location Alias *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.locationAlias
                    ? colors.error
                    : colors.border,
                  backgroundColor: colors.card,
                  color: colors.text,
                },
              ]}
              placeholder="e.g. Lekki Branch / Head Office"
              placeholderTextColor={colors.textTertiary}
              value={locationAlias}
              onChangeText={(text) => {
                setLocationAlias(text);
                setErrors((prev) => ({ ...prev, locationAlias: false }));
              }}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <BottomSheetPicker
                label="Country"
                value={countryName}
                options={countryOptions}
                onSelect={(val) => {
                  setCountryName(val);
                  setStateName("");
                  setLgaName("");
                  setTownName("");
                  setErrors((prev) => ({ ...prev, countryName: false }));
                }}
                required
              />
            </View>

            <View style={styles.half}>
              <BottomSheetPicker
                label="State"
                value={stateName}
                options={stateOptions}
                onSelect={(val) => {
                  setStateName(val);
                  setLgaName("");
                  setTownName("");
                  setErrors((prev) => ({ ...prev, stateName: false }));
                }}
                required
                disabled={!countryName}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <BottomSheetPicker
                label="LGA"
                value={lgaName}
                options={lgaOptions}
                onSelect={(val) => {
                  setLgaName(val);
                  setTownName("");
                  setErrors((prev) => ({ ...prev, lgaName: false }));
                }}
                required
                disabled={!stateName}
              />
            </View>

            <View style={styles.half}>
              <BottomSheetPicker
                label="Town / Area"
                value={townName}
                options={townOptions}
                onSelect={(val) => {
                  setTownName(val);
                  setErrors((prev) => ({ ...prev, townName: false }));
                }}
                required
                disabled={!lgaName}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={[styles.label, { color: colors.text }]}>
                Street Address *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.streetAddress
                      ? colors.error
                      : colors.border,
                    backgroundColor: colors.card,
                    color: colors.text,
                  },
                ]}
                placeholder="Enter street name"
                placeholderTextColor={colors.textTertiary}
                value={streetAddress}
                onChangeText={(text) => {
                  setStreetAddress(text);
                  setErrors((prev) => ({ ...prev, streetAddress: false }));
                }}
              />
            </View>

            <View style={styles.half}>
              <Text style={[styles.label, { color: colors.text }]}>
                Postal Code (Optional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.card, color: colors.text },
                ]}
                placeholder="Enter postal code"
                placeholderTextColor={colors.textTertiary}
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="numeric"
              />
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
        onPress={handleContinue}
        disabled={!isFormValid || isLoading}
        accessibilityLabel="Continue to next step"
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
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.nunitoBold,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.nunitoRegular,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: "row",
    gap: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontFamily: Fonts.nunitoSemiBold,
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
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  half: {
    flex: 1,
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
