import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from './src/stores/authStore';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme';
import './global.css';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for Zustand persist to fully hydrate from AsyncStorage
    const checkHydration = () => {
      setIsReady(true);
    };

    // Small delay to allow AsyncStorage to load
    const timer = setTimeout(checkHydration, 200);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.neutral.creamWhite }}>
        <ActivityIndicator size="large" color={colors.primary.blue} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
