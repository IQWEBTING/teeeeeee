# Songkran Festival Mini-Games

This is Phase 1 of the Thai Songkran Festival Mini-Games Web App foundation. 

## Technology Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 + native CSS animations
- **State Management**: Zustand
- **Routing**: React Router v7
- **Database Backend**: Supabase
- **Game Engine**: Phaser 3
- **Animations**: GSAP
- **Audio**: Howler.js

## Project Setup Guide

### 1. Install Dependencies

You can install the dependencies listed in `package.json` using npm:

```bash
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the SQL code from `supabase/migrations/001_initial.sql`. This will create the required tables (`girl_game_scores`, `balloon_game_scores`, `announcements`), set up Row Level Security (RLS) policies, and create performance indexes.
3. Obtain your Project URL and anon key from the Supabase Project API Settings.
4. Copy `.env.example` to a new file named `.env.local` (or `.env`):
   ```bash
   cp .env.example .env.local
   ```
5. Populate the variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_EMOJI_PASSWORD=😎🤩🥳
   ```

### 3. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173/](http://localhost:5173/).

## Future Phases

- Phase 2: Game Logic implementation via Phaser 3
- Phase 3: Leaderboard & Admin integration
- Phase 4: Audio mapping & Final polish
