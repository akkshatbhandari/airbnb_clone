from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Review, Listing, User
from app.schemas import ReviewResponse, ReviewCreate

router = APIRouter(prefix="/api/listings", tags=["reviews"])


@router.get("/{listing_id}/reviews", response_model=List[ReviewResponse])
def get_listing_reviews(listing_id: str, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.listing_id == listing_id).order_by(Review.created_at.desc()).all()


@router.post("/{listing_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    listing_id: str,
    payload: ReviewCreate,
    author_id: str = "user_guest_1",
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    new_review = Review(
        listing_id=listing_id,
        author_id=author_id,
        rating=payload.rating,
        cleanliness=payload.cleanliness,
        accuracy=payload.accuracy,
        communication=payload.communication,
        location=payload.location,
        check_in_rating=payload.check_in_rating,
        value_rating=payload.value_rating,
        comment=payload.comment
    )

    db.add(new_review)
    
    # Recalculate listing rating and count
    all_reviews = db.query(Review).filter(Review.listing_id == listing_id).all()
    all_ratings = [r.rating for r in all_reviews] + [payload.rating]
    listing.rating = round(sum(all_ratings) / len(all_ratings), 2)
    listing.review_count = len(all_ratings)

    db.commit()
    db.refresh(new_review)
    return new_review
