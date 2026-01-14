// app/(auth)/login.tsx

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import CustomAlert from "@components/CustomAlert";

export default function Login() {
  const router = useRouter();
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertData({
        title: "Error",
        message: "Please fill all fields",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    setAlertData({
      title: "Success",
      message: "Logged in successfully",
      onConfirm: () => {
        router.push("/loading-screen");
      },
    });
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
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Hi, Welcome! 👋
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Log in with your email and password to continue.
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
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxWrapper}>
              <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
                <Ionicons
                  name={isChecked ? "checkbox" : "square-outline"}
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
              <Text style={[styles.checkboxText, { color: colors.text }]}>
                Remember me
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/forgot-password")}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 32 }}>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/loading-screen")}
            >
              <Text
                style={[styles.loginButtonText, { color: colors.background }]}
              >
                Log in
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orContainer}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Text style={[styles.orText, { color: colors.textTertiary }]}>
              OR
            </Text>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity
            style={[
              styles.socialButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/000000/google-logo.png",
              }}
              style={styles.socialIcon}
            />
            <Text style={[styles.socialText, { color: colors.text }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="logo-apple" size={20} color={colors.text} />
            <Text style={[styles.socialText, { color: colors.text }]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text style={[styles.signupText, { color: colors.textSecondary }]}>
              Don't have an account?{" "}
              <Text
                style={[styles.signupSignUpText, { color: colors.primary }]}
              >
                Sign up
              </Text>
            </Text>
          </TouchableOpacity>

          <CustomAlert
            isVisible={alertVisible}
            title={alertData.title}
            message={alertData.message}
            onConfirm={alertData.onConfirm}
          />
        </View>
      </ScrollView>
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
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
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
  label: {
    fontSize: 14,
    fontFamily: Fonts.nunitoSemiBold,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 24,
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
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: Fonts.nunitoRegular,
    marginLeft: 8,
  },
  forgotText: {
    fontSize: 14,
    fontFamily: Fonts.nunitoRegular,
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: Fonts.nunitoBold,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    fontSize: 14,
    fontFamily: Fonts.nunitoRegular,
    marginHorizontal: 8,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
    justifyContent: "center",
    borderWidth: 1,
  },
  socialText: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: Fonts.nunitoSemiBold,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  signupText: {
    fontSize: 14,
    fontFamily: Fonts.nunitoRegular,
    textAlign: "center",
    marginTop: 24,
  },
  signupSignUpText: {
    fontFamily: Fonts.nunitoSemiBold,
    textDecorationLine: "underline",
  },
});
