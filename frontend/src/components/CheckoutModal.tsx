'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Listing } from '@/lib/types';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { createBooking } from '@/lib/api';
import { useRole } from '@/context/RoleContext';
import { useRouter } from 'next/navigation';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  bookingDetails: {
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    nights: number;
  };
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  listing,
  bookingDetails
}) => {
  const router = useRouter();
  const { addToast } = useRole();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirmPay = async () => {
    setIsSubmitting(true);
    try {
      await createBooking({
        listing_id: listing.id,
        check_in: bookingDetails.checkIn,
        check_out: bookingDetails.checkOut,
        guests_count: bookingDetails.guests,
        total_price: bookingDetails.totalPrice
      });

      addToast(
        'Booking Confirmed!',
        `Your stay at ${listing.title} is confirmed for ${bookingDetails.checkIn}`,
        'success'
      );
      onClose();
      router.push('/trips');
    } catch (err: any) {
      addToast('Booking Failed', err.message || 'Could not complete reservation', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-airbnb-dark">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-base font-bold text-airbnb-dark">Confirm and Pay</h3>
          <div className="w-9" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Listing Summary Card */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
              <Image
                src={listing.images[0]?.url || ''}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between text-xs">
              <div>
                <p className="text-airbnb-gray">{listing.property_type} in {listing.city}</p>
                <h4 className="font-bold text-sm text-airbnb-dark line-clamp-1">{listing.title}</h4>
              </div>
              <p className="font-medium text-airbnb-dark">★ {listing.rating.toFixed(2)} ({listing.review_count} reviews)</p>
            </div>
          </div>

          {/* Trip Details */}
          <div className="flex flex-col gap-3 text-sm border-b border-gray-100 pb-4">
            <h4 className="font-bold text-airbnb-dark text-base">Your trip</h4>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-airbnb-dark">Dates</p>
                <p className="text-xs text-airbnb-gray">{bookingDetails.checkIn} to {bookingDetails.checkOut} ({bookingDetails.nights} nights)</p>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-airbnb-dark">Guests</p>
                <p className="text-xs text-airbnb-gray">{bookingDetails.guests} guest{bookingDetails.guests > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Payment Method (Mocked) */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-airbnb-dark text-base">Pay with</h4>
            <div className="flex items-center justify-between p-3.5 border border-gray-300 rounded-xl bg-white">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-airbnb-red" />
                <span className="text-sm font-semibold text-airbnb-dark">Visa ending in 4242 (Mocked)</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          {/* Total Price */}
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-base text-airbnb-dark">Total (USD)</span>
            <span className="font-extrabold text-xl text-airbnb-dark">${bookingDetails.totalPrice}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-airbnb-gray bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Mocked instant checkout. All bookings persist to database.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleConfirmPay}
            disabled={isSubmitting}
            className="w-full bg-airbnb-red text-white font-bold py-3.5 rounded-xl hover:bg-airbnb-hover transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Confirming reservation...</span>
              </>
            ) : (
              <span>Confirm & Pay ${bookingDetails.totalPrice}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
