'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api-client';
import { useState, useEffect } from 'react';
import { use } from 'react';

interface Route {
  id: string;
  name: string;
  schoolId: string;
  busId?: string;
  shift?: string;
  school?: {
    id: string;
    name: string;
  };
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
  stops?: any[];
  children?: any[];
  _count?: {
    children: number;
  };
}

interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  driver: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

interface School {
  id: string;
  name: string;
}

export default function RoutesPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  // Form state
  const [routeName, setRouteName] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedBusId, setSelectedBusId] = useState('');
  const [selectedShift, setSelectedShift] = useState<'MORNING' | 'AFTERNOON'>('MORNING');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRoutes();
    fetchBuses();
    fetchSchools();
  }, [companyId]);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data: any = await apiClient.get(`/admin/company/${companyId}/routes`);
      setRoutes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading routes:', err);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const data: any = await apiClient.get(`/buses/company/${companyId}`);
      setBuses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading buses:', err);
      setBuses([]);
    }
  };

  const fetchSchools = async () => {
    try {
      const data: any = await apiClient.get(`/admin/company/${companyId}/schools`);
      setSchools(Array.isArray(data) ? data : []);
      // Auto-select first school if only one exists
      if (Array.isArray(data) && data.length === 1) {
        setSelectedSchoolId(data[0].id);
      }
    } catch (err) {
      console.error('Error loading schools:', err);
      setSchools([]);
    }
  };

  const openCreateModal = () => {
    setRouteName('');
    setSelectedSchoolId(schools.length === 1 ? schools[0].id : '');
    setSelectedBusId('');
    setSelectedShift('MORNING');
    setEditingRoute(null);
    setShowCreateModal(true);
  };

  const openEditModal = (route: Route) => {
    setRouteName(route.name);
    setSelectedSchoolId(route.schoolId);
    setSelectedBusId(route.busId || '');
    setSelectedShift((route.shift as 'MORNING' | 'AFTERNOON') || 'MORNING');
    setEditingRoute(route);
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!routeName.trim()) {
      alert('Please enter route name');
      return;
    }

    if (!selectedSchoolId) {
      alert('Please select a school');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: routeName.trim(),
        busId: selectedBusId || null,
        shift: selectedShift,
        schoolId: selectedSchoolId,
      };

      if (editingRoute) {
        await apiClient.patch(`/routes/${editingRoute.id}`, payload);
        alert('✅ Route updated successfully!');
      } else {
        await apiClient.post('/routes', payload);
        alert('✅ Route created successfully!');
      }

      setShowCreateModal(false);
      fetchRoutes();
    } catch (err: any) {
      alert('❌ Error: ' + (err.response?.data?.message || 'Failed to save route'));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRoute = async (routeId: string) => {
    if (!confirm('Are you sure? Children on this route will need to be reassigned.')) {
      return;
    }

    try {
      await apiClient.delete(`/routes/${routeId}`);
      alert('✅ Route deleted successfully');
      fetchRoutes();
    } catch (err: any) {
      alert('❌ Error: ' + (err.response?.data?.message || 'Failed to delete route'));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Routes Management</h1>
            <p className="text-slate-500 mt-1">Manage bus routes and assignments</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Create Route
          </button>
        </div>



        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="font-semibold text-blue-900 mb-1">How Routes Work</p>
              <p className="text-sm text-blue-800">
                <strong>Child → Route → Bus → Driver</strong>
                <br />
                Children are assigned to routes permanently. Each route is linked to a bus, which has a driver.
                When you change a bus's driver, all children on that bus's routes automatically follow.
              </p>
            </div>
          </div>
        </div>

        {routes.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-500 text-lg mb-4">No routes created yet</p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Your First Route
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {routes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{route.name}</h3>
                      {route.shift && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            route.shift === 'MORNING'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {route.shift === 'MORNING' ? '🌅 Morning' : '🌆 Afternoon'}
                        </span>
                      )}
                    </div>

                    {route.bus ? (
                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-slate-600">
                          🚌 Bus: <strong>{route.bus.plateNumber}</strong>
                        </p>
                        {route.bus.driver && (
                          <p className="text-sm text-slate-600">
                            👨‍✈️ Driver:{' '}
                            <strong>
                              {route.bus.driver.user.firstName} {route.bus.driver.user.lastName}
                            </strong>
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-amber-600 mb-3">⚠️ No bus assigned</p>
                    )}

                    {route._count && (
                      <p className="text-sm text-slate-500">
                        👶 {route._count.children} children assigned
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(route)}
                      className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRoute(route.id)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">
                {editingRoute ? 'Edit Route' : 'Create Route'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Route Name *
                  </label>
                  <input
                    type="text"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="e.g., Morning East Route"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    School *
                  </label>
                  <select
                    value={selectedSchoolId}
                    onChange={(e) => setSelectedSchoolId(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a school...</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Assign Bus (Optional)
                  </label>
                  <select
                    value={selectedBusId}
                    onChange={(e) => setSelectedBusId(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No bus assigned</option>
                    {buses.map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.plateNumber} - {bus.driver.user.firstName} {bus.driver.user.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Shift *
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedShift('MORNING')}
                      className={`flex-1 py-3 rounded-lg font-semibold transition ${
                        selectedShift === 'MORNING'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      🌅 Morning
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedShift('AFTERNOON')}
                      className={`flex-1 py-3 rounded-lg font-semibold transition ${
                        selectedShift === 'AFTERNOON'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      🌆 Afternoon
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingRoute ? 'Update Route' : 'Create Route'}
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
