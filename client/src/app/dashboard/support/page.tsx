"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, Calendar, Mail, CheckCircle, Clock, Send, HelpCircle, ShieldQuestion, MessageCircle, ArrowRight, LifeBuoy } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function SupportPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Client form state
  const [formData, setFormData] = useState({
    subject: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSupportData();
  }, [user]);

  const fetchSupportData = async () => {
    try {
      if (user?.role === 'ADMIN') {
        const { data } = await api.get('/admin/support');
        setMessages(data);
      } else if (user) {
        const { data } = await api.get('/support/my-messages');
        setUserMessages(data);
      }
    } catch (error) {
      console.error('Error fetching support data:', error);
      // toast.error('Failed to load support data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/admin/support/${id}`, { status });
      toast.success('Status updated');
      fetchSupportData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
       await api.post('/support', {
         name: user?.name,
         email: user?.email,
         subject: formData.subject,
         message: formData.message,
         userId: user?.id
       });
       toast.success('Message sent! Our team will get back to you.');
       setFormData({ ...formData, message: '' });
       fetchSupportData(); // Refresh history
    } catch (error) {
       toast.error('Failed to send message');
    } finally {
       setSubmitting(false);
    }
  };

  if (user?.role === 'ADMIN') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Support Inbox</h1>
            <p className="text-gray-500 font-medium">Manage inquiries and feedback from platform users.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
            <div className="h-3 w-3 bg-indigo-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-gray-700">{messages.length} Active Tickets</span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6">
             {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-[2rem] animate-pulse"></div>)}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
             <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                <MessageSquare size={40} />
             </div>
             <h3 className="text-2xl font-black text-gray-900">Inbox is empty</h3>
             <p className="text-gray-500 mt-2 max-w-sm mx-auto">When users submit the contact form, their specialized inquiries will appear here for your review.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 hover:border-indigo-100 transition-colors group">
                 <div className="flex-1 space-y-5">
                    <div className="flex items-center justify-between">
                       <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">{msg.subject}</span>
                       <span className="text-xs text-gray-400 font-bold flex items-center space-x-1.5">
                          <Calendar size={14} className="text-indigo-300" />
                          <span>{new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                       </span>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">From: {msg.name}</h3>
                       <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
                          <Mail size={14} className="text-indigo-400" />
                          <span>{msg.email}</span>
                       </div>
                    </div>
                    <div className="relative">
                       <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-50 rounded-full"></div>
                       <p className="text-gray-600 text-base leading-relaxed pl-6 italic">"{msg.message}"</p>
                    </div>
                 </div>
                 
                 <div className="flex flex-row md:flex-col justify-end gap-3 border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-10 min-w-[180px]">
                    <div className="mb-auto">
                       <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          msg.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 
                          msg.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-700' : 
                          'bg-amber-100 text-amber-700'
                       }`}>
                          <div className={`h-1.5 w-1.5 rounded-full mr-2 ${
                             msg.status === 'RESOLVED' ? 'bg-green-500' : 
                             msg.status === 'IN_PROGRESS' ? 'bg-indigo-500' : 
                             'bg-amber-500'
                          }`}></div>
                          {msg.status}
                       </div>
                    </div>
                    {msg.status !== 'RESOLVED' && (
                      <button onClick={() => handleUpdateStatus(msg.id, 'RESOLVED')} className="flex items-center justify-center space-x-2 px-5 py-3 bg-green-600 text-white rounded-2xl font-black text-xs hover:bg-green-700 transition shadow-lg shadow-green-100">
                         <CheckCircle size={16} />
                         <span>Mark as Resolved</span>
                      </button>
                    )}
                    {msg.status === 'OPEN' && (
                      <button onClick={() => handleUpdateStatus(msg.id, 'IN_PROGRESS')} className="flex items-center justify-center space-x-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                         <Clock size={16} />
                         <span>Start Progress</span>
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

  // Client & Provider view
  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-2">
           <LifeBuoy className="w-4 h-4 mr-2" />
           Support Center
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">How can we help?</h1>
        <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">We're building the future of services, and we're here to support you at every step of your journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group cursor-pointer hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300">
               <div className="h-20 w-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldQuestion size={36} />
               </div>
               <h3 className="font-black text-gray-900 text-xl mb-3">Help Center</h3>
               <p className="text-sm text-gray-500 leading-relaxed mb-6">Browse our comprehensive guides for quick answers to common questions.</p>
               <button className="flex items-center font-black text-sm text-indigo-600 group-hover:translate-x-2 transition-transform">
                  Go to FAQ 
                  <ArrowRight size={16} className="ml-2" />
               </button>
            </div>

            <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
               <HelpCircle className="absolute -bottom-10 -right-10 h-48 w-48 text-indigo-500 opacity-20 group-hover:scale-110 transition-transform duration-700" />
               <div className="relative z-10">
                  <div className="h-14 w-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                    <MessageCircle size={28} />
                  </div>
                  <h3 className="font-black text-2xl mb-3">Priority Support</h3>
                  <p className="text-indigo-100 text-base leading-relaxed mb-8">Average response time is <span className="text-white font-bold">under 12 hours</span>. Our team is ready to assist with any technical issues.</p>
                  <div className="inline-flex items-center space-x-3 px-4 py-2 bg-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm border border-white/10">
                     <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                     <span>Experts Online Now</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-50">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">Send Message</h3>
                  <div className="hidden md:flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                     <Clock size={14} />
                     <span>Typical reply: ~12h</span>
                  </div>
               </div>
               
               <form onSubmit={handleClientSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Subject Category</label>
                        <select 
                           className="w-full p-5 border-2 border-gray-50 rounded-[1.5rem] bg-gray-50 focus:bg-white focus:border-indigo-600 focus:outline-none font-bold text-gray-700 transition appearance-none cursor-pointer"
                           value={formData.subject}
                           onChange={e => setFormData({...formData, subject: e.target.value})}
                        >
                           <option>General Inquiry</option>
                           <option>Booking Issue</option>
                           <option>Payment Query</option>
                           <option>Report a Problem</option>
                           <option>Account Access</option>
                           <option>Other</option>
                        </select>
                     </div>
                     <div className="flex items-end">
                        <p className="text-xs text-gray-400 font-medium italic mb-5 ml-2">Choose the category that best fits your inquiry for faster routing.</p>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">How can we help?</label>
                     <textarea 
                        rows={6}
                        placeholder="Detailed message about your request..."
                        required
                        className="w-full p-6 border-2 border-gray-50 rounded-[2rem] bg-gray-50 focus:bg-white focus:border-indigo-600 focus:outline-none font-medium text-gray-700 transition resize-none leading-relaxed"
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                     />
                  </div>
                  
                  <button 
                     type="submit" 
                     disabled={submitting}
                     className="w-full py-6 bg-indigo-600 text-white rounded-[1.75rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                     <Send size={24} />
                     <span>{submitting ? 'Transmitting Request...' : 'Send Message'}</span>
                  </button>
               </form>
            </div>

            {/* Message History Section */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Inquiries</h3>
                  <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">History Log</div>
               </div>
               
               {loading ? (
                  <div className="space-y-4">
                     {[1,2].map(i => <div key={i} className="h-24 bg-gray-50 rounded-3xl animate-pulse"></div>)}
                  </div>
               ) : userMessages.length === 0 ? (
                  <div className="p-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                     <p className="text-gray-400 font-bold">No previous messages found.</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {userMessages.map((msg) => (
                        <div key={msg.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-colors">
                           <div className="flex items-center space-x-6">
                              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
                                 msg.status === 'RESOLVED' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                 {msg.status === 'RESOLVED' ? <CheckCircle size={24} /> : <Clock size={24} />}
                              </div>
                              <div>
                                 <div className="flex items-center space-x-3 mb-1">
                                    <h4 className="font-black text-gray-900">{msg.subject}</h4>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                                       msg.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                       {msg.status}
                                    </span>
                                 </div>
                                 <p className="text-sm text-gray-500 font-medium line-clamp-1">{msg.message}</p>
                              </div>
                           </div>
                           <div className="text-right hidden sm:block">
                              <p className="text-xs font-black text-gray-400 mb-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Ticket ID: #{msg.id}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
