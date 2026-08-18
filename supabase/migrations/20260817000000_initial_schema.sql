-- Migration: Initial Schema for Triple Stars Gaming Hall Tournament Platform
-- Date: 2026-08-17

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    wins INT DEFAULT 0 NOT NULL,
    losses INT DEFAULT 0 NOT NULL,
    championships INT DEFAULT 0 NOT NULL,
    total_prize_money NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    points INT DEFAULT 0 NOT NULL,
    is_disabled BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. USER ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

-- 3. GAMES
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. TOURNAMENTS
CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE RESTRICT,
    banner_url TEXT,
    entry_fee_mad NUMERIC(10, 2) DEFAULT 0.00 NOT NULL, -- Currency in MAD / DH
    prize_pool_mad NUMERIC(10, 2) DEFAULT 0.00 NOT NULL, -- Currency in MAD / DH
    early_bird_fee_mad NUMERIC(10, 2),
    vip_fee_mad NUMERIC(10, 2),
    max_players INT DEFAULT 16 NOT NULL CHECK (max_players >= 2),
    format TEXT DEFAULT 'single_elimination' NOT NULL CHECK (format IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss')),
    status TEXT DEFAULT 'DRAFT' NOT NULL CHECK (status IN ('DRAFT', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'CHECK_IN', 'LIVE', 'COMPLETED', 'CANCELLED')),
    location TEXT DEFAULT 'Triple Stars Gaming Hall' NOT NULL,
    rules TEXT,
    stream_url TEXT,
    stream_embed_url TEXT,
    stream_title TEXT,
    registration_start_at TIMESTAMPTZ,
    registration_end_at TIMESTAMPTZ,
    start_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. TOURNAMENT REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    payment_status TEXT DEFAULT 'pending' NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded', 'cancelled')),
    check_in_status TEXT DEFAULT 'registered' NOT NULL CHECK (check_in_status IN ('registered', 'paid', 'checked_in', 'no_show', 'disqualified')),
    payment_method TEXT DEFAULT 'cash' NOT NULL,
    amount_paid_mad NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    seed INT,
    team_name TEXT,
    CONSTRAINT unique_tournament_player UNIQUE (tournament_id, player_id)
);

-- 6. TOURNAMENT ROUNDS
CREATE TABLE IF NOT EXISTS public.tournament_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    round_number INT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_tournament_round UNIQUE (tournament_id, round_number)
);

-- 7. TOURNAMENT MATCHES
CREATE TABLE IF NOT EXISTS public.tournament_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    round_id UUID REFERENCES public.tournament_rounds(id) ON DELETE CASCADE,
    round_number INT NOT NULL,
    match_number INT NOT NULL,
    player1_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    player2_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    player1_score INT DEFAULT 0 NOT NULL CHECK (player1_score >= 0),
    player2_score INT DEFAULT 0 NOT NULL CHECK (player2_score >= 0),
    winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'check_in', 'live', 'finished', 'cancelled')),
    scheduled_at TIMESTAMPTZ,
    next_match_id UUID REFERENCES public.tournament_matches(id) ON DELETE SET NULL,
    next_match_slot INT CHECK (next_match_slot IN (1, 2)),
    is_bye BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_tournament_round_match UNIQUE (tournament_id, round_number, match_number)
);

-- 8. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES public.tournament_registrations(id) ON DELETE CASCADE,
    amount_mad NUMERIC(10, 2) NOT NULL CHECK (amount_mad >= 0),
    currency TEXT DEFAULT 'MAD' NOT NULL,
    status TEXT DEFAULT 'paid' NOT NULL CHECK (status IN ('pending', 'paid', 'refunded', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. STREAMS
CREATE TABLE IF NOT EXISTS public.streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    match_id UUID REFERENCES public.tournament_matches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('youtube', 'twitch', 'custom')),
    stream_url TEXT NOT NULL,
    embed_url TEXT NOT NULL,
    is_live BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' NOT NULL,
    read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. LEADERBOARD POINTS
CREATE TABLE IF NOT EXISTS public.leaderboard_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rank_achieved INT NOT NULL,
    points_awarded INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON public.tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_game_id ON public.tournaments(game_id);
CREATE INDEX IF NOT EXISTS idx_registrations_tournament ON public.tournament_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_registrations_player ON public.tournament_registrations(player_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON public.tournament_matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.tournament_matches(status);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_points ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: Anyone can view profiles, users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Games: Public read
CREATE POLICY "Games viewable by everyone" ON public.games FOR SELECT USING (true);

-- Tournaments: Public read
CREATE POLICY "Tournaments viewable by everyone" ON public.tournaments FOR SELECT USING (true);

-- Registrations: Public read, Authenticated insert own
CREATE POLICY "Registrations viewable by everyone" ON public.tournament_registrations FOR SELECT USING (true);
CREATE POLICY "Users can register themselves" ON public.tournament_registrations FOR INSERT WITH CHECK (auth.uid() = player_id);

-- Matches & Rounds: Public read
CREATE POLICY "Matches viewable by everyone" ON public.tournament_matches FOR SELECT USING (true);
CREATE POLICY "Rounds viewable by everyone" ON public.tournament_rounds FOR SELECT USING (true);

-- Notifications: User read own
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- Admin Policies: User with role 'admin' or 'super_admin' can manage all tables
CREATE POLICY "Admins full control on tournaments" ON public.tournaments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins full control on matches" ON public.tournament_matches FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin', 'staff'))
);
CREATE POLICY "Admins full control on registrations" ON public.tournament_registrations FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin', 'staff'))
);
