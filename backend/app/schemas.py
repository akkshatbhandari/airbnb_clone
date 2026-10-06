from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    avatar_url: Optional[str] = None
    role: str = "GUEST"
    is_superhost: bool = False


class UserResponse(UserBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Category & Amenity Schemas
class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    icon: str
    model_config = ConfigDict(from_attributes=True)


class AmenityResponse(BaseModel):
    id: str
    name: str
    icon: str
    category: str
    model_config = ConfigDict(from_attributes=True)


# Listing Image Schemas
class ListingImageBase(BaseModel):
    url: str
    is_primary: bool = False
    display_order: int = 0


class ListingImageResponse(ListingImageBase):
    id: str
    model_config = ConfigDict(from_attributes=True)


# Review Schemas
class ReviewCreate(BaseModel):
    rating: float = Field(..., ge=1.0, le=5.0)
    cleanliness: Optional[float] = 5.0
    accuracy: Optional[float] = 5.0
    communication: Optional[float] = 5.0
    location: Optional[float] = 5.0
    check_in_rating: Optional[float] = 5.0
    value_rating: Optional[float] = 5.0
    comment: str


class ReviewResponse(BaseModel):
    id: str
    listing_id: str
    author: UserResponse
    rating: float
    cleanliness: float
    accuracy: float
    communication: float
    location: float
    check_in_rating: float
    value_rating: float
    comment: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Booking Schemas
class BookingCreate(BaseModel):
    listing_id: str
    check_in: str  # YYYY-MM-DD
    check_out: str  # YYYY-MM-DD
    guests_count: int = 1
    total_price: float


class BookingResponse(BaseModel):
    id: str
    listing_id: str
    guest_id: str
    check_in: str
    check_out: str
    guests_count: int
    total_price: float
    status: str
    created_at: datetime
    listing: Optional["ListingResponseMinimal"] = None
    model_config = ConfigDict(from_attributes=True)


# Listing Schemas
class ListingCreate(BaseModel):
    category_id: str
    title: str
    description: str
    property_type: str = "Entire place"
    city: str
    country: str
    address: str
    latitude: float = 0.0
    longitude: float = 0.0
    price_per_night: float
    cleaning_fee: float = 50.0
    service_fee: float = 30.0
    max_guests: int = 2
    bedrooms: int = 1
    beds: int = 1
    bathrooms: float = 1.0
    amenity_ids: List[str] = []
    images: List[str] = []  # Image URLs


class ListingUpdate(BaseModel):
    category_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: Optional[float] = None
    cleaning_fee: Optional[float] = None
    service_fee: Optional[float] = None
    max_guests: Optional[int] = None
    bedrooms: Optional[int] = None
    beds: Optional[int] = None
    bathrooms: Optional[float] = None
    amenity_ids: Optional[List[str]] = None
    images: Optional[List[str]] = None


class ListingResponseMinimal(BaseModel):
    id: str
    title: str
    city: str
    country: str
    price_per_night: float
    rating: float
    review_count: int
    property_type: str
    images: List[ListingImageResponse] = []
    category: CategoryResponse
    model_config = ConfigDict(from_attributes=True)


class ListingResponse(BaseModel):
    id: str
    host_id: str
    host: UserResponse
    category_id: str
    category: CategoryResponse
    title: str
    description: str
    property_type: str
    city: str
    country: str
    address: str
    latitude: float
    longitude: float
    price_per_night: float
    cleaning_fee: float
    service_fee: float
    max_guests: int
    bedrooms: int
    beds: int
    bathrooms: float
    rating: float
    review_count: int
    images: List[ListingImageResponse] = []
    amenities: List[AmenityResponse] = []
    reviews: List[ReviewResponse] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Wishlist Schema
class WishlistResponse(BaseModel):
    id: str
    user_id: str
    listing_id: str
    listing: ListingResponseMinimal
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
