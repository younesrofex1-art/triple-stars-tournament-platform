// Types definition for Triple Stars Gaming Hall Tournament Platform

export type TournamentStatus =
  | 'DRAFT'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'CHECK_IN'
  | 'LIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';
export type CheckInStatus = 'registered' | 'paid' | 'checked_in' | 'no_show' | 'disqualified';
export type MatchStatus = 'scheduled' | 'check_in' | 'live' | 'finished' | 'cancelled';
export type UserRoleType = 'super_admin' | 'admin' | 'staff';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  email: string;
  phone?: string;
  wins: number;
  losses: number;
  championships: number;
  total_prize_money: number; // Stored as numeric in MAD (DH)
  points: number;
  is_disabled: boolean;
  role?: UserRoleType;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  code: string;
  name: string;
  category: string;
  logo_url?: string;
  banner_url?: string;
}

export interface Tournament {
  id: string;
  slug: string;
  name: string;
  description: string;
  game_id: string;
  game?: Game;
  banner_url?: string;
  entry_fee_mad: number; // Stored as numeric MAD / DH
  prize_pool_mad: number; // Stored as numeric MAD / DH
  early_bird_fee_mad?: number;
  vip_fee_mad?: number;
  max_players: number;
  current_players?: number;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  status: TournamentStatus;
  location: string;
  rules?: string;
  stream_url?: string;
  stream_embed_url?: string;
  stream_title?: string;
  registration_start_at?: string;
  registration_end_at?: string;
  start_at: string;
  created_at: string;
  updated_at: string;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  player_id: string;
  player?: Profile;
  registered_at: string;
  payment_status: PaymentStatus;
  check_in_status: CheckInStatus;
  payment_method: string;
  amount_paid_mad: number;
  seed?: number;
  team_name?: string;
}

export interface TournamentRound {
  id: string;
  tournament_id: string;
  round_number: number;
  name: string;
}

export interface TournamentMatch {
  id: string;
  tournament_id: string;
  round_id: string;
  round_number: number;
  match_number: number;
  player1_id?: string;
  player2_id?: string;
  player1?: Profile;
  player2?: Profile;
  player1_score: number;
  player2_score: number;
  winner_id?: string;
  winner?: Profile;
  status: MatchStatus;
  scheduled_at?: string;
  next_match_id?: string;
  next_match_slot?: 1 | 2;
  is_bye: boolean;
  updated_at: string;
}

export interface Stream {
  id: string;
  tournament_id?: string;
  match_id?: string;
  title: string;
  provider: 'youtube' | 'twitch' | 'custom';
  stream_url: string;
  embed_url: string;
  is_live: boolean;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  user?: Profile;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface FinanceSummary {
  total_registrations: number;
  paid_registrations: number;
  total_revenue_mad: number;
  total_prize_pool_mad: number;
  net_revenue_mad: number;
  refunds_mad: number;
}
