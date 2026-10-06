'use client';

import React, { useState, useEffect } from 'react';
import { Listing } from '@/lib/types';
import { Star, ChevronDown, Flag, AlertCircle } from 'lucide-react';
import { fetchBookedDates } from '@/lib/api';

interface ReservationWidgetProps {
  listing: Listing;
  onReserve: (bookingDetails: {
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    nights: number;
  }) => void;
}

export const ReservationWidget: React.FC<ReservationWidgetProps> = ({ listing, onReserve }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [bookedRanges, setBookedRanges] = useState<{ check_in: string; check_out: string }[]>([]);

  useEffect(() => {
    fetchBookedDates(listing.id).then(setBookedRanges);
  }, [listing.id]);

  // Calculate nights difference
  let nights = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const basePrice = nights > 0 ? nights * listing.price_per_night : 0;
  const cleaningFee = nights > 0 ? listing.cleaning_fee : 0;
  const serviceFee = nights > 0 ? listing.service_fee : 0;
  const totalPrice = basePrice + cleaningFee + serviceFee;

  const handleReserveClick = () => {
    setError(null);

    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates.');
      return;
    }

    if (nights <= 0) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    // Overlap validation
    const hasOverlap = bookedRanges.some(r => {
      return (checkIn < r.check_out && checkOut > r.check_in);
    });

    if (hasOverlap) {
      setError('These dates overlap with an existing confirmed booking.');
      return;
    }

    onReserve({
      checkIn,
      checkOut,
      guests,
      totalPrice,
      nights
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-airbnb sticky top-28 flex flex-col gap-5">
      {/* Header Price & Rating */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold text-airbnb-dark">${listing.price_per_night}</span>
          <span className="text-airbnb-gray text-sm font-normal"> / night</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-airbnb-dark">
          <Star className="w-4 h-4 fill-airbnb-dark text-airbnb-dark" />
          <span>{listing.rating.toFixed(2)}</span>
          <span className="text-airbnb-gray font-normal">({listing.review_count})</span>
        </div>
      </div>

      {/* Date & Guest Inputs Box */}
      <div className="border border-gray-300 rounded-2xl overflow-hidden divide-y divide-gray-300">
        <div className="grid grid-cols-2 divide-x divide-gray-300">
          <div className="p-3 bg-gray-50/50">
            <label className="text-[10px] font-bold uppercase text-airbnb-dark block">CHECK-IN</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
            />
          </div>
          <div className="p-3 bg-gray-50/50">
            <label className="text-[10px] font-bold uppercase text-airbnb-dark block">CHECKOUT</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="p-3 bg-gray-50/50">
          <label className="text-[10px] font-bold uppercase text-airbnb-dark block">GUESTS</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-transparent text-xs font-medium focus:outline-none cursor-pointer py-0.5"
          >
            {Array.from({ length: listing.max_guests }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} guest{i > 0 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Reserve Button */}
      <button
        onClick={handleReserveClick}
        className="w-full bg-airbnb-red text-white font-bold py-3.5 rounded-2xl hover:bg-airbnb-hover transition-colors shadow-md text-base"
      >
        Reserve
      </button>

      <p className="text-center text-xs text-airbnb-gray font-normal">You won't be charged yet</p>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 text-sm text-airbnb-dark">
          <div className="flex justify-between">
            <span className="underline">${listing.price_per_night} × {nights} nights</span>
            <span>${basePrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Cleaning fee</span>
            <span>${cleaningFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Airbnb service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-200">
            <span>Total before taxes</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      {/* Report listing link */}
      <div className="flex items-center justify-center gap-2 text-xs text-airbnb-gray hover:text-airbnb-dark cursor-pointer pt-2">
        <Flag className="w-3.5 h-3.5" />
        <span className="underline">Report this listing</span>
      </div>
    </div>
  );
};
