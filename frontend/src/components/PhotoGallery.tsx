'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ListingImage } from '@/lib/types';
import { Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryProps {
  images: ListingImage[];
  title: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, title }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    { id: '1', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', is_primary: true, display_order: 0 }
  ];

  const mainPhoto = displayImages[0];
  const gridPhotos = displayImages.slice(1, 5);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="relative">
      {/* Airbnb 5-Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[300px] sm:h-[420px] relative">
        {/* Main Large Image (Left half) */}
        <div
          onClick={() => openLightbox(0)}
          className="md:col-span-2 relative h-full cursor-pointer overflow-hidden group"
        >
          <Image
            src={mainPhoto.url}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>

        {/* 4 Grid Images (Right half) */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
          {gridPhotos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => openLightbox(idx + 1)}
              className="relative h-full cursor-pointer overflow-hidden group"
            >
              <Image
                src={photo.url}
                alt={`${title} photo ${idx + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Show All Photos Floating Button */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs text-airbnb-dark font-semibold px-4 py-2 rounded-xl shadow-md border border-gray-200 flex items-center gap-2 hover:bg-white text-xs sm:text-sm transition-all"
        >
          <Grid className="w-4 h-4" />
          <span>Show all photos</span>
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <span className="text-sm font-medium">
              {activePhotoIndex + 1} / {displayImages.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Main Image Display */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            <button
              onClick={() => setActivePhotoIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-5xl h-full max-h-[75vh]">
              <Image
                src={displayImages[activePhotoIndex].url}
                alt={`${title} fullscreen`}
                fill
                className="object-contain"
              />
            </div>

            <button
              onClick={() => setActivePhotoIndex((prev) => (prev + 1) % displayImages.length)}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Thumbnails Bar */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2">
            {displayImages.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  idx === activePhotoIndex ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <Image src={img.url} alt="thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
