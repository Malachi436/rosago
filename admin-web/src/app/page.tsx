'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user) {
        const role = user.role?.toUpperCase();
        if (role === 'PLATFORM_ADMIN') {
          router.push('/platform/overview');
        } else if (role === 'COMPANY_ADMIN') {
          router.push(`/company/${user.companyId}/overview`);
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}
