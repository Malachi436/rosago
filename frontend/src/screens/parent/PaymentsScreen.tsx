/**
 * Payments Screen
 * Manage and make payments
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme";

export default function PaymentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.screenName}>Payments Screen</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.creamWhite,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenName: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.neutral.textPrimary,
  },
});
