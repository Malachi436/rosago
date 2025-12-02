/**
 * Admin Navigator
 * Navigation structure for admin users (COMPANY_ADMIN and PLATFORM_ADMIN)
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

// Import screens
import ScheduledRoutesScreen from "../screens/admin/ScheduledRoutesScreen";
import AutoGenerateRoutesScreen from "../screens/admin/AutoGenerateRoutesScreen";

export type AdminTabParamList = {
  ScheduledRoutes: undefined;
  AutoGenerate: undefined;
};

export type AdminStackParamList = {
  Main: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary.blue,
        tabBarInactiveTintColor: colors.neutral.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.neutral.pureWhite,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 88,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ScheduledRoutes"
        component={ScheduledRoutesScreen}
        options={{
          tabBarLabel: "Scheduled Routes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AutoGenerate"
        component={AutoGenerateRoutesScreen}
        options={{
          tabBarLabel: "Auto Generate",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="git-network" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.neutral.pureWhite,
        },
        headerTintColor: colors.neutral.textPrimary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Main"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
