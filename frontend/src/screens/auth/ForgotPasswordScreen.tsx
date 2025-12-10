/**
 * Forgot Password Screen
 * Allows users to request a password reset email
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { LargeCTAButton } from "../../components/ui/LargeCTAButton";
import { LiquidGlassCard } from "../../components/ui/LiquidGlassCard";
import { colors } from "../../theme";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { apiClient } from "../../utils/api";

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post("/auth/forgot-password", { email: email.trim() });
      setIsSuccess(true);
    } catch (error: any) {
      // Always show success message for security (don't reveal if email exists)
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.primary.blue, colors.primary.teal]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>ROSAgo</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <LiquidGlassCard intensity="heavy">
                <View style={styles.successContainer}>
                  <View style={styles.successIcon}>
                    <Ionicons name="mail-open" size={48} color={colors.accent.successGreen} />
                  </View>
                  <Text style={styles.successTitle}>Check Your Email</Text>
                  <Text style={styles.successText}>
                    If an account exists with {email}, you'll receive a password reset link shortly.
                  </Text>
                  <Text style={styles.successNote}>
                    Don't forget to check your spam folder!
                  </Text>
                  <LargeCTAButton
                    title="Back to Login"
                    onPress={() => navigation.navigate("Login")}
                    variant="primary"
                    style={styles.backButton}
                  />
                </View>
              </LiquidGlassCard>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.blue, colors.primary.teal]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>ROSAgo</Text>
            </View>
            <Text style={styles.subtitle}>Premium School Transport</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <LiquidGlassCard intensity="heavy">
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Forgot Password?</Text>
                <Text style={styles.formSubtitle}>
                  Enter your email address and we'll send you a link to reset your password.
                </Text>

                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail"
                      size={20}
                      color={colors.neutral.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="your.email@example.com"
                      placeholderTextColor={colors.neutral.textSecondary + "80"}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Submit Button */}
                <LargeCTAButton
                  title={isLoading ? "Sending..." : "Send Reset Link"}
                  onPress={handleSubmit}
                  variant="primary"
                  disabled={isLoading}
                  style={styles.submitButton}
                />

                {/* Back to Login */}
                <LargeCTAButton
                  title="Back to Login"
                  onPress={() => navigation.navigate("Login")}
                  variant="secondary"
                  style={styles.backButton}
                />
              </View>
            </LiquidGlassCard>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "700",
    color: colors.neutral.pureWhite,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral.creamWhite,
    fontWeight: "500",
  },
  formContainer: {
    padding: 20,
    gap: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.neutral.textPrimary,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.neutral.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.neutral.textPrimary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral.pureWhite,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.neutral.textSecondary + "30",
    overflow: "hidden",
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.neutral.textPrimary,
  },
  submitButton: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 4,
  },
  successContainer: {
    padding: 24,
    alignItems: "center",
    gap: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent.successGreen + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.neutral.textPrimary,
  },
  successText: {
    fontSize: 14,
    color: colors.neutral.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  successNote: {
    fontSize: 13,
    color: colors.neutral.textSecondary,
    fontStyle: "italic",
  },
});
