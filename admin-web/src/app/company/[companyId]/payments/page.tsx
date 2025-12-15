'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api-client';
import { useState, useEffect } from 'react';
import { use } from 'react';

interface PaymentPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'TERMLY' | 'YEARLY';
  isActive: boolean;
  createdAt: string;
}

export default function PaymentsPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = use(params);
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null);
  
  // Form state
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planAmount, setPlanAmount] = useState('');
  const [planFrequency, setPlanFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'TERMLY' | 'YEARLY'>('MONTHLY');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [companyId]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data: any = await apiClient.get(`/admin/company/${companyId}/payment-plans`);
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading payment plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setPlanName('');
    setPlanDescription('');
    setPlanAmount('');
    setPlanFrequency('MONTHLY');
    setEditingPlan(null);
    setShowCreateModal(true);
  };

  const openEditModal = (plan: PaymentPlan) => {
    setPlanName(plan.name);
    setPlanDescription(plan.description || '');
    setPlanAmount(plan.amount.toString());
    setPlanFrequency(plan.frequency);
    setEditingPlan(plan);
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!planName.trim() || !planAmount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        name: planName.trim(),
        description: planDescription.trim(),
        amount: parseFloat(planAmount),
        frequency: planFrequency,
      };

      if (editingPlan) {
        await apiClient.patch(`/admin/company/${companyId}/payment-plans/${editingPlan.id}`, payload);
        alert('Payment plan updated successfully!');
      } else {
        await apiClient.post(`/admin/company/${companyId}/payment-plans`, payload);
        alert('Payment plan created successfully! Parents can now see this plan.');
      }

      setShowCreateModal(false);
      fetchPlans();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save payment plan');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(`/admin/company/${companyId}/payment-plans/${planId}`, {
        isActive: !currentStatus,
      });
      fetchPlans();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update plan status');
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan? Parents subscribed to it will be affected.')) {
      return;
    }

    try {
      await apiClient.delete(`/admin/company/${companyId}/payment-plans/${planId}`);
      alert('Payment plan deleted successfully');
      fetchPlans();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete plan');
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
            <h1 className="text-3xl font-bold text-slate-900">Payment Plans</h1>
            <p className="text-slate-500 mt-1">Create and manage payment plans for parents</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Create Plan
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-500 text-lg mb-4">No payment plans created yet</p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Your First Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg border-2 p-6 hover:shadow-lg transition ${
                  plan.isActive ? 'border-green-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {plan.description && (
                  <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
                )}

                <div className="mb-6">
                  <p className="text-3xl font-bold text-blue-600">
                    GHS {plan.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-500">per {plan.frequency.toLowerCase()}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => togglePlanStatus(plan.id, plan.isActive)}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                      plan.isActive
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {plan.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    🗑️
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-4">
                  Created {new Date(plan.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">
                {editingPlan ? 'Edit Payment Plan' : 'Create Payment Plan'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="e.g., Monthly Plan, Termly Plan"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={planDescription}
                    onChange={(e) => setPlanDescription(e.target.value)}
                    placeholder="Describe what this plan includes..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Amount (GHS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={planAmount}
                    onChange={(e) => setPlanAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Billing Frequency *
                  </label>
                  <select
                    value={planFrequency}
                    onChange={(e) => setPlanFrequency(e.target.value as any)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="TERMLY">Termly (Per Term)</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
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
                    {submitting ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
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
