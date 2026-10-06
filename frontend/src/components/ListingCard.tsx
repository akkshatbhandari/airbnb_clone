'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/lib/types';
import { useRole } from '@/context/RoleContext';
import { Heart, Star, ChevronLeft, ChevronRight, Award } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { wishlistIds, toggleWishlistId } = useRole();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isSaved = wishlistIds.has(listing.id);
  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [{ id: '1', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', is_primary: true, display_order: 0 }];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistId(listing.id);
  };

  return (
    <div className="group flex flex-col cursor-pointer transition-transform duration-200">
      <Link href={`/listings/${listing.id}`} className="block">
        {/* Photo Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 mb-3 shadow-card">
          <Image
            src={images[currentImageIndex].url}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Wishlist Heart Icon */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full hover:scale-110 active:scale-95 transition-transform z-10"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-6 h-6 stroke-[2] drop-shadow-md transition-colors ${
                isSaved ? 'fill-airbnb-red stroke-airbnb-red' : 'fill-black/40 stroke-white'
              }`}
            />
          </button>

          {/* Superhost Badge */}
          {listing.host?.is_superhost && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-airbnb-dark flex items-center gap-1 shadow-sm z-10 border border-gray-200/50">
              <Award className="w-3.5 h-3.5 text-airbnb-red" />
              Superhost
            </div>
          )}

          {/* Photo Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
              >
                <ChevronLeft className="w-4 h-4 text-airbnb-dark" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
              >
                <ChevronRight className="w-4 h-4 text-airbnb-dark" />
              </button>

              {/* Carousel Indicators Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Card Details */}
        <div className="flex flex-col gap-0.5 text-sm">
          <div className="flex items-center justify-between font-semibold text-airbnb-dark">
            <span className="truncate pr-2">{listing.city}, {listing.country}</span>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-airbnb-dark text-airbnb-dark" />
              <span>{listing.rating.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-airbnb-gray text-xs truncate">{listing.title}</p>
          <p className="text-airbnb-gray text-xs">{listing.property_type} · {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}</p>

          <div className="mt-1">
            <span className="font-bold text-airbnb-dark">${listing.price_per_night}</span>
            <span className="text-airbnb-gray text-xs font-normal"> / night</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
