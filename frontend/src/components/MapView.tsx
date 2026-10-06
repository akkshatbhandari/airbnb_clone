'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { Star, MapPin } from 'lucide-react';

interface MapViewProps {
  listings: Listing[];
}

export const MapView: React.FC<MapViewProps> = ({ listings }) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    // Dynamic import Leaflet stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <div className="w-full h-[calc(100vh-210px)] min-h-[500px] rounded-3xl overflow-hidden relative shadow-airbnb border border-gray-200 bg-slate-100">
      {/* Map Tile Layer Simulation */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1800&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-sky-950/20 backdrop-blur-[0.5px]" />
      </div>

      {/* Interactive Price Badge Pins Grid Canvas */}
      <div className="relative z-10 w-full h-full p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto">
        {listings.map((listing, idx) => {
          const isSelected = selectedListing?.id === listing.id;

          return (
            <div
              key={listing.id}
              className="self-center justify-self-center transition-transform duration-200"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="relative">
                {/* Custom Airbnb Price Badge Marker */}
                <button
                  onClick={() => setSelectedListing(isSelected ? null : listing)}
                  className={`px-3.5 py-1.5 rounded-full font-bold text-xs shadow-2xl transition-all transform hover:scale-110 flex items-center gap-1 cursor-pointer border ${
                    isSelected
                      ? 'bg-airbnb-dark text-white scale-110 border-black ring-2 ring-white'
                      : 'bg-white text-airbnb-dark border-gray-200 hover:bg-airbnb-dark hover:text-white'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-airbnb-red shrink-0" />
                  <span>${listing.price_per_night}</span>
                </button>

                {/* Selected Listing Popover Card */}
                {isSelected && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-60 bg-white rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 border border-gray-200">
                    <Link href={`/listings/${listing.id}`}>
                      <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden mb-2">
                        <Image
                          src={listing.images[0]?.url || ''}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="px-1 text-left">
                        <div className="flex items-center justify-between text-xs font-semibold text-airbnb-dark">
                          <span className="truncate">{listing.city}</span>
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-airbnb-dark text-airbnb-dark" />
                            <span>{listing.rating.toFixed(2)}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-airbnb-gray truncate mt-0.5">{listing.title}</p>
                        <p className="text-xs font-bold text-airbnb-dark mt-1.5">
                          ${listing.price_per_night} <span className="font-normal text-airbnb-gray">/ night</span>
                        </p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
