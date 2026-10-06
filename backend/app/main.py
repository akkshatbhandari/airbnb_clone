from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import categories, listings, bookings, wishlists, reviews
from app.seed_data import seed_database

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Airbnb Clone API",
    description="Fullstack Airbnb Clone API powered by FastAPI, SQLite, and SQLAlchemy",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev/testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(categories.router)
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(wishlists.router)
app.include_router(reviews.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Airbnb Clone API",
        "docs_url": "/docs",
        "status": "healthy"
    }


@app.post("/api/seed")
def seed_data():
    seed_database()
    return {"message": "Database re-seeded successfully with mock data!"}


# Auto-seed on initial launch if listings are empty
@app.on_event("startup")
def startup_event():
    from app.database import SessionLocal
    from app.models import Listing
    db = SessionLocal()
    try:
        count = db.query(Listing).count()
        if count == 0:
            print("No listings found. Seeding initial database...")
            seed_database()
    finally:
        db.close()
