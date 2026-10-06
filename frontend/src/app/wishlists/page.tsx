'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ListingGrid } from '@/components/ListingGrid';
import { fetchListings } from '@/lib/api';
import { Listing } from '@/lib/types';
import { useRole } from '@/context/RoleContext';
import { Heart } from 'lucide-react';

export default function WishlistsPage() {
  const { wishlistIds } = useRole();
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchListings()
      .then(setAllListings)
      .finally(() => setIsLoading(false));
  }, []);

  const savedListings = allListings.filter((l) => wishlistIds.has(l.id));

  return (
    <div className="flex-1 flex flex-col bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 fill-airbnb-red text-airbnb-red" />
          <h1 className="text-3xl font-extrabold text-airbnb-dark">Wishlists</h1>
        </div>

        {isLoading ? (
          <ListingGrid listings={[]} isLoading={true} />
        ) : savedListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-200 rounded-3xl text-center">
            <Heart className="w-16 h-16 text-airbnb-gray mb-4 stroke-1" />
            <h3 className="text-xl font-bold text-airbnb-dark mb-1">Create your first wishlist</h3>
            <p className="text-sm text-airbnb-gray mb-6">As you search, click the heart icon on any home to save your favorite places.</p>
          </div>
        ) : (
          <ListingGrid listings={savedListings} />
        )}
      </main>
    </div>
  );
}
