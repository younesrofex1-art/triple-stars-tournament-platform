import {
  Profile,
  Game,
  Tournament,
  TournamentRegistration,
  TournamentMatch,
  TournamentRound,
  Stream,
  AuditLog,
  FinanceSummary,
} from '../types';
import {
  generateSingleEliminationBracket,
  generateDoubleEliminationBracket,
  generateSwissTournament,
  generateNextSwissRoundPairings,
  calculateSwissStandings,
  generateRoundRobinTournament,
  advanceMatchWinner,
} from './bracketEngine';
import { supabase } from '../lib/supabase';

export interface StoreSnapshot {
  games: Game[];
  profiles: Profile[];
  tournaments: Tournament[];
  rounds: TournamentRound[];
  matches: TournamentMatch[];
  registrations: TournamentRegistration[];
  auditLogs: AuditLog[];
  finance: FinanceSummary;
  isLoaded: boolean;
}

// Fallback initial game definitions (saved in Supabase `games` table)
const DEFAULT_GAMES: Game[] = [
  {
    id: 'ea03326e-58e0-469e-ab36-19fe145db76a',
    code: 'ea-fc-25',
    name: 'EA FC 25',
    category: 'Sports / Football',
    logo_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ad7fb811-38f6-451f-9bf4-0e60a5710daa',
    code: 'tekken-8',
    name: 'Tekken 8',
    category: 'Fighting',
    logo_url: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'f433b1e5-cdf0-437c-9b52-ae77dc3028ff',
    code: 'sf6',
    name: 'Street Fighter 6',
    category: 'Fighting',
    logo_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'fb209fda-c89b-43f8-a6a3-cbdc05ebd701',
    code: 'valorant',
    name: 'Valorant',
    category: 'Tactical Shooter',
    logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'c4bf933a-a7b5-404a-a8ea-a65f0b0c1f81',
    code: 'cod-warzone',
    name: 'Call of Duty: Warzone',
    category: 'Battle Royale',
    logo_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
  },
];

class TripleStarsStore {
  private games: Game[] = DEFAULT_GAMES;
  private profiles: Profile[] = [];
  private tournaments: Tournament[] = [];
  private rounds: TournamentRound[] = [];
  private matches: TournamentMatch[] = [];
  private registrations: TournamentRegistration[] = [];
  private auditLogs: AuditLog[] = [];
  private isLoaded: boolean = false;

  private listeners: (() => void)[] = [];
  private snapshot: StoreSnapshot | null = null;
  private realtimeChannel: any = null;

  constructor() {
    this.initFromSupabase();
  }

  /**
   * Load real data from Supabase and listen for Realtime events
   */
  async initFromSupabase() {
    try {
      await this.fetchAll();
      this.setupRealtime();
    } catch (e) {
      console.warn('Initial Supabase fetch warning:', e);
      this.isLoaded = true;
      this.notify();
    }
  }

  async fetchAll() {
    try {
      const [
        gamesRes,
        profilesRes,
        tournamentsRes,
        roundsRes,
        matchesRes,
        regsRes,
        auditRes,
      ] = await Promise.allSettled([
        supabase.from('games').select('*').order('name'),
        supabase.from('profiles').select('*').order('points', { ascending: false }),
        supabase.from('tournaments').select('*, game:games(*)').order('start_at', { ascending: true }),
        supabase.from('tournament_rounds').select('*').order('round_number', { ascending: true }),
        supabase.from('tournament_matches').select('*, player1:player1_id(*), player2:player2_id(*), winner:winner_id(*)').order('round_number').order('match_number'),
        supabase.from('tournament_registrations').select('*, player:profiles(*)').order('registered_at', { ascending: false }),
        supabase.from('audit_logs').select('*, user:profiles(*)').order('created_at', { ascending: false }).limit(50),
      ]);

      if (gamesRes.status === 'fulfilled' && gamesRes.value.data && gamesRes.value.data.length > 0) {
        this.games = gamesRes.value.data;
      }
      if (profilesRes.status === 'fulfilled' && profilesRes.value.data) {
        this.profiles = profilesRes.value.data;
      }
      if (tournamentsRes.status === 'fulfilled' && tournamentsRes.value.data) {
        this.tournaments = tournamentsRes.value.data;
      }
      if (roundsRes.status === 'fulfilled' && roundsRes.value.data) {
        this.rounds = roundsRes.value.data;
      }
      if (matchesRes.status === 'fulfilled' && matchesRes.value.data) {
        this.matches = matchesRes.value.data;
      }
      if (regsRes.status === 'fulfilled' && regsRes.value.data) {
        this.registrations = regsRes.value.data;
      }
      if (auditRes.status === 'fulfilled' && auditRes.value.data) {
        this.auditLogs = auditRes.value.data;
      }

      this.isLoaded = true;
      this.notify();
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      this.isLoaded = true;
      this.notify();
    }
  }

