'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Review } from '@/lib/types';
import { Star, MessageSquarePlus, X, Send, ShieldCheck } from 'lucide-react';
import { useRole } from '@/context/RoleContext';

interface ReviewsSectionProps {
  listingId?: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  listingId,
  reviews: initialReviews,
  rating: initialRating,
  reviewCount: initialReviewCount,
}) => {
  const { role, addToast } = useRole();
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const metrics = [
    { label: 'Cleanliness', score: 5.0 },
    { label: 'Accuracy', score: 4.9 },
    { label: 'Communication', score: 5.0 },
    { label: 'Location', score: 4.9 },
    { label: 'Check-in', score: 5.0 },
    { label: 'Value', score: 4.8 },
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (role === 'HOST') {
      addToast('Permission Denied', 'Hosts cannot write or edit guest reviews.', 'error');
      setIsModalOpen(false);
      return;
    }

    setIsSubmitting(true);
    const createdReview: Review = {
      id: `rev_${Date.now()}`,
      listing_id: listingId || 'list_1',
      author: {
        id: 'user_guest_1',
        name: 'Alex Morgan',
        email: 'alex@example.com',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role: 'GUEST',
        is_superhost: false,
      },
      rating: newRating,
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      check_in_rating: 5.0,
      value_rating: 5.0,
      comment: newComment.trim(),
      created_at: new Date().toISOString(),
    };

    setReviewsList((prev) => [createdReview, ...prev]);
    addToast('Review Submitted', 'Thank you for sharing your stay experience!', 'success');
    setNewComment('');
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-8 py-8 border-t border-gray-200">
      {/* Title & Rating & Write Review Button (Guest Only) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-airbnb-dark">
          <Star className="w-6 h-6 fill-airbnb-dark text-airbnb-dark" />
          <span>{initialRating.toFixed(2)}</span>
          <span>·</span>
          <span>{reviewsList.length} review{reviewsList.length !== 1 ? 's' : ''}</span>
        </div>

        {/* RESTRICT WRITE REVIEW TO GUEST MODE ONLY */}
        {role === 'GUEST' ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 border border-gray-300 hover:border-airbnb-dark rounded-xl px-4 py-2 text-sm font-semibold text-airbnb-dark transition-colors bg-white shadow-xs"
          >
            <MessageSquarePlus className="w-4 h-4 text-airbnb-red" />
            <span>Leave a Review</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Verified guest feedback (Hosts cannot write or edit reviews)</span>
          </div>
        )}
      </div>

      {/* Category Ratings Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between text-sm">
            <span className="text-airbnb-dark font-medium">{m.label}</span>
            <div className="flex items-center gap-3 w-1/2">
              <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-airbnb-dark h-full rounded-full"
                  style={{ width: `${(m.score / 5) * 100}%` }}
                />
              </div>
              <span className="font-bold text-xs w-6 text-airbnb-dark">{m.score.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {reviewsList.length > 0 ? (
          reviewsList.map((rev) => (
            <div key={rev.id} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-300 shrink-0">
                  <Image
                    src={rev.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={rev.author?.name || 'Reviewer'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-airbnb-dark">{rev.author?.name || 'Verified Guest'}</h4>
                  <p className="text-xs text-airbnb-gray">{new Date(rev.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-airbnb-dark">
                {Array.from({ length: Math.round(rev.rating) }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-airbnb-dark text-airbnb-dark" />
                ))}
              </div>
              <p className="text-sm text-airbnb-dark leading-relaxed">{rev.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-airbnb-gray text-sm col-span-2">No guest reviews yet for this listing. Be the first to leave one!</p>
        )}
      </div>

      {/* Write Review Modal (Guest Only) */}
      {isModalOpen && role === 'GUEST' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-airbnb-dark">Write a Review</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-airbnb-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-airbnb-dark block mb-2">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-airbnb-dark block mb-1">Your Feedback</label>
                <textarea
                  rows={4}
                  placeholder="Share details of your stay, host communication, cleanliness, location..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white text-airbnb-dark"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-airbnb-dark hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-airbnb-red text-white font-bold px-5 py-2.5 rounded-xl hover:bg-airbnb-hover transition-colors text-sm shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
