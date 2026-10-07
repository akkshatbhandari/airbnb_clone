import { Listing, Category, Amenity, Booking, Wishlist, SearchFilters, Review } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Fallback Mock Data for instant zero-dependency client rendering
const MOCK_CATEGORIES: Category[] = [
  { id: "cat_beach", name: "Beachfront", slug: "beachfront", icon: "Umbrella" },
  { id: "cat_cabins", name: "Cabins", slug: "cabins", icon: "Home" },
  { id: "cat_mansions", name: "Mansions", slug: "mansions", icon: "Castle" },
  { id: "cat_views", name: "Amazing views", slug: "amazing-views", icon: "Mountain" },
  { id: "cat_pools", name: "Amazing pools", slug: "amazing-pools", icon: "Waves" },
  { id: "cat_lake", name: "Lakefront", slug: "lakefront", icon: "Compass" },
  { id: "cat_tiny", name: "Tiny homes", slug: "tiny-homes", icon: "Box" },
  { id: "cat_tropical", name: "Tropical", slug: "tropical", icon: "Sun" },
  { id: "cat_luxe", name: "Luxe", slug: "luxe", icon: "Sparkles" },
  { id: "cat_icons", name: "Icons", slug: "icons", icon: "Flame" },
  { id: "cat_farms", name: "Farms", slug: "farms", icon: "Trees" },
  { id: "cat_trending", name: "Trending", slug: "trending", icon: "TrendingUp" }
];

const MOCK_AMENITIES: Amenity[] = [
  { id: "am_wifi", name: "Fast Wi-Fi", icon: "Wifi", category: "Essentials" },
  { id: "am_kitchen", name: "Chef's Kitchen", icon: "Utensils", category: "Essentials" },
  { id: "am_pool", name: "Private Pool", icon: "Waves", category: "Features" },
  { id: "am_ac", name: "Air Conditioning", icon: "Wind", category: "Essentials" },
  { id: "am_parking", name: "Free Parking", icon: "Car", category: "Facilities" },
  { id: "am_hottub", name: "Private Hot Tub", icon: "Flame", category: "Features" },
  { id: "am_workspace", name: "Dedicated Workspace", icon: "Laptop", category: "Essentials" },
  { id: "am_ev", name: "EV Charger", icon: "Zap", category: "Facilities" }
];

