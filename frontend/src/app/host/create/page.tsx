'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { createListing } from '@/lib/api';
import { useRole } from '@/context/RoleContext';
import { Building2, Plus, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function CreateListingPage() {
  const router = useRouter();
  const { addToast } = useRole();

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
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createListing({
        category_id: categoryId,
        title,
        description,
        property_type: propertyType,
        city,
        country,
        address: address || `${city}, ${country}`,
        price_per_night: Number(pricePerNight),
        max_guests: Number(maxGuests),
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        bathrooms: Number(bathrooms),
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80']
      });

      addToast('Listing Published!', `"${title}" is now live on Airbnb`, 'success');
      router.push('/host');
    } catch (err: any) {
      addToast('Creation Failed', err.message || 'Could not save listing', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-airbnb-red" />
          <h1 className="text-3xl font-extrabold text-airbnb-dark">Create a New Listing</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-gray-50/50 p-8 rounded-3xl border border-gray-200">
          {/* Title & Description */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-airbnb-dark">Listing Overview</h3>

            <div>
              <label className="text-xs font-bold uppercase text-airbnb-dark block mb-1">Property Title *</label>
              <input
                type="text"
                placeholder="e.g. Modern Coastal Villa with Panoramic Ocean Views"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-airbnb-dark block mb-1">Description *</label>
              <textarea
                rows={4}
                placeholder="Describe what makes your space unique, amenities, surroundings..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-airbnb-dark">Location</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-airbnb-dark block mb-1">City *</label>
                <input
                  type="text"
                  placeholder="e.g. Miami Beach"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-airbnb-dark block mb-1">Country *</label>
                <input
                  type="text"
                  placeholder="e.g. United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Capacity */}
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-airbnb-dark">Pricing & Capacity</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-airbnb-dark block mb-1">Price / Night ($)</label>
                <input
                  type="number"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-airbnb-dark block mb-1">Max Guests</label>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-airbnb-dark block mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-airbnb-dark block mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white"
                />
              </div>
            </div>
          </div>

          {/* Photo Management */}
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-airbnb-dark flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-airbnb-red" />
              Photos (URLs)
            </h3>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste image URL (e.g. Unsplash URL)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-airbnb-dark bg-white"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-airbnb-dark text-white font-semibold px-5 rounded-xl hover:bg-black transition-colors text-sm"
              >
                Add
              </button>
            </div>

            {/* Thumbnail Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {images.map((url, idx) => (
                <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden group bg-gray-200 border border-gray-300">
                  <Image src={url} alt="Listing preview" fill className="object-cover" />
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
              <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
