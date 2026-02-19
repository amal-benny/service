"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Users, Mail, Clock, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setClients(data.filter((u: any) => u.role === 'CLIENT'));
    } catch (error) {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Clients</h1>
        <p className="text-gray-500">Overview of all registered customers and their activity.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                 <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Client Name</th>
                 <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</th>
                 <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-50">
              {clients.map(client => (
                 <tr key={client.id} className="hover:bg-indigo-50/10 transition">
                    <td className="px-8 py-5">
                       <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                             {client.name.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-900">{client.name}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center space-x-2 text-gray-500">
                          <Mail size={16} />
                          <span>{client.email}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <Calendar size={16} />
                          <span>{new Date(client.createdAt).toLocaleDateString()}</span>
                       </div>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
