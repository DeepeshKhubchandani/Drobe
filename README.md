# Drobe - AI-Powered Wardrobe Assistant

> **Northwestern Kellogg MBAi 448 Final Project**
>
> **Project Team**: Nick Gulson, Shinjini Biswas, George Pantazis, Deepesh Khubchandani, Saahithi Budharaju, Tatsuya Fujii

An AI-powered Progressive Web App that helps you organize your wardrobe and receive personalized outfit recommendations using Claude Vision AI and weather-aware styling.

**Live Prototype**: [drobe-eight.vercel.app](https://drobe-eight.vercel.app)

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

---

## 🎥 Demo Video

**[Link to Product Demo Video]** *(Upload your video to YouTube/Vimeo and add link here)*

*1-2 minute walkthrough showing:*
1. User requesting outfit suggestions for an occasion
2. AI generating personalized recommendations
3. User uploading a clothing photo
4. AI automatically categorizing the item
5. User views Look of the Day page

---

## 🏗️ System Architecture

### Architecture Diagram

![Drobe Architecture](./docs/DrobeArchitectureDiagram.png)

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

