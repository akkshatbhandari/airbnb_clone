'use client';

import React, { useState } from 'react';
import { Search, X, MapPin, Calendar, Users, Plus, Minus } from 'lucide-react';
import { SearchFilters } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);

  if (!isOpen) return null;

  const handleApply = () => {
    onSearch({
      city: city.trim() || undefined,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
      guests: adults + childrenCount > 0 ? adults + childrenCount : undefined
    });
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-airbnb-dark">Stays Search</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-airbnb-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* Where */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-airbnb-dark flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-airbnb-red" />
              Where to?
            </label>
            <input
              type="text"
              placeholder="Search destinations (e.g. Miami, Paris, Aspen, Tokyo)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb-dark text-sm"
            />
          </div>

          {/* When */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-airbnb-dark flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-airbnb-red" />
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb-dark text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-airbnb-dark flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-airbnb-red" />
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-airbnb-dark text-sm"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-airbnb-dark flex items-center gap-1.5">
              <Users className="w-4 h-4 text-airbnb-red" />
              Who's coming?
            </label>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-semibold text-airbnb-dark">Adults</p>
                <p className="text-xs text-airbnb-gray">Ages 13 or above</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={adults <= 1}
                  onClick={() => setAdults(adults - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-sm w-4 text-center">{adults}</span>
                <button
                  onClick={() => setAdults(adults + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-airbnb-dark">Children</p>
                <p className="text-xs text-airbnb-gray">Ages 2–12</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={childrenCount <= 0}
                  onClick={() => setChildrenCount(childrenCount - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-sm w-4 text-center">{childrenCount}</span>
                <button
                  onClick={() => setChildrenCount(childrenCount + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-airbnb-dark"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
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
            className="flex items-center gap-2 bg-airbnb-red text-white font-semibold px-6 py-3 rounded-xl hover:bg-airbnb-hover transition-colors shadow-md"
          >
            <Search className="w-4 h-4 stroke-[3]" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};
