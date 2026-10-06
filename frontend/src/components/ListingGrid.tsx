'use client';

import React from 'react';
import { Listing } from '@/lib/types';
import { ListingCard } from './ListingCard';

interface ListingGridProps {
  listings: Listing[];
  isLoading?: boolean;
}

export const ListingGrid: React.FC<ListingGridProps> = ({ listings, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="animate-pulse flex flex-col gap-2">
            <div className="aspect-square bg-gray-200 rounded-2xl w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-bold text-airbnb-dark mb-1">No listings found</h3>
        <p className="text-airbnb-gray text-sm max-w-md">
          Try adjusting your search criteria or clearing your filters to explore available properties.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};
