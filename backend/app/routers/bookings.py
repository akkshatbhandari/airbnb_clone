from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.database import get_db
from app.models import Booking, Listing, User
from app.schemas import BookingResponse, BookingCreate

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.get("", response_model=List[BookingResponse])
def get_bookings(
    guest_id: Optional[str] = None,
    host_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Booking)

    if guest_id:
        q = q.filter(Booking.guest_id == guest_id)

    if host_id:
        q = q.join(Listing).filter(Listing.host_id == host_id)

    return q.order_by(Booking.created_at.desc()).all()


@router.get("/listings/{listing_id}/booked-dates")
def get_listing_booked_dates(listing_id: str, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(
        Booking.listing_id == listing_id,
        Booking.status == "CONFIRMED"
    ).all()
    
    return [
        {"check_in": b.check_in, "check_out": b.check_out, "id": b.id}
        for b in bookings
    ]


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    guest_id: str = "user_guest_1",
    db: Session = Depends(get_db)
):
    # 1. Check listing existence
    listing = db.query(Listing).filter(Listing.id == payload.listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    # 2. Validate dates
    if payload.check_in >= payload.check_out:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-in date must be before Check-out date"
        )

    # 3. Check availability overlap
    overlapping_booking = db.query(Booking).filter(
        Booking.listing_id == payload.listing_id,
        Booking.status == "CONFIRMED",
        and_(
            Booking.check_in < payload.check_out,
            Booking.check_out > payload.check_in
        )
    ).first()

    if overlapping_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected dates are no longer available. Please choose different dates."
        )

    # 4. Ensure guest exists
    guest = db.query(User).filter(User.id == guest_id).first()
    if not guest:
        guest = User(id=guest_id, name="Alex Morgan", email="guest@example.com", role="GUEST")
        db.add(guest)
        db.commit()

    # 5. Create booking record
    new_booking = Booking(
        listing_id=payload.listing_id,
        guest_id=guest_id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        guests_count=payload.guests_count,
        total_price=payload.total_price,
        status="CONFIRMED"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking


@router.delete("/{id}", response_model=BookingResponse)
def cancel_booking(id: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    booking.status = "CANCELLED"
    db.commit()
    db.refresh(booking)
    return booking
