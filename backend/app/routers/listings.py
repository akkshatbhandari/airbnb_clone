from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database import get_db
from app.models import Listing, ListingImage, Amenity, Booking, User
from app.schemas import ListingResponse, ListingCreate, ListingUpdate

router = APIRouter(prefix="/api/listings", tags=["listings"])


@router.get("", response_model=List[ListingResponse])
def search_listings(
    category_id: Optional[str] = None,
    city: Optional[str] = None,
    query: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    property_type: Optional[str] = None,
    guests: Optional[int] = None,
    check_in: Optional[str] = None,
    check_out: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Listing)

    if category_id:
        q = q.filter(Listing.category_id == category_id)

    if city:
        q = q.filter(Listing.city.ilike(f"%{city}%"))

    if query:
        q = q.filter(
            or_(
                Listing.title.ilike(f"%{query}%"),
                Listing.city.ilike(f"%{query}%"),
                Listing.country.ilike(f"%{query}%"),
                Listing.description.ilike(f"%{query}%")
            )
        )

    if min_price is not None:
        q = q.filter(Listing.price_per_night >= min_price)

    if max_price is not None:
        q = q.filter(Listing.price_per_night <= max_price)

    if property_type and property_type != "Any type":
        q = q.filter(Listing.property_type.ilike(f"%{property_type}%"))

    if guests:
        q = q.filter(Listing.max_guests >= guests)

    # Date range availability filter: exclude listings with overlapping confirmed bookings
    if check_in and check_out:
        subquery_booked_ids = (
            db.query(Booking.listing_id)
            .filter(
                Booking.status == "CONFIRMED",
                and_(
                    Booking.check_in < check_out,
                    Booking.check_out > check_in
                )
            )
            .subquery()
        )
        q = q.filter(Listing.id.not_in(subquery_booked_ids))

    return q.order_by(Listing.created_at.desc()).all()


@router.get("/{id}", response_model=ListingResponse)
def get_listing_by_id(id: str, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    return listing


@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    payload: ListingCreate,
    host_id: str = "user_host_1",
    db: Session = Depends(get_db)
):
    # Ensure host exists
    host = db.query(User).filter(User.id == host_id).first()
    if not host:
        host = User(id=host_id, name="Sarah Jenkins", email="host@example.com", role="HOST", is_superhost=True)
        db.add(host)
        db.commit()

    new_listing = Listing(
        host_id=host_id,
        category_id=payload.category_id,
        title=payload.title,
        description=payload.description,
        property_type=payload.property_type,
        city=payload.city,
        country=payload.country,
        address=payload.address,
        latitude=payload.latitude,
        longitude=payload.longitude,
        price_per_night=payload.price_per_night,
        cleaning_fee=payload.cleaning_fee,
        service_fee=payload.service_fee,
        max_guests=payload.max_guests,
        bedrooms=payload.bedrooms,
        beds=payload.beds,
        bathrooms=payload.bathrooms
    )

    # Add images
    for idx, img_url in enumerate(payload.images):
        new_listing.images.append(
            ListingImage(url=img_url, is_primary=(idx == 0), display_order=idx)
        )

    # Add amenities
    if payload.amenity_ids:
        amenities = db.query(Amenity).filter(Amenity.id.in_(payload.amenity_ids)).all()
        new_listing.amenities.extend(amenities)

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing


@router.put("/{id}", response_model=ListingResponse)
def update_listing(id: str, payload: ListingUpdate, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    update_data = payload.model_dump(exclude_unset=True)

    if "images" in update_data and update_data["images"] is not None:
        images_urls = update_data.pop("images")
        db.query(ListingImage).filter(ListingImage.listing_id == id).delete()
        for idx, img_url in enumerate(images_urls):
            listing.images.append(ListingImage(url=img_url, is_primary=(idx == 0), display_order=idx))

    if "amenity_ids" in update_data and update_data["amenity_ids"] is not None:
        amenity_ids = update_data.pop("amenity_ids")
        amenities = db.query(Amenity).filter(Amenity.id.in_(amenity_ids)).all()
        listing.amenities = amenities

    for key, val in update_data.items():
        setattr(listing, key, val)

    db.commit()
    db.refresh(listing)
    return listing


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(id: str, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    db.delete(listing)
    db.commit()
    return None
