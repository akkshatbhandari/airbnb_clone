'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Listing } from '@/lib/types';
import { Star, ChevronDown, ChevronUp, Flag, AlertCircle, Plus, Minus } from 'lucide-react';
import { fetchBookedDates } from '@/lib/api';

interface ReservationWidgetProps {
  listing: Listing;
  onReserve: (bookingDetails: {
    checkIn: string;
    checkOut: string;
    guests: number;
    adults: number;
    childrenCount: number;
    infants: number;
    pets: number;
    totalPrice: number;
    nights: number;
  }) => void;
}

export const ReservationWidget: React.FC<ReservationWidgetProps> = ({ listing, onReserve }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  
  // Detailed Guest Counters matching Airbnb layout
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedRanges, setBookedRanges] = useState<{ check_in: string; check_out: string }[]>([]);
  const guestDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBookedDates(listing.id).then(setBookedRanges);
  }, [listing.id]);

  // Close guest dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(e.target as Node)) {
        setIsGuestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalGuests = adults + childrenCount;
  const maxGuests = listing.max_guests || 4;

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
      guests: totalGuests,
      adults,
      childrenCount,
      infants,
      pets,
      totalPrice,
      nights
    });
  };

  // Format guest summary text
  const getGuestSummaryText = () => {
    const parts = [];
    parts.push(`${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`);
    if (infants > 0) parts.push(`${infants} infant${infants !== 1 ? 's' : ''}`);
    if (pets > 0) parts.push(`${pets} pet${pets !== 1 ? 's' : ''}`);
    return parts.join(', ');
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
      <div className="border border-gray-300 rounded-2xl divide-y divide-gray-300">
        <div className="grid grid-cols-2 divide-x divide-gray-300">
          <div className="p-3 bg-gray-50/50 rounded-tl-2xl">
            <label className="text-[10px] font-bold uppercase text-airbnb-dark block">CHECK-IN</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-airbnb-dark focus:outline-none cursor-pointer"
            />
          </div>
          <div className="p-3 bg-gray-50/50 rounded-tr-2xl">
            <label className="text-[10px] font-bold uppercase text-airbnb-dark block">CHECKOUT</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-airbnb-dark focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Expandable Airbnb Guest Dropdown Trigger */}
        <div className="relative" ref={guestDropdownRef}>
          <div
            onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
            className="p-3 bg-gray-50/50 cursor-pointer flex items-center justify-between rounded-b-2xl hover:bg-gray-100/60 transition-colors"
          >
            <div>
              <label className="text-[10px] font-bold uppercase text-airbnb-dark block pointer-events-none">GUESTS</label>
              <p className="text-xs font-semibold text-airbnb-dark pointer-events-none">{getGuestSummaryText()}</p>
            </div>
            {isGuestDropdownOpen ? (
              <ChevronUp className="w-4 h-4 text-airbnb-dark shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-airbnb-dark shrink-0" />
            )}
          </div>

          {/* Airbnb Expandable Guests Selector Popup (Matching PDF Problem 2 & 3 Screenshot) */}
          {isGuestDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 flex flex-col gap-4 animate-in fade-in duration-150">
              {/* Adults */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-bold text-airbnb-dark">Adults</p>
                  <p className="text-xs text-airbnb-gray">Age 13+</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => setAdults(adults - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-sm w-4 text-center text-airbnb-dark">{adults}</span>
                  <button
                    type="button"
                    disabled={totalGuests >= maxGuests}
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-bold text-airbnb-dark">Children</p>
                  <p className="text-xs text-airbnb-gray">Ages 2–12</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={childrenCount <= 0}
                    onClick={() => setChildrenCount(childrenCount - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-sm w-4 text-center text-airbnb-dark">{childrenCount}</span>
                  <button
                    type="button"
                    disabled={totalGuests >= maxGuests}
                    onClick={() => setChildrenCount(childrenCount + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-bold text-airbnb-dark">Infants</p>
                  <p className="text-xs text-airbnb-gray">Under 2</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={infants <= 0}
                    onClick={() => setInfants(infants - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-sm w-4 text-center text-airbnb-dark">{infants}</span>
                  <button
                    type="button"
                    disabled={infants >= 5}
                    onClick={() => setInfants(infants + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pets */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-bold text-airbnb-dark">Pets</p>
                  <p className="text-xs text-airbnb-gray">Bringing a service animal?</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={pets <= 0}
                    onClick={() => setPets(pets - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-sm w-4 text-center text-airbnb-dark">{pets}</span>
                  <button
                    type="button"
                    disabled={pets >= 3}
                    onClick={() => setPets(pets + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30 hover:border-airbnb-dark"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <span className="text-[11px] text-airbnb-gray">Maximum {maxGuests} guests</span>
                <button
                  type="button"
                  onClick={() => setIsGuestDropdownOpen(false)}
                  className="text-xs font-bold text-airbnb-dark underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
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
          <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-200 text-airbnb-dark">
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
