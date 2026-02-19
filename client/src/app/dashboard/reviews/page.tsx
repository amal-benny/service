"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Star, MessageSquare, CheckCircle, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReviewModal from '@/components/reviews/ReviewModal';

interface Booking {
  id: number;
  date: string;
  status: string;
  service: {
    id: number;
    title: string;
    price: string;
  };
  provider: {
    user: {
      name: string;
    };
  };
  review?: {
    id: number;
    rating: number;
    comment: string;
  };
}

export default function ReviewsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/bookings');
      // Filter for COMPLETED bookings
      const completed = data.filter((b: any) => b.status === 'COMPLETED');
      setBookings(completed);
    } catch (error) {
      toast.error('Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Reviews</h1>
        <p className="text-gray-500 font-medium">Rate your past services and share your feedback.</p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
           {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl"></div>)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
           <MessageSquare className="mx-auto h-16 w-16 text-gray-200 mb-6" />
           <h3 className="text-2xl font-bold text-gray-900">No services yet</h3>
           <p className="text-gray-500 mt-2">Bookings you've completed will appear here for review.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-indigo-200 transition-all duration-300">
               <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-3 text-emerald-600">
                     <CheckCircle size={18} />
                     <span className="text-xs font-black uppercase tracking-widest">Service Completed</span>
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-gray-900">{booking.service.title}</h3>
                     <p className="text-gray-500 font-medium">Provided by <span className="text-indigo-600">{booking.provider.user.name}</span></p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                     <span className="flex items-center space-x-1"><Calendar size={14}/> <span>{new Date(booking.date).toLocaleDateString()}</span></span>
                     <span className="font-bold text-gray-900">${booking.service.price}</span>
                  </div>
               </div>

               <div className="min-w-[200px] flex flex-col items-center md:items-end justify-center">
                  {booking.review ? (
                    <div className="text-center md:text-right space-y-3">
                       <div className="flex items-center space-x-1 justify-center md:justify-end">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={16} className={`${i <= booking.review!.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                          ))}
                       </div>
                       <p className="text-sm text-gray-600 italic line-clamp-2 max-w-[250px]">"{booking.review.comment}"</p>
                       <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">Already Reviewed</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2"
                    >
                       <Star size={20} className="fill-white" />
                       <span>Write Review</span>
                    </button>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <ReviewModal 
          bookingId={selectedBooking.id}
          providerName={selectedBooking.provider.user.name}
          onClose={() => setSelectedBooking(null)}
          onSuccess={() => {
            setSelectedBooking(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
