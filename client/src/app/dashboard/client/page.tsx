"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Calendar, CheckCircle, Clock, CreditCard, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { StatusPieChart } from '@/components/dashboard/DashboardCharts';

interface Booking {
  id: number;
  date: string;
  status: string;
  service: { title: string; price: string };
  provider: { user: { name: string } };
}

export default function ClientDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalSpent: bookings.filter(b => b.status === 'COMPLETED').reduce((acc, curr) => acc + parseFloat(curr.service.price), 0),
    activeCount: bookings.filter(b => ['PENDING', 'ACCEPTED'].includes(b.status)).length,
    completedCount: bookings.filter(b => b.status === 'COMPLETED').length,
  };

  const recentBookings = [...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">My Overview</h1>
          <p className="text-gray-500 font-medium">Quick glance at your service activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 flex items-center space-x-6">
           <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <CreditCard size={32} />
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Spent</p>
              <h3 className="text-3xl font-black text-gray-900">${stats.totalSpent.toFixed(2)}</h3>
           </div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 flex items-center space-x-6">
           <div className="h-16 w-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <Clock size={32} />
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">In Progress</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.activeCount}</h3>
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 flex items-center space-x-6">
           <div className="h-16 w-16 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
              <CheckCircle size={32} />
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Completed</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.completedCount}</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
               <Calendar size={20} className="text-indigo-600" />
               <span>Recent Activity</span>
            </h2>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
               <div className="divide-y divide-gray-50">
                  {recentBookings.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">No recent activity.</div>
                  ) : recentBookings.map(b => (
                    <div key={b.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition">
                       <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${b.status === 'COMPLETED' ? 'bg-green-500' : 'bg-indigo-500'}`}>
                             {b.service.title.charAt(0)}
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900">{b.service.title}</h4>
                             <p className="text-xs text-gray-500">{b.provider.user.name}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 mb-1">${b.service.price}</div>
                          <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${b.status === 'COMPLETED' ? 'text-green-600 bg-green-50' : 'text-indigo-600 bg-indigo-50'}`}>
                             {b.status}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
               <Star size={20} className="text-amber-500" />
               <span>Status Split</span>
            </h2>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center">
               {bookings.length > 0 ? (
                 <StatusPieChart data={[
                   { name: 'Active', value: stats.activeCount },
                   { name: 'Completed', value: stats.completedCount },
                   { name: 'Cancelled', value: bookings.filter(b => b.status === 'CANCELLED').length }
                 ].filter(d => d.value > 0)} />
               ) : (
                 <div className="h-64 flex items-center justify-center text-gray-300">No data</div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
