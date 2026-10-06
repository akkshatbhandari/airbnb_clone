'use client';

import React, { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { SearchFilters } from '@/lib/types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters
}) => {
  const [minPrice, setMinPrice] = useState<number>(currentFilters.min_price || 0);
  const [maxPrice, setMaxPrice] = useState<number>(currentFilters.max_price || 1000);
  const [propertyType, setPropertyType] = useState<string>(currentFilters.property_type || 'Any type');

  if (!isOpen) return null;

  const propertyTypes = ['Any type', 'Entire place', 'Private room', 'Shared room'];

  const handleApply = () => {
    onApplyFilters({
      ...currentFilters,
      min_price: minPrice > 0 ? minPrice : undefined,
      max_price: maxPrice < 1000 ? maxPrice : undefined,
      property_type: propertyType !== 'Any type' ? propertyType : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(1000);
    setPropertyType('Any type');
    onApplyFilters({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-airbnb-dark">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-base font-bold text-airbnb-dark">Filters</h3>
          <div className="w-9" />
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 divide-y divide-gray-100">
          {/* Price Range */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-airbnb-dark">Price range</h4>
            <p className="text-xs text-airbnb-gray">Nightly prices before taxes and fees</p>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 border border-gray-300 rounded-xl px-3 py-2">
                <label className="text-[10px] text-airbnb-gray font-semibold block uppercase">Minimum</label>
                <div className="flex items-center gap-1 font-semibold text-sm">
                  <span>$</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>

              <span className="text-airbnb-gray font-bold">-</span>

              <div className="flex-1 border border-gray-300 rounded-xl px-3 py-2">
                <label className="text-[10px] text-airbnb-gray font-semibold block uppercase">Maximum</label>
                <div className="flex items-center gap-1 font-semibold text-sm">
                  <span>$</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div className="pt-6 flex flex-col gap-4">
            <h4 className="text-lg font-bold text-airbnb-dark">Type of place</h4>
            <div className="grid grid-cols-2 gap-3">
              {propertyTypes.map((type) => {
                const isSelected = propertyType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setPropertyType(type)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                      isSelected
                        ? 'border-airbnb-dark bg-gray-50 ring-1 ring-airbnb-dark'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-semibold text-sm text-airbnb-dark">{type}</span>
                    {isSelected && <Check className="w-4 h-4 text-airbnb-dark self-end" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleReset}
            className="text-sm font-semibold text-airbnb-dark underline hover:opacity-80"
          >
            Clear all
          </button>

          <button
            onClick={handleApply}
            className="bg-airbnb-dark text-white font-semibold px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-md"
          >
            Show Places
          </button>
        </div>
      </div>
    </div>
  );
};
