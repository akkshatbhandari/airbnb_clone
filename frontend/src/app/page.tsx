'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CategoryBar } from '@/components/CategoryBar';
import { ListingGrid } from '@/components/ListingGrid';
import { MapView } from '@/components/MapView';
import { SearchModal } from '@/components/SearchModal';
import { FilterModal } from '@/components/FilterModal';
import { fetchCategories, fetchListings } from '@/lib/api';
import { Category, Listing, SearchFilters } from '@/lib/types';
import { Map, List } from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialTab, setSearchInitialTab] = useState<'location' | 'dates' | 'guests'>('location');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const combinedFilters: SearchFilters = {
      ...filters,
      category_id: selectedCategoryId || undefined,
    };

    fetchListings(combinedFilters)
      .then(setListings)
      .finally(() => setIsLoading(false));
  }, [selectedCategoryId, filters]);

  const handleOpenSearch = (tab: 'location' | 'dates' | 'guests' = 'location') => {
    setSearchInitialTab(tab);
    setIsSearchOpen(true);
  };

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex-1 flex flex-col relative pb-20 bg-white">
      {/* Navigation Header */}
      <Navbar onOpenSearch={handleOpenSearch} />

      {/* Category Pills Bar */}
      <CategoryBar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        onOpenFilterModal={() => setIsFilterOpen(true)}
      />

      {/* Main Listing View / Map View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {showMap ? (
          <MapView listings={listings} />
        ) : (
          <ListingGrid listings={listings} isLoading={isLoading} />
        )}
      </main>

      {/* Floating Bottom Map/List Toggle Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowMap(!showMap)}
          className="bg-airbnb-dark text-white font-semibold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all duration-200 text-sm border border-white/20"
        >
          {showMap ? (
            <>
              <span>Show list</span>
              <List className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Show map</span>
              <Map className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        initialTab={searchInitialTab}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
}
