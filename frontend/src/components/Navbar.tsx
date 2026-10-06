'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Search, Globe, Menu, User as UserIcon, Heart, Luggage, Building2, PlusCircle } from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, wishlistIds, addToast } = useRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleRole = () => {
    const nextRole = role === 'GUEST' ? 'HOST' : 'GUEST';
    setRole(nextRole);
    addToast(
      `Switched to ${nextRole === 'HOST' ? 'Host Mode' : 'Guest Mode'}`,
      nextRole === 'HOST' ? 'You can now create and manage properties' : 'You can browse and book stays',
      'info'
    );
    if (nextRole === 'HOST') {
      router.push('/host');
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-airbnb-red group">
          <svg
            className="h-9 w-9 fill-current transition-transform duration-200 group-hover:scale-105"
            viewBox="0 0 32 32"
          >
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.308-3.238 7.806-7.5 7.806-2.58 0-4.908-1.258-6.417-3.264l-.583-.812-.583.812C12.908 30.742 10.58 32 8 32 3.738 32 .5 28.502.5 24.194c0-1.162.298-2.29.96-3.711l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C10.537 1.963 11.992 1 14 1h2zm0 2h-2c-1.217 0-2.227.6-3.251 2.435l-.478.919c-1.921 3.766-6.042 12.404-7.009 14.654C2.71 22.19 2.5 23.086 2.5 24.194c0 3.208 2.378 5.806 5.5 5.806 2.051 0 3.962-1.045 5.138-2.775l1.362-2.005 1.362 2.005C17.038 28.955 18.949 30 21 30c3.122 0 5.5-2.598 5.5-5.806 0-1.108-.21-2.004-.762-3.186l-.142-.321c-.967-2.25-5.088-10.888-7.009-14.654l-.478-.919C17.227 3.6 16.217 3 15 3h1z" />
          </svg>
          <span className="font-bold text-xl tracking-tight hidden sm:inline text-airbnb-red">
            airbnb
          </span>
        </Link>

        {/* Center Search Bar Trigger */}
        <div
          onClick={onOpenSearch}
          className="flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-search hover:shadow-airbnb transition-all duration-200 cursor-pointer text-sm font-medium text-airbnb-dark bg-white"
        >
          <button className="px-3 font-semibold border-r border-gray-200 hover:text-airbnb-red transition-colors">
            Anywhere
          </button>
          <button className="px-3 font-semibold border-r border-gray-200 hover:text-airbnb-red transition-colors hidden md:inline">
            Any week
          </button>
          <button className="px-3 text-airbnb-gray hover:text-airbnb-dark transition-colors hidden lg:inline">
            Add guests
          </button>
          <div className="bg-airbnb-red text-white p-2 rounded-full ml-2">
            <Search className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Right Menu Controls */}
        <div className="flex items-center gap-3">
          {/* Guest vs Host Switcher */}
          <button
            onClick={toggleRole}
            className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full hover:bg-gray-100 transition-colors text-airbnb-dark border border-gray-200 sm:border-transparent"
          >
            {role === 'GUEST' ? 'Switch to Host' : 'Switch to Guest'}
          </button>

          {/* User Menu Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 border border-gray-300 rounded-full p-2 pl-3 hover:shadow-search transition-all duration-200 bg-white"
            >
              <Menu className="w-4 h-4 text-airbnb-dark" />
              <div className="w-7 h-7 bg-airbnb-gray text-white rounded-full flex items-center justify-center text-xs font-bold">
                {role === 'HOST' ? 'H' : 'G'}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-airbnb border border-gray-100 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-airbnb-dark">
                    {role === 'HOST' ? 'Sarah Jenkins (Host)' : 'Alex Morgan (Guest)'}
                  </p>
                  <p className="text-xs text-airbnb-gray">Active Mode: {role}</p>
                </div>

                <Link
                  href="/trips"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-airbnb-dark transition-colors"
                >
                  <Luggage className="w-4 h-4 text-airbnb-gray" />
                  My Trips
                </Link>

                <Link
                  href="/wishlists"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-airbnb-dark transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-airbnb-gray" />
                    Wishlists
                  </div>
                  {wishlistIds.size > 0 && (
                    <span className="bg-airbnb-red text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {wishlistIds.size}
                    </span>
                  )}
                </Link>

                <div className="border-t border-gray-100 my-1"></div>

                <Link
                  href="/host"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-airbnb-dark font-medium transition-colors"
                >
                  <Building2 className="w-4 h-4 text-airbnb-gray" />
                  Host Dashboard
                </Link>

                <Link
                  href="/host/create"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-airbnb-red font-semibold transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-airbnb-red" />
                  Create New Listing
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
