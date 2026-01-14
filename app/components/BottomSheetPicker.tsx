// @components/BottomSheetPicker.tsx

import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
  TextStyle,
  useColorScheme,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";

interface BottomSheetPickerProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  valueStyle?: TextStyle;
}

export default function BottomSheetPicker({
  label,
  value,
  options,
  onSelect,
  placeholder = `Select ${label.toLowerCase()}...`,
  required = false,
  disabled = false,
  valueStyle = {},
}: BottomSheetPickerProps) {
  const [visible, setVisible] = useState(false);
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  const handleSelect = (selected: string) => {
    onSelect(selected);
    setVisible(false);
  };

  return (
    <>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && (
          <Text style={[styles.requiredAsterisk, { color: colors.error }]}>
            {" "}
            *
          </Text>
        )}
      </Text>

      <TouchableOpacity
        style={[
          styles.dropdownButton,
          {
            backgroundColor: disabled ? colors.card : colors.card,
            borderColor: disabled ? colors.border : colors.border,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
        onPress={() => !disabled && setVisible(true)}
        disabled={disabled}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityHint="Opens selection menu"
      >
        <Text
          style={[
            styles.dropdownText,
            { color: value ? colors.text : colors.textTertiary },
            valueStyle,
          ]}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType={Platform.OS === "ios" ? "slide" : "fade"}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.4)" }]}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={[styles.bottomSheet, { backgroundColor: colors.background }]}
            onPress={() => {}}
          >
            <View style={styles.header}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>
                Select {label}
              </Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, { borderBottomColor: colors.border }]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontFamily: Fonts.nunitoSemiBold,
    marginBottom: 8,
  },
  requiredAsterisk: {
    fontSize: 14,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: Fonts.nunitoRegular,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20, // safe area
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // will be replaced with colors.border
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: Fonts.nunitoBold,
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontFamily: Fonts.nunitoRegular,
  },
});
