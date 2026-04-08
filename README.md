# Drobe - AI-Powered Wardrobe Assistant

> **Project Team**: Deepesh Khubchandani, Nick Gulson, Shinjini Biswas

An AI-Powered Mobile App that helps you organize your wardrobe and receive personalized outfit recommendations using Claude Vision AI and weather-aware styling.

**Live Prototype**: [drobe-eight.vercel.app](https://drobe-eight.vercel.app) (Mobile-optimized)

**Sample Images**: `Sample Images/` folder contains test clothing photos.

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

**[Watch Product Demo Video](https://drive.google.com/file/d/1YIoevPC0YStZl2ROj31D-dgs9hfJuJxP/view?usp=sharing)**

*1-2 minute walkthrough showing:*
1. User requesting outfit suggestions for an occasion
2. AI generating personalized recommendations
3. User uploading a clothing photo
4. AI automatically categorizing the item
5. User views Look of the Day page

---

## 🏗️ System Architecture

![Drobe Architecture](./docs/DrobeArchitectureDiagram.png)

**For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md)**

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

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and npm
- **Supabase account** (free tier): [supabase.com](https://supabase.com)
- **Anthropic API key**: [console.anthropic.com](https://console.anthropic.com) (~$5-10 for testing)
- **OpenWeatherMap API key** (free tier): [openweathermap.org](https://openweathermap.org/api)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd drobe/app
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `app/.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   Find these in: Supabase Dashboard → Settings → API

3. **Set up database**

   In Supabase Dashboard → SQL Editor, run the schema from:
   `Docs/plans/2026-03-05-drobe-mvp-implementation.md` (lines 74-246)

   This creates tables, RLS policies, and storage bucket.

4. **Deploy Edge Functions** (for AI features)

   Follow instructions in `Docs/EDGE_FUNCTIONS_SETUP.md` to deploy:
   - `analyze-clothing` (Claude Vision)
   - `suggest-outfits` (Claude text)
   - `get-weather` (weather proxy)

   Add your API keys as Supabase secrets.

5. **Run the app**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) and create an account to start!

---

## 📖 Usage Guide

### Upload Clothing
Wardrobe → "+ Add" → Take/upload photo → AI analyzes (3-5s) → Review category, colors, formality

**Tips**: Good lighting, single item, clear view (flat lay or hanging preferred). Sample images available in `Sample Images/` folder for testing.

### Get Outfit Suggestions
Style AI → Enter occasion (e.g., "job interview") → Review 2-3 AI-generated outfits with reasoning → Save favorites

### Manage Wardrobe
- **View**: Grid or list view with category filters
- **Details**: Tap items to see full AI metadata and delete
- **Preferences**: Edit in Profile to personalize AI suggestions (gender, age, style, colors)

---

## 🎯 Expected Outputs

### Clothing Upload
Upload a photo → AI analyzes and returns: category (tops, bottoms, shoes, etc.), colors, formality level (casual/smart casual/formal), seasonal tags, and style notes. Item appears in wardrobe grid with category badge and tags (~3-5 seconds).

### Outfit Suggestions
Enter occasion (e.g., "job interview") → AI generates 2-3 outfit combinations with:
- Creative outfit name
- Item combinations from your wardrobe
- Styling reasoning (why this works)
- Weather considerations
- Option to save to favorites (~4-8 seconds)

### Saved Outfits
View saved outfits in Wardrobe → Outfits tab. Each shows outfit name, 2x2 item grid, and occasion. Tap to see full details and AI reasoning.

---

