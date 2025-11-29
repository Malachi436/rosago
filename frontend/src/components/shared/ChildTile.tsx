/**
 * ChildTile Component
 * Display child information with initials and status
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Child } from "../../types/models";
import { colors } from "../../theme";
import { LiquidGlassCard } from "../ui/LiquidGlassCard";

interface ChildTileProps {
  child: Child;
  onPress?: () => void;
  showStatus?: boolean;
}

export function ChildTile({ child, onPress, showStatus = true }: ChildTileProps) {
  const statusConfig = {
    waiting: { icon: "time-outline", color: colors.status.warningYellow, label: "Waiting" },
    picked_up: { icon: "checkmark-circle", color: colors.accent.successGreen, label: "Picked Up" },
    on_way: { icon: "car-outline", color: colors.status.infoBlue, label: "On the way" },
    arrived: { icon: "location", color: colors.accent.plantainGreen, label: "Arrived" },
    dropped_off: { icon: "checkmark-done-circle", color: colors.accent.successGreen, label: "Dropped Off" },
  };

  const status = statusConfig[child.status];

  // Get initials from child name
  const initials = child.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <LiquidGlassCard className="mb-3">
        <View style={styles.container}>
          {/* Avatar with Initials */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{child.name}</Text>
            <Text style={styles.pickupType}>
              {child.pickupType === "home" ? "Home Pickup" : "Roadside Pickup"}
            </Text>
            {child.pickupLocation.address && (
              <Text style={styles.address} numberOfLines={1}>
                {child.pickupLocation.address}
              </Text>
            )}
          </View>

          {/* Status */}
          {showStatus && (
            <View style={styles.statusContainer}>
              <Ionicons name={status.icon as any} size={24} color={status.color} />
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          )}
        </View>
      </LiquidGlassCard>
    </Pressable>
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.blue + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary.blue,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.neutral.textPrimary,
    marginBottom: 2,
  },
  pickupType: {
    fontSize: 13,
    color: colors.neutral.textSecondary,
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    color: colors.neutral.textSecondary,
  },
  statusContainer: {
    alignItems: "center",
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
});
