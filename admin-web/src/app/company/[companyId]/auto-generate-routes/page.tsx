'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api-client';

interface School {
  id: string;
  name: string;
  address?: string;
}

interface GenerationResult {
  message: string;
  routes: Array<{
    route: {
      id: string;
      name: string;
      stops: Array<{
        id: string;
        name: string;
        order: number;
      }>;
    };
    childrenCount: number;
  }>;
  summary: {
    totalChildren: number;
    routesCreated: number;
    avgChildrenPerRoute: number;
    busCapacityUsed: number;
  };
}

export default function AutoGenerateRoutesPage({
  params,
}: {
  params: { companyId: string };
}) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
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

  const handleGenerate = async (schoolId: string, schoolName: string) => {
    if (!window.confirm(`Generate routes for ${schoolName}? This will cluster children and create new routes.`)) {
      return;
    }

    try {
      setGenerating(true);
      const data = await apiClient.post<GenerationResult>(`/routes/auto-generate/${schoolId}`);
      setResult(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate routes');
      setResult(null);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Auto Generate Routes</h1>
          <p className="text-slate-500 mt-1">
            Automatically create routes based on children pickup locations and bus capacity
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-green-900 mb-4">Generation Results</h2>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded p-4 border border-green-200">
                <p className="text-slate-600 text-sm">Total Children</p>
                <p className="text-2xl font-bold text-slate-900">{result.summary.totalChildren}</p>
              </div>
              <div className="bg-white rounded p-4 border border-green-200">
                <p className="text-slate-600 text-sm">Routes Created</p>
                <p className="text-2xl font-bold text-slate-900">{result.summary.routesCreated}</p>
              </div>
              <div className="bg-white rounded p-4 border border-green-200">
                <p className="text-slate-600 text-sm">Avg per Route</p>
                <p className="text-2xl font-bold text-slate-900">{result.summary.avgChildrenPerRoute}</p>
              </div>
              <div className="bg-white rounded p-4 border border-green-200">
                <p className="text-slate-600 text-sm">Bus Capacity</p>
                <p className="text-2xl font-bold text-slate-900">{result.summary.busCapacityUsed}</p>
              </div>
            </div>

            <div className="space-y-3">
              {result.routes.map((routeData, idx) => (
                <div key={routeData.route.id} className="bg-white rounded p-4 border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900">{routeData.route.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {routeData.childrenCount} children • {routeData.route.stops.length} stops
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold">
                      New Route
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setResult(null)}
              className="mt-6 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold px-6 py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading schools...</p>
          </div>
        ) : schools.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-500">No schools available for route generation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schools.map((school) => (
              <div
                key={school.id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg text-slate-900">{school.name}</h3>
                {school.address && (
                  <p className="text-sm text-slate-500 mt-2">{school.address}</p>
                )}
                <button
                  onClick={() => handleGenerate(school.id, school.name)}
                  disabled={generating}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition"
                >
                  {generating ? 'Generating...' : 'Generate Routes'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
