"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Check, X, Clock, Filter, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Booking {
  id: number;
  date: string;
  status: string;
  notes: string;
  service: {
    title: string;
    description: string;
    price: string;
    imageUrl: string | null;
  };
  client?: { name: string; email: string };
  provider?: { user: { name: string } };
}

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'ALL' || b.status === filter;
    const matchesSearch = b.service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.provider?.user.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-500">Manage all your service requests and schedules.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by service or name..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-600 outline-none bg-white font-medium"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
           <p className="text-gray-500">No bookings found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition">
               <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400">
                     {booking.service.imageUrl ? <img src={booking.service.imageUrl} className="h-full w-full object-cover" /> : <Calendar size={24}/>}
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-gray-900">{booking.service.title}</h3>
                     <p className="text-sm text-gray-500 mb-2">
                        {user?.role === 'PROVIDER' ? `Client: ${booking.client?.name}` : `Provider: ${booking.provider?.user?.name}`}
                     </p>
                     <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>{booking.status}</span>
                        <span className="text-xs text-gray-400 font-medium flex items-center space-x-1">
                           <Clock size={12} />
                           <span>{new Date(booking.date).toLocaleDateString()} at {new Date(booking.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center space-x-3">
                  {user?.role === 'PROVIDER' && booking.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateStatus(booking.id, 'ACCEPTED')} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition">
                         <Check size={18} />
                         <span>Accept</span>
                      </button>
                      <button onClick={() => updateStatus(booking.id, 'REJECTED')} className="px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded-lg transition">
                         Reject
                      </button>
                    </>
                  )}
                  {user?.role === 'PROVIDER' && booking.status === 'ACCEPTED' && (
                    <button onClick={() => updateStatus(booking.id, 'COMPLETED')} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">
                       <Check size={18} />
                       <span>Complete Job</span>
                    </button>
                  )}
                  {user?.role === 'CLIENT' && booking.status === 'ACCEPTED' && (
                    <button onClick={() => updateStatus(booking.id, 'COMPLETED')} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition">
                       <Check size={18} />
                       <span>Mark Completed</span>
                    </button>
                  )}
                  {['PENDING', 'ACCEPTED'].includes(booking.status) && (
                    <button onClick={() => updateStatus(booking.id, 'CANCELLED')} className="px-4 py-2 text-gray-400 font-bold hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                       Cancel
                    </button>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
