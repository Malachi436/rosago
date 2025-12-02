import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { colors } from '../../theme/colors';

interface ScheduledRoute {
  id: string;
  scheduledTime: string;
  recurringDays: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  autoAssignChildren: boolean;
  route: {
    name: string;
    school: { name: string };
  };
  driver: {
    user: { firstName: string; lastName: string };
  };
  bus: {
    plateNumber: string;
  };
}

export default function ScheduledRoutesScreen() {
  const [routes, setRoutes] = useState<ScheduledRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScheduledRoutes();
  }, []);

  const fetchScheduledRoutes = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/scheduled-routes');
      setRoutes(response);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load scheduled routes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const endpoint = currentStatus === 'ACTIVE' ? 'suspend' : 'activate';
      await apiClient.put(`/scheduled-routes/${id}/${endpoint}`, {});
      Alert.alert('Success', `Route ${endpoint}d successfully`);
      fetchScheduledRoutes();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update route');
    }
  };

  const handleGenerateToday = async () => {
    Alert.alert(
      'Generate Trips',
      'This will create trips for all active scheduled routes today. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            try {
              await apiClient.post('/trips/generate-today', {});
              Alert.alert('Success', 'Trips generated successfully for today!');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to generate trips');
            }
          },
        },
      ],
    );
  };

  const renderDay = (day: string) => {
    const dayShort = day.substring(0, 3);
    return (
      <View key={day} style={styles.dayBadge}>
        <Text style={styles.dayText}>{dayShort}</Text>
      </View>
    );
  };

  const renderRoute = ({ item }: { item: ScheduledRoute }) => (
    <View style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{item.route.name}</Text>
          <Text style={styles.schoolName}>{item.route.school.name}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.routeDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>Departs: {item.scheduledTime}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>
            {item.driver.user.firstName} {item.driver.user.lastName}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="bus-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>{item.bus.plateNumber}</Text>
        </View>

        <View style={styles.daysContainer}>
          <Text style={styles.daysLabel}>Recurring Days:</Text>
          <View style={styles.daysRow}>{item.recurringDays.map(renderDay)}</View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name={item.autoAssignChildren ? 'checkmark-circle' : 'close-circle'}
            size={16}
            color={item.autoAssignChildren ? colors.status.success : colors.text.secondary}
          />
          <Text style={styles.detailText}>
            {item.autoAssignChildren ? 'Auto-assign enabled' : 'Manual assignment'}
          </Text>
        </View>
      </View>

      <View style={styles.routeActions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => handleToggleStatus(item.id, item.status)}
        >
          <Text style={styles.actionButtonText}>
            {item.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scheduled Routes</Text>
        <Pressable style={styles.generateButton} onPress={handleGenerateToday}>
          <Ionicons name="add-circle" size={20} color={colors.white} />
          <Text style={styles.generateButtonText}>Generate Today</Text>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={styles.infoText}>
          Trips are auto-generated daily at midnight. Use "Generate Today" to manually create trips.
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading scheduled routes...</Text>
        </View>
      ) : routes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color={colors.text.secondary} />
          <Text style={styles.emptyText}>No scheduled routes yet</Text>
          <Text style={styles.emptySubtext}>Create recurring routes to automate trip generation</Text>
        </View>
      ) : (
        <FlatList
          data={routes}
          renderItem={renderRoute}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  generateButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    margin: 16,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  routeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  schoolName: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: colors.status.successLight,
  },
  statusInactive: {
    backgroundColor: colors.background.secondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  routeDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  daysContainer: {
    marginTop: 4,
  },
  daysLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  dayBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dayText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  routeActions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    backgroundColor: colors.background.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
