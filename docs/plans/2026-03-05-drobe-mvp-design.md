# Drobe MVP Design
**Date:** 2026-03-05
**Timeline:** 3 days
**Type:** Progressive Web App

## Overview
Drobe is an AI-powered wardrobe management and outfit planning app. Users photograph their clothing, and Claude AI analyzes items and suggests outfits based on occasion and weather.

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS (Figma-generated foundation)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI:** Anthropic Claude API (Claude 3.5 Sonnet for vision + recommendations)
- **Weather:** OpenWeatherMap API
- **Deployment:** Vercel/Netlify as PWA

## Architecture
**Layered Architecture:**
1. UI Layer: React components (from Figma code)
2. State Layer: React Context + hooks (auth, wardrobe, outfits, weather)
3. Service Layer: API clients (Supabase, Claude, Weather)
4. Data Layer: Supabase with Row Level Security

**Key Decisions:**
- Client-side image resize before upload (800x800px, WebP format, <150KB target)
- Supabase Edge Functions hide API keys from client
- Email/password auth for MVP (social login in v2)
- No background removal for MVP (v2 feature)
- No chat stylist (structured occasions only)

## Database Schema

### profiles
```sql
- id (uuid, FK to auth.users)
- created_at (timestamp)
- updated_at (timestamp)
- display_name (text)
- location (text) -- for weather lookups
- style_preferences (jsonb) -- {minimal, smart_casual, neutral_tones, etc}
```

### wardrobe_items
```sql
- id (uuid, PK)
- user_id (uuid, FK to profiles)
- created_at (timestamp)
- photo_url (text) -- Supabase Storage URL
- thumbnail_url (text) -- 300x300px version
- category (text) -- "tops", "bottoms", "outerwear", "shoes", "accessories"
- subcategory (text) -- "t-shirt", "jeans", "blazer"
- colors (text[]) -- ["black", "white"]
- seasons (text[]) -- ["spring", "fall", "all-season"]
- formality (text) -- "casual", "smart_casual", "formal"
- worn_count (integer)
- last_worn_date (date)
- ai_metadata (jsonb) -- Claude's full analysis
```

### outfits
```sql
- id (uuid, PK)
- user_id (uuid, FK to profiles)
- created_at (timestamp)
- name (text) -- "Garden Ceremony"
- occasion (text) -- "wedding", "work", "casual"
- item_ids (uuid[]) -- array of wardrobe_item ids
- ai_reasoning (text) -- why Claude suggested this
- is_favorite (boolean)
- weather_conditions (jsonb) -- {temp: 14, condition: "rain"}
```

### planned_outfits
```sql
- id (uuid, PK)
- user_id (uuid, FK to profiles)
- outfit_id (uuid, FK to outfits)
- planned_date (date)
- event_name (text) -- "Client Meeting"
- event_time (time)
```

**RLS Policies:** All tables restrict access to user's own data only.

## Image Strategy
**Upload Flow:**
1. User selects/captures photo
2. Client-side resize to 800x800px (detail view)
3. Generate 300x300px thumbnail (grid view)
4. Convert to WebP @ 82% quality
5. Upload both to Supabase Storage
6. Target: <150KB per image

**No background removal in MVP** (deferred to v2)

## AI Integration

### Edge Functions (hide API keys)
1. **analyze-clothing** - Claude Vision categorizes uploaded clothing
2. **suggest-outfits** - Claude generates outfit combinations based on occasion + weather

### Capabilities
**Wardrobe Item Analysis:**
- Upload photo → Claude Vision identifies category, colors, seasons, formality
- Store in `ai_metadata` field
- Fallback: manual categorization if API fails

**Outfit Recommendations:**
- Input: occasion, weather, user's wardrobe items
- Output: 2-3 outfit combinations with AI reasoning
- Shows "TOP PICK" badge on first result
- Star to favorite outfits

**Cost Management:**
- One-time Vision call per clothing item upload
- Cache outfit suggestions for common requests
- Limit: 20 outfit requests/user/day (free tier protection)

## Weather Integration
**Service:** OpenWeatherMap API (Free tier: 1000 calls/day)

**Data:**
- Current temp, "feels like", condition, precipitation, wind

**Flow:**
1. User sets location in profile
2. Fetch weather on Style AI screen load
3. Cache for 30 minutes
4. Display in header: "14° · London"
5. "Weather considered" badge when it influences suggestions

**Edge Function:** `get-weather` proxies OpenWeatherMap API

## Screen Functionality

### 1. Splash Screen
- Drobe logo + tagline
- "Get Started" → Sign up
- "Sign In" → Login
- Wire to Supabase Auth

### 2. Style AI Screen (Main)
**Header:**
- Date, weather (14° London), "AI STYLIST" badge

**Main Input:**
- "What are you dressing for?" text area
- Freeform text or Quick Occasions

**Weather Card:**
- "Partly Cloudy 14° rain after 3pm - Outfits include layers & rain-friendly picks"

**Quick Occasions:**
- Friend's wedding, Job interview, Casual brunch, Date night

**Outfit Results:**
- Outfit name (e.g., "Garden Ceremony")
- "TOP PICK" badge (first result only)
- Item thumbnails + names
- AI reasoning text
- Star to favorite
- Tap to see full detail

### 3. Wardrobe Screen
**Header:**
- "My Wardrobe" + item/category count
- Grid/list toggle, "+ Add" button

