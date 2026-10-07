A full-featured, high-fidelity clone of the Airbnb web marketplace built with **Next.js (TypeScript)**, **Tailwind CSS**, **Python FastAPI**, and **SQLite (SQLAlchemy ORM)**.

---

## 🌟 Key Features

### 1. Explore & Search (`/`)
- **Branded Airbnb Navigation Header**: Includes `#FF385C` Airbnb branding, floating search pill trigger, Guest vs. Host mode switcher, user menu dropdown, and direct links to Trips & Wishlists.
- **Category Pill Bar Carousel**: 12+ categories (*Beachfront, Cabins, Mansions, Amazing Views, Amazing Pools, Tropical, Luxe, Tiny Homes, Icons, Farms, Lakefront, Trending*) with active selection indicators.
- **Interactive Search Overlay**: Filter stays by destination city/country, check-in & check-out date range pickers, and guest counter controls.
- **Filters Modal**: Price range min/max sliders, property type selection (*Entire place, Private room, Shared room*), and amenities checklist.
- **Responsive Listing Cards Grid**: Card photo slider controls, wishlist heart toggle animation, star ratings, and price/night displays.
- **Interactive Map View**: Floating bottom pill button toggling between grid view and an interactive Leaflet map featuring custom price markers and hover preview cards.

### 2. Listing Details (`/listings/[id]`)
- **Airbnb 5-Photo Grid**: 1 featured main photo + 4 secondary photos grid with a "Show all photos" trigger opening a fullscreen Lightbox modal.
- **Host Highlights & Metadata**: Host avatar, Superhost status badge, dedicated workspace, self check-in, free cancellation rules, and full listing description.
- **Interactive Sticky Reservation Widget**: Real-time cost calculation (`Nightly rate × nights + Cleaning fee + Service fee = Total before tax`), guest count selection, and date range overlap validation.
- **Categorized Reviews Breakdown**: Rating metrics breakdown (*Cleanliness, Accuracy, Communication, Location, Check-in, Value*) and guest review cards.

### 3. Booking Engine & Trips (`/trips`)
- **Date Range Overlap Engine**: Prevents booking past dates, invalid ranges, or dates overlapping with existing confirmed reservations.
- **Mocked Checkout Modal**: Summary breakdown, mocked credit card selection, instant booking creation in SQLite DB.
- **My Trips Dashboard**: View upcoming and past trips with cancellation functionality that frees booked date ranges back to the calendar.

### 4. Host Experience & CRUD (`/host`)
- **Host Dashboard (`/host`)**: Overview of active properties, total reservations count, and Superhost rating.
- **Create Listing Wizard (`/host/create`)**: Input property title, category, description, location, price, max guests, bedrooms, beds, bathrooms, and photo URLs with live thumbnail previews.
- **Delete & Edit Properties**: Delete functionality with instant database cascading updates.

---

## 🛠️ Technical Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Leaflet.js
- **Backend**: Python 3.11+, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic v2
- **Database**: SQLite (`airbnb.db`) with seed script generating 12+ sample properties, Unsplash high-res photography, hosts, reviews, and categories.

---

## 📁 Repository Structure

```
airbnb_clone/
├── backend/
│   ├── app/
│   │   ├── database.py         # SQLAlchemy engine & session setup
│   │   ├── models.py           # Relational DB models (Users, Listings, Bookings, etc.)
│   │   ├── schemas.py          # Pydantic v2 validation schemas
│   │   ├── seed_data.py        # Database seeder with realistic sample listings
│   │   ├── main.py             # FastAPI app, CORS middleware, router registration
│   │   └── routers/
│   │       ├── categories.py   # Categories & amenities API
│   │       ├── listings.py     # Listings CRUD & search/filter API
│   │       ├── bookings.py     # Reservation & date validation API
│   │       ├── wishlists.py    # Wishlist toggle API
│   │       └── reviews.py      # Reviews submission API
│   ├── requirements.txt
│   └── run.py                  # Uvicorn entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Explore view page
│   │   │   ├── listings/[id]/      # Listing detail page
│   │   │   ├── trips/              # Trips management page
│   │   │   ├── wishlists/          # Favorites page
│   │   │   └── host/               # Host dashboard & create form
│   │   ├── components/         # Navbar, CategoryBar, ListingCard, ReservationWidget, etc.
│   │   ├── context/            # RoleContext (Guest/Host switcher, Wishlists, Toasts)
│   │   └── lib/                # API client & TypeScript types
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── README.md
```

---

## 🚀 Setup & Execution Guide

### 1. Backend Setup (FastAPI + SQLite)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m app.seed_data
python run.py
```
*The FastAPI backend will start at `http://localhost:8000` (Interactive API docs at `http://localhost:8000/docs`).*

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your web browser.*

---

## 🗄️ Database Schema Overview

```
USERS (id, name, email, avatar_url, role, is_superhost)
CATEGORIES (id, name, slug, icon)
AMENITIES (id, name, icon, category)
LISTINGS (id, host_id, category_id, title, description, property_type, city, country, address, latitude, longitude, price_per_night, cleaning_fee, service_fee, max_guests, bedrooms, beds, bathrooms, rating, review_count)
LISTING_IMAGES (id, listing_id, url, is_primary, display_order)
BOOKINGS (id, listing_id, guest_id, check_in, check_out, guests_count, total_price, status)
REVIEWS (id, listing_id, author_id, rating, cleanliness, accuracy, communication, location, check_in_rating, value_rating, comment)
WISHLISTS (id, user_id, listing_id)
```




-----------------------------------------------------------------
                                                                |
                                                                |
        Problems Lists faced during AI powered development      |
                                                                |
                                                                |
-----------------------------------------------------------------

1. Being a guest, I am able to see host dashboard.(contains an image for reference)
2. Guest list should be visible in this way for checkout. (contains an image for reference)
3. An unnecessary lagging or no respond to some clicks is observed at some time.
4. Search bar optimization is required such that anywhere pops field for only location, any
week pops field for only time and add guests pops field for number of guests only.
Combining these search field should work. If not entered any value in those field neglect
those null fields. (contains an image for reference)
5. Host is able to create a listing but is not able to edit listing.
6. Interactive map with listing pins is not satisfiable. If possible include it with real premium
look or else discard it.
7. Include leave a review section after a completed stay for guest. Mind it that this feature is
only for guest and host must not be able to edit the reviews.
8. Cancellation of trip by guest have bad UI/UX experience (contains an image of simple alert for reference)
9. Guest list should be visible in this way for checkout (contains an image for reference)
10. The guest lists is not shown on clicking it.(contains an image for reference)



---------------------------------------------------------------------

                      Prompting with AI

---------------------------------------------------------------------

Initial prompt
If you were hiring manager trying to hire a candidate. You have to provide an assignment to the candidate which has to be submitted within 24 hours. The candidate is allowed to use any sort of AI tools and technology. Even you yourself encourage the candidate to leverage the use of AI. The evaluation is done on the basis of full stack development of Airbnb clone given in the document attached. 

So, if I were the candidate how should I proceed to handle the assignment and complete it. What do you want to see in the candidate to implement and understand from the assignment in this short time window for full stack development? 

It is at least known to me that in this small deadline a hiring manager won't be looking for deep implementation of concurrency or scaling of the system at backend as scaling about applying engineering principles upon deployment and performance monitoring and front end system design.

---------Prepared PRD, TRD, App Flow, UI/UX Document, Backend Schema Document

Further Prompting


-----------------------------------
Deployed Link
-----------------------------------
Frontend - https://airbnb-clone-dun-tau.vercel.app/
Backend - https://airbnb-clone-backend-67g2.onrender.com
