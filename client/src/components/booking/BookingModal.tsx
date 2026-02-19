"use client";

import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  provider: {
    id: number; // ProviderProfile ID required by backend? actually backend uses serviceId to find provider usually, but let's see controller
  };
}

// Controller expects: { serviceId, providerId, date, notes }
// We need providerId from the service object.
// The previous service interface in ServicesPage didn't explicitly include provider.id. 
// I will assume the previous interface will be updated or I check the API response. 
// The API response for /services includes provider object.

interface BookingModalProps {
  service: any; // Using any for flexibility or fix type
  onClose: () => void;
}

export default function BookingModal({ service, onClose }: BookingModalProps) {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Backend expects: serviceId, providerId, date, notes
      // Ensure service object has provider.id
      console.log('Submitting booking:', { serviceId: service.id, providerId: service.provider?.id, date, notes });
      await api.post('/bookings', {
        serviceId: service.id,
        providerId: service.provider.id,
        date,
        notes
      });
      toast.success('Booking requested successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="absolute top-0 right-0 pt-4 pr-4">
               <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
               </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Book Service: {service.title}
                </h3>
                <div className="mt-2">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input 
                            type="datetime-local" 
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea 
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Describe your requirements..."
                        />
                    </div>
                    
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            {submitting ? 'Booking...' : 'Confirm Booking'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
