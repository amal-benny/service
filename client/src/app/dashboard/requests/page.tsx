"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { ShieldCheck, UserCheck, XCircle, Clock, MapPin, Mail, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Provider {
  id: number;
  name: string;
  email: string;
  providerProfile: {
    id: number;
    isVerified: boolean;
    address?: string;
    bio?: string;
  };
}

export default function VendorRequestsPage() {
  const [vendors, setVendors] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setVendors(data.filter((u: any) => u.role === 'PROVIDER'));
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const approveVendor = async (profileId: number) => {
    try {
      await api.put(`/admin/verify/${profileId}`);
      toast.success('Vendor approved successfully');
      fetchVendors();
    } catch (error) {
      toast.error('Failed to approve vendor');
    }
  };

  const pendingVendors = vendors.filter(v => !v.providerProfile?.isVerified);
  const activeVendors = vendors.filter(v => v.providerProfile?.isVerified);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
        <p className="text-gray-500">Approve new service providers and manage existing partners.</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Clock className="text-amber-500" />
          <span>Pending Approvals ({pendingVendors.length})</span>
        </h2>
        {pendingVendors.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 text-gray-400">
             No new provider requests.
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingVendors.map((vendor) => (
              <div key={vendor.id} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                       <ShieldCheck size={32} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-900">{vendor.name}</h3>
                       <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center space-x-1"><Mail size={14} /> <span>{vendor.email}</span></span>
                          <span className="flex items-center space-x-1"><MapPin size={14} /> <span>{vendor.providerProfile?.address || 'Location Hidden'}</span></span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3">
                    <button onClick={() => approveVendor(vendor.providerProfile.id)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">
                       Approve Access
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6 opacity-80">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <UserCheck className="text-green-500" />
          <span>Active Vendors ({activeVendors.length})</span>
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                 <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Vendor</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {activeVendors.map(vendor => (
                    <tr key={vendor.id} className="hover:bg-gray-50 transition">
                       <td className="px-6 py-4 font-bold text-gray-900">{vendor.name}</td>
                       <td className="px-6 py-4 text-sm text-gray-600">{vendor.email}</td>
                       <td className="px-6 py-4"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Verified</span></td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-indigo-600 hover:text-indigo-800"><ExternalLink size={18}/></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </section>
    </div>
  );
}
