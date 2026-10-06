'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { fetchBookings, cancelBooking } from '@/lib/api';
import { Booking } from '@/lib/types';
import { useRole } from '@/context/RoleContext';
import { Calendar, Luggage, MapPin, XCircle } from 'lucide-react';

export default function TripsPage() {
  const { addToast } = useRole();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings('GUEST')
      .then(setBookings)
      .finally(() => setIsLoading(false));
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
      addToast('Reservation Cancelled', 'Your trip has been cancelled and dates freed', 'info');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <h1 className="text-3xl font-extrabold text-airbnb-dark mb-8">My Trips</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-44 bg-gray-200 rounded-3xl" />
            <div className="h-44 bg-gray-200 rounded-3xl" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-200 rounded-3xl text-center">
            <Luggage className="w-16 h-16 text-airbnb-gray mb-4" />
            <h3 className="text-xl font-bold text-airbnb-dark mb-1">No trips booked... yet!</h3>
            <p className="text-sm text-airbnb-gray mb-6">Time to dust off your bags and start planning your next adventure.</p>
            <Link
              href="/"
              className="bg-airbnb-red text-white font-bold px-6 py-3 rounded-xl hover:bg-airbnb-hover transition-colors shadow-md text-sm"
            >
              Start searching
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col border border-gray-200 rounded-3xl overflow-hidden shadow-card hover:shadow-airbnb transition-all bg-white"
              >
                {/* Image & Status Tag */}
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={b.listing?.images[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'}
                    alt={b.listing?.title || 'Property'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full shadow-xs ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-base text-airbnb-dark line-clamp-1">{b.listing?.title}</h3>
                    <p className="text-xs text-airbnb-gray flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-airbnb-red" />
                      {b.listing?.city}, {b.listing?.country}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-airbnb-dark bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Calendar className="w-4 h-4 text-airbnb-dark" />
                      <span>{b.check_in} — {b.check_out}</span>
                    </div>
                    <p className="text-airbnb-gray">{b.guests_count} guest{b.guests_count > 1 ? 's' : ''} · Total: <span className="font-bold text-airbnb-dark">${b.total_price}</span></p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Link
                      href={`/listings/${b.listing_id}`}
                      className="text-xs font-bold text-airbnb-dark underline hover:opacity-80"
                    >
                      View listing
                    </Link>

                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-xs font-semibold text-airbnb-red hover:underline flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel trip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