  private setupRealtime() {
    if (this.realtimeChannel) return;

    this.realtimeChannel = supabase
      .channel('triplestars-db-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => {
          this.fetchAll();
        }
      )
      .subscribe();
  }

  getSnapshot(): StoreSnapshot {
    if (!this.snapshot) {
      this.snapshot = {
        games: this.games,
        profiles: this.profiles,
        tournaments: this.tournaments,
        rounds: this.rounds,
        matches: this.matches,
        registrations: this.registrations,
        auditLogs: this.auditLogs,
        finance: this.getFinanceSummary(),
        isLoaded: this.isLoaded,
      };
    }
    return this.snapshot;
  }

  subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  private notify() {
    this.snapshot = null;
    this.listeners.forEach((l) => l());
  }

  // --- GETTERS ---

  getGames(): Game[] {
    return this.games;
  }

  getProfiles(): Profile[] {
    return this.profiles;
  }

  getProfileByUsername(username: string): Profile | undefined {
    return this.profiles.find(
      (p) => p.username.toLowerCase() === username.toLowerCase()
    );
  }

  getProfileById(id: string): Profile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  getTournaments(): Tournament[] {
    return this.tournaments;
  }

  getTournamentById(idOrSlug: string): Tournament | undefined {
    return this.tournaments.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
  }

  getMatchesByTournament(tournamentId: string): TournamentMatch[] {
    return this.matches.filter((m) => m.tournament_id === tournamentId);
  }

  getRoundsByTournament(tournamentId: string): TournamentRound[] {
    return this.rounds.filter((r) => r.tournament_id === tournamentId);
  }

  getRegistrationsByTournament(tournamentId: string): TournamentRegistration[] {
    return this.registrations.filter((r) => r.tournament_id === tournamentId);
  }

  getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  // --- ACTIONS (SUPABASE PERSISTED) ---

  async createTournament(data: Partial<Tournament>): Promise<Tournament> {
    const game = this.games.find((g) => g.id === data.game_id) || this.games[0];
    const slug = (data.name || 'tournament')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

    const payload = {
      slug,
      name: data.name || 'New Tournament',
      description: data.description || '',
      game_id: game.id,
      banner_url:
        data.banner_url ||
        game.banner_url ||
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      entry_fee_mad: Number(data.entry_fee_mad) || 0,
      prize_pool_mad: Number(data.prize_pool_mad) || 0,
      early_bird_fee_mad: data.early_bird_fee_mad ? Number(data.early_bird_fee_mad) : null,
      vip_fee_mad: data.vip_fee_mad ? Number(data.vip_fee_mad) : null,
      max_players: Number(data.max_players) || 16,
      format: data.format || 'single_elimination',
      status: data.status || 'REGISTRATION_OPEN',
      location: data.location || 'Triple Stars Gaming Hall',
      rules: data.rules || 'Standard Moroccan Gaming Federation Rules. Fair Play mandatory.',
      stream_url: data.stream_url || null,
      stream_embed_url: data.stream_embed_url || null,
      stream_title: data.stream_title || null,
      start_at: data.start_at || new Date(Date.now() + 86400000).toISOString(),
    };

    const { data: inserted, error } = await supabase
      .from('tournaments')
      .insert(payload)
      .select('*, game:games(*)')
      .single();

    if (error) {
      console.error('Error creating tournament in Supabase:', error);
      throw error;
    }

    this.tournaments.unshift(inserted);
    this.addAuditLog('TOURNAMENT_CREATED', 'tournament', inserted.id, { name: inserted.name });
    this.notify();
    return inserted;
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament> {
    const { data: updated, error } = await supabase
      .from('tournaments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, game:games(*)')
      .single();

    if (error) {
      console.error('Error updating tournament in Supabase:', error);
      throw error;
    }

    const idx = this.tournaments.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.tournaments[idx] = updated;
    }
    this.addAuditLog('TOURNAMENT_UPDATED', 'tournament', id, updates);
    this.notify();
    return updated;
  }

  async deleteTournament(id: string): Promise<void> {
    const { error } = await supabase.from('tournaments').delete().eq('id', id);
    if (error) {
      console.error('Error deleting tournament in Supabase:', error);
      throw error;
    }
    this.tournaments = this.tournaments.filter((t) => t.id !== id);
    this.matches = this.matches.filter((m) => m.tournament_id !== id);
    this.rounds = this.rounds.filter((r) => r.tournament_id !== id);
    this.registrations = this.registrations.filter((r) => r.tournament_id !== id);
    this.notify();
  }

  async createPlayerProfile(profileData: {
    username: string;
    display_name: string;
    email: string;
    phone?: string;
  }): Promise<Profile> {
    // Generate UUID for walk-in player profile
    const id = crypto.randomUUID();
    const payload: Partial<Profile> = {
      id,
      username: profileData.username.toLowerCase().trim().replace(/[^a-z0-9_]/g, ''),
      display_name: profileData.display_name.trim(),
      email: profileData.email.toLowerCase().trim(),
      phone: profileData.phone || null,
      wins: 0,
      losses: 0,
      championships: 0,
      total_prize_money: 0,
      points: 0,
      is_disabled: false,
    };

    const { data: created, error } = await supabase
      .from('profiles')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating profile in Supabase:', error);
      throw error;
    }

    this.profiles.push(created);
    this.notify();
    return created;
  }

  async registerPlayer(
    tournamentId: string,
    player: Profile,
    teamName?: string,
    paymentMethod: string = 'cash'
  ): Promise<TournamentRegistration> {
    const t = this.getTournamentById(tournamentId);
    if (!t) throw new Error('Tournament not found');

    const existing = this.registrations.find(
      (r) => r.tournament_id === tournamentId && r.player_id === player.id
    );
    if (existing) return existing;

    const payload = {
      tournament_id: tournamentId,
      player_id: player.id,
      payment_status: 'pending',
      check_in_status: 'registered',
      payment_method: paymentMethod,
      amount_paid_mad: t.entry_fee_mad || 0,
      team_name: teamName || null,
    };

    const { data: inserted, error } = await supabase
      .from('tournament_registrations')
      .insert(payload)
      .select('*, player:profiles(*)')
      .single();

    if (error) {
      console.error('Error registering player in Supabase:', error);
      throw error;
    }

    this.registrations.unshift(inserted);
    this.addAuditLog('PLAYER_REGISTERED', 'registration', inserted.id, {
      player: player.username,
      tournament: t.name,
    });
    this.notify();
    return inserted;
  }

  async updateRegistrationStatus(
    registrationId: string,
    payment_status?: TournamentRegistration['payment_status'],
    check_in_status?: TournamentRegistration['check_in_status']
  ): Promise<void> {
    const updates: any = {};
    if (payment_status) updates.payment_status = payment_status;
    if (check_in_status) updates.check_in_status = check_in_status;

    const { error } = await supabase
      .from('tournament_registrations')
      .update(updates)
      .eq('id', registrationId);

    if (error) {
      console.error('Error updating registration in Supabase:', error);
      throw error;
    }

    const reg = this.registrations.find((r) => r.id === registrationId);
    if (reg) {
      if (payment_status) reg.payment_status = payment_status;
      if (check_in_status) reg.check_in_status = check_in_status;
    }
    this.addAuditLog('REGISTRATION_STATUS_UPDATED', 'registration', registrationId, updates);
    this.notify();
  }

  async generateBracketForTournament(tournamentId: string, randomizeSeed: boolean = true): Promise<void> {
    const tournament = this.tournaments.find((t) => t.id === tournamentId);
    const regs = this.getRegistrationsByTournament(tournamentId);
    
    // Filter players who are checked in or registered
    const eligiblePlayers = regs
      .map((r) => r.player!)
      .filter(Boolean);

    if (eligiblePlayers.length < 2) {
      throw new Error('You need at least 2 registered competitors to generate a bracket.');
    }

    let generated: { rounds: TournamentRound[]; matches: TournamentMatch[] };

    const format = tournament?.format || 'single_elimination';

    if (format === 'double_elimination') {
      generated = generateDoubleEliminationBracket(tournamentId, eligiblePlayers, {
        randomize: randomizeSeed,
      });
    } else if (format === 'swiss') {
      generated = generateSwissTournament(tournamentId, eligiblePlayers, {
        randomize: randomizeSeed,
      });
    } else if (format === 'round_robin') {
      generated = generateRoundRobinTournament(tournamentId, eligiblePlayers);
    } else {
      generated = generateSingleEliminationBracket(tournamentId, eligiblePlayers, {
        randomize: randomizeSeed,
      });
    }

    const { rounds, matches } = generated;

    // Delete existing rounds and matches for this tournament if re-generating
    await supabase.from('tournament_matches').delete().eq('tournament_id', tournamentId);
    await supabase.from('tournament_rounds').delete().eq('tournament_id', tournamentId);

    // Insert rounds
    const roundsPayload = rounds.map((r) => ({
      id: r.id,
      tournament_id: tournamentId,
      round_number: r.round_number,
      name: r.name,
    }));
    await supabase.from('tournament_rounds').insert(roundsPayload);

    // Insert matches
    const matchesPayload = matches.map((m) => ({
      id: m.id,
      tournament_id: tournamentId,
      round_id: m.round_id,
      round_number: m.round_number,
      match_number: m.match_number,
      player1_id: m.player1_id || null,
      player2_id: m.player2_id || null,
      player1_score: m.player1_score || 0,
      player2_score: m.player2_score || 0,
      winner_id: m.winner_id || null,
      status: m.status || 'scheduled',
      next_match_id: m.next_match_id || null,
      next_match_slot: m.next_match_slot || null,
      is_bye: m.is_bye || false,
    }));
    await supabase.from('tournament_matches').insert(matchesPayload);

    // Update tournament status to CHECK_IN or LIVE
    await this.updateTournament(tournamentId, { status: 'CHECK_IN' });

    this.rounds = [...this.rounds.filter((r) => r.tournament_id !== tournamentId), ...rounds];
    this.matches = [...this.matches.filter((m) => m.tournament_id !== tournamentId), ...matches];

    this.addAuditLog('BRACKET_GENERATED', 'tournament', tournamentId, {
      format,
      playersCount: eligiblePlayers.length,
      roundsCount: rounds.length,
    });
    this.notify();
  }

  async generateNextSwissRound(tournamentId: string): Promise<void> {
    const tournamentMatches = this.matches.filter((m) => m.tournament_id === tournamentId);
    const regs = this.getRegistrationsByTournament(tournamentId);
    const eligiblePlayers = regs.map((r) => r.player!).filter(Boolean);

    if (eligiblePlayers.length < 2) {
      throw new Error('Not enough players registered.');
    }

    const highestRoundNumber = tournamentMatches.reduce(
      (max, m) => Math.max(max, m.round_number),
      0
    );
    const nextRoundNumber = highestRoundNumber + 1;

    const newMatches = generateNextSwissRoundPairings(
      tournamentId,
      nextRoundNumber,
      eligiblePlayers,
      tournamentMatches
    );

    // Ensure round exists
    let round = this.rounds.find(
      (r) => r.tournament_id === tournamentId && r.round_number === nextRoundNumber
    );

    if (!round) {
      round = {
        id: `round-${tournamentId}-swiss-${nextRoundNumber}`,
        tournament_id: tournamentId,
        round_number: nextRoundNumber,
        name: `Swiss Round ${nextRoundNumber}`,
        stage: 'swiss',
      };
      await supabase.from('tournament_rounds').insert({
        id: round.id,
        tournament_id: tournamentId,
        round_number: round.round_number,
        name: round.name,
      });
      this.rounds.push(round);
    }

    const matchesPayload = newMatches.map((m) => ({
      id: m.id,
      tournament_id: tournamentId,
      round_id: round!.id,
      round_number: m.round_number,
      match_number: m.match_number,
      player1_id: m.player1_id || null,
      player2_id: m.player2_id || null,
      player1_score: m.player1_score || 0,
      player2_score: m.player2_score || 0,
      winner_id: m.winner_id || null,
      status: m.status || 'scheduled',
      is_bye: m.is_bye || false,
    }));

    await supabase.from('tournament_matches').insert(matchesPayload);

    this.matches.push(...newMatches);
    this.addAuditLog('SWISS_ROUND_GENERATED', 'tournament', tournamentId, {
      roundNumber: nextRoundNumber,
      matchesCount: newMatches.length,
    });
    this.notify();
  }

  async updateMatchScore(
    matchId: string,
    player1Score: number,
    player2Score: number,
    status?: TournamentMatch['status']
  ): Promise<void> {
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) throw new Error('Match not found');

    const updates: any = {
      player1_score: player1Score,
      player2_score: player2Score,
      updated_at: new Date().toISOString(),
    };
    if (status) updates.status = status;

    const { error } = await supabase
      .from('tournament_matches')
      .update(updates)
      .eq('id', matchId);

    if (error) {
      console.error('Error updating match in Supabase:', error);
      throw error;
    }

    match.player1_score = player1Score;
    match.player2_score = player2Score;
    if (status) match.status = status;
    this.notify();
  }

  async finishMatch(matchId: string, player1Score: number, player2Score: number): Promise<void> {
    const targetMatch = this.matches.find((m) => m.id === matchId);
    if (!targetMatch) throw new Error('Match not found');

    const tournamentMatches = this.matches.filter(
      (m) => m.tournament_id === targetMatch.tournament_id
    );

    const updatedMatches = advanceMatchWinner(
      tournamentMatches,
      matchId,
      player1Score,
      player2Score
    );

    // Save updated matches to Supabase
    for (const m of updatedMatches) {
      await supabase
        .from('tournament_matches')
        .update({
          player1_id: m.player1_id || null,
          player2_id: m.player2_id || null,
          player1_score: m.player1_score || 0,
          player2_score: m.player2_score || 0,
          winner_id: m.winner_id || null,
          status: m.status || 'scheduled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', m.id);
    }

    // Update local matches
    this.matches = this.matches.map((m) => {
      const u = updatedMatches.find((um) => um.id === m.id);
      return u || m;
    });

    const finishedMatch = this.matches.find((m) => m.id === matchId);
    if (finishedMatch?.winner_id) {
      const winner = this.profiles.find((p) => p.id === finishedMatch.winner_id);
      if (winner) {
        const newWins = (winner.wins || 0) + 1;
        const newPoints = (winner.points || 0) + 20;
        winner.wins = newWins;
        winner.points = newPoints;
        await supabase
          .from('profiles')
          .update({ wins: newWins, points: newPoints, updated_at: new Date().toISOString() })
          .eq('id', winner.id);
      }

      const loserId =
        finishedMatch.winner_id === finishedMatch.player1_id
          ? finishedMatch.player2_id
          : finishedMatch.player1_id;
      const loser = this.profiles.find((p) => p.id === loserId);
      if (loser) {
        const newLosses = (loser.losses || 0) + 1;
        loser.losses = newLosses;
        await supabase
          .from('profiles')
          .update({ losses: newLosses, updated_at: new Date().toISOString() })
          .eq('id', loser.id);
      }
    }

    this.addAuditLog('MATCH_FINISHED', 'match', matchId, {
      score: `${player1Score}-${player2Score}`,
      winner_id: finishedMatch?.winner_id,
    });
    this.notify();
  }

  getFinanceSummary(): FinanceSummary {
    const paidRegs = this.registrations.filter((r) => r.payment_status === 'paid');
    const totalRevenue = paidRegs.reduce((sum, r) => sum + (r.amount_paid_mad || 0), 0);
    const totalPrizePool = this.tournaments.reduce(
      (sum, t) => sum + (t.prize_pool_mad || 0),
      0
    );

    return {
      total_registrations: this.registrations.length,
      paid_registrations: paidRegs.length,
      total_revenue_mad: totalRevenue,
      total_prize_pool_mad: totalPrizePool,
      net_revenue_mad: totalRevenue - totalPrizePool,
      refunds_mad: 0,
    };
  }

  private async addAuditLog(
    action: string,
    entity_type: string,
    entity_id: string,
    details?: any,
    userId?: string
  ) {
    const newLog: Partial<AuditLog> = {
      id: crypto.randomUUID(),
      user_id: userId || null,
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('audit_logs').insert(newLog);
    } catch (e) {
      // Non-blocking
    }

    this.auditLogs.unshift(newLog as AuditLog);
  }
}

export const store = new TripleStarsStore();