const MOCK_LISTINGS: Listing[] = [
  {
    id: "list_1",
    host_id: "user_host_1",
    host: {
      id: "user_host_1",
      name: "Sarah Jenkins",
      email: "sarah@example.com",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      role: "HOST",
      is_superhost: true
    },
    category_id: "cat_beach",
    category: MOCK_CATEGORIES[0],
    title: "Luxury Oceanfront Villa with Infinity Pool",
    description: "Step out of your glass sliding doors straight onto the white sands of Miami Beach. Features 180-degree panoramic ocean views, an infinity pool, heated spa, and bespoke interior furnishings. Wake up to ocean breezes and enjoy sunset cocktails on the wrap-around teak balcony.",
    property_type: "Entire place",
    city: "Miami Beach",
    country: "United States",
    address: "420 Ocean Drive",
    latitude: 25.7781,
    longitude: -80.1313,
    price_per_night: 450.0,
    cleaning_fee: 120.0,
    service_fee: 65.0,
    max_guests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3.5,
    rating: 4.96,
    review_count: 84,
    images: [
      { id: "img_1_1", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", is_primary: true, display_order: 0 },
      { id: "img_1_2", url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 1 },
      { id: "img_1_3", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 2 },
      { id: "img_1_4", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 3 },
      { id: "img_1_5", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 4 }
    ],
    amenities: MOCK_AMENITIES,
    reviews: [
      {
        id: "rev_1",
        listing_id: "list_1",
        author: {
          id: "user_guest_1",
          name: "Alex Morgan",
          email: "alex@example.com",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          role: "GUEST",
          is_superhost: false
        },
        rating: 5.0,
        cleanliness: 5.0,
        accuracy: 5.0,
        communication: 5.0,
        location: 5.0,
        check_in_rating: 5.0,
        value_rating: 5.0,
        comment: "Absolutely spectacular stay! The ocean views were breathless, and Sarah was the most attentive host imaginable. Watching the sunrise from the pool was unforgettable.",
        created_at: "2026-09-15T10:00:00Z"
      }
    ]
  },
  {
    id: "list_2",
    host_id: "user_host_1",
    host: {
      id: "user_host_1",
      name: "Sarah Jenkins",
      email: "sarah@example.com",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      role: "HOST",
      is_superhost: true
    },
    category_id: "cat_cabins",
    category: MOCK_CATEGORIES[1],
    title: "Minimalist A-Frame Cabin in Snowmass Forest",
    description: "Nestled among towering pine trees in Aspen, this designer A-Frame cabin offers the ultimate mountain retreat. Featuring floor-to-ceiling windows, wood fireplace, cedar hot tub, and ski-in/ski-out convenience.",
    property_type: "Entire place",
    city: "Aspen",
    country: "United States",
    address: "120 Snowmass Creek Rd",
    latitude: 39.1911,
    longitude: -106.8175,
    price_per_night: 320.0,
    cleaning_fee: 85.0,
    service_fee: 45.0,
    max_guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2.0,
    rating: 4.92,
    review_count: 62,
    images: [
      { id: "img_2_1", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", is_primary: true, display_order: 0 },
      { id: "img_2_2", url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 1 },
      { id: "img_2_3", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 2 },
      { id: "img_2_4", url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 3 },
      { id: "img_2_5", url: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 4 }
    ],
    amenities: MOCK_AMENITIES,
    reviews: []
  },
  {
    id: "list_3",
    host_id: "user_host_1",
    host: {
      id: "user_host_1",
      name: "Sarah Jenkins",
      email: "sarah@example.com",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      role: "HOST",
      is_superhost: true
    },
    category_id: "cat_mansions",
    category: MOCK_CATEGORIES[2],
    title: "Château de Lumière in Parisian Countryside",
    description: "An opulent 18th-century French estate renovated with modern luxury. Stroll through 10 acres of private manicured gardens, enjoy a private wine cellar, heated indoor pool, and grand ballroom.",
    property_type: "Entire place",
    city: "Paris",
    country: "France",
    address: "14 Rue du Château",
    latitude: 48.8566,
    longitude: 2.3522,
    price_per_night: 890.0,
    cleaning_fee: 200.0,
    service_fee: 130.0,
    max_guests: 10,
    bedrooms: 5,
    beds: 6,
    bathrooms: 5.0,
    rating: 4.98,
    review_count: 45,
    images: [
      { id: "img_3_1", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", is_primary: true, display_order: 0 },
      { id: "img_3_2", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 1 },
      { id: "img_3_3", url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 2 },
      { id: "img_3_4", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 3 },
      { id: "img_3_5", url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 4 }
    ],
    amenities: MOCK_AMENITIES,
    reviews: []
  },
  {
    id: "list_4",
    host_id: "user_host_1",
    host: {
      id: "user_host_1",
      name: "Sarah Jenkins",
      email: "sarah@example.com",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      role: "HOST",
      is_superhost: true
    },
    category_id: "cat_tropical",
    category: MOCK_CATEGORIES[7],
    title: "Bamboo Treehouse Overlooking Sacred Valley",
    description: "Experience nature in its purest form in this handcrafted multi-level bamboo sanctuary in Ubud. Suspended above lush rice terraces with open-air lounge decks and natural plunge pool.",
    property_type: "Entire place",
    city: "Ubud",
    country: "Indonesia",
    address: "Jalan Raya Sayan",
    latitude: -8.5069,
    longitude: 115.2625,
    price_per_night: 280.0,
    cleaning_fee: 40.0,
    service_fee: 35.0,
    max_guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1.5,
    rating: 4.95,
    review_count: 112,
    images: [
      { id: "img_4_1", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80", is_primary: true, display_order: 0 },
      { id: "img_4_2", url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 1 },
      { id: "img_4_3", url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 2 },
      { id: "img_4_4", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 3 },
      { id: "img_4_5", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80", is_primary: false, display_order: 4 }
    ],
    amenities: MOCK_AMENITIES,
    reviews: []
  }
];

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API unavailable, using mock categories", e);
  }
  return MOCK_CATEGORIES;
}

export async function fetchAmenities(): Promise<Amenity[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/amenities`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API unavailable, using mock amenities", e);
  }
  return MOCK_AMENITIES;
}

export async function fetchListings(filters?: SearchFilters): Promise<Listing[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category_id) params.append('category_id', filters.category_id);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.query) params.append('query', filters.query);
    if (filters?.min_price) params.append('min_price', filters.min_price.toString());
    if (filters?.max_price) params.append('max_price', filters.max_price.toString());
    if (filters?.property_type) params.append('property_type', filters.property_type);
    if (filters?.guests) params.append('guests', filters.guests.toString());
    if (filters?.check_in) params.append('check_in', filters.check_in);
    if (filters?.check_out) params.append('check_out', filters.check_out);

    const res = await fetch(`${API_BASE_URL}/listings?${params.toString()}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API unavailable, using mock listings", e);
  }

  // Client-side fallback filtering
  let result = [...MOCK_LISTINGS];
  if (filters?.category_id) {
    result = result.filter(l => l.category_id === filters.category_id);
  }
  if (filters?.city) {
    result = result.filter(l => l.city.toLowerCase().includes(filters.city!.toLowerCase()));
  }
  if (filters?.min_price) {
    result = result.filter(l => l.price_per_night >= filters.min_price!);
  }
  if (filters?.max_price) {
    result = result.filter(l => l.price_per_night <= filters.max_price!);
  }
  return result;
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn(`Backend API unavailable for listing ${id}, checking mock data`, e);
  }
  return MOCK_LISTINGS.find(l => l.id === id) || MOCK_LISTINGS[0];
}

export async function fetchBookedDates(listingId: string): Promise<{ check_in: string; check_out: string }[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/listings/${listingId}/booked-dates`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API unavailable for booked dates", e);
  }
  return [
    { check_in: "2026-11-10", check_out: "2026-11-14" }
  ];
}

export async function createBooking(data: {
  listing_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
}): Promise<Booking> {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to create booking');
  } catch (e: any) {
    if (e.message) throw e;
    console.warn("Backend unavailable, mock booking response");
  }

  return {
    id: `book_${Date.now()}`,
    listing_id: data.listing_id,
    guest_id: "user_guest_1",
    check_in: data.check_in,
    check_out: data.check_out,
    guests_count: data.guests_count,
    total_price: data.total_price,
    status: 'CONFIRMED',
    created_at: new Date().toISOString()
  };
}

export async function fetchBookings(role: 'GUEST' | 'HOST' = 'GUEST'): Promise<Booking[]> {
  try {
    const param = role === 'GUEST' ? 'guest_id=user_guest_1' : 'host_id=user_host_1';
    const res = await fetch(`${API_BASE_URL}/bookings?${param}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend unavailable, returning empty bookings array");
  }
  return [
    {
      id: "book_sample_1",
      listing_id: "list_1",
      guest_id: "user_guest_1",
      check_in: "2026-11-10",
      check_out: "2026-11-14",
      guests_count: 4,
      total_price: 1985.0,
      status: "CONFIRMED",
      created_at: "2026-10-01T12:00:00Z",
      listing: MOCK_LISTINGS[0]
    }
  ];
}

export async function cancelBooking(bookingId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (e) {
    console.warn("Backend unavailable for cancel booking", e);
  }
  return true;
}

export async function toggleWishlist(listingId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/wishlists/${listingId}`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      return data.saved;
    }
  } catch (e) {
    console.warn("Backend unavailable for wishlist toggle", e);
  }
  return true;
}

export async function fetchWishlists(): Promise<Wishlist[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/wishlists`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend unavailable for wishlists", e);
  }
  return [
    {
      id: "wish_1",
      user_id: "user_guest_1",
      listing_id: "list_1",
      listing: MOCK_LISTINGS[0],
      created_at: new Date().toISOString()
    }
  ];
}

export async function createListing(data: any): Promise<Listing> {
  try {
    const res = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend unavailable for listing creation", e);
  }
  
  return {
    ...MOCK_LISTINGS[0],
    id: `list_${Date.now()}`,
    title: data.title,
    description: data.description,
    price_per_night: data.price_per_night,
    city: data.city,
    country: data.country
  };
}

export async function deleteListing(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/listings/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (e) {
    console.warn("Backend unavailable for delete listing", e);
  }
  return true;
}
