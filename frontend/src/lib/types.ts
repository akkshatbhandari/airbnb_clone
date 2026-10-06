export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'GUEST' | 'HOST';
  is_superhost: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface ListingImage {
  id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
}

export interface Review {
  id: string;
  listing_id: string;
  author: User;
  rating: number;
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  check_in_rating: number;
  value_rating: number;
  comment: string;
  created_at: string;
}

export interface Listing {
  id: string;
  host_id: string;
  host: User;
  category_id: string;
  category: Category;
  title: string;
  description: string;
  property_type: string;
  city: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  review_count: number;
  images: ListingImage[];
  amenities: Amenity[];
  reviews?: Review[];
  created_at?: string;
}

export interface Booking {
  id: string;
  listing_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  status: 'CONFIRMED' | 'CANCELLED';
  created_at: string;
  listing?: Listing;
}

export interface Wishlist {
  id: string;
  user_id: string;
  listing_id: string;
  listing: Listing;
  created_at: string;
}

export interface SearchFilters {
  category_id?: string;
  city?: string;
  query?: string;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  guests?: number;
  check_in?: string;
  check_out?: string;
}
