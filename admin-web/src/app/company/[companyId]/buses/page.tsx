'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api-client';

interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  driver?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
}

export default function BusesPage({
  params,
}: {
  params: { companyId: string };
}) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ plateNumber: '', capacity: 50 });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<Bus[]>('/buses');
      setBuses(data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/buses', {
        plateNumber: formData.plateNumber,
        capacity: parseInt(formData.capacity.toString()),
      });
      setFormData({ plateNumber: '', capacity: 50 });
      setShowForm(false);
      await fetchBuses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create bus');
    }
  };

  const handleDeleteBus = async (busId: string) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return;
    try {
      await apiClient.delete(`/buses/${busId}`);
      await fetchBuses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete bus');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Buses</h1>
            <p className="text-slate-500 mt-1">Manage your fleet and bus capacity</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            {showForm ? 'Cancel' : 'Add Bus'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Bus</h2>
            <form onSubmit={handleAddBus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Plate Number
                </label>
                <input
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ABC-123"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Create Bus
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading buses...</p>
          </div>
        ) : buses.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-500 mb-4">No buses registered yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Add First Bus
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus) => (
              <div key={bus.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{bus.plateNumber}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Capacity: <span className="font-semibold text-slate-900">{bus.capacity} seats</span>
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-semibold">
                    Active
                  </span>
                </div>

                {bus.driver && (
                  <div className="bg-slate-50 rounded p-3 mb-4">
                    <p className="text-xs text-slate-600">Assigned Driver</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {bus.driver.user.firstName} {bus.driver.user.lastName}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2 rounded-lg transition text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBus(bus.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-900 font-semibold py-2 rounded-lg transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
