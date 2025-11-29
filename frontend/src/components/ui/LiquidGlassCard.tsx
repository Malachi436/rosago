/**
 * LiquidGlassCard Component
 * Premium glassmorphism card with blur, overlay, and soft shadows
 */

import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "../../utils/cn";
import { colors, shadows } from "../../theme";

interface LiquidGlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: "light" | "medium" | "heavy";
  className?: string;
}

export function LiquidGlassCard({
  children,
  intensity = "medium",
  className,
  style,
  ...props
}: LiquidGlassCardProps) {
  const overlayOpacity = {
    light: 0.2,
    medium: 0.25,
    heavy: 0.35,
  }[intensity];

  return (
    <View
      className={cn("rounded-2xl overflow-hidden", className)}
      style={[styles.container, style]}
      {...props}
    >
      {/* Blur background */}
      <BlurView intensity={15} style={StyleSheet.absoluteFill} />

      {/* White overlay */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})` },
        ]}
      />

      {/* Gradient stroke highlight */}
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...shadows.md,
  },
  gradientBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  content: {
    padding: 16,
    position: "relative",
    zIndex: 1,
  },
});
