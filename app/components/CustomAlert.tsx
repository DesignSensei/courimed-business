// app/components/CustomAlert.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import Modal from "react-native-modal";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";

interface CustomAlertProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isVisible,
  title,
  message,
  onConfirm,
}) => {
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onConfirm}
      onBackButtonPress={onConfirm}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}
    >
      <View style={[styles.alertContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: colors.primary }]}
            onPress={onConfirm}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.nunitoBold,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.nunitoRegular,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.nunitoBold,
  },
});

export default CustomAlert;
