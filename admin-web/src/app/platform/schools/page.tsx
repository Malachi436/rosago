'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api-client';

interface School {
  id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  company: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<School[]>('/schools');
      setSchools(data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Schools</h1>
            <p className="text-slate-500 mt-1">View all schools across all companies</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading schools...</p>
          </div>
        ) : schools.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-500">No schools found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-900">School Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-900">Company</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-900">Address</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-900">Location</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-900">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {schools.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{school.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded font-semibold">
                        {school.company.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-sm">{school.address || '–'}</td>
                    <td className="px-6 py-4 text-slate-700 text-sm">
                      {school.latitude && school.longitude
                        ? `${school.latitude.toFixed(4)}, ${school.longitude.toFixed(4)}`
                        : '–'}
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-sm">
                      {new Date(school.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
