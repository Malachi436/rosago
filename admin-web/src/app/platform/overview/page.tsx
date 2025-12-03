'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function PlatformOverviewPage() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Companies',
      description: 'Manage all registered companies and their admins',
      href: '/platform/companies',
      color: 'bg-blue-50 border-blue-200',
      icon: '🏢',
    },
    {
      title: 'Schools',
      description: 'View and manage all schools across companies',
      href: '/platform/schools',
      color: 'bg-teal-50 border-teal-200',
      icon: '🎓',
    },
    {
      title: 'Analytics',
      description: 'System-wide analytics and reporting',
      href: '/platform/analytics',
      color: 'bg-green-50 border-green-200',
      icon: '📊',
    },
    {
      title: 'Users',
      description: 'Manage platform admins and company admins',
      href: '/platform/users',
      color: 'bg-orange-50 border-orange-200',
      icon: '👥',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Platform Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome, {user?.firstName}! Manage the entire ROSAgo platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div
                className={`${action.color} border rounded-lg p-6 hover:shadow-lg transition cursor-pointer`}
              >
                <div className="text-4xl mb-3">{action.icon}</div>
                <h3 className="font-bold text-lg text-slate-900">{action.title}</h3>
                <p className="text-slate-600 text-sm mt-2">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">System Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-slate-600 text-sm">Total Companies</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">–</p>
            </div>
            <div className="border-l-4 border-teal-600 pl-4">
              <p className="text-slate-600 text-sm">Total Schools</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">–</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-slate-600 text-sm">Active Routes</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">–</p>
            </div>
            <div className="border-l-4 border-orange-600 pl-4">
              <p className="text-slate-600 text-sm">Registered Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">–</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
