"use client";

import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import { X, Star } from 'lucide-react';

interface ReviewModalProps {
  bookingId: number;
  providerName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ bookingId, providerName, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        bookingId,
        rating,
        comment
      });
      toast.success('Review submitted! Thank you.');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
          <div className="bg-white px-8 pt-6 pb-8 sm:p-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Rate Your Experience</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-8">
              How was your service with <span className="font-bold text-indigo-600">{providerName}</span>?
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={40}
                        className={`${
                          (hoverRating || rating) >= star 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-200 fill-gray-200'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <span className="mt-4 text-sm font-bold text-gray-500 uppercase tracking-widest">
                  {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Great' : 'Excellent'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Share more details (Optional)</label>
                <textarea
                  rows={4}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 text-gray-900 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:outline-none transition"
                  placeholder="What did you like? What could be improved?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 transition"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
