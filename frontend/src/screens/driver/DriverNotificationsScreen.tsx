/**
 * Driver Notifications Screen with Acknowledgment
 * Shows notifications requiring driver acknowledgment (unskip requests, skip requests, etc.)
 */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors } from "../../theme";
import { LiquidGlassCard } from "../../components/ui/LiquidGlassCard";
import { useAuthStore } from "../../stores/authStore";
import { apiClient } from "../../utils/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  requiresAck: boolean;
  acknowledgedAt: string | null;
  createdAt: string;
  metadata?: any;
}

export default function DriverNotificationsScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unacknowledged'>('unacknowledged');

  useEffect(() => {
    fetchNotifications();
  }, [user?.id, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      let data;
      if (filter === 'unacknowledged') {
        data = await apiClient.get(`/notifications/user/${user?.id}/unacknowledged`);
      } else {
        data = await apiClient.get(`/notifications/user/${user?.id}`);
      }
      
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error loading notifications:', err);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const acknowledgeNotification = async (notificationId: string) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/acknowledge`, {});
      Alert.alert('Success', 'Notification acknowledged');
      fetchNotifications();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to acknowledge notification');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'UNSKIP_REQUEST':
        return '🚨';
      case 'SKIP_REQUEST':
        return '⏭️';
      case 'PARENT_PICKUP':
        return '👨‍👩‍👧';
      case 'LOCATION_CHANGE_REQUEST':
        return '📍';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'UNSKIP_REQUEST':
        return '#ef4444'; // red
      case 'SKIP_REQUEST':
        return '#f59e0b'; // amber
      case 'PARENT_PICKUP':
        return '#3b82f6'; // blue
      default:
        return '#64748b'; // slate
    }
  };

  const filteredNotifications = notifications;

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2A7FF4" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1D1D1F" />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterTab, filter === 'unacknowledged' && styles.filterTabActive]}
          onPress={() => setFilter('unacknowledged')}
        >
          <Text style={[styles.filterText, filter === 'unacknowledged' && styles.filterTextActive]}>
            Requires Action
          </Text>
          {notifications.filter(n => !n.acknowledgedAt && n.requiresAck).length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notifications.filter(n => !n.acknowledgedAt && n.requiresAck).length}
              </Text>
            </View>
          )}
        </Pressable>
        
        <Pressable
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </Pressable>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredNotifications.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No notifications</Text>
          </Animated.View>
        ) : (
          filteredNotifications.map((notification, index) => (
            <Animated.View key={notification.id} entering={FadeInDown.delay(index * 50)}>
              <LiquidGlassCard style={styles.notificationCard}>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationTitleRow}>
                    <Text style={styles.notificationIcon}>{getNotificationIcon(notification.type)}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationTime}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </Text>
                    </View>
                    {notification.requiresAck && !notification.acknowledgedAt && (
                      <View style={[styles.urgentBadge, { backgroundColor: getNotificationColor(notification.type) }]}>
                        <Text style={styles.urgentText}>ACTION REQUIRED</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.notificationMessage}>{notification.message}</Text>

                {/* Metadata */}
                {notification.metadata && (
                  <View style={styles.metadataContainer}>
                    {notification.metadata.childName && (
                      <Text style={styles.metadataText}>👶 {notification.metadata.childName}</Text>
                    )}
                    {notification.metadata.parentPhone && (
                      <Text style={styles.metadataText}>📞 {notification.metadata.parentPhone}</Text>
                    )}
                    {notification.metadata.pickupAddress && (
                      <Text style={styles.metadataText}>📍 {notification.metadata.pickupAddress}</Text>
                    )}
                  </View>
                )}

                {/* Acknowledge Button */}
                {notification.requiresAck && !notification.acknowledgedAt && (
                  <Pressable
                    style={styles.ackButton}
                    onPress={() => acknowledgeNotification(notification.id)}
                  >
                    <Text style={styles.ackButtonText}>✓ Acknowledge</Text>
                  </Pressable>
                )}

                {notification.acknowledgedAt && (
                  <View style={styles.acknowledgedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#23C552" />
                    <Text style={styles.acknowledgedText}>
                      Acknowledged {new Date(notification.acknowledgedAt).toLocaleString()}
                    </Text>
                  </View>
                )}
              </LiquidGlassCard>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: '#2A7FF4',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.neutral.textSecondary,
  },
  notificationCard: {
    padding: 16,
    marginBottom: 12,
  },
  notificationHeader: {
    marginBottom: 12,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6E6E6E',
  },
  urgentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#1D1D1F',
    lineHeight: 20,
    marginBottom: 12,
  },
  metadataContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  metadataText: {
    fontSize: 13,
    color: '#1D1D1F',
  },
  ackButton: {
    backgroundColor: '#2A7FF4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ackButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  acknowledgedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  acknowledgedText: {
    fontSize: 12,
    color: '#23C552',
    fontWeight: '600',
  },
});
