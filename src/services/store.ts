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
import { generateSingleEliminationBracket, advanceMatchWinner } from './bracketEngine';

export interface StoreSnapshot {
  games: Game[];
  profiles: Profile[];
  tournaments: Tournament[];
  rounds: TournamentRound[];
  matches: TournamentMatch[];
  registrations: TournamentRegistration[];
  auditLogs: AuditLog[];
  finance: FinanceSummary;
}


// Initial Mock Seed Data for Triple Stars Gaming Hall
const INITIAL_GAMES: Game[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    code: 'ea-fc-25',
    name: 'EA FC 25',
    category: 'Sports / Football',
    logo_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    code: 'tekken-8',
    name: 'Tekken 8',
    category: 'Fighting',
    logo_url: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    code: 'sf6',
    name: 'Street Fighter 6',
    category: 'Fighting',
    logo_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    code: 'valorant',
    name: 'Valorant',
    category: 'Tactical Shooter',
    logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    code: 'cod-warzone',
    name: 'Call of Duty: Warzone',
    category: 'Battle Royale',
    logo_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
  },
];

const INITIAL_PROFILES: Profile[] = [
  {
    id: 'p-khalid',
    username: 'khalid_fc',
    display_name: 'Khalid Alami',
    email: 'khalid@triplestars.ma',
    phone: '+212 661-123456',
    wins: 18,
    losses: 4,
    championships: 3,
    total_prize_money: 3400, // 3400 DH
    points: 450,
    is_disabled: false,
    role: 'admin',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-yassine',
    username: 'yassine_pro',
    display_name: 'Yassine Berrada',
    email: 'yassine@triplestars.ma',
    phone: '+212 662-987654',
    wins: 15,
    losses: 5,
    championships: 2,
    total_prize_money: 2100, // 2100 DH
    points: 380,
    is_disabled: false,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-amine',
    username: 'amine_fist',
    display_name: 'Amine Tazi',
    email: 'amine@triplestars.ma',
    phone: '+212 663-555111',
    wins: 12,
    losses: 3,
    championships: 2,
    total_prize_money: 1800, // 1800 DH
    points: 320,
    is_disabled: false,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-reda',
    username: 'reda_striker',
    display_name: 'Reda Benali',
    email: 'reda@triplestars.ma',
    phone: '+212 664-222333',
    wins: 10,
    losses: 6,
    championships: 1,
    total_prize_money: 1200, // 1200 DH
    points: 260,
    is_disabled: false,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-mehdi',
    username: 'mehdi_apex',
    display_name: 'Mehdi El Fassi',
    email: 'mehdi@triplestars.ma',
    phone: '+212 665-444888',
    wins: 9,
    losses: 7,
    championships: 1,
    total_prize_money: 950, // 950 DH
    points: 210,
    is_disabled: false,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-simo',
    username: 'simohammed',
    display_name: 'Simo Chaoui',
    email: 'simo@triplestars.ma',
    phone: '+212 666-777999',
    wins: 8,
    losses: 8,
    championships: 0,
    total_prize_money: 600, // 600 DH
    points: 180,
    is_disabled: false,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-omar',
    username: 'ocharles',
    display_name: 'Omar Mansouri',
    email: 'omar@triplestars.ma',
    phone: '+212 667-333444',
    wins: 7,
    losses: 5,
    championships: 0,
    total_prize_money: 450, // 450 DH
    points: 150,
    is_disabled: false,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-soufiane',
    username: 'soufiane_esports',
    display_name: 'Soufiane Kadiri',
    email: 'soufiane@triplestars.ma',
    phone: '+212 668-111222',
    wins: 6,
    losses: 9,
    championships: 0,
    total_prize_money: 300, // 300 DH
    points: 120,
    is_disabled: false,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 't-eafc25-champions',
    slug: 'triple-stars-ea-fc-25-champions-cup',
    name: 'Triple Stars EA FC 25 Champions Cup',
    description:
      'The flagship EA FC 25 tournament at Triple Stars Gaming Hall! 8 top players compete live on stage for a 2,000 DH cash prize.',
    game_id: '11111111-1111-1111-1111-111111111111',
    game: INITIAL_GAMES[0],
    banner_url:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    entry_fee_mad: 50, // 50 DH
    prize_pool_mad: 2000, // 2000 DH
    early_bird_fee_mad: 40, // 40 DH
    vip_fee_mad: 75, // 75 DH
    max_players: 8,
    current_players: 8,
    format: 'single_elimination',
    status: 'LIVE',
    location: 'Triple Stars Main Arena - Station 1 & 2',
    rules: 'Best of 3 matches. Tactical defending mandatory. No pause during active attacks.',
    stream_url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    stream_embed_url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1',
    stream_title: 'EA FC 25 Semi-Finals Live from Triple Stars Gaming Hall',
    start_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't-tekken8-showdown',
    slug: 'tekken-8-iron-fist-showdown',
    name: 'Tekken 8 Iron Fist Showdown',
    description:
      'Fast-paced Tekken 8 bracket action. Bring your fight stick or controller and dominate the arena.',
    game_id: '22222222-2222-2222-2222-222222222222',
    game: INITIAL_GAMES[1],
    banner_url:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    entry_fee_mad: 30, // 30 DH
    prize_pool_mad: 1200, // 1200 DH
    max_players: 16,
    current_players: 6,
    format: 'single_elimination',
    status: 'REGISTRATION_OPEN',
    location: 'Triple Stars Gaming Hall - Arcade Station B',
    rules: 'FT3 rounds, FT2 games. Winners, Losers, and Grand Finals are FT3 games.',
    start_at: new Date(Date.now() + 2 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't-sf6-brawl',
    slug: 'street-fighter-6-night-brawl',
    name: 'Street Fighter 6 Night Brawl',
    description:
      'Late night fighting game intensity. Show off your combos and claim the championship title.',
    game_id: '33333333-3333-3333-3333-333333333333',
    game: INITIAL_GAMES[2],
    banner_url:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    entry_fee_mad: 20, // 20 DH
    prize_pool_mad: 800, // 800 DH
    max_players: 8,
    current_players: 8,
    format: 'single_elimination',
    status: 'CHECK_IN',
    location: 'Triple Stars Gaming Hall - Station C',
    rules: 'First to 3 rounds. Blind pick available upon request.',
    start_at: new Date(Date.now() + 4 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't-valorant-invitational',
    slug: 'valorant-5v5-triple-stars-invitational',
    name: 'Valorant 5v5 Triple Stars Invitational',
    description: 'Premier tactical squad tournament with big cash rewards.',
    game_id: '44444444-4444-4444-4444-444444444444',
    game: INITIAL_GAMES[3],
    banner_url:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    entry_fee_mad: 100, // 100 DH
    prize_pool_mad: 5000, // 5000 DH
    max_players: 16,
    current_players: 4,
    format: 'single_elimination',
    status: 'REGISTRATION_OPEN',
    location: 'Triple Stars PC Gaming Zone',
    rules: 'Standard VCT Competitive Ruleset. Map ban phase prior to match.',
    start_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Pre-generate live bracket for EA FC 25 Champions Cup
const liveEAFCBracket = generateSingleEliminationBracket(
  't-eafc25-champions',
  INITIAL_PROFILES.slice(0, 8)
);

// Mark some matches as played/live for demo realism
const updatedMatches = [...liveEAFCBracket.matches];
// Match 1 QF: Khalid 2 - 1 Yassine (Finished)
const m1 = updatedMatches.find((m) => m.round_number === 1 && m.match_number === 1)!;
m1.player1_score = 2;
m1.player2_score = 1;
m1.status = 'finished';
m1.winner_id = INITIAL_PROFILES[0].id;
m1.winner = INITIAL_PROFILES[0];
const semi1 = updatedMatches.find((m) => m.id === m1.next_match_id)!;
semi1.player1_id = INITIAL_PROFILES[0].id;
semi1.player1 = INITIAL_PROFILES[0];

// Match 2 QF: Amine 2 - 0 Reda (Finished)
const m2 = updatedMatches.find((m) => m.round_number === 1 && m.match_number === 2)!;
m2.player1_score = 2;
m2.player2_score = 0;
m2.status = 'finished';
m2.winner_id = INITIAL_PROFILES[2].id;
m2.winner = INITIAL_PROFILES[2];
semi1.player2_id = INITIAL_PROFILES[2].id;
semi1.player2 = INITIAL_PROFILES[2];

// Semi 1: Khalid 2 - 1 Amine (LIVE)
semi1.player1_score = 2;
semi1.player2_score = 1;
semi1.status = 'live';

class TripleStarsStore {
  private games: Game[] = INITIAL_GAMES;
  private profiles: Profile[] = INITIAL_PROFILES;
  private tournaments: Tournament[] = INITIAL_TOURNAMENTS;
  private rounds: TournamentRound[] = liveEAFCBracket.rounds;
  private matches: TournamentMatch[] = updatedMatches;
  private registrations: TournamentRegistration[] = INITIAL_PROFILES.map((p, idx) => ({
    id: `reg-${idx}`,
    tournament_id: 't-eafc25-champions',
    player_id: p.id,
    player: p,
    registered_at: new Date(Date.now() - idx * 3600000).toISOString(),
    payment_status: 'paid',
    check_in_status: 'checked_in',
    payment_method: 'cash',
    amount_paid_mad: 50,
    seed: idx + 1,
  }));
  private auditLogs: AuditLog[] = [
    {
      id: 'audit-1',
      action: 'TOURNAMENT_CREATED',
      entity_type: 'tournament',
      entity_id: 't-eafc25-champions',
      details: { name: 'Triple Stars EA FC 25 Champions Cup', entry_fee: 50 },
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'audit-2',
      action: 'MATCH_SCORE_UPDATED',
      entity_type: 'match',
      entity_id: m1.id,
      details: { player1: 'khalid_fc', player2: 'yassine_pro', score: '2-1' },
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  private listeners: (() => void)[] = [];
  private snapshot: StoreSnapshot | null = null;

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

  // --- ACTIONS ---

  createTournament(data: Partial<Tournament>): Tournament {
    const game = this.games.find((g) => g.id === data.game_id) || this.games[0];
    const newId = `t-${Date.now()}`;
    const slug = (data.name || 'tournament')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const tournament: Tournament = {
      id: newId,
      slug,
      name: data.name || 'New Tournament',
      description: data.description || '',
      game_id: game.id,
      game,
      banner_url:
        data.banner_url ||
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      entry_fee_mad: Number(data.entry_fee_mad) || 0,
      prize_pool_mad: Number(data.prize_pool_mad) || 0,
      early_bird_fee_mad: data.early_bird_fee_mad ? Number(data.early_bird_fee_mad) : undefined,
      vip_fee_mad: data.vip_fee_mad ? Number(data.vip_fee_mad) : undefined,
      max_players: Number(data.max_players) || 16,
      current_players: 0,
      format: data.format || 'single_elimination',
      status: data.status || 'DRAFT',
      location: data.location || 'Triple Stars Gaming Hall',
      rules: data.rules || '',
      stream_url: data.stream_url,
      stream_embed_url: data.stream_embed_url,
      stream_title: data.stream_title,
      start_at: data.start_at || new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.tournaments.unshift(tournament);
    this.addAuditLog('TOURNAMENT_CREATED', 'tournament', newId, { name: tournament.name });
    this.notify();
    return tournament;
  }

  updateTournament(id: string, updates: Partial<Tournament>): Tournament {
    const idx = this.tournaments.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tournament not found');
    const existing = this.tournaments[idx];
    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.tournaments[idx] = updated;
    this.addAuditLog('TOURNAMENT_UPDATED', 'tournament', id, updates);
    this.notify();
    return updated;
  }

  registerPlayer(tournamentId: string, player: Profile, teamName?: string): TournamentRegistration {
    const t = this.getTournamentById(tournamentId);
    if (!t) throw new Error('Tournament not found');
    const existingReg = this.registrations.find(
      (r) => r.tournament_id === tournamentId && r.player_id === player.id
    );
    if (existingReg) return existingReg;

    const newReg: TournamentRegistration = {
      id: `reg-${Date.now()}`,
      tournament_id: tournamentId,
      player_id: player.id,
      player,
      registered_at: new Date().toISOString(),
      payment_status: 'pending',
      check_in_status: 'registered',
      payment_method: 'cash',
      amount_paid_mad: t.entry_fee_mad,
      team_name: teamName,
    };

    this.registrations.push(newReg);
    t.current_players = (t.current_players || 0) + 1;
    this.addAuditLog('PLAYER_REGISTERED', 'registration', newReg.id, {
      player: player.username,
      tournament: t.name,
    });
    this.notify();
    return newReg;
  }

  updateRegistrationStatus(
    registrationId: string,
    payment_status?: TournamentRegistration['payment_status'],
    check_in_status?: TournamentRegistration['check_in_status']
  ) {
    const reg = this.registrations.find((r) => r.id === registrationId);
    if (!reg) return;
    if (payment_status) reg.payment_status = payment_status;
    if (check_in_status) reg.check_in_status = check_in_status;
    this.addAuditLog('REGISTRATION_STATUS_UPDATED', 'registration', registrationId, {
      payment_status,
      check_in_status,
    });
    this.notify();
  }

  generateBracketForTournament(tournamentId: string, randomizeSeed: boolean = true) {
    const regs = this.getRegistrationsByTournament(tournamentId);
    // Filter players who are checked in or paid
    const eligiblePlayers = regs
      .filter((r) => r.check_in_status === 'checked_in' || r.payment_status === 'paid')
      .map((r) => r.player!)
      .filter(Boolean);

    // Fall back to all profiles if fewer than 2 registered
    const playerList = eligiblePlayers.length >= 2 ? eligiblePlayers : this.profiles.slice(0, 8);

    const { rounds, matches } = generateSingleEliminationBracket(
      tournamentId,
      playerList,
      { randomize: randomizeSeed }
    );

    this.rounds = [...this.rounds.filter((r) => r.tournament_id !== tournamentId), ...rounds];
    this.matches = [...this.matches.filter((m) => m.tournament_id !== tournamentId), ...matches];

    this.updateTournament(tournamentId, { status: 'CHECK_IN' });
    this.addAuditLog('BRACKET_GENERATED', 'tournament', tournamentId, {
      playersCount: playerList.length,
      roundsCount: rounds.length,
    });
    this.notify();
  }

  updateMatchScore(
    matchId: string,
    player1Score: number,
    player2Score: number,
    status?: TournamentMatch['status']
  ) {
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) throw new Error('Match not found');

    match.player1_score = player1Score;
    match.player2_score = player2Score;
    if (status) match.status = status;
    match.updated_at = new Date().toISOString();

    this.addAuditLog('MATCH_SCORE_UPDATED', 'match', matchId, {
      score: `${player1Score}-${player2Score}`,
      status,
    });
    this.notify();
  }

  finishMatch(matchId: string, player1Score: number, player2Score: number) {
    const tournamentMatches = this.matches.filter(
      (m) => m.tournament_id === this.matches.find((target) => target.id === matchId)?.tournament_id
    );

    const updatedMatches = advanceMatchWinner(
      tournamentMatches,
      matchId,
      player1Score,
      player2Score
    );

    // Replace matches in store
    this.matches = this.matches.map((m) => {
      const u = updatedMatches.find((um) => um.id === m.id);
      return u || m;
    });

    const finishedMatch = this.matches.find((m) => m.id === matchId);
    if (finishedMatch?.winner_id) {
      // Update player win/loss stats
      const winner = this.profiles.find((p) => p.id === finishedMatch.winner_id);
      if (winner) {
        winner.wins += 1;
        winner.points += 20;
      }
      const loserId =
        finishedMatch.winner_id === finishedMatch.player1_id
          ? finishedMatch.player2_id
          : finishedMatch.player1_id;
      const loser = this.profiles.find((p) => p.id === loserId);
      if (loser) {
        loser.losses += 1;
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

  private addAuditLog(action: string, entity_type: string, entity_id: string, details?: any) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      user_id: 'p-khalid',
      user: this.profiles[0],
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    });
  }
}

export const store = new TripleStarsStore();
