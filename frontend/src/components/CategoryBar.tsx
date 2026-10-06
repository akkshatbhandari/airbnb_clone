'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import {
  Umbrella, Home, Castle, Mountain, Waves, Compass, Box, Sun, Sparkles, Flame, Trees, TrendingUp, SlidersHorizontal, ChevronLeft, ChevronRight
} from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onOpenFilterModal: () => void;
}

const getCategoryIcon = (iconName: string, slug?: string) => {
  const normalized = (iconName || slug || '').toLowerCase();

  if (normalized.includes('umbrella') || normalized.includes('beach')) return <Umbrella className="w-6 h-6" />;
  if (normalized.includes('home') || normalized.includes('cabin')) return <Home className="w-6 h-6" />;
  if (normalized.includes('castle') || normalized.includes('mansion')) return <Castle className="w-6 h-6" />;
  if (normalized.includes('mountain') || normalized.includes('view')) return <Mountain className="w-6 h-6" />;
  if (normalized.includes('wave') || normalized.includes('pool')) return <Waves className="w-6 h-6" />;
  if (normalized.includes('compass') || normalized.includes('lake')) return <Compass className="w-6 h-6" />;
  if (normalized.includes('box') || normalized.includes('tiny')) return <Box className="w-6 h-6" />;
  if (normalized.includes('sun') || normalized.includes('tropical')) return <Sun className="w-6 h-6" />;
  if (normalized.includes('sparkle') || normalized.includes('luxe')) return <Sparkles className="w-6 h-6" />;
  if (normalized.includes('flame') || normalized.includes('icon')) return <Flame className="w-6 h-6" />;
  if (normalized.includes('tree') || normalized.includes('farm')) return <Trees className="w-6 h-6" />;
  if (normalized.includes('trending')) return <TrendingUp className="w-6 h-6" />;

  return <Home className="w-6 h-6" />;
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onOpenFilterModal
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollContainerRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-20 z-30 bg-white border-b border-gray-200 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 relative">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-300 shadow-md items-center justify-center text-airbnb-dark hover:scale-105 transition-transform"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Horizontal Category Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2 scroll-smooth flex-1"
        >
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex flex-col items-center gap-2 pb-2 border-b-2 transition-all whitespace-nowrap group shrink-0 ${
              selectedCategoryId === null
                ? 'border-airbnb-dark text-airbnb-dark font-semibold'
                : 'border-transparent text-airbnb-gray hover:text-airbnb-dark hover:border-gray-300'
            }`}
          >
            <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs">All Homes</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`flex flex-col items-center gap-2 pb-2 border-b-2 transition-all whitespace-nowrap group shrink-0 ${
                  isSelected
                    ? 'border-airbnb-dark text-airbnb-dark font-semibold'
                    : 'border-transparent text-airbnb-gray hover:text-airbnb-dark hover:border-gray-300'
                }`}
              >
                <div className="group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.icon, cat.slug)}
                </div>
                <span className="text-xs font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-32 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-300 shadow-md items-center justify-center text-airbnb-dark hover:scale-105 transition-transform"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Filter Trigger Button */}
        <button
          onClick={onOpenFilterModal}
          className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 text-xs font-semibold text-airbnb-dark hover:border-airbnb-dark transition-all shrink-0 bg-white shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
};
