import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, ShieldCheck, Key, Lock, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import PasswordInput from '@/components/ui/PasswordInput';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/profile/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-10">
      <div>
        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 font-medium">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Profile Card */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/40 border border-gray-100 overflow-hidden transform transition-all hover:shadow-2xl hover:shadow-indigo-100/60">
            <div className="h-40 bg-gradient-to-r from-indigo-600 to-blue-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
            </div>
            <div className="px-10 pb-10">
              <div className="relative flex justify-between items-end -mt-16 mb-10">
                <div className="h-32 w-32 rounded-[2rem] bg-white p-2 border shadow-2xl overflow-hidden hover:scale-105 transition-transform">
                   <div className="h-full w-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-4xl font-black">
                      {user?.name?.charAt(0)}
                   </div>
                </div>
                <button className="px-6 py-3 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition shadow-sm active:scale-95 text-sm uppercase tracking-widest">
                   Edit Identity
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <div className="flex items-start space-x-5">
                      <div className="p-3 bg-gray-50 rounded-2xl text-indigo-600 shadow-inner"><User size={24} /></div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Display Name</label>
                        <p className="text-xl font-black text-gray-900 tracking-tight">{user?.name}</p>
                      </div>
                   </div>

                   <div className="flex items-start space-x-5">
                      <div className="p-3 bg-gray-50 rounded-2xl text-indigo-600 shadow-inner"><Mail size={24} /></div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Email Access</label>
                        <p className="text-xl font-black text-gray-900 tracking-tight">{user?.email}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="flex items-start space-x-5">
                      <div className="p-3 bg-gray-50 rounded-2xl text-indigo-600 shadow-inner"><Shield size={24} /></div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">System Privilege</label>
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-black text-gray-900 tracking-tight uppercase">{user?.role}</span>
                            <div className="bg-green-100 p-1 rounded-full"><ShieldCheck className="text-green-600" size={16} /></div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/40 border border-gray-100 p-10">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                     <Lock size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">Security Credentials</h3>
               </div>
               {!isChangingPassword && (
                 <button 
                   onClick={() => setIsChangingPassword(true)}
                   className="flex items-center space-x-2 text-indigo-600 font-black text-sm uppercase tracking-widest hover:text-indigo-700 transition"
                 >
                    <Key size={18} />
                    <span>Change Password</span>
                 </button>
               )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handlePasswordChange} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Access Password</label>
                      <PasswordInput
                        id="currentPassword"
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                        required
                        className="rounded-2xl"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                      <PasswordInput
                        id="newPassword"
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        required
                        className="rounded-2xl"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                      <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        required
                        className="rounded-2xl"
                      />
                   </div>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition active:scale-95 disabled:opacity-50 flex items-center"
                   >
                      {loading ? 'Updating Credentials...' : 'Update Security Key'}
                   </button>
                   <button 
                     type="button"
                     onClick={() => setIsChangingPassword(false)}
                     className="px-8 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition active:scale-95"
                   >
                      Cancel
                   </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center space-x-3 text-green-600 bg-green-50 p-6 rounded-3xl border border-green-100">
                 <CheckCircle2 size={24} />
                 <p className="font-bold">Your account security is up to date.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h4 className="text-xl font-black mb-4 relative z-10">Security Tip</h4>
              <p className="text-indigo-100 font-medium relative z-10 leading-relaxed">
                 Use a combination of letters, numbers, and symbols for a stronger password. Never share your credentials with anyone.
              </p>
           </div>
           
           <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/40 border border-gray-100 p-8 space-y-6">
              <h4 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-4 uppercase tracking-widest text-xs">Account Statistics</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-400">Join Date</span>
                    <span className="text-sm font-black text-gray-900">Jan 2026</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-400">Trust Score</span>
                    <div className="flex items-center space-x-1">
                       <span className="text-sm font-black text-gray-900">98%</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
