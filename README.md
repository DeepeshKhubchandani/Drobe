# Drobe - AI-Powered Wardrobe Assistant

> **Northwestern Kellogg MBAi 448 Final Project**

An AI-powered Progressive Web App that helps you organize your wardrobe and receive personalized outfit recommendations using Claude Vision AI and weather-aware styling.

**Live Demo**: [drobe-eight.vercel.app](https://drobe-eight.vercel.app)

---

## 📋 Table of Contents

- [Product Overview](#-product-overview)
- [Demo Video](#-demo-video)
- [System Architecture](#-system-architecture)
- [AI Model Card](#-ai-model-card)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Demo](#running-the-demo)
- [Usage Guide](#-usage-guide)
- [Expected Outputs](#-expected-outputs)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Team & Contact](#-team--contact)

---

## 📱 Product Overview

**Drobe** solves a common daily problem: "What should I wear today?"

By combining AI-powered clothing analysis with intelligent outfit recommendations, Drobe helps users:
- **Save time**: Get outfit suggestions in seconds instead of trying on multiple combinations
- **Discover new looks**: AI finds combinations you might not have considered
- **Dress appropriately**: Weather-aware suggestions ensure comfort and style
- **Organize efficiently**: Automatic categorization eliminates manual wardrobe tagging
- **Shop their closet**: Maximize existing wardrobe instead of buying new clothes

### What This Demo Shows

This working proof-of-concept demonstrates:

1. **AI Clothing Analysis** (Claude Vision)
   - Upload a photo of any clothing item
   - AI automatically categorizes it (tops, bottoms, shoes, etc.)
   - Extracts colors, formality level, and seasonal appropriateness

2. **Intelligent Outfit Recommendations** (Claude 3.5 Sonnet)
   - Enter an occasion (e.g., "job interview", "casual brunch")
   - AI suggests 2-3 complete outfits from your wardrobe
   - Considers current weather, your style preferences, and occasion formality

3. **User Personalization**
   - Set your gender, age, style preferences (minimalist, streetwear, etc.)
   - Choose color palettes (neutral, colorful, earthy, etc.)
   - AI adapts suggestions to match your personal style

4. **Full Wardrobe Management**
   - View all items in grid or list view
   - Filter by category (tops, bottoms, outerwear, etc.)
   - Save favorite outfit combinations
   - Curated "Look of the Day" inspiration

---

## 🎥 Demo Video

**[Link to Product Demo Video]** *(Upload your video to YouTube/Vimeo and add link here)*

*1-2 minute walkthrough showing:*
- User uploading a clothing photo
- AI automatically categorizing the item
- User requesting outfit suggestions for an occasion
- AI generating personalized recommendations
- User saving a favorite outfit

---

## 🏗️ System Architecture

### Architecture Diagram

See **[Docs/DrobeArchitectureDiagram.pdf](./Docs/DrobeArchitectureDiagram.pdf)** for the complete system architecture diagram.

### High-Level Flow

```
User Upload Photo → Client Resize/Optimize → Supabase Storage → Edge Function
                                                                      ↓
                                                            Claude Vision API
                                                                      ↓
                                                         Structured Metadata
                                                                      ↓
                                                          PostgreSQL Database

User Requests Outfit → Fetch Wardrobe + Weather → Edge Function
                                                         ↓
                                              Claude 3.5 Sonnet API
                                                         ↓
                                               2-3 Outfit Suggestions
                                                         ↓
                                                    Display to User
```

### Key Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 18 + TypeScript + Vite | Interactive UI, state management |
| **Backend** | Supabase (PostgreSQL + Storage) | Database, authentication, file storage |
| **AI - Vision** | Claude 3.5 Sonnet (Vision) | Clothing categorization |
| **AI - Recommendations** | Claude 3.5 Sonnet (Text) | Outfit suggestions |
| **Weather** | OpenWeatherMap API | Real-time weather data |
| **Serverless** | Supabase Edge Functions | Hide API keys, server-side logic |
| **Image Processing** | Canvas API (client-side) | Resize, compress, WebP conversion |

**Architecture Document**: See [ARCHITECTURE.md](./ARCHITECTURE.md) for comprehensive system design.

---

## 🤖 AI Model Card

We use **two AI models** in Drobe:

1. **Claude Vision** - Analyzes uploaded clothing photos
   - Categorizes items (tops, bottoms, shoes, etc.)
   - Extracts colors, formality, and seasonal data
   - Zero-shot learning (no fine-tuning required)

2. **Claude 3.5 Sonnet** - Generates outfit recommendations
   - Considers occasion, weather, and user preferences
   - Provides styling reasoning for each suggestion
   - Personalized to user's demographics and style

**Full Model Card**: See [MODEL_CARD.md](./MODEL_CARD.md) for detailed information on:
- Model specifications and intended use
- Training data and limitations
- Performance evaluation and metrics
- Bias considerations and ethical deployment

---

## ✨ Features

### Core Features (Implemented)

- ✅ **Smart Photo Upload**
  - Take photo or choose from gallery
  - Client-side optimization (800x800 + 300x300 thumbnail, WebP format)
  - Automatic AI categorization

- ✅ **AI Wardrobe Analysis**
  - Automatic category detection (tops, bottoms, outerwear, shoes, accessories)
  - Color extraction
  - Formality classification (casual, smart casual, formal)
  - Seasonal appropriateness

- ✅ **Intelligent Outfit Suggestions**
  - Natural language occasion input ("What should I wear to a wedding?")
  - Weather-aware recommendations
  - 2-3 outfit combinations with styling reasoning
  - Save favorites to your collection

- ✅ **User Personalization**
  - Demographic preferences (gender, age)
  - Style preferences (minimalist, streetwear, classic, bohemian, sporty, preppy, edgy, casual)
  - Color palette preferences (colorful, earthy, dark, neutral, bright)
  - Onboarding flow for new users

- ✅ **Wardrobe Management**
  - Grid and list view modes
  - Filter by category
  - Separate tabs for Clothes and Favorite Outfits
  - Delete items from wardrobe

- ✅ **Lookbook Inspiration**
  - Curated "Look of the Day" content
  - Sponsored outfit inspiration
  - Links to sustainable fashion brands

- ✅ **User Profile**
  - View and edit preferences
  - Wardrobe statistics (total items, favorite outfits)
  - Account management

### Security & Privacy

- 🔐 Email/password authentication
- 🔐 Row Level Security (RLS) - users only access their own data
- 🔐 API keys hidden in Edge Functions (never exposed to client)
- 🔐 HTTPS enforced on all endpoints

---

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern component-based UI
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Context API**: Global state management

### Backend (Supabase)
- **PostgreSQL**: Relational database with RLS
- **Supabase Auth**: Email/password authentication
- **Supabase Storage**: Object storage for photos
- **Edge Functions**: Serverless API (Deno runtime)

### AI & External APIs
- **Anthropic Claude API**: Vision and text generation
- **OpenWeatherMap API**: Weather data

### Development Tools
- **npm**: Package manager
- **Git**: Version control
- **Vercel**: Deployment platform

---

## 🚀 Getting Started

### Prerequisites

Before running this demo, you need:

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18+
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Supabase Account** (free tier)
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Note your `Project URL` and `anon/public` API key

4. **Anthropic API Key** (for AI features)
   - Sign up at [console.anthropic.com](https://console.anthropic.com)
   - Generate an API key
   - **Note**: Free trial available, paid tier ~$5-10/month for testing

5. **OpenWeatherMap API Key** (for weather)
   - Sign up at [openweathermap.org](https://openweathermap.org/api)
   - Free tier: 1000 calls/day

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drobe
   ```

2. **Navigate to the app directory**
   ```bash
   cd app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

   This will install all required packages (~180 dependencies). Should take 1-2 minutes.

### Environment Configuration

1. **Copy the environment template**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your credentials:
   ```bash
   # Required for app to run
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   **Where to find these values**:
   - Go to your Supabase project dashboard
   - Click **Settings** → **API**
   - Copy `Project URL` → `VITE_SUPABASE_URL`
   - Copy `anon` `public` key → `VITE_SUPABASE_ANON_KEY`

3. **Set up Supabase database** (one-time setup)

   Go to your Supabase dashboard → **SQL Editor** → paste and run:

   ```sql
   -- See Docs/plans/2026-03-05-drobe-mvp-implementation.md lines 74-218
   -- Or visit Supabase Dashboard → SQL Editor and run the setup script
   ```

   **Quick setup**: The full SQL schema is in `Docs/plans/2026-03-05-drobe-mvp-implementation.md` (Task 2, lines 74-246).

   This creates:
   - `profiles` table (user data)
   - `wardrobe_items` table (clothing)
   - `outfits` table (saved combinations)
   - `planned_outfits` table (future feature)
   - Row Level Security policies
   - `wardrobe-photos` storage bucket

4. **Deploy Edge Functions** (for AI features)

   **Option A: Use Supabase Dashboard** (recommended for demo)
   - Go to **Edge Functions** → **New Function**
   - Create 3 functions: `analyze-clothing`, `suggest-outfits`, `get-weather`
   - Paste code from `Docs/EDGE_FUNCTIONS_SETUP.md`
   - Add environment variables:
     - `ANTHROPIC_API_KEY`: Your Anthropic API key
     - `OPENWEATHER_API_KEY`: Your OpenWeatherMap key

   **Option B: Use Supabase CLI** (for developers)
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login
   supabase login

   # Link to your project
   supabase link --project-ref your-project-ref

   # Deploy functions
   supabase functions deploy analyze-clothing
   supabase functions deploy suggest-outfits
   supabase functions deploy get-weather

   # Set secrets
   supabase secrets set ANTHROPIC_API_KEY=your-key
   supabase secrets set OPENWEATHER_API_KEY=your-key
   ```

### Running the Demo

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   ```
   http://localhost:5173
   ```

3. **Create an account**
   - Click "Sign Up"
   - Enter email and password
   - Complete preferences onboarding (name, gender, age, style preferences)

4. **Upload your first clothing item**
   - Navigate to "Wardrobe" tab
   - Click "+ Add" button
   - Take a photo or upload from gallery
   - Wait ~3-5 seconds for AI analysis
   - Item appears with automatic categorization

5. **Get outfit suggestions**
   - Navigate to "Style AI" tab
   - Enter an occasion (e.g., "job interview")
   - AI generates 2-3 outfit suggestions
   - Click "Add to Outfits" to save favorites

6. **View saved outfits**
   - Navigate to "Wardrobe" → "Outfits" tab
   - See all your favorite outfit combinations

**Expected startup time**: 5-10 seconds for Vite dev server to start.

---

## 📖 Usage Guide

### Uploading Clothing Items

1. **Navigate to Wardrobe** (hangar icon in bottom nav)
2. **Click "+ Add"** button in top right
3. **Choose photo method**:
   - "Take Photo" (uses device camera)
   - "Choose from Gallery" (selects from photos)
4. **Wait for AI analysis** (~3-5 seconds)
5. **Review categorization**:
   - Category (tops, bottoms, outerwear, shoes, accessories)
   - Subcategory (t-shirt, jeans, sneakers, etc.)
   - Colors
   - Formality level
   - Seasonal tags

**Tips for best results**:
- ✅ Good lighting (natural light preferred)
- ✅ Single item per photo
- ✅ Clear, unobstructed view
- ✅ Flat lay or hanging (not worn)
- ❌ Avoid multiple items in one photo
- ❌ Avoid extreme angles or blur

### Getting Outfit Suggestions

1. **Navigate to Style AI** (sparkles icon in bottom nav)
2. **Enter an occasion**:
   - Natural language: "What should I wear to a wedding?"
   - Or select Quick Occasion: "Job Interview", "Casual Brunch", etc.
3. **Review suggestions** (2-3 outfits generated)
   - Each shows item combinations with photos
   - AI reasoning explains why the outfit works
   - Weather badge shows current conditions
4. **Save favorites**: Click "Add to Outfits" button (star icon)

**Example occasions**:
- "Job interview at a tech startup"
- "Date night at a nice restaurant"
- "Casual brunch with friends"
- "Wedding in the summer"
- "Work presentation"
- "Coffee meeting"

### Managing Your Wardrobe

**Grid View** (default):
- 2-column masonry layout
- Thumbnail images
- Category and formality tags
- Tap item to see details

**List View**:
- Full-width rows
- Larger thumbnails
- More metadata visible
- Swipe to delete (future feature)

**Filtering**:
- Use category tabs: All | Tops | Bottoms | Outerwear | Shoes | Accessories
- Only shows items in selected category

**Item Details**:
- Tap any item to see full detail modal
- View all AI-generated metadata
- See which favorite outfits include this item
- Delete item from wardrobe

### Editing Preferences

1. **Navigate to Profile** (person icon in bottom nav)
2. **Click "Edit Preferences"**
3. **Update**:
   - Display name
   - Gender and age
   - Style preferences (multi-select)
   - Color palettes (multi-select)
4. **Save changes**
5. **AI suggestions will now reflect your updates**

---

## 🎯 Expected Outputs

### 1. After Uploading a Clothing Item

**Input**: Photo of a navy blue t-shirt

**Expected Output** (in Wardrobe):
```json
{
  "category": "tops",
  "subcategory": "t-shirt",
  "colors": ["navy blue"],
  "formality": "casual",
  "seasons": ["spring", "summer", "fall", "all-season"],
  "patterns": ["solid"],
  "style_notes": "Classic navy crew neck t-shirt, versatile wardrobe staple"
}
```

**Visual**: Item appears in Wardrobe grid with "Tops" category badge, "Casual" formality tag.

### 2. After Requesting Outfit Suggestions

**Input**:
- Occasion: "job interview"
- Wardrobe: 15 items (mix of casual and formal)
- Weather: 65°F, Partly Cloudy
- User: Male, 28, Minimalist style, Neutral colors

**Expected Output** (2-3 suggestions):

**Suggestion 1: "Sharp Professional"**
- Items: White dress shirt + Navy suit pants + Brown leather shoes + Brown belt
- Reasoning: "This classic combination projects confidence and professionalism. The neutral color palette aligns with your minimalist style, and the lightweight fabric is perfect for 65°F weather."
- Occasion: Job Interview
- Weather: 65°F, Partly Cloudy

**Suggestion 2: "Modern Business Casual"**
- Items: Light blue button-down + Charcoal chinos + Black loafers
- Reasoning: "A slightly less formal but equally polished look. The light blue adds subtle personality while maintaining professionalism. Perfect for startup or creative industry interviews."

**Visual**: Cards showing outfit name, 2x2 grid of item photos, reasoning text, "Add to Outfits" button.

### 3. After Saving a Favorite Outfit

**Action**: User clicks "Add to Outfits" on Suggestion 1

**Expected**:
- Button changes to "Added to Outfits" with checkmark
- Outfit saved to database with:
  - Name: "Sharp Professional"
  - Occasion: "job interview"
  - Item IDs: [id1, id2, id3, id4]
  - AI reasoning
  - Weather snapshot
  - `is_favorite = true`

**Visual in Wardrobe > Outfits Tab**:
- Card showing "Sharp Professional"
- 2x2 mini grid of first 4 items
- Tap to expand full detail modal

### 4. Error Handling

**Scenario**: User tries to get outfit suggestions with only 2 items in wardrobe

**Expected**:
- AI still attempts to generate suggestions
- May return: "Your wardrobe has limited items. Here's one possible combination, but consider adding more pieces for better variety."
- Suggests incomplete outfit or recommends shopping

**Scenario**: API key is invalid or Edge Function fails

**Expected**:
- Error message: "Unable to connect to AI service. Please try again later."
- App remains functional for non-AI features (browsing wardrobe, viewing saved outfits)

---

## 📁 Project Structure

```
drobe/
├── app/                          # Main React application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── screens/    # Main UI screens
│   │   │   │   │   ├── AuthScreen.tsx
│   │   │   │   │   ├── PreferencesScreen.tsx
│   │   │   │   │   ├── WardrobeScreen.tsx
│   │   │   │   │   ├── AIScreen.tsx
│   │   │   │   │   ├── LookbookScreen.tsx
│   │   │   │   │   └── ProfileScreen.tsx
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   └── PhoneFrame.tsx
│   │   │   └── App.tsx          # Main app component
│   │   │
│   │   ├── contexts/            # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   ├── WardrobeContext.tsx
│   │   │   ├── OutfitContext.tsx
│   │   │   └── WeatherContext.tsx
│   │   │
│   │   ├── services/            # Business logic & API clients
│   │   │   ├── auth.ts
│   │   │   ├── wardrobe.ts
│   │   │   ├── outfits.ts
│   │   │   ├── ai.ts
│   │   │   ├── weather.ts
│   │   │   └── image.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase.ts      # Supabase client setup
│   │   │   └── types.ts         # TypeScript type definitions
│   │   │
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useViewportOffset.ts
│   │   │
│   │   ├── styles/
│   │   │   └── index.css        # Global styles
│   │   │
│   │   └── main.tsx             # App entry point
│   │
│   ├── public/                  # Static assets
│   ├── .env.local              # Environment variables (git ignored)
│   ├── .env.example            # Environment template
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── vite.config.ts          # Vite config
│   └── tailwind.config.js      # Tailwind config
│
├── Docs/                        # Project documentation
│   ├── PROJECT_STATUS.md       # Current status & features
│   ├── EDGE_FUNCTIONS_SETUP.md # Deploy guide for AI
│   └── plans/                  # Design & implementation plans
│       ├── 2026-03-05-drobe-mvp-design.md
│       └── 2026-03-05-drobe-mvp-implementation.md
│
├── ARCHITECTURE.md             # System architecture documentation
├── MODEL_CARD.md               # AI model documentation
├── README.md                   # This file
├── .gitignore                  # Git exclusions
└── 2026 MBAi 448 Final Project - Product Demo.pdf  # Assignment
```

### Key Files

| File | Purpose |
|------|---------|
| `app/src/app/App.tsx` | Main app component, routing logic |
| `app/src/contexts/AuthContext.tsx` | Authentication state management |
| `app/src/contexts/WardrobeContext.tsx` | Wardrobe data & CRUD operations |
| `app/src/services/ai.ts` | AI service (calls Edge Functions) |
| `app/src/services/image.ts` | Client-side image processing |
| `app/src/lib/supabase.ts` | Supabase client initialization |
| `app/.env.local` | Environment variables (YOU MUST CREATE) |
| `ARCHITECTURE.md` | System design documentation |
| `MODEL_CARD.md` | AI model card & evaluation |
| `Docs/PROJECT_STATUS.md` | Development timeline & status |

---

## 🌐 Deployment

### Current Deployment

**Frontend**: Deployed on Vercel
- URL: [drobe-eight.vercel.app](https://drobe-eight.vercel.app)
- Auto-deploys from `main` branch

**Backend**: Supabase Cloud
- Database: PostgreSQL with RLS
- Storage: `wardrobe-photos` bucket
- Edge Functions: Deployed to Supabase

### Deploy Your Own

**Vercel Deployment** (Recommended):

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Root directory: `app/`
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Set environment variables** in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Vercel will build and deploy automatically
   - Access at `<your-project>.vercel.app`

**Note**: Edge Functions must be deployed separately to Supabase (they're not part of the Vercel deployment).

---

## 🐛 Troubleshooting

### Installation Issues

**Problem**: `npm install` fails with dependency errors

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Problem**: Node version mismatch

**Solution**:
```bash
# Check version
node --version

# If < v18, upgrade Node.js
# Use nvm (recommended): nvm install 18 && nvm use 18
# Or download from nodejs.org
```

### Runtime Errors

**Problem**: Blank screen or "Failed to connect to Supabase"

**Solution**:
- Check `.env.local` exists in `app/` directory
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Restart dev server: `Ctrl+C`, then `npm run dev`

**Problem**: "AI features not working" or "analyze-clothing function not found"

**Solution**:
- Edge Functions not deployed yet
- Follow `Docs/EDGE_FUNCTIONS_SETUP.md` to deploy
- Or use app without AI (manual categorization only)

**Problem**: Photos not uploading

**Solution**:
- Check Supabase Storage bucket `wardrobe-photos` exists
- Verify RLS policies are set (see setup instructions)
- Check browser console for specific error

**Problem**: Weather not showing

**Solution**:
- `get-weather` Edge Function not deployed
- Or `OPENWEATHER_API_KEY` not set in Edge Function secrets
- Default location is Evanston, IL (can change in Profile → Location)

### Database Issues

**Problem**: "Row Level Security policy violation"

**Solution**:
- RLS policies not set up correctly
- Re-run SQL schema from `Docs/plans/2026-03-05-drobe-mvp-implementation.md` lines 74-246
- Ensure policies allow authenticated users to access own data

**Problem**: "Table does not exist"

**Solution**:
- Database schema not created
- Run setup SQL in Supabase Dashboard → SQL Editor

### Performance Issues

**Problem**: Slow image uploads

**Solution**:
- Normal! Client-side processing takes 1-2 seconds
- Large images (>5MB) take longer
- Use lower resolution photos for faster upload

**Problem**: Slow AI responses

**Solution**:
- Claude API calls take 2-8 seconds (normal)
- Check Anthropic API dashboard for rate limits
- Verify internet connection

---

## 👥 Team & Contact

**Northwestern Kellogg MBAi 448 Final Project**

- **Course**: MBAi 448 - Artificial Intelligence for Business
- **Institution**: Northwestern University - Kellogg School of Management
- **Quarter**: Winter 2026
- **Instructors**: Alex Castrounis & Harper Pack

**Project Team**: *(Add your team member names here)*

**For Questions or Issues**:
- Check existing documentation: `Docs/PROJECT_STATUS.md`, `ARCHITECTURE.md`, `MODEL_CARD.md`
- Review troubleshooting section above
- Check Supabase logs for Edge Function errors
- Verify environment variables are set correctly

---

## 📄 License

This project is for educational purposes as part of Northwestern Kellogg MBAi 448.

---

## 🙏 Acknowledgments

- **Anthropic** for Claude AI API
- **Supabase** for backend infrastructure
- **OpenWeatherMap** for weather data
- **Figma** for initial design system
- **Northwestern Kellogg** MBAi 448 teaching team for guidance

---

**Last Updated**: March 11, 2026

**Assignment Deliverable Checklist**:
- ✅ Architecture diagram (`ARCHITECTURE.md`)
- ✅ Model card (`MODEL_CARD.md`)
- ✅ Demo video link (add above)
- ✅ Complete README with setup instructions
- ✅ Reproducible code and dependencies
- ✅ Environment template (`.env.example`)
- ✅ Expected outputs documented
- ✅ No sensitive data in repo (`.gitignore` configured)
