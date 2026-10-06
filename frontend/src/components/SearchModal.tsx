'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Calendar, Users, Plus, Minus } from 'lucide-react';
import { SearchFilters } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
  initialTab?: 'location' | 'dates' | 'guests';
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  initialTab = 'location'
}) => {
  const [activeStep, setActiveStep] = useState<'location' | 'dates' | 'guests'>('location');
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);

  useEffect(() => {
    if (initialTab) {
      setActiveStep(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    const combined: SearchFilters = {};
    if (city.trim()) combined.city = city.trim();
    if (checkIn) combined.check_in = checkIn;
    if (checkOut) combined.check_out = checkOut;
    const totalGuests = adults + childrenCount;
    if (totalGuests > 0) combined.guests = totalGuests;

    onSearch(combined);
    onClose();
  };

  const handleClear = () => {
    setCity('');
    setCheckIn('');
    setCheckOut('');
    setAdults(1);
    setChildrenCount(0);
    onSearch({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Modal Header with Step Tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveStep('location')}
              className={`text-sm font-bold pb-1 border-b-2 transition-colors ${
                activeStep === 'location'
                  ? 'border-airbnb-red text-airbnb-dark'
                  : 'border-transparent text-airbnb-gray hover:text-airbnb-dark'
              }`}
            >
              1. Where (Location)
            </button>
            <button
              onClick={() => setActiveStep('dates')}
              className={`text-sm font-bold pb-1 border-b-2 transition-colors ${
                activeStep === 'dates'
                  ? 'border-airbnb-red text-airbnb-dark'
                  : 'border-transparent text-airbnb-gray hover:text-airbnb-dark'
              }`}
            >
              2. When (Time / Dates)
            </button>
            <button
              onClick={() => setActiveStep('guests')}
              className={`text-sm font-bold pb-1 border-b-2 transition-colors ${
                activeStep === 'guests'
                  ? 'border-airbnb-red text-airbnb-dark'
                  : 'border-transparent text-airbnb-gray hover:text-airbnb-dark'
              }`}
            >
              3. Who (Guests)
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-airbnb-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Focused Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* STEP 1: LOCATION */}
          {activeStep === 'location' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-150">
              <label className="text-xs font-bold uppercase tracking-wider text-airbnb-dark flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-airbnb-red" />
                Where to? (Destination City or Country)
              </label>
              <input
                type="text"
                autoFocus
                placeholder="Search destinations (e.g. Miami, Paris, Aspen, Tokyo, Positano)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb-dark text-sm bg-white text-airbnb-dark"
              />
              <div className="flex items-center justify-between text-xs text-airbnb-gray pt-2">
                <span>Tip: Leave blank to search anywhere worldwide.</span>
                <button
                  onClick={() => setActiveStep('dates')}
                  className="font-bold text-airbnb-red hover:underline"
                >
                  Next: Select Dates →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATES / TIME */}
          {activeStep === 'dates' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <label className="text-xs font-bold uppercase tracking-wider text-airbnb-dark flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-airbnb-red" />
                Select Trip Dates (Check-in & Check-out)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-airbnb-dark">Check-in</span>
                  <input
                    type="date"
                    autoFocus
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb-dark text-sm bg-white text-airbnb-dark"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-airbnb-dark">Check-out</span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb-dark text-sm bg-white text-airbnb-dark"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-airbnb-gray pt-2">
                <button
                  onClick={() => setActiveStep('location')}
                  className="font-semibold text-airbnb-dark hover:underline"
                >
                  ← Back to Location
                </button>
                <button
                  onClick={() => setActiveStep('guests')}
                  className="font-bold text-airbnb-red hover:underline"
                >
                  Next: Add Guests →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GUESTS */}
          {activeStep === 'guests' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <label className="text-xs font-bold uppercase tracking-wider text-airbnb-dark flex items-center gap-1.5">
                <Users className="w-4 h-4 text-airbnb-red" />
                Who's coming? (Guest Counts)
              </label>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-airbnb-dark">Adults</p>
                  <p className="text-xs text-airbnb-gray">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => setAdults(adults - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-sm w-4 text-center text-airbnb-dark">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-airbnb-dark">Children</p>
                  <p className="text-xs text-airbnb-gray">Ages 2–12</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={childrenCount <= 0}
                    onClick={() => setChildrenCount(childrenCount - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-sm w-4 text-center text-airbnb-dark">{childrenCount}</span>
                  <button
                    type="button"
                    onClick={() => setChildrenCount(childrenCount + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-airbnb-gray pt-2">
                <button
                  onClick={() => setActiveStep('dates')}
                  className="font-semibold text-airbnb-dark hover:underline"
                >
                  ← Back to Dates
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleClear}
            className="text-sm font-semibold text-airbnb-dark underline hover:opacity-80"
          >
            Clear all
          </button>

          <button
            onClick={handleApply}
            className="flex items-center gap-2 bg-airbnb-red text-white font-semibold px-7 py-3 rounded-xl hover:bg-airbnb-hover transition-colors shadow-md text-sm"
          >
            <Search className="w-4 h-4 stroke-[3]" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};
