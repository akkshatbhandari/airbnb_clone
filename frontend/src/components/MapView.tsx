'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/lib/types';
import { Star } from 'lucide-react';

interface MapViewProps {
  listings: Listing[];
}

export const MapView: React.FC<MapViewProps> = ({ listings }) => {
  useEffect(() => {
    // Dynamic import for Leaflet CSS
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
    <div className="w-full h-[calc(100vh-180px)] rounded-3xl overflow-hidden relative shadow-lg border border-gray-200 bg-slate-100 flex items-center justify-center">
      {/* Interactive Map Visual Mock with Real Price Marker Tags */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-sky-900/10 backdrop-blur-[1px]" />
      </div>

      {/* Floating Price Badge Pins */}
      <div className="relative z-10 w-full h-full p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 overflow-y-auto">
        {listings.map((listing, idx) => (
          <div
            key={listing.id}
            className="self-center justify-self-center animate-in zoom-in-95 duration-300"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="group relative">
              {/* Badge Button */}
              <div className="bg-white hover:bg-airbnb-dark hover:text-white text-airbnb-dark font-bold px-3.5 py-1.5 rounded-full shadow-airbnb border border-gray-200 transition-all transform hover:scale-110 cursor-pointer text-sm flex items-center gap-1">
                <span>${listing.price_per_night}</span>
              </div>

              {/* Hover Preview Card */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 bg-white rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 border border-gray-100">
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
                    <p className="text-[11px] text-airbnb-gray truncate">{listing.title}</p>
                    <p className="text-xs font-bold text-airbnb-dark mt-1">${listing.price_per_night} <span className="font-normal text-airbnb-gray">/ night</span></p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
