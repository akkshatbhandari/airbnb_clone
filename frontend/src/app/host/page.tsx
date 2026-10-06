'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { fetchListings, fetchBookings, deleteListing } from '@/lib/api';
import { Listing, Booking } from '@/lib/types';
import { useRole } from '@/context/RoleContext';
import { Building2, Plus, Trash2, Edit3, Calendar, Star, DollarSign, Award, ShieldAlert } from 'lucide-react';

export default function HostDashboardPage() {
  const { role, setRole, addToast } = useRole();
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchListings(), fetchBookings('HOST')])
      .then(([lData, bData]) => {
        setListings(lData);
        setBookings(bData);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      addToast('Listing Deleted', `"${title}" has been removed from your host account`, 'info');
    }
  };

  if (role === 'GUEST') {
    return (
      <div className="flex-1 flex flex-col bg-white text-airbnb-dark">
        <Navbar />
        <main className="max-w-2xl mx-auto my-20 p-10 text-center bg-gray-50 rounded-3xl border border-gray-200 shadow-lg flex flex-col items-center gap-4">
          <div className="p-4 bg-red-100 text-airbnb-red rounded-full">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold">Host Mode Required</h2>
          <p className="text-sm text-airbnb-gray max-w-md">
            You are currently in Guest mode. Switch to Host mode to view your hosting dashboard, edit properties, or publish new listings.
          </p>
          <button
            onClick={() => setRole('HOST')}
            className="mt-2 bg-airbnb-red text-white font-bold px-8 py-3.5 rounded-xl hover:bg-airbnb-hover transition-colors shadow-md text-sm"
          >
            Switch to Host Mode Now
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white text-airbnb-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col gap-10">
        {/* Host Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold">Welcome back, Sarah!</h1>
              <Award className="w-6 h-6 text-airbnb-red fill-airbnb-red/10" />
            </div>
            <p className="text-sm text-airbnb-gray mt-1">Manage your properties, view bookings, and host travelers worldwide.</p>
          </div>

          <Link
            href="/host/create"
            className="flex items-center gap-2 bg-airbnb-red text-white font-bold px-6 py-3 rounded-xl hover:bg-airbnb-hover transition-colors shadow-md text-sm shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Create New Listing</span>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-red-100 text-airbnb-red rounded-2xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-airbnb-gray font-semibold uppercase">Active Listings</p>
              <h3 className="text-2xl font-bold">{listings.length}</h3>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border border-gray-200 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-airbnb-gray font-semibold uppercase">Total Reservations</p>
              <h3 className="text-2xl font-bold">{bookings.length}</h3>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border border-gray-200 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-airbnb-gray font-semibold uppercase">Superhost Rating</p>
              <h3 className="text-2xl font-bold">4.95 ★</h3>
            </div>
          </div>
        </div>

        {/* Owned Listings Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Your Properties</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-3xl" />
              <div className="h-48 bg-gray-200 rounded-3xl" />
            </div>
          ) : listings.length === 0 ? (
            <p className="text-airbnb-gray text-sm">No properties listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col border border-gray-200 rounded-3xl overflow-hidden shadow-card bg-white"
                >
                  <div className="relative h-44 w-full bg-gray-100">
                    <Image
                      src={l.images[0]?.url || ''}
                      alt={l.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-airbnb-gray font-semibold">
                        <span>{l.city}, {l.country}</span>
                        <div className="flex items-center gap-1 text-airbnb-dark">
                          <Star className="w-3.5 h-3.5 fill-airbnb-dark text-airbnb-dark" />
                          <span>{l.rating.toFixed(2)}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-base line-clamp-1 mt-1">{l.title}</h3>
                      <p className="text-xs font-bold mt-1">${l.price_per_night} <span className="font-normal text-airbnb-gray">/ night</span></p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                      <Link
                        href={`/host/edit/${l.id}`}
                        className="font-bold text-airbnb-dark hover:text-airbnb-red flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Listing
                      </Link>

                      <button
                        onClick={() => handleDelete(l.id, l.title)}
                        className="font-semibold text-airbnb-red hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
