'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { PhotoGallery } from '@/components/PhotoGallery';
import { ReservationWidget } from '@/components/ReservationWidget';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ReviewsSection } from '@/components/ReviewsSection';
import { fetchListingById } from '@/lib/api';
import { Listing } from '@/lib/types';
import { useRole } from '@/context/RoleContext';
import { Star, Award, Heart, Share, DoorOpen, Calendar, ShieldCheck, Wifi, Utensils, Waves, Wind, Car, Flame, Laptop, Zap } from 'lucide-react';

const amenityIconMap: Record<string, React.ReactNode> = {
  Wifi: <Wifi className="w-5 h-5 text-airbnb-dark" />,
  Utensils: <Utensils className="w-5 h-5 text-airbnb-dark" />,
  Waves: <Waves className="w-5 h-5 text-airbnb-dark" />,
  Wind: <Wind className="w-5 h-5 text-airbnb-dark" />,
  Car: <Car className="w-5 h-5 text-airbnb-dark" />,
  Flame: <Flame className="w-5 h-5 text-airbnb-dark" />,
  Laptop: <Laptop className="w-5 h-5 text-airbnb-dark" />,
  Zap: <Zap className="w-5 h-5 text-airbnb-dark" />,
};

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { wishlistIds, toggleWishlistId, addToast } = useRole();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    nights: number;
  } | null>(null);

  useEffect(() => {
    if (id) {
      fetchListingById(id)
        .then(setListing)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 w-full animate-pulse flex flex-col gap-6">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-[400px] bg-gray-200 rounded-3xl w-full" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-airbnb-dark">Listing not found</h2>
        </div>
      </div>
    );
  }

  const isSaved = wishlistIds.has(listing.id);

  const handleReserve = (details: any) => {
    setBookingDetails(details);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied!', 'Listing link copied to clipboard', 'info');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white text-airbnb-dark transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-6">
        {/* Title Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{listing.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between text-sm gap-4">
            <div className="flex items-center gap-2 font-semibold">
              <Star className="w-4 h-4 fill-airbnb-dark text-airbnb-dark" />
              <span>{listing.rating.toFixed(2)}</span>
              <span>·</span>
              <span className="underline">{listing.review_count} reviews</span>
              {listing.host?.is_superhost && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-airbnb-gray">
                    <Award className="w-3.5 h-3.5 text-airbnb-red" />
                    Superhost
                  </span>
                </>
              )}
              <span>·</span>
              <span className="underline font-normal text-airbnb-gray">{listing.city}, {listing.country}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Share className="w-4 h-4" />
                <span className="underline">Share</span>
              </button>
              <button
                onClick={() => toggleWishlistId(listing.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-airbnb-red text-airbnb-red' : ''}`} />
                <span className="underline">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5-Photo Gallery */}
        <PhotoGallery images={listing.images} title={listing.title} />

        {/* Two-Column Detail Content & Sticky Booking Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6">
          {/* Left Column (Listing Details) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Host Header */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold">
                  {listing.property_type} hosted by {listing.host?.name || 'Sarah'}
                </h2>
                <p className="text-sm text-airbnb-gray mt-1">
                  {listing.max_guests} guests · {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''} · {listing.beds} bed{listing.beds > 1 ? 's' : ''} · {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
                </p>
              </div>

              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gray-200">
                <Image
                  src={listing.host?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                  alt={listing.host?.name || 'Host'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Key Features Highlights */}
            <div className="flex flex-col gap-5 pb-6 border-b border-gray-200 text-sm">
              <div className="flex items-start gap-4">
                <DoorOpen className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Self check-in</h4>
                  <p className="text-xs text-airbnb-gray">Check yourself in with the keypad.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Free cancellation for 48 hours</h4>
                  <p className="text-xs text-airbnb-gray">Get a full refund if you change your mind.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Airbnb Cover Protection</h4>
                  <p className="text-xs text-airbnb-gray">Every booking includes free protection from Host cancellations.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-gray-200">
              <p className="text-sm leading-relaxed whitespace-pre-line text-airbnb-dark">{listing.description}</p>
            </div>

            {/* Amenities Section */}
            <div className="pb-6 border-b border-gray-200 flex flex-col gap-4">
              <h3 className="text-xl font-bold">What this place offers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.amenities?.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-3 text-sm">
                    {amenityIconMap[amenity.icon] || <Wifi className="w-5 h-5 text-airbnb-dark" />}
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewsSection
              listingId={listing.id}
              reviews={listing.reviews || []}
              rating={listing.rating}
              reviewCount={listing.review_count}
            />
          </div>

          {/* Right Column (Sticky Reservation Widget) */}
          <div className="lg:col-span-1">
            <ReservationWidget listing={listing} onReserve={handleReserve} />
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {bookingDetails && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          listing={listing}
          bookingDetails={bookingDetails}
        />
      )}
    </div>
  );
}
