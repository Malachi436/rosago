/**
 * Request Location Change Screen
 * Parents can request to change pickup/dropoff location for their children
 */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

import { colors } from "../../theme";
import { LiquidGlassCard } from "../../components/ui/LiquidGlassCard";
import { LargeCTAButton } from "../../components/ui/LargeCTAButton";
import { apiClient } from "../../utils/api";
import { useAuthStore } from "../../stores/authStore";

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  homeLatitude?: number;
  homeLongitude?: number;
  homeAddress?: string;
}

export default function RequestLocationChangeScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [newLatitude, setNewLatitude] = useState<number | null>(null);
  const [newLongitude, setNewLongitude] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoadingChildren(true);
      const data: any = await apiClient.get(`/children/parent/${user?.id}`);
      setChildren(Array.isArray(data) ? data : []);
      if (data.length > 0) {
        setSelectedChildId(data[0].id);
      }
    } catch (err) {
      console.error('Error loading children:', err);
      Alert.alert('Error', 'Failed to load your children');
    } finally {
      setLoadingChildren(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setGettingLocation(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setNewLatitude(location.coords.latitude);
      setNewLongitude(location.coords.longitude);

      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses[0]) {
        const addr = addresses[0];
        const formattedAddress = `${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim();
        setNewAddress(formattedAddress);
      }

      Alert.alert('Success', 'Location captured successfully!');
    } catch (err) {
      console.error('Error getting location:', err);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setGettingLocation(false);
    }
  };

  const submitRequest = async () => {
    if (!selectedChildId) {
      Alert.alert('Error', 'Please select a child');
      return;
    }

    if (!newLatitude || !newLongitude) {
      Alert.alert('Error', 'Please set the new location using GPS');
      return;
    }

    if (!newAddress.trim()) {
      Alert.alert('Error', 'Please enter the new address');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for the location change');
      return;
    }

    try {
      setLoading(true);
      
      await apiClient.post('/children/location-change/request', {
        childId: selectedChildId,
        newLatitude,
        newLongitude,
        newAddress: newAddress.trim(),
        reason: reason.trim(),
      });

      Alert.alert(
        'Request Submitted',
        'Your location change request has been submitted. The school admin will review it shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const selectedChild = children.find(c => c.id === selectedChildId);

  if (loadingChildren) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.blue} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Request Location Change</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {children.length === 0 ? (
          <LiquidGlassCard style={styles.card}>
            <Text style={styles.emptyText}>No children linked to your account</Text>
          </LiquidGlassCard>
        ) : (
          <>
            {/* Select Child */}
            <LiquidGlassCard style={styles.card}>
              <Text style={styles.cardTitle}>Select Child</Text>
              <View style={styles.childrenList}>
                {children.map((child) => (
                  <Pressable
                    key={child.id}
                    style={[
                      styles.childCard,
                      selectedChildId === child.id && styles.childCardSelected,
                    ]}
                    onPress={() => setSelectedChildId(child.id)}
                  >
                    <View style={styles.radioOuter}>
                      {selectedChildId === child.id && <View style={styles.radioInner} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.childName}>
                        {child.firstName} {child.lastName}
                      </Text>
                      {child.homeAddress && (
                        <Text style={styles.currentLocation}>📍 {child.homeAddress}</Text>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </LiquidGlassCard>

            {/* New Location */}
            <LiquidGlassCard style={styles.card}>
              <Text style={styles.cardTitle}>New Location</Text>
              
              <Pressable
                style={styles.gpsButton}
                onPress={getCurrentLocation}
                disabled={gettingLocation}
              >
                <Ionicons name="location" size={24} color="#fff" />
                <Text style={styles.gpsButtonText}>
                  {gettingLocation ? 'Getting Location...' : 'Use Current Location (GPS)'}
                </Text>
              </Pressable>

              {(newLatitude && newLongitude) && (
                <View style={styles.locationPreview}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.accent.successGreen} />
                  <Text style={styles.locationText}>
                    📍 {newLatitude.toFixed(6)}, {newLongitude.toFixed(6)}
                  </Text>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>New Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter the new pickup/dropoff address"
                  value={newAddress}
                  onChangeText={setNewAddress}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Reason for Change *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Explain why you need to change the location..."
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </LiquidGlassCard>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color={colors.primary.blue} />
              <Text style={styles.infoText}>
                Your request will be reviewed by the school admin. You will be notified once it's approved or rejected.
              </Text>
            </View>

            {/* Submit Button */}
            <LargeCTAButton
              title={loading ? 'Submitting...' : 'Submit Request'}
              onPress={submitRequest}
              disabled={loading || !newLatitude || !newLongitude}
              variant="primary"
              style={styles.submitButton}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.creamWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral.textPrimary,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
  },
  childrenList: {
    gap: 12,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    gap: 12,
  },
  childCardSelected: {
    borderColor: colors.primary.blue,
    backgroundColor: '#E3F2FD',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.blue,
  },
  childName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral.textPrimary,
    marginBottom: 4,
  },
  currentLocation: {
    fontSize: 13,
    color: colors.neutral.textSecondary,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.blue,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  gpsButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  locationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 13,
    color: colors.neutral.textPrimary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.neutral.textPrimary,
    textAlignVertical: 'top',
  },
  textArea: {
    minHeight: 100,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    gap: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.neutral.textPrimary,
    lineHeight: 18,
  },
  submitButton: {
    marginBottom: 20,
  },
});
