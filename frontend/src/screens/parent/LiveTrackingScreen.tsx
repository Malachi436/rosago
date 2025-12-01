/**
 * Live Tracking Screen
 * Real-time tracking of children and bus location
 */

import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors } from "../../theme";
import { LiquidGlassCard } from "../../components/ui/LiquidGlassCard";
import { apiClient } from "../../utils/api";
import { useAuthStore } from "../../stores/authStore";
import { Child, Trip, BusLocation } from "../../types";

interface TrackingData {
  child: { id: string; name: string; colorCode: string };
  home: { latitude: number; longitude: number; address: string };
  school: { name: string; latitude: number; longitude: number; address: string };
  currentTrip: any;
  attendanceStatus: string;
}

export default function LiveTrackingScreen() {
  const { user } = useAuthStore();
  const [childrenTrackingData, setChildrenTrackingData] = useState<TrackingData[]>([]);
  const [busLocations, setBusLocations] = useState<{ [busId: string]: BusLocation }>({});
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all children and their tracking data
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch children
      const childrenResponse = await apiClient.get<Child[]>(
        `/children/parent/${user.id}`
      );
      const childrenData = Array.isArray(childrenResponse) ? childrenResponse : [];
      
      if (childrenData.length === 0) {
        setChildrenTrackingData([]);
        return;
      }

      // Fetch tracking data for all children
      const trackingDataPromises = childrenData.map(child =>
        apiClient.get<TrackingData>(`/children/${child.id}/tracking`)
          .catch(() => null)
      );
      
      const trackingResults = await Promise.all(trackingDataPromises);
      const validTrackingData = trackingResults.filter(data => data !== null) as TrackingData[];
      setChildrenTrackingData(validTrackingData);
      console.log('[LiveTracking] Fetched tracking data for children:', validTrackingData);

      // Fetch bus locations for active trips
      const busIds = validTrackingData
        .map(data => data.currentTrip?.busId)
        .filter(Boolean);
      
      if (busIds.length > 0) {
        const locationPromises = busIds.map(busId =>
          apiClient.get<BusLocation>(`/gps/location/${busId}`)
            .then(loc => ({ busId, location: loc }))
            .catch(() => null)
        );
        
        const locationResults = await Promise.all(locationPromises);
        const locationsMap: { [busId: string]: BusLocation } = {};
        locationResults.forEach(result => {
          if (result) {
            locationsMap[result.busId] = result.location as BusLocation;
          }
        });
        setBusLocations(locationsMap);
        console.log('[LiveTracking] Fetched bus locations:', locationsMap);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load tracking data';
      setError(errorMsg);
      console.error('[LiveTracking] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Poll for location updates every 5 seconds
  useEffect(() => {
    if (childrenTrackingData.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const activeTrips = childrenTrackingData.filter(data => 
          data.currentTrip && 
          ['IN_PROGRESS', 'ARRIVED_SCHOOL', 'RETURN_IN_PROGRESS'].includes(data.currentTrip.status)
        );
        
        if (activeTrips.length === 0) return;

        const locationPromises = activeTrips.map(data =>
          apiClient.get<BusLocation>(`/gps/location/${data.currentTrip.busId}`)
            .then(loc => ({ busId: data.currentTrip.busId, location: loc }))
            .catch(() => null)
        );
        
        const locationResults = await Promise.all(locationPromises);
        const updatedLocations = { ...busLocations };
        locationResults.forEach(result => {
          if (result) {
            updatedLocations[result.busId] = result.location as BusLocation;
          }
        });
        setBusLocations(updatedLocations);
      } catch (err) {
        console.log('[LiveTracking] Poll error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [childrenTrackingData]);

  const selectedChildData = childrenTrackingData[selectedChildIndex];
  const selectedChildTrip = selectedChildData?.currentTrip;
  const selectedBusLocation = selectedChildTrip ? busLocations[selectedChildTrip.busId] : null;
  const canTrack = selectedChildTrip && 
    ['IN_PROGRESS', 'ARRIVED_SCHOOL', 'RETURN_IN_PROGRESS'].includes(selectedChildTrip.status) &&
    selectedBusLocation;

  const initialRegion = selectedChildData ? {
    latitude: selectedChildData.home.latitude || 5.6037,
    longitude: selectedChildData.home.longitude || -0.187,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : {
    latitude: 5.6037,
    longitude: -0.187,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary.blue} />
      </View>
    );
  }

  if (error || childrenTrackingData.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>{error || 'No children found'}</Text>
        <Pressable onPress={fetchData}>
          <Text>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
      >
        {/* Show all children markers on map */}
        {childrenTrackingData.map((trackingData) => {
          const isSelected = trackingData.child.id === selectedChildData?.child.id;
          
          // Home marker
          if (trackingData.home.latitude && trackingData.home.longitude) {
            return (
              <Marker
                key={`home-${trackingData.child.id}`}
                coordinate={{
                  latitude: trackingData.home.latitude,
                  longitude: trackingData.home.longitude,
                }}
                title={`${trackingData.child.name}'s Home`}
                description={trackingData.home.address}
              >
                <View style={[
                  styles.homeMarker,
                  { opacity: isSelected ? 1 : 0.6 }
                ]}>
                  <Ionicons name="home" size={20} color={colors.neutral.pureWhite} />
                </View>
              </Marker>
            );
          }
        })}

        {/* School marker */}
        {selectedChildData?.school && (
          <Marker
            coordinate={{
              latitude: selectedChildData.school.latitude,
              longitude: selectedChildData.school.longitude,
            }}
            title={selectedChildData.school.name}
            description="School location"
          >
            <View style={styles.schoolMarker}>
              <Ionicons name="school" size={20} color={colors.neutral.pureWhite} />
            </View>
          </Marker>
        )}

        {/* Bus Location - Only show if trip is still active */}
        {canTrack && selectedBusLocation && (
          <Marker
            coordinate={{
              latitude: selectedBusLocation.latitude,
              longitude: selectedBusLocation.longitude,
            }}
            title="School Bus"
          >
            <View style={styles.busMarker}>
              <Ionicons name="bus" size={24} color={colors.neutral.pureWhite} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />

        {/* Child Selector */}
        {childrenTrackingData.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.childSelector}
            contentContainerStyle={styles.childSelectorContent}
          >
            {childrenTrackingData.map((trackingData, index) => (
              <Animated.View
                key={trackingData.child.id}
                entering={FadeInDown.delay(100 + index * 50).springify()}
              >
                <Pressable
                  onPress={() => setSelectedChildIndex(index)}
                  style={[
                    styles.childChip,
                    selectedChildIndex === index && styles.childChipActive,
                  ]}
                >
                  <View
                    style={[
                      styles.childChipAvatar,
                      { backgroundColor: trackingData.child.colorCode + '30' },
                      selectedChildIndex === index && { backgroundColor: trackingData.child.colorCode },
                    ]}
                  >
                    <Text
                      style={[
                        styles.childChipAvatarText,
                        { color: trackingData.child.colorCode },
                        selectedChildIndex === index && styles.childChipAvatarTextActive,
                      ]}
                    >
                      {trackingData.child.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.childChipText,
                      selectedChildIndex === index && styles.childChipTextActive,
                    ]}
                  >
                    {trackingData.child.name.split(' ')[0]}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        )}

        {/* Status Card */}
        {selectedChildData && (
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <LiquidGlassCard intensity="heavy" className="mb-4">
              <View style={styles.statusCard}>
                <View style={styles.statusHeader}>
                  <View style={styles.statusLeft}>
                    <Text style={styles.childName}>{selectedChildData.child.name}</Text>
                    <View style={styles.statusBadge}>
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor:
                              selectedChildData.attendanceStatus === "PICKED_UP"
                                ? colors.accent.successGreen
                                : selectedChildData.attendanceStatus === "DROPPED"
                                ? colors.primary.teal
                                : colors.status.warningYellow,
                          },
                        ]}
                      />
                      <Text style={styles.statusText}>
                        {selectedChildData.attendanceStatus === "PICKED_UP" ? "On the bus" :
                         selectedChildData.attendanceStatus === "DROPPED" ? "Dropped off" :
                         "Waiting for pickup"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.etaContainer}>
                    <Text style={styles.etaLabel}>Route</Text>
                    <Text style={styles.etaValue} numberOfLines={1}>{selectedChildData.currentTrip?.routeName || '--'}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.locationInfo}>
                  <Ionicons name="home" size={16} color={colors.neutral.textSecondary} />
                  <Text style={styles.addressText} numberOfLines={2}>
                    {selectedChildData.home.address || 'Home location'}
                  </Text>
                </View>
              </View>
            </LiquidGlassCard>
          </Animated.View>
        )}

        {/* Driver Info */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <LiquidGlassCard intensity="medium">
            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>
                  --
                </Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverLabel}>Driver Info</Text>
                <Text style={styles.driverName}>--</Text>
                <Text style={styles.driverPhone}>--</Text>
              </View>
              <Pressable style={styles.callButton}>
                <Ionicons name="call" size={20} color={colors.neutral.pureWhite} />
              </Pressable>
            </View>
          </LiquidGlassCard>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.creamWhite,
  },
  map: {
    flex: 1,
  },
  busMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent.sunsetOrange,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.neutral.pureWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  homeMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.teal,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.neutral.pureWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  schoolMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent.successGreen,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.neutral.pureWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.neutral.pureWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: "55%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.neutral.textSecondary + "40",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  childSelector: {
    marginBottom: 16,
  },
  childSelectorContent: {
    gap: 12,
  },
  childChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.neutral.creamWhite,
    gap: 8,
  },
  childChipActive: {
    backgroundColor: colors.primary.blue,
  },
  childChipAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  childChipAvatarActive: {
    backgroundColor: colors.neutral.pureWhite + "30",
  },
  childChipAvatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary.blue,
  },
  childChipAvatarTextActive: {
    color: colors.neutral.pureWhite,
  },
  childChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.neutral.textPrimary,
  },
  childChipTextActive: {
    color: colors.neutral.pureWhite,
  },
  statusCard: {
    padding: 16,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  statusLeft: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral.textPrimary,
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: colors.neutral.textSecondary,
  },
  etaContainer: {
    alignItems: "flex-end",
  },
  etaLabel: {
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginBottom: 2,
  },
  etaValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary.blue,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral.textSecondary + "20",
    marginVertical: 12,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral.textSecondary,
    lineHeight: 20,
  },
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.teal + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  driverAvatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary.teal,
  },
  driverInfo: {
    flex: 1,
  },
  driverLabel: {
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginBottom: 2,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.neutral.textPrimary,
    marginBottom: 2,
  },
  driverPhone: {
    fontSize: 13,
    color: colors.neutral.textSecondary,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.blue,
    alignItems: "center",
    justifyContent: "center",
  },
});
