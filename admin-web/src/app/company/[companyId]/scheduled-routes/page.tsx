'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api-client';
import { useState, useEffect } from 'react';
import { use } from 'react';

interface ScheduledRoute {
  id: string;
  routeId: string;
  driverId: string;
  busId: string;
  scheduledTime: string;
  recurringDays: string[];
  status: string;
  route: {
    id: string;
    name: string;
    school?: {
      name: string;
    };
  };
  driver: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  bus: {
    id: string;
    plateNumber: string;
  };
}

interface Route {
  id: string;
  name: string;
  busId?: string;
  shift?: string;
  bus?: {
    id: string;
    plateNumber: string;
    driver?: {
      id: string;
      user: {
        firstName: string;
        lastName: string;
      };
    };
  };
}

interface Driver {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface Bus {
  id: string;
  plateNumber: string;
  driver?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function ScheduledRoutesPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const [routes, setRoutes] = useState<ScheduledRoute[]>([]);
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedBusId, setSelectedBusId] = useState('');
  const [scheduledTime, setScheduledTime] = useState('07:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);

  useEffect(() => {
    fetchScheduledRoutes();
    fetchAvailableRoutes();
    fetchBuses();
    fetchDrivers();
  }, [companyId]);

  const fetchScheduledRoutes = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<ScheduledRoute[]>(`/scheduled-routes/company/${companyId}`);
      setRoutes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load scheduled routes');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRoutes = async () => {
    try {
      const data: any = await apiClient.get(`/admin/company/${companyId}/routes`);
      setAvailableRoutes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading routes:', err);
    }
  };

  const fetchBuses = async () => {
    try {
      const data: any = await apiClient.get(`/buses/company/${companyId}`);
      setBuses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading buses:', err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const data: any = await apiClient.get(`/admin/company/${companyId}/drivers`);
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading drivers:', err);
    }
  };

  const handleToggleStatus = async (routeId: string, currentStatus: string) => {
    const endpoint =
      currentStatus === 'ACTIVE'
        ? `/scheduled-routes/${routeId}/suspend`
        : `/scheduled-routes/${routeId}/activate`;

    try {
      await apiClient.put(endpoint, {});
      await fetchScheduledRoutes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleGenerateTodayTrips = async () => {
    try {
      const result = await apiClient.post('/trips/generate-today', {});
      alert(`Success! Generated trips for today`);
      await fetchScheduledRoutes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate trips');
    }
  };

  const handleCreateScheduledRoute = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRouteId || !selectedDriverId || !selectedBusId) {
      alert('Please select route, driver, and bus');
      return;
    }

    if (selectedDays.length === 0) {
      alert('Please select at least one day');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        routeId: selectedRouteId,
        driverId: selectedDriverId,
        busId: selectedBusId,
        scheduledTime,
        recurringDays: selectedDays,
        status: 'ACTIVE',
        autoAssignChildren: true,
      };

      await apiClient.post('/scheduled-routes', payload);
      alert('✅ Scheduled route created successfully!');
      setShowCreateModal(false);
      fetchScheduledRoutes();
    } catch (err: any) {
      alert('❌ Error: ' + (err.response?.data?.message || 'Failed to create scheduled route'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Scheduled Routes</h1>
            <p className="text-slate-500 mt-1">Manage recurring routes and generate daily trips</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-semibold"
            >
              + Create Scheduled Route
            </button>
            <button
              onClick={handleGenerateTodayTrips}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              📅 Generate Today's Trips
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        {routes.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-500">No scheduled routes yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Route Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Driver</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Bus</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Days</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {route.route.name}
                      {route.route.school && (
                        <span className="block text-xs text-slate-500 mt-1">
                          {route.route.school.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {route.driver.user.firstName} {route.driver.user.lastName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{route.bus.plateNumber}</td>
                    <td className="px-6 py-4 text-slate-600">{route.scheduledTime}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {route.recurringDays.map(day => day.substring(0, 3)).join(', ')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          route.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {route.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(route.id, route.status)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition ${
                          route.status === 'ACTIVE'
                            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                            : 'bg-green-100 hover:bg-green-200 text-green-800'
                        }`}
                      >
                        {route.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Scheduled Route Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Create Scheduled Route</h2>

              <form onSubmit={handleCreateScheduledRoute}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Route *
                  </label>
                  <select
                    value={selectedRouteId}
                    onChange={(e) => setSelectedRouteId(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a route...</option>
                    {availableRoutes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.name} {route.shift ? `(${route.shift})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Assign Driver *
                  </label>
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a driver...</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.user.firstName} {driver.user.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Assign Bus *
                  </label>
                  <select
                    value={selectedBusId}
                    onChange={(e) => setSelectedBusId(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a bus...</option>
                    {buses.map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.plateNumber}
                        {bus.driver && ` - ${bus.driver.user.firstName} ${bus.driver.user.lastName}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Scheduled Time *
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Recurring Days *
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 px-1 text-xs font-semibold rounded-lg transition ${
                          selectedDays.includes(day)
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Selected: {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-slate-100 text-slate-700 px-4 py-3 rounded-lg font-semibold hover:bg-slate-200 transition"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create Scheduled Route'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
