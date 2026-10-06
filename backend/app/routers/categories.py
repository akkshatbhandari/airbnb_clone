from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Category, Amenity
from app.schemas import CategoryResponse, AmenityResponse

router = APIRouter(prefix="/api", tags=["categories"])


@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@router.get("/amenities", response_model=List[AmenityResponse])
def get_amenities(db: Session = Depends(get_db)):
    return db.query(Amenity).all()