**Search/Filter:**
- Search bar
- Category pills: All, Tops, Bottoms, Outerwear

**Grid View:**
- 2-column masonry
- Thumbnail, name, tags (Casual, Spring)
- Wear count badge (+12)

**Add Item Flow:**
1. Tap "+ Add"
2. Bottom sheet: "Take Photo" / "Choose from Gallery"
3. Resize image client-side
4. Upload to Supabase Storage
5. Call `analyze-clothing` Edge Function
6. Save to database
7. Success toast

**Item Detail Modal:**
- Full-size photo
- Details (category, colors, formality, seasons)
- Wear count, last worn date
- **"In [X] Favorite Outfits"** - shows favorited outfits containing this item
- Edit/Delete buttons

### 4. Outfit Planner Screen
**MVP Simplification:** Show saved/favorited outfits in a list (no calendar scheduling)

**This Week Section:**
- Horizontal scroll of daily cards (simplified view)
- Shows stacked clothing images
- "Preview" button
- Star to favorite

**Upcoming Events:**
- List of planned outfits
- Event name, date/time, outfit thumbnail
- "+ Add" to plan new event

**Add Event Flow:**
1. Enter event name, date, time, occasion
2. Pick existing outfit OR generate new suggestion
3. Save to `planned_outfits`

### 5. Profile Screen
**Profile Header:**
- Avatar with initials
- Username, "Member since Jan 2025"
- Stats: 47 Items, 124 Outfits, 38 Saved
- "Edit" button

**Style Profile:**
- Preference tags: "Minimal", "Smart Casual", "Neutral Tones", "Structured", "Relaxed Fit"
- "Edit preferences" + "+ Add" buttons
- (Note: preferences stored but not used in AI for MVP)

**Wear Activity:**
- "This week" summary
- M-T-W-T-F-S-S usage calendar

**Settings:**
- Location for weather
- Account settings
- Sign out button

**Removed:** Sustainability score (deferred)

## Authentication Flow
**Supabase Auth - Email/Password Only (MVP)**

**Sign Up:**
1. Email + password
2. Auto-create profile via DB trigger
3. Optional onboarding: location, style preferences
4. Redirect to Style AI screen

**Sign In:**
1. Email + password
2. Load profile
3. Redirect to Style AI screen

**Session:** Supabase tokens in localStorage, auto-refresh

## State Management
**React Context + Hooks (no Redux)**

**Contexts:**
1. **AuthContext** - user, session, login/logout
2. **WardrobeContext** - wardrobe items, CRUD operations
3. **OutfitContext** - saved outfits, favorites, planned outfits
4. **WeatherContext** - current weather (30min cache)

**Custom Hooks:**
- `useAuth()` - current user, isLoading, signIn/signOut
- `useWardrobe()` - items, addItem, deleteItem, updateItem
- `useOutfits()` - outfits, toggleFavorite, saveOutfit
- `useWeather()` - weather data, refresh

**Data Fetching:**
- Load wardrobe on app init (cache in context)
- Optimistic updates for favorites
- Standard fetch/refresh (no realtime subscriptions in MVP)
- Skeleton loading states

## Service Layer

### Services
1. **supabase.ts** - Initialize client, typed exports
2. **auth.ts** - signUp, signIn, signOut, getCurrentUser, updateProfile
3. **wardrobe.ts** - getWardrobeItems, addWardrobeItem, updateWardrobeItem, deleteWardrobeItem, incrementWearCount
4. **outfits.ts** - getOutfits, saveOutfit, toggleFavorite, getPlannedOutfits, planOutfit
5. **ai.ts** - analyzeClothing, suggestOutfits (calls Edge Functions)
6. **weather.ts** - getWeather (calls Edge Function, 30min cache)
7. **image.ts** - resizeImage, convertToWebP, generateThumbnail

### Supabase Edge Functions (Deno)
- `/functions/analyze-clothing` - Claude Vision proxy
- `/functions/suggest-outfits` - Claude API proxy
- `/functions/get-weather` - OpenWeatherMap proxy

All API keys in Supabase secrets, never exposed to client.

## MVP Scope (3 days)

### Included
✅ Email/password authentication
✅ Wardrobe CRUD with photo upload
✅ Client-side image resize/compression
✅ Claude Vision auto-categorization
✅ Outfit suggestions with Claude API
✅ Weather integration
✅ Favorites system
✅ All core UI screens functional

### Simplified/Deferred
⚠️ Outfit Planner calendar → Simple saved outfits list
⚠️ Wear count tracking → Fields exist, no analytics UI
⚠️ Style preferences → Profile only, not used in AI yet
⚠️ PWA offline support → Online-only for MVP
⚠️ Social login → Phase 2

### Not Included
❌ Background removal on images
❌ Chat-with-stylist feature
❌ Sustainability score
❌ Real-time Supabase subscriptions
❌ Extensive error handling/edge cases

## Dependencies (User to Provide)
- Supabase project + credentials (URL, anon key, service key)
- Anthropic API key
- OpenWeatherMap API key
- Testing during development
- Deployment to Vercel/Netlify

## Development Plan
- **Day 1:** Foundation (auth, database, services, wardrobe CRUD)
- **Day 2:** AI features (Claude integration, outfit suggestions, weather)
- **Day 3:** Remaining screens, polish, bug fixes
