"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Navbar from '@/components/layout/Navbar';
import { Check, X, Shield, User, Key, RefreshCcw, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AppUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  providerProfile?: {
    id: number;
    isVerified: boolean;
  };
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (providerProfileId: number) => {
     try {
       await api.put(`/admin/verify/${providerProfileId}`);
       toast.success('Provider verified');
       fetchUsers();
     } catch (error) {
       toast.error('Verification failed');
     }
  };

  const handleResetPassword = async (userId: number) => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await api.put(`/admin/reset-password/${userId}`, { newPassword });
      toast.success('Password reset successfully');
      setResettingId(null);
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50Selection">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-gray-500 font-medium">Platform overview and user management.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Users</p>
                <p className="text-lg font-black text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl shadow-indigo-100/50 rounded-[2.5rem] border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900">User Directory</h3>
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Records: {users.length}</div>
          </div>
          
          <div className="overflow-x-auto">
             {loading ? (
               <div className="p-20 flex flex-col items-center justify-center space-y-4">
                 <RefreshCcw className="h-10 w-10 text-indigo-600 animate-spin" />
                 <p className="text-gray-400 font-bold animate-pulse">Fetching records...</p>
               </div>
             ) : (
                <table className="min-w-full divide-y divide-gray-100">
                   <thead>
                     <tr className="bg-gray-50/50 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                       <th className="px-8 py-5">Identities</th>
                       <th className="px-8 py-5">Permission Level</th>
                       <th className="px-8 py-5">Account Status</th>
                       <th className="px-8 py-5 text-right">System Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 bg-white">
                   {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center">
                               <div className="flex-shrink-0 h-14 w-14 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                                  {user.role === 'ADMIN' ? <Shield size={28} /> : <User size={28} />}
                               </div>
                               <div className="ml-5">
                                  <div className="text-base font-black text-gray-900">{user.name}</div>
                                  <div className="text-sm font-bold text-gray-400">{user.email}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 inline-flex text-[10px] font-black rounded-full tracking-widest uppercase border ${
                               user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                               user.role === 'PROVIDER' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-green-50 text-green-700 border-green-100'
                            }`}>
                               {user.role}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            {user.role === 'PROVIDER' && user.providerProfile ? (
                               <div className="flex items-center">
                                  {user.providerProfile.isVerified ? (
                                    <span className="flex items-center text-[10px] font-black tracking-widest uppercase text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                                      <Check className="h-3 w-3 mr-1.5" /> Verified
                                    </span>
                                  ) : (
                                    <span className="flex items-center text-[10px] font-black tracking-widest uppercase text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                      <RefreshCcw className="h-3 w-3 mr-1.5" /> Pending
                                    </span>
                                  )}
                               </div>
                            ) : (
                              <span className="text-[10px] font-black text-gray-300 tracking-widest uppercase">N/A</span>
                            )}
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end space-x-3">
                               {user.role === 'PROVIDER' && user.providerProfile && !user.providerProfile.isVerified && (
                                  <button 
                                    onClick={() => handleVerify(user.providerProfile!.id)}
                                    className="px-5 py-2.5 border border-transparent text-xs font-black rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition transform active:scale-95 shadow-xl shadow-indigo-100"
                                  >
                                     Approve
                                  </button>
                               )}
                               
                               {resettingId === user.id ? (
                                 <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                   <input
                                     type="text"
                                     value={newPassword}
                                     onChange={(e) => setNewPassword(e.target.value)}
                                     placeholder="Set password"
                                     className="px-4 py-2 text-xs font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-32 shadow-sm transition-all"
                                   />
                                   <button 
                                     onClick={() => handleResetPassword(user.id)}
                                     className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100"
                                   >
                                     <Check size={16} />
                                   </button>
                                   <button 
                                     onClick={() => {setResettingId(null); setNewPassword('');}}
                                     className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition shadow-sm"
                                   >
                                     <X size={16} />
                                   </button>
                                 </div>
                               ) : (
                                 <button 
                                   onClick={() => setResettingId(user.id)}
                                   className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-[1.25rem] transition-all group/btn"
                                   title="Reset User Password"
                                 >
                                    <Key size={20} className="group-hover/btn:rotate-12 transition-transform" />
                                 </button>
                               )}
                            </div>
                         </td>
                      </tr>
                   ))}
                   </tbody>
                </table>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
