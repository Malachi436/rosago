/**
 * Root Navigator
 * Main navigation structure for ROSAgo app
 * Routes authenticated users to Parent or Driver flows only
 */

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores/authStore";
import { apiClient } from "../utils/api";
import { colors } from "../theme";

// Import screens
import LoginScreen from "../screens/auth/LoginScreen";
import ParentSignUpScreen from "../screens/auth/ParentSignUpScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import ParentNavigator from "./ParentNavigator";
import DriverNavigator from "./DriverNavigator";
import AdminNavigator from "./AdminNavigator";

export type RootStackParamList = {
  Login: undefined;
  ParentSignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
  ParentApp: undefined;
  DriverApp: undefined;
  AdminApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isHydrated, setIsHydrated] = useState(false);

  // Set up auth failure callback
  useEffect(() => {
    apiClient.setAuthFailureCallback(() => {
      console.log('[RootNavigator] Auth failure detected - logging out');
      logout();
    });
  }, [logout]);

  // Wait for persist middleware to hydrate
  useEffect(() => {
    console.log('[RootNavigator] Hydration check - isAuthenticated:', isAuthenticated, 'role:', role, 'user:', user);
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.blue} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      {!isAuthenticated ? (
        <>
          {console.log('[RootNavigator] Rendering Login screens - isAuthenticated is false')}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ParentSignUp" component={ParentSignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      ) : (
        <>
          {console.log('[RootNavigator] Rendering App screens - isAuthenticated is true, role:', role)}
          {role === "parent" && <Stack.Screen name="ParentApp" component={ParentNavigator} />}
          {role === "driver" && <Stack.Screen name="DriverApp" component={DriverNavigator} />}
          {(role === "company_admin" || role === "platform_admin") && (
            <Stack.Screen name="AdminApp" component={AdminNavigator} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral.creamWhite,
  },
});
