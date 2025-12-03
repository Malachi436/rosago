'use client';

import { DashboardLayout } from '@/components/DashboardLayout';

export default function PlatformAnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Platform Analytics</h1>
          <p className="text-slate-500 mt-1">System-wide performance and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-600 mb-2">Total Routes</p>
            <p className="text-slate-400 text-sm">Coming soon</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-600 mb-2">Active Trips</p>
            <p className="text-slate-400 text-sm">Coming soon</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-600 mb-2">System Health</p>
            <p className="text-slate-400 text-sm">Coming soon</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-600 mb-2">User Activity</p>
            <p className="text-slate-400 text-sm">Coming soon</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
