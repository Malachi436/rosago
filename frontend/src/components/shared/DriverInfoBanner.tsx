/**
 * DriverInfoBanner Component
 * Display driver information with avatar and contact
 */

import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Driver } from "../../types/models";
import { colors } from "../../theme";
import { LiquidGlassCard } from "../ui/LiquidGlassCard";
import * as Haptics from "expo-haptics";

interface DriverInfoBannerProps {
  driver: Driver;
  busPlateNumber?: string;
}

export function DriverInfoBanner({ driver, busPlateNumber }: DriverInfoBannerProps) {
  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement phone call functionality
  };

  return (
    <LiquidGlassCard>
      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {driver.avatar ? (
            <Image source={{ uri: driver.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={32} color={colors.neutral.textSecondary} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Your Driver</Text>
          <Text style={styles.name}>{driver.name}</Text>
          {busPlateNumber && <Text style={styles.busNumber}>Bus: {busPlateNumber}</Text>}
        </View>

        {/* Call button */}
        <Pressable onPress={handleCall} style={styles.callButton}>
          <Ionicons name="call" size={20} color={colors.neutral.pureWhite} />
        </Pressable>
      </View>
    </LiquidGlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    backgroundColor: colors.neutral.creamWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.neutral.textPrimary,
    marginBottom: 2,
  },
  busNumber: {
    fontSize: 13,
    color: colors.neutral.textSecondary,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent.successGreen,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
