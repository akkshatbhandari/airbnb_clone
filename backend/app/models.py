import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


listing_amenity_association = Table(
    "listing_amenities",
    Base.metadata,
    Column("listing_id", String, ForeignKey("listings.id", ondelete="CASCADE"), primary_key=True),
    Column("amenity_id", String, ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    role = Column(String(20), default="GUEST")  # "GUEST" or "HOST"
    is_superhost = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    listings = relationship("Listing", back_populates="host", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="guest", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="author", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(50), nullable=False, unique=True)
    slug = Column(String(50), nullable=False, unique=True)
    icon = Column(String(50), nullable=False)

    listings = relationship("Listing", back_populates="category")


class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False, unique=True)
    icon = Column(String(50), nullable=False)
    category = Column(String(50), default="General")

    listings = relationship("Listing", secondary=listing_amenity_association, back_populates="amenities")


class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(String, primary_key=True, default=generate_uuid)
    listing_id = Column(String, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    url = Column(String(500), nullable=False)
    is_primary = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)

    listing = relationship("Listing", back_populates="images")


class Listing(Base):
    __tablename__ = "listings"

    id = Column(String, primary_key=True, default=generate_uuid)
    host_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    property_type = Column(String(50), default="Entire place")  # "Entire place", "Private room", "Shared room"
    city = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    address = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=False, default=0.0)
    longitude = Column(Float, nullable=False, default=0.0)
    price_per_night = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=50.0)
    service_fee = Column(Float, default=30.0)
    max_guests = Column(Integer, default=2)
    bedrooms = Column(Integer, default=1)
    beds = Column(Integer, default=1)
    bathrooms = Column(Float, default=1.0)
    rating = Column(Float, default=4.9)
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    host = relationship("User", back_populates="listings")
    category = relationship("Category", back_populates="listings")
    images = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan", order_by="ListingImage.display_order")
    amenities = relationship("Amenity", secondary=listing_amenity_association, back_populates="listings")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="listing", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=generate_uuid)
    listing_id = Column(String, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    guest_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    check_in = Column(String, nullable=False)   # YYYY-MM-DD
    check_out = Column(String, nullable=False)  # YYYY-MM-DD
    guests_count = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)
    status = Column(String(20), default="CONFIRMED")  # "CONFIRMED", "CANCELLED"
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=generate_uuid)
    listing_id = Column(String, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Float, nullable=False, default=5.0)
    cleanliness = Column(Float, default=5.0)
    accuracy = Column(Float, default=5.0)
    communication = Column(Float, default=5.0)
    location = Column(Float, default=5.0)
    check_in_rating = Column(Float, default=5.0)
    value_rating = Column(Float, default=5.0)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="reviews")
    author = relationship("User", back_populates="reviews")


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    listing_id = Column(String, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="wishlists")
    listing = relationship("Listing", back_populates="wishlists")
