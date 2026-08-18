# Triple Stars Gaming Hall - Tournament Platform

Production-ready, modern tournament management web platform for **Triple Stars Gaming Hall**.

---

## 🌟 Features Overview

- **Dark Esports Aesthetics**: Modern visual identity (`#0B0E14` base, neon cyan `#00F0FF` accents, gold `#FFB800` highlights, red live pulse, glassmorphism, GSAP animations, Lucide icons).
- **Strict Moroccan Dirham (MAD / DH) Currency**: All tournament entry fees, prize pools, and financial reports are denominated strictly in MAD (e.g. `20 DH`, `50 DH`, `100 DH`, `2,000 DH`). USD and `$` are excluded.
- **Interactive Tournament Bracket System**:
  - Single Elimination bracket generator supporting powers of 2 ($8, 16, 32, 64$) as well as non-power-of-2 participant counts ($10, 12, 14$) with automatic BYE placement.
  - Interactive visual bracket component with horizontal mobile scrolling, zoom controls (`+`, `-`, reset), round headers, match score badges, winner highlights, and hover details.
  - Instant winner advancement into `next_match_id` slots upon score submission.
- **Live Match System & Stream Integration**:
  - Real-time score updates via Supabase Realtime without page refresh.
  - Video stream embeds (YouTube Live / Twitch) with "WATCH LIVE" badges.
- **Cash Registration Workflow**:
  - Player registration for tournaments with cash payments at Triple Stars desk.
  - Check-in status tracking (`Registered`, `Paid`, `Checked In`, `No Show`, `Disqualified`).
- **Comprehensive Admin Dashboard (`/admin`)**:
  - **Overview**: Key metrics cards, dynamic revenue/prize bar charts (Recharts), audit feed.
  - **Tournament Management**: Create/Edit/Publish/Start/Finish tournaments.
  - **Match Score Controller**: Interactive score editor (`PLAYER A [-] X [+] vs PLAYER B [-] Y [+]`), `START MATCH`, `MARK LIVE`, `FINISH MATCH`.
  - **Finance Dashboard**: Registration revenue, prize payouts, and net income in DH.
  - **System Audit Log**: Full tracking of score changes, tournament updates, and check-in marks.
- **Player Profiles & Global Leaderboard**:
  - Profiles (`/players/:username`) showing wins, losses, win rates, titles, and total prize money earned in DH.
  - Global hall leaderboard ranking players by points, championships, and wins.

---

## 🛠️ Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, GSAP, Recharts
- **Backend & Database**: Supabase (PostgreSQL schema, RLS policies, Auth, Realtime, Storage)
- **Testing**: Vitest (`npm run test`)

---

## 🚀 Quick Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Unit Tests
Verify bracket generation, BYE handling, winner advancement, and currency calculations:
```bash
npm run test
```

### 3. Launch Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔐 Supabase Database Setup

1. Copy `.env.example` to `.env` and set your Supabase URL and Anon Key:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Apply the schema migration located at [`supabase/migrations/20260817000000_initial_schema.sql`](supabase/migrations/20260817000000_initial_schema.sql).
3. Seed sample data using [`supabase/seed.sql`](supabase/seed.sql).

---

## 👑 End-to-End Admin Workflow Checklist

1. Access the **Admin Dashboard** via the `/admin` link in the navbar.
2. Click **Create Tournament** and set name, game, entry fee (`50 DH`), prize pool (`2000 DH`), max players (`8` or `16`), and stream URL.
3. Click **Publish** -> Status becomes `REGISTRATION_OPEN`.
4. Players register via the public tournament details page.
5. In Admin **Registrations & Check-In**, click **Mark Cash Paid & Check-In**.
6. Click **Generate Bracket** (BYEs are automatically created if participant count is not a power of 2).
7. Select a match, adjust scores (`PLAYER A [-] 2 [+] vs PLAYER B [-] 1 [+]`), click **MARK LIVE**, then **FINISH MATCH**.
8. Observe the winner automatically advance into the next round on the interactive bracket across all open browser windows in real time!
