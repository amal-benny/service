"use client";

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import Navbar from '@/components/layout/Navbar';
import { Search, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BookingModal from '@/components/booking/BookingModal';

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string | null;
  provider: {
    id: number;
    user: { name: string };
    address: string | null;
    isVerified: boolean;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const { isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, [category]); 

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (category) params.category = category;
      if (searchTerm) params.search = searchTerm;

      const { data } = await api.get('/services', { params });
      setServices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

   const getImageUrl = (path: string | undefined | null) => {
      if (!path) return null;
      if (path.startsWith('http')) return path; // Manual URL
      return `http://localhost:5000${path}`; // Local upload
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Filter Section */}
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Find Top-Rated Services</h1>
            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-grow flex items-center relative">
                    <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        placeholder="Search for 'Plumbing', 'Cleaning'..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                     <button
                        type="submit"
                        className="absolute right-2 px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition"
                    >
                        Search
                    </button>
                </form>

                <div className="w-full md:w-64">
                    <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full pl-3 pr-10 py-3 text-base border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    >
                    <option value="">All Categories</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Moving">Moving</option>
                    </select>
                </div>
            </div>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
             {[1,2,3].map(i => (
                 <div key={i} className="animate-pulse bg-white h-96 rounded-xl shadow-md"></div>
             ))}
          </div>
        ) : services.length === 0 ? (
            <div className="text-center py-20">
                <h3 className="text-lg font-medium text-gray-900">No services found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
            </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 flex flex-col overflow-hidden border border-gray-100">
                {/* Image Section */}
                <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                    {service.imageUrl ? (
                        <img 
                            src={getImageUrl(service.imageUrl) || ''} 
                            alt={service.title} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No Image
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-indigo-600 shadow-sm">
                        ${service.price}
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-semibold tracking-wider uppercase text-indigo-500">
                        {service.category}
                     </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                      {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                      {service.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs mr-2">
                            {service.provider.user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 flex items-center">
                                {service.provider.user.name}
                                {service.provider.isVerified && (
                                    <span className="ml-1 text-blue-500" title="Verified Provider">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                                    </span>
                                )}
                            </span>
                            {service.provider.address && (
                                <span className="text-xs text-gray-400 flex items-center mt-0.5">
                                    <MapPin className="w-3 h-3 mr-1" /> {service.provider.address}
                                </span>
                            )}
                        </div>
                    </div>
                  </div>

                  <div className="mt-4">
                   {isAuthenticated ? (
                      <button
                        onClick={() => setSelectedService(service)}
                        className="w-full btn-primary py-2.5 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 shadow-md transition"
                      >
                        Book Now
                      </button>
                   ) : (
                      <Link href="/auth/login" className="w-full block text-center py-2.5 rounded-lg font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition">
                         Login to Book
                      </Link>
                   )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedService && (
        <BookingModal 
           service={selectedService} 
           onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
}
