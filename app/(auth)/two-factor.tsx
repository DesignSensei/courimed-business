// app/(auth)/two-factor.tsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomAlert from "@components/CustomAlert";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";
import { Ionicons } from "@expo/vector-icons";

const MAX_RESEND_ATTEMPTS = 3;
const OTP_LENGTH = 6;
const TIMER_DURATION = 60;

export default function TwoFactor() {
  const router = useRouter();
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState<number>(TIMER_DURATION);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [hasError, setHasError] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Validate email param
  useEffect(() => {
    if (!email) {
      setAlertData({
        title: "Error",
        message: "Email not provided. Please try again.",
        onConfirm: () => {
          setAlertVisible(false);
          router.back();
        },
      });
      setAlertVisible(true);
    }
  }, [email]);

  // Timer management
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimer(TIMER_DURATION);
    setCanResend(false);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setHasError(false);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = async () => {
    try {
      // Note: React Native doesn't have native clipboard access in TextInput
      // You'd need to use expo-clipboard or @react-native-clipboard/clipboard
      // const text = await Clipboard.getStringAsync();
      // const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
      // if (digits.length === OTP_LENGTH) {
      //   setOtp(digits.split(''));
      //   inputRefs.current[OTP_LENGTH - 1]?.focus();
      // }
    } catch (error) {
      console.error("Paste error:", error);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== OTP_LENGTH) {
      setHasError(true);
      setAlertData({
        title: "Error",
        message: `Please enter a ${OTP_LENGTH}-digit OTP`,
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    if (timer <= 0) {
      setHasError(true);
      setAlertData({
        title: "OTP Expired",
        message: "Your OTP has expired. Please request a new one.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    setIsVerifying(true);
    Keyboard.dismiss();

    try {
      // TODO: Replace with actual API call
      // const response = await verifyOTP({ email, otp: otpCode });

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success
      setAlertData({
        title: "Success",
        message: "Email verified successfully!",
        onConfirm: () => {
          setAlertVisible(false);
          // Small delay before navigation to let user see success message
          setTimeout(() => {
            router.push("/create-password");
          }, 500);
        },
      });
      setAlertVisible(true);

      // Clear timer on success
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again.";
      setHasError(true);
      setAlertData({
        title: "Verification Failed",
        message: errorMessage,
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
      setAlertData({
        title: "Limit Reached",
        message:
          "You've reached the maximum number of resend attempts. Please try again later.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
      return;
    }

    setIsResending(true);
    Keyboard.dismiss();

    try {
      // TODO: Replace with actual API call
      // const response = await resendOTP({ email });

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOtp(Array(OTP_LENGTH).fill(""));
      setHasError(false);
      setResendAttempts((prev) => prev + 1);
      startTimer();

      inputRefs.current[0]?.focus();

      setAlertData({
        title: "Success",
        message: "A new OTP has been sent to your email.",
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Please try again.";
      setAlertData({
        title: "Error",
        message: errorMessage,
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    } finally {
      setIsResending(false);
    }
  };

  const setRef = useCallback(
    (index: number) => (ref: TextInput | null) => {
      inputRefs.current[index] = ref;
    },
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          Verify Your Email
        </Text>
        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
          Enter the OTP sent to {email || "your email"}
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={setRef(index)}
            style={[
              styles.otpBox,
              {
                color: colors.text,
                borderColor: hasError ? colors.error : colors.border,
                backgroundColor: colors.card,
              },
            ]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            placeholderTextColor={colors.textTertiary}
            editable={!isVerifying}
            accessibilityLabel={`OTP digit ${index + 1}`}
            accessibilityHint={`Enter digit ${index + 1} of ${OTP_LENGTH}`}
          />
        ))}
      </View>

      <Text
        style={[styles.timer, { color: colors.textSecondary }]}
        accessibilityLabel={`Time remaining ${formatTimer(timer)}`}
        accessibilityLiveRegion="polite"
      >
        Time remaining: {formatTimer(timer)}
      </Text>

      {resendAttempts > 0 && resendAttempts < MAX_RESEND_ATTEMPTS && (
        <Text style={[styles.attemptsText, { color: colors.textTertiary }]}>
          {MAX_RESEND_ATTEMPTS - resendAttempts} resend attempts remaining
        </Text>
      )}

      <Pressable
        style={[
          styles.resendButton,
          {
            backgroundColor:
              canResend && !isResending ? colors.primary : colors.border,
            opacity: isResending ? 0.7 : 1,
          },
        ]}
        onPress={handleResend}
        disabled={!canResend || isResending}
        accessibilityLabel="Resend OTP code"
        accessibilityRole="button"
        accessibilityState={{ disabled: !canResend || isResending }}
      >
        {isResending ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              { color: canResend ? colors.background : colors.textTertiary },
            ]}
          >
            Resend Code
          </Text>
        )}
      </Pressable>

      <Pressable
        style={[
          styles.verifyButton,
          {
            backgroundColor: colors.primary,
            opacity: isVerifying ? 0.7 : 1,
          },
        ]}
        onPress={handleVerify}
        disabled={isVerifying}
        accessibilityLabel="Verify OTP"
        accessibilityRole="button"
        accessibilityState={{ disabled: isVerifying }}
      >
        {isVerifying ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Verify OTP
          </Text>
        )}
      </Pressable>

      <CustomAlert
        isVisible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        onConfirm={alertData.onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "flex-start",
    marginTop: 64,
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.nunitoBold,
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    fontFamily: Fonts.nunitoRegular,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpBox: {
    width: 52,
    height: 64,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 18,
    textAlign: "center",
    fontFamily: Fonts.nunitoRegular,
  },
  timer: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Fonts.nunitoRegular,
  },
  attemptsText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: Fonts.nunitoRegular,
  },
  verifyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    minHeight: 50,
  },
  resendButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    minHeight: 50,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.nunitoBold,
  },
});
