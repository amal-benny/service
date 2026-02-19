"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { PieChart as PieChartIcon, BarChart as BarChartIcon, CreditCard, Briefcase, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { StatusPieChart, RevenueBarChart } from '@/components/dashboard/DashboardCharts';

interface Booking {
  id: number;
  status: string;
  service: { title: string; price: string };
}

export default function ProviderDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalRevenue: bookings.filter(b => b.status === 'COMPLETED').reduce((acc, curr) => acc + parseFloat(curr.service.price), 0),
    activeJobs: bookings.filter(b => ['PENDING', 'ACCEPTED'].includes(b.status)).length,
    completionRate: bookings.length > 0 ? ((bookings.filter(b => b.status === 'COMPLETED').length / bookings.length) * 100).toFixed(0) : 0,
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Performance Center</h1>
        <p className="text-gray-500 font-medium">Real-time metrics and business growth tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
           <CreditCard className="absolute -bottom-4 -right-4 h-32 w-32 text-indigo-500 opacity-20" />
           <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest mb-2">Platform Revenue</p>
           <h3 className="text-4xl font-black">${stats.totalRevenue.toFixed(2)}</h3>
           <div className="mt-4 flex items-center space-x-2 text-xs font-bold text-indigo-200">
              <span className="px-2 py-0.5 bg-indigo-500 rounded-full">+12% from last month</span>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-6">
           <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Briefcase size={32} />
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Projects</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.activeJobs}</h3>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-6">
           <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Zap size={32} />
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Success Rate</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.completionRate}%</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                   <PieChartIcon size={24} className="text-indigo-600" />
                   <span>Booking Distribution</span>
                 </h3>
              </div>
              <StatusPieChart data={[
                  { name: 'Pending', value: bookings.filter(b => b.status === 'PENDING').length },
                  { name: 'Accepted', value: bookings.filter(b => b.status === 'ACCEPTED').length },
                  { name: 'Completed', value: bookings.filter(b => b.status === 'COMPLETED').length },
              ].filter(d => d.value > 0)} />
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                    <BarChartIcon size={24} className="text-indigo-600" />
                    <span>Financial Metrics</span>
                 </h3>
              </div>
              <RevenueBarChart data={[
                  { name: 'Potential', value: bookings.reduce((acc, curr) => acc + parseFloat(curr.service.price), 0) },
                  { name: 'Realized', value: stats.totalRevenue }
              ]} />
          </div>
      </div>
    </div>
  );
}
