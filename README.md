# Drobe - AI Wardrobe Assistant

An AI-powered Progressive Web App for managing your wardrobe and getting outfit suggestions.

## Project Structure

```
drobe/
├── app/                      # Main React application
│   ├── src/                  # Source code
│   │   ├── app/             # App components and screens
│   │   ├── contexts/        # React Context providers
│   │   ├── lib/             # Core libraries and types
│   │   └── services/        # Business logic services
│   ├── .env.local           # Environment variables (not in git)
│   ├── .env.example         # Environment variables template
│   └── package.json         # Dependencies
│
├── docs/                     # Project documentation
│   ├── PROJECT_STATUS.md    # Current project status
│   ├── EDGE_FUNCTIONS_SETUP.md  # Edge Functions deployment guide
│   └── plans/               # Implementation plans
│
└── Figma Design Images/      # Design reference (not in git)
```

## Quick Start

### 1. Install Dependencies
```bash
cd app
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and add your credentials:
```bash
cd app
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Run Development Server
```bash
cd app
npm run dev
```

The app will be available at `http://localhost:5173`

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Anthropic Claude API (Claude 3.5 Sonnet)
- **Build Tool**: Vite

## Documentation

- [Project Status](docs/PROJECT_STATUS.md) - Current status and completed features
- [Edge Functions Setup](docs/EDGE_FUNCTIONS_SETUP.md) - Deploy AI features

## Features

- 📸 Upload and manage wardrobe items
- 🤖 AI-powered clothing categorization (Claude Vision)
- 👔 Smart outfit suggestions based on occasion and weather
- 📅 Outfit planning for events
- 📊 Wardrobe analytics and sustainability tracking
- 🔐 Secure authentication

## Development Status

**Current**: Core MVP Complete
**Next**: Deploy Edge Functions for AI features

See [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) for detailed progress.
