'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { fetchListingById } from '@/lib/api';
import { useRole } from '@/context/RoleContext';
import { Building2, X, Image as ImageIcon, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function EditListingPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { role, addToast } = useRole();

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('cat_beach');
  const [propertyType, setPropertyType] = useState('Entire place');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [pricePerNight, setPricePerNight] = useState(250);
  const [maxGuests, setMaxGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListingById(id).then((listing) => {
        if (listing) {
          setTitle(listing.title);
          setDescription(listing.description);
          setCategoryId(listing.category_id || 'cat_beach');
          setPropertyType(listing.property_type || 'Entire place');
          setCity(listing.city);
          setCountry(listing.country);
          setAddress(listing.address);
          setPricePerNight(listing.price_per_night);
          setMaxGuests(listing.max_guests);
          setBedrooms(listing.bedrooms);
          setBeds(listing.beds);
          setBathrooms(listing.bathrooms);
          setImages(listing.images?.map((img) => img.url) || []);
        }
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !city || !country || !pricePerNight) {
      addToast('Missing Required Fields', 'Please complete title, city, country, and price', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: categoryId,
          title,
          description,
          property_type: propertyType,
          city,
          country,
          address,
          price_per_night: Number(pricePerNight),
          max_guests: Number(maxGuests),
          bedrooms: Number(bedrooms),
          beds: Number(beds),
          bathrooms: Number(bathrooms),
          images: images
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Could not update listing');
      }

      addToast('Listing Updated!', `"${title}" has been saved successfully`, 'success');
      router.push('/host');
    } catch (err: any) {
      addToast('Update Failed', err.message || 'Could not update listing', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (role === 'GUEST') {
    return (
      <div className="flex-1 flex flex-col bg-white text-airbnb-dark">
        <Navbar />
        <div className="max-w-xl mx-auto my-20 p-8 text-center bg-gray-50 rounded-3xl border border-gray-200">
          <Building2 className="w-12 h-12 text-airbnb-red mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-airbnb-dark mb-2">Host Mode Required</h2>
          <p className="text-sm text-airbnb-gray mb-6">Switch to Host mode to edit your listings.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto p-10 w-full animate-pulse flex flex-col gap-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white text-airbnb-dark">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <button
          onClick={() => router.push('/host')}
          className="flex items-center gap-2 text-xs font-bold text-airbnb-gray hover:text-airbnb-dark mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Host Dashboard
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-airbnb-red" />
          <h1 className="text-3xl font-extrabold">Edit Property Listing</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-gray-50/50 p-8 rounded-3xl border border-gray-200">
          {/* Title & Description */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Listing Overview</h3>

            <div>
              <label className="text-xs font-bold uppercase block mb-1">Property Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white text-airbnb-dark"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase block mb-1">Description *</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white text-airbnb-dark"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold">Location</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase block mb-1">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white text-airbnb-dark"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">Country *</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white text-airbnb-dark"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Capacity */}
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold">Pricing & Capacity</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold uppercase block mb-1">Price / Night ($)</label>
                <input
                  type="number"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white text-airbnb-dark"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">Max Guests</label>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white text-airbnb-dark"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white text-airbnb-dark"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white text-airbnb-dark"
                />
              </div>
            </div>
          </div>

          {/* Photo Management */}
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-airbnb-red" />
              Photos (URLs)
            </h3>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste image URL (Unsplash)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white text-airbnb-dark"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-airbnb-dark text-white font-semibold px-5 rounded-xl hover:bg-black transition-colors text-sm"
              >
                Add
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {images.map((url, idx) => (
                <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden group bg-gray-200 border border-gray-300">
                  <Image src={url} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-airbnb-red text-white font-bold px-8 py-3.5 rounded-xl hover:bg-airbnb-hover transition-colors shadow-md text-base flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
