import uuid
from app.database import SessionLocal, engine, Base
from app.models import User, Category, Amenity, Listing, ListingImage, Booking, Review, Wishlist


def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Users
        guest_user = User(
            id="user_guest_1",
            name="Alex Morgan",
            email="alex.morgan@example.com",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            role="GUEST",
            is_superhost=False
        )
        host_user = User(
            id="user_host_1",
            name="Sarah Jenkins",
            email="sarah.jenkins@example.com",
            avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
            role="HOST",
            is_superhost=True
        )
        db.add_all([guest_user, host_user])

        # 2. Categories
        categories_data = [
            {"id": "cat_beach", "name": "Beachfront", "slug": "beachfront", "icon": "Umbrella"},
            {"id": "cat_cabins", "name": "Cabins", "slug": "cabins", "icon": "Home"},
            {"id": "cat_mansions", "name": "Mansions", "slug": "mansions", "icon": "Castle"},
            {"id": "cat_views", "name": "Amazing views", "slug": "amazing-views", "icon": "Mountain"},
            {"id": "cat_pools", "name": "Amazing pools", "slug": "amazing-pools", "icon": "Waves"},
            {"id": "cat_lake", "name": "Lakefront", "slug": "lakefront", "icon": "Compass"},
            {"id": "cat_tiny", "name": "Tiny homes", "slug": "tiny-homes", "icon": "Box"},
            {"id": "cat_tropical", "name": "Tropical", "slug": "tropical", "icon": "Sun"},
            {"id": "cat_luxe", "name": "Luxe", "slug": "luxe", "icon": "Sparkles"},
            {"id": "cat_icons", "name": "Icons", "slug": "icons", "icon": "Flame"},
            {"id": "cat_farms", "name": "Farms", "slug": "farms", "icon": "Trees"},
            {"id": "cat_trending", "name": "Trending", "slug": "trending", "icon": "TrendingUp"}
        ]
        categories = [Category(**c) for c in categories_data]
        db.add_all(categories)

        # 3. Amenities
        amenities_data = [
            {"id": "am_wifi", "name": "Fast Wi-Fi", "icon": "Wifi", "category": "Essentials"},
            {"id": "am_kitchen", "name": "Chef's Kitchen", "icon": "Utensils", "category": "Essentials"},
            {"id": "am_pool", "name": "Private Pool", "icon": "Waves", "category": "Features"},
            {"id": "am_ac", "name": "Air Conditioning", "icon": "Wind", "category": "Essentials"},
            {"id": "am_parking", "name": "Free Parking", "icon": "Car", "category": "Facilities"},
            {"id": "am_hottub", "name": "Private Hot Tub", "icon": "Flame", "category": "Features"},
            {"id": "am_workspace", "name": "Dedicated Workspace", "icon": "Laptop", "category": "Essentials"},
            {"id": "am_ev", "name": "EV Charger", "icon": "Zap", "category": "Facilities"},
            {"id": "am_waterfront", "name": "Waterfront Access", "icon": "Anchor", "category": "Location"},
            {"id": "am_tv", "name": "65\" HDTV with Netflix", "icon": "Tv", "category": "Entertainment"},
            {"id": "am_patio", "name": "Outdoor Patio & Grill", "icon": "Sun", "category": "Outdoor"},
            {"id": "am_gym", "name": "Private Fitness Center", "icon": "Dumbbell", "category": "Features"}
        ]
        amenities = [Amenity(**a) for a in amenities_data]
        db.add_all(amenities)
        db.commit()

        # 4. Listings Data (12 Properties)
        listings_data = [
            {
                "id": "list_1",
                "host_id": "user_host_1",
                "category_id": "cat_beach",
                "title": "Luxury Oceanfront Villa with Infinity Pool",
                "description": "Step out of your glass sliding doors straight onto the white sands of Miami Beach. This architectural marvel features 180-degree panoramic ocean views, an infinity pool, heated spa, and bespoke interior furnishings. Wake up to ocean breezes and enjoy sunset cocktails on the wrap-around teak balcony.",
                "property_type": "Entire place",
                "city": "Miami Beach",
                "country": "United States",
                "address": "420 Ocean Drive",
                "latitude": 25.7781,
                "longitude": -80.1313,
                "price_per_night": 450.0,
                "cleaning_fee": 120.0,
                "service_fee": 65.0,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 4,
                "bathrooms": 3.5,
                "rating": 4.96,
                "review_count": 84,
                "images": [
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_kitchen", "am_pool", "am_ac", "am_parking", "am_hottub", "am_waterfront", "am_patio"]
            },
            {
                "id": "list_2",
                "host_id": "user_host_1",
                "category_id": "cat_cabins",
                "title": "Minimalist A-Frame Cabin in Snowmass Forest",
                "description": "Nestled among towering pine trees in Aspen, this designer A-Frame cabin offers the ultimate mountain retreat. Featuring floor-to-ceiling windows, an indoor wood-burning fireplace, a cedar hot tub, and ski-in/ski-out convenience.",
                "property_type": "Entire place",
                "city": "Aspen",
                "country": "United States",
                "address": "120 Snowmass Creek Rd",
                "latitude": 39.1911,
                "longitude": -106.8175,
                "price_per_night": 320.0,
                "cleaning_fee": 85.0,
                "service_fee": 45.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.92,
                "review_count": 62,
                "images": [
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_kitchen", "am_hottub", "am_parking", "am_workspace", "am_patio"]
            },
            {
                "id": "list_3",
                "host_id": "user_host_1",
                "category_id": "cat_mansions",
                "title": "Château de Lumière in Parisian Countryside",
                "description": "An opulent 18th-century French estate renovated with modern luxury. Stroll through 10 acres of private manicured gardens, enjoy a private wine cellar, heated indoor pool, and a grand ballroom.",
                "property_type": "Entire place",
                "city": "Paris",
                "country": "France",
                "address": "14 Rue du Château",
                "latitude": 48.8566,
                "longitude": 2.3522,
                "price_per_night": 890.0,
                "cleaning_fee": 200.0,
                "service_fee": 130.0,
                "max_guests": 10,
                "bedrooms": 5,
                "beds": 6,
                "bathrooms": 5.0,
                "rating": 4.98,
                "review_count": 45,
                "images": [
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_kitchen", "am_pool", "am_ac", "am_parking", "am_gym", "am_patio"]
            },
            {
                "id": "list_4",
                "host_id": "user_host_1",
                "category_id": "cat_tropical",
                "title": "Bamboo Treehouse Overlooking Sacred Valley",
                "description": "Experience nature in its purest form in this handcrafted multi-level bamboo sanctuary in Ubud. Suspended above lush rice terraces with open-air lounge decks, a natural spring plunge pool, and daily organic breakfast.",
                "property_type": "Entire place",
                "city": "Ubud",
                "country": "Indonesia",
                "address": "Jalan Raya Sayan",
                "latitude": -8.5069,
                "longitude": 115.2625,
                "price_per_night": 280.0,
                "cleaning_fee": 40.0,
                "service_fee": 35.0,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1.5,
                "rating": 4.95,
                "review_count": 112,
                "images": [
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_pool", "am_kitchen", "am_patio", "am_workspace"]
            },
            {
                "id": "list_5",
                "host_id": "user_host_1",
                "category_id": "cat_views",
                "title": "Cliffside Villa Hanging Over Amalfi Sea",
                "description": "Perched dramatically on Positano's cliffs, this whitewashed Mediterranean villa boasts uninterrupted views of the turquoise Tyrrhenian Sea. Features lemon grove gardens, sun terraces, and private stairs leading down to the beach.",
                "property_type": "Entire place",
                "city": "Positano",
                "country": "Italy",
                "address": "Via Cristoforo Colombo",
                "latitude": 40.6281,
                "longitude": 14.4850,
                "price_per_night": 650.0,
                "cleaning_fee": 110.0,
                "service_fee": 90.0,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": 3.0,
                "rating": 4.97,
                "review_count": 76,
                "images": [
                    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_kitchen", "am_ac", "am_waterfront", "am_patio"]
            },
            {
                "id": "list_6",
                "host_id": "user_host_1",
                "category_id": "cat_luxe",
                "title": "Ultra-Modern Penthouse in Downtown Tokyo",
                "description": "High above the vibrant city lights of Roppongi, this sleek penthouse features double-height glass walls, custom Italian leather furniture, a private rooftop helipad access, and state-of-the-art home automation.",
                "property_type": "Entire place",
                "city": "Tokyo",
                "country": "Japan",
                "address": "6-10-1 Roppongi",
                "latitude": 35.6628,
                "longitude": 139.7314,
                "price_per_night": 520.0,
                "cleaning_fee": 90.0,
                "service_fee": 70.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.94,
                "review_count": 98,
                "images": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_kitchen", "am_ac", "am_workspace", "am_tv", "am_gym"]
            },
            {
                "id": "list_7",
                "host_id": "user_host_1",
                "category_id": "cat_lake",
                "title": "Serene Glass House on Lake Como",
                "description": "Direct lakefront access with private dock and boat mooring. Floor-to-ceiling glass pavilions frame sweeping alpine water views. Includes kayaks, paddleboards, and a lakeside fireplace.",
                "property_type": "Entire place",
                "city": "Lake Como",
                "country": "Italy",
                "address": "Via Regina 45",
                "latitude": 45.9926,
                "longitude": 9.2573,
                "price_per_night": 590.0,
                "cleaning_fee": 100.0,
                "service_fee": 80.0,
                "max_guests": 5,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": 2.5,
                "rating": 4.99,
                "review_count": 51,
                "images": [
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_kitchen", "am_waterfront", "am_parking", "am_patio", "am_hottub"]
            },
            {
                "id": "list_8",
                "host_id": "user_host_1",
                "category_id": "cat_tiny",
                "title": "Eco Glass Igloo with Aurora Views",
                "description": "Sleep beneath the magical Northern Lights in a heated glass dome in Lapland. Fully insulated, equipped with a Scandinavian sauna, outdoor wood-fired tub, and snowshoe rentals.",
                "property_type": "Entire place",
                "city": "Rovaniemi",
                "country": "Finland",
                "address": "Tähtikuja 1",
                "latitude": 66.5039,
                "longitude": 25.7294,
                "price_per_night": 390.0,
                "cleaning_fee": 60.0,
                "service_fee": 50.0,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1.0,
                "rating": 4.93,
                "review_count": 130,
                "images": [
                    "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_hottub", "am_parking", "am_patio"]
            },
            {
                "id": "list_9",
                "host_id": "user_host_1",
                "category_id": "cat_pools",
                "title": "Cliffside Oasis with Heated Infinity Lagoon",
                "description": "Unwind in a dramatic infinity pool overlooking the Aegean Sea. Featuring cave suites, sunset champagne lounge, outdoor cinema, and private butler service in Oia.",
                "property_type": "Entire place",
                "city": "Santorini",
                "country": "Greece",
                "address": "Oia Castle Steps 12",
                "latitude": 36.4618,
                "longitude": 25.3753,
                "price_per_night": 720.0,
                "cleaning_fee": 150.0,
                "service_fee": 110.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.98,
                "review_count": 89,
                "images": [
                    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_pool", "am_kitchen", "am_ac", "am_patio"]
            },
            {
                "id": "list_10",
                "host_id": "user_host_1",
                "category_id": "cat_icons",
                "title": "Iconic Glass Loft in Soho Arts District",
                "description": "Live like an art connoisseur in this celebrity designer loft in Manhattan. 16-foot ceilings, original brick walls, private elevator opening directly into your foyer, and museum-grade art collection.",
                "property_type": "Entire place",
                "city": "New York",
                "country": "United States",
                "address": "88 Spring Street",
                "latitude": 40.7233,
                "longitude": -73.9985,
                "price_per_night": 610.0,
                "cleaning_fee": 110.0,
                "service_fee": 85.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.95,
                "review_count": 142,
                "images": [
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_kitchen", "am_ac", "am_workspace", "am_tv"]
            },
            {
                "id": "list_11",
                "host_id": "user_host_1",
                "category_id": "cat_farms",
                "title": "Historic Tuscan Vineyard Farmhouse",
                "description": "Surrounded by rolling Chianti hills, olive groves, and vineyards. Enjoy wine tasting on your private veranda, wood-fired pizza oven, and infinity pool.",
                "property_type": "Entire place",
                "city": "Siena",
                "country": "Italy",
                "address": "Località San Casciano 4",
                "latitude": 43.3188,
                "longitude": 11.3308,
                "price_per_night": 410.0,
                "cleaning_fee": 80.0,
                "service_fee": 60.0,
                "max_guests": 8,
                "bedrooms": 4,
                "beds": 5,
                "bathrooms": 3.0,
                "rating": 4.97,
                "review_count": 94,
                "images": [
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_kitchen", "am_pool", "am_parking", "am_patio"]
            },
            {
                "id": "list_12",
                "host_id": "user_host_1",
                "category_id": "cat_trending",
                "title": "Zen Bamboo Villa in Arashiyama Bamboo Forest",
                "description": "Step into tranquillity in Kyoto. Traditional Japanese tatami rooms, outdoor hinoki cypress soaking bath, stone garden, and tea ceremony pavilion.",
                "property_type": "Entire place",
                "city": "Kyoto",
                "country": "Japan",
                "address": "Arashiyama Naka-cho 10",
                "latitude": 35.0116,
                "longitude": 135.6777,
                "price_per_night": 340.0,
                "cleaning_fee": 65.0,
                "service_fee": 50.0,
                "max_guests": 3,
                "bedrooms": 2,
                "beds": 3,
                "bathrooms": 1.5,
                "rating": 4.96,
                "review_count": 108,
                "images": [
                    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                ],
                "amenity_ids": ["am_wifi", "am_kitchen", "am_hottub", "am_ac", "am_patio"]
            }
        ]

        for ld in listings_data:
            image_urls = ld.pop("images")
            amenity_ids = ld.pop("amenity_ids")
            listing = Listing(**ld)
            
            # Attach images
            for idx, img_url in enumerate(image_urls):
                listing.images.append(
                    ListingImage(
                        url=img_url,
                        is_primary=(idx == 0),
                        display_order=idx
                    )
                )
            
            # Attach amenities
            selected_amenities = db.query(Amenity).filter(Amenity.id.in_(amenity_ids)).all()
            listing.amenities.extend(selected_amenities)
            db.add(listing)

        # 5. Reviews
        sample_reviews = [
            {
                "id": "rev_1",
                "listing_id": "list_1",
                "author_id": "user_guest_1",
                "rating": 5.0,
                "cleanliness": 5.0,
                "accuracy": 5.0,
                "communication": 5.0,
                "location": 5.0,
                "check_in_rating": 5.0,
                "value_rating": 5.0,
                "comment": "Absolutely spectacular stay! The ocean views were breathless, and Sarah was the most attentive host imaginable. Watching the sunrise from the pool was an unforgettable memory."
            },
            {
                "id": "rev_2",
                "listing_id": "list_2",
                "author_id": "user_guest_1",
                "rating": 4.9,
                "cleanliness": 5.0,
                "accuracy": 4.8,
                "communication": 5.0,
                "location": 5.0,
                "check_in_rating": 5.0,
                "value_rating": 4.7,
                "comment": "The cabin was cozy, incredibly clean, and the hot tub under the stars was pure bliss. Skiing right to our front door made our Aspen trip effortless."
            }
        ]
        for rd in sample_reviews:
            db.add(Review(**rd))

        # 6. Sample Booking
        sample_booking = Booking(
            id="book_sample_1",
            listing_id="list_1",
            guest_id="user_guest_1",
            check_in="2026-11-10",
            check_out="2026-11-14",
            guests_count=4,
            total_price=1985.0,
            status="CONFIRMED"
        )
        db.add(sample_booking)

        db.commit()
        print("Database successfully seeded with realistic Airbnb data!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
