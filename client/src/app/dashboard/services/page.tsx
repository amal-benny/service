"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Plus, Trash2, ExternalLink, Search, Eye, Star, X, MapPin, Tag, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BookingModal from '@/components/booking/BookingModal';

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl?: string | null;
  provider: {
    id: number;
    user: { name: string };
    address?: string;
  };
  reviews?: any[];
}

export default function ServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceToBook, setServiceToBook] = useState<Service | null>(null);

  // Provider state
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ title: '', description: '', price: '', category: 'Plumbing' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      if (user?.role === 'PROVIDER') {
        const userRes = await api.get('/auth/me');
        const myProviderId = userRes.data.providerProfile?.id;
        setServices(data.filter((s: any) => s.provider.id === myProviderId));
      } else {
        setServices(data);
      }
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newService.title);
      formData.append('description', newService.description);
      formData.append('price', newService.price);
      formData.append('category', newService.category);
      if (imageFile) formData.append('image', imageFile);

      await api.post('/services', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Service added successfully');
      setShowAddService(false);
      fetchServices();
    } catch (error) {
      toast.error('Failed to add service');
    }
  };

  const deleteService = async (id: number) => {
    if(!confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (path: string | undefined | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; 
    return `http://localhost:5000${path}`; 
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.role === 'PROVIDER' ? 'My Service Catalog' : 'Discover Services'}
          </h1>
          <p className="text-gray-500">
            {user?.role === 'PROVIDER' ? 'Manage your offerings and reach more clients.' : 'Find the best professionals for your needs.'}
          </p>
        </div>
        {user?.role === 'PROVIDER' && !showAddService && (
          <button onClick={() => setShowAddService(true)} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg">
            <Plus size={18} />
            <span>Add New Service</span>
          </button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search services..." 
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showAddService ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 animate-fadeIn max-w-2xl">
           <form onSubmit={handleAddService} className="space-y-6">
              <div className="flex justify-between">
                 <h3 className="font-bold text-xl text-gray-900">New Service Details</h3>
                 <button type="button" onClick={() => setShowAddService(false)} className="text-gray-400 hover:text-gray-600"><X/></button>
              </div>
              <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Service Title" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
              <textarea className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" rows={3} placeholder="Service Description" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                 <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input type="number" className="w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Price" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} required />
                 </div>
                 <select className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none bg-white" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})}>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Moving">Moving</option>
                 </select>
              </div>
              <div className="border-2 border-dashed border-gray-100 p-6 rounded-xl text-center">
                 <input type="file" className="hidden" id="service-image" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
                 <label htmlFor="service-image" className="cursor-pointer">
                    <div className="text-indigo-600 font-bold hover:text-indigo-700 transition mb-1">Upload Image</div>
                    <div className="text-xs text-gray-400">{imageFile ? imageFile.name : 'JPEG, PNG up to 5MB'}</div>
                 </label>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">Save & Publish</button>
           </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
               <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {service.imageUrl ? (
                    <img src={getImageUrl(service.imageUrl) || ''} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Tag size={40}/></div>
                  )}
                  <div className="absolute top-3 right-3 flex space-x-2">
                    {user?.role === 'PROVIDER' ? (
                      <button onClick={() => deleteService(service.id)} className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-red-50 transition shadow-sm"><Trash2 size={16}/></button>
                    ) : (
                      <button onClick={() => setSelectedService(service)} className="p-2 bg-white/90 text-indigo-600 rounded-full hover:bg-indigo-50 transition shadow-sm"><Eye size={16}/></button>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {service.category}
                  </div>
               </div>
               <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{service.title}</h3>
                    <span className="font-black text-indigo-600">${service.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{service.description}</p>
                  
                  {user?.role === 'CLIENT' && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                       <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <User size={14} />
                          <span>{service.provider?.user?.name}</span>
                       </div>
                       <button onClick={() => setSelectedService(service)} className="text-xs font-bold text-indigo-600 hover:underline">View Details & Book</button>
                    </div>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedService(null)}></div>
           <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl animate-modalUp">
              <button onClick={() => setSelectedService(null)} className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition z-20"><X size={24}/></button>
              
              <div className="flex flex-col md:flex-row h-full">
                 <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden bg-gray-100">
                    <img src={getImageUrl(selectedService.imageUrl) || ''} className="w-full h-full object-cover" />
                 </div>
                 
                 <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                    <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                       <Tag size={12}/>
                       <span>{selectedService?.category}</span>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">{selectedService?.title}</h2>
                    <div className="flex items-center space-x-6 mb-8">
                       <div className="text-gray-900"><span className="text-3xl font-black">${selectedService?.price}</span> <span className="text-sm text-gray-400">/ service</span></div>
                       <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                          <Star size={16} className="text-amber-500 fill-amber-500 mr-1" />
                          <span className="text-sm font-bold text-amber-700">4.8 (24 Reviews)</span>
                       </div>
                    </div>
                    
                    <div className="space-y-6 mb-10">
                       <p className="text-gray-600 leading-relaxed">{selectedService?.description}</p>
                       <div className="flex items-center space-x-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                          <MapPin size={18} className="text-indigo-600" />
                          <span>{selectedService?.provider?.address || 'Remote / Worldwide'}</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="font-bold text-gray-900">Recent Feedback</h4>
                       <div className="space-y-4 border-l-2 border-indigo-50 pl-6">
                          {/* Placeholder for real reviews */}
                          <div className="bg-gray-50 p-4 rounded-2xl relative">
                             <div className="flex items-center space-x-1 mb-2">
                                {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-amber-500 fill-amber-500" />)}
                             </div>
                             <p className="text-sm text-gray-600">"Excellent service! Fast and professional. Highly recommended."</p>
                             <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">James W. • 2 days ago</div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-10">
                       <button 
                         onClick={() => {
                           setServiceToBook(selectedService);
                           setSelectedService(null);
                         }}
                         className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200"
                       >
                         Book This Service Now
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {serviceToBook && (
        <BookingModal 
          service={serviceToBook} 
          onClose={() => setServiceToBook(null)} 
        />
      )}
    </div>
  );
}
