/**
 * ETAChip Component
 * Display estimated time of arrival in a compact chip
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";

interface ETAChipProps {
  minutes: number;
  variant?: "default" | "warning" | "success";
}

export function ETAChip({ minutes, variant = "default" }: ETAChipProps) {
  const variantConfig = {
    default: { bg: colors.status.infoBlue, text: colors.neutral.pureWhite },
    warning: { bg: colors.status.warningYellow, text: colors.neutral.textPrimary },
    success: { bg: colors.accent.successGreen, text: colors.neutral.pureWhite },
  };

  const config = variantConfig[variant];

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      <Ionicons name="time-outline" size={16} color={config.text} />
      <Text style={[styles.text, { color: config.text }]}>{minutes} min</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
