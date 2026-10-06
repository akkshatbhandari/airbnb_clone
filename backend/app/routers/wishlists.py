from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Wishlist, Listing
from app.schemas import WishlistResponse

router = APIRouter(prefix="/api/wishlists", tags=["wishlists"])


@router.get("", response_model=List[WishlistResponse])
def get_user_wishlist(user_id: str = "user_guest_1", db: Session = Depends(get_db)):
    return db.query(Wishlist).filter(Wishlist.user_id == user_id).all()


@router.post("/{listing_id}", status_code=status.HTTP_201_CREATED)
def toggle_wishlist(listing_id: str, user_id: str = "user_guest_1", db: Session = Depends(get_db)):
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == user_id,
        Wishlist.listing_id == listing_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "message": "Removed from wishlist"}
    else:
        new_item = Wishlist(user_id=user_id, listing_id=listing_id)
        db.add(new_item)
        db.commit()
        return {"saved": True, "message": "Saved to wishlist"}
