import { Profile, TournamentMatch, TournamentRound, SwissStanding } from '../types';

export interface GeneratedBracket {
  rounds: TournamentRound[];
  matches: TournamentMatch[];
}

export function getNextPowerOfTwo(n: number): number {
  if (n <= 2) return 2;
  let p = 2;
  while (p < n) {
    p *= 2;
  }
  return p;
}

export function getRoundName(totalRounds: number, currentRoundIndex: number): string {
  const remainingRounds = totalRounds - currentRoundIndex;
  if (remainingRounds === 1) return 'Final';
  if (remainingRounds === 2) return 'Semi Finals';
  if (remainingRounds === 3) return 'Quarter Finals';
  const slots = Math.pow(2, remainingRounds);
  return `Round of ${slots}`;
}

/**
 * Single Elimination Bracket Generator
 */
export function generateSingleEliminationBracket(
  tournamentId: string,
  players: Profile[],
  options: { randomize?: boolean } = {}
): GeneratedBracket {
  if (players.length < 2) {
    throw new Error('A tournament requires at least 2 players to generate a bracket.');
  }

  let seededPlayers = [...players];
  if (options.randomize) {
    for (let i = seededPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [seededPlayers[i], seededPlayers[j]] = [seededPlayers[j], seededPlayers[i]];
    }
  }

  const numPlayers = seededPlayers.length;
  const bracketSlots = getNextPowerOfTwo(numPlayers);
  const numRounds = Math.log2(bracketSlots);
  const numByes = bracketSlots - numPlayers;

  const rounds: TournamentRound[] = [];
  const matches: TournamentMatch[] = [];

  // Generate Rounds
  for (let r = 1; r <= numRounds; r++) {
    const roundId = `round-${tournamentId}-${r}`;
    rounds.push({
      id: roundId,
      tournament_id: tournamentId,
      round_number: r,
      name: getRoundName(numRounds, r - 1),
      stage: 'winners',
    });
  }

  const roundMatchesMap = new Map<number, TournamentMatch[]>();

  for (let r = numRounds; r >= 1; r--) {
    const matchesInRound = Math.pow(2, numRounds - r);
    const roundId = rounds[r - 1].id;
    const currentRoundMatches: TournamentMatch[] = [];

    for (let m = 1; m <= matchesInRound; m++) {
      const matchId = `match-${tournamentId}-r${r}-m${m}`;
      const match: TournamentMatch = {
        id: matchId,
        tournament_id: tournamentId,
        round_id: roundId,
        round_number: r,
        match_number: m,
        stage: 'winners',
        player1_id: undefined,
        player2_id: undefined,
        player1_score: 0,
        player2_score: 0,
        winner_id: undefined,
        status: 'scheduled',
        is_bye: false,
        updated_at: new Date().toISOString(),
      };

      if (r < numRounds) {
        const nextRoundMatches = roundMatchesMap.get(r + 1);
        if (nextRoundMatches) {
          const nextMatchIndex = Math.floor((m - 1) / 2);
          match.next_match_id = nextRoundMatches[nextMatchIndex].id;
          match.next_match_slot = (m % 2 === 1 ? 1 : 2) as 1 | 2;
        }
      }

      currentRoundMatches.push(match);
    }
    roundMatchesMap.set(r, currentRoundMatches);
  }

  for (let r = 1; r <= numRounds; r++) {
    const rMatches = roundMatchesMap.get(r) || [];
    matches.push(...rMatches);
  }

  // Populate Round 1 matches with players and BYEs
  const round1Matches = roundMatchesMap.get(1) || [];
  let playerIdx = 0;

  for (let m = 0; m < round1Matches.length; m++) {
    const match = round1Matches[m];
    const p1 = seededPlayers[playerIdx++];
    match.player1_id = p1?.id;
    match.player1 = p1;

    if (m < numByes) {
      match.is_bye = true;
      match.status = 'finished';
      match.winner_id = p1?.id;
      match.winner = p1;

      if (match.next_match_id) {
        const nextMatch = matches.find((nm) => nm.id === match.next_match_id);
        if (nextMatch) {
          if (match.next_match_slot === 1) {
            nextMatch.player1_id = p1?.id;
            nextMatch.player1 = p1;
          } else {
            nextMatch.player2_id = p1?.id;
            nextMatch.player2 = p1;
          }
        }
      }
    } else {
      const p2 = seededPlayers[playerIdx++];
      match.player2_id = p2?.id;
      match.player2 = p2;
    }
  }

  return { rounds, matches };
}

/**
 * Double Elimination Bracket Generator
 * Creates Winners Bracket, Losers Bracket, and Grand Finals (with potential Reset)
 */
export function generateDoubleEliminationBracket(
  tournamentId: string,
  players: Profile[],
  options: { randomize?: boolean } = {}
): GeneratedBracket {
  if (players.length < 2) {
    throw new Error('A tournament requires at least 2 players to generate a bracket.');
  }

  let seededPlayers = [...players];
  if (options.randomize) {
    for (let i = seededPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [seededPlayers[i], seededPlayers[j]] = [seededPlayers[j], seededPlayers[i]];
    }
  }

  const numPlayers = seededPlayers.length;
  const bracketSlots = getNextPowerOfTwo(numPlayers);
  const wbRoundsCount = Math.log2(bracketSlots);
  const lbRoundsCount = Math.max(1, 2 * (wbRoundsCount - 1));
  const totalRoundsCount = wbRoundsCount + lbRoundsCount + 1; // +1 for Grand Finals

  const rounds: TournamentRound[] = [];
  const matches: TournamentMatch[] = [];

  // 1. Create Winners Bracket Rounds
  for (let r = 1; r <= wbRoundsCount; r++) {
    let name = `Winners Round ${r}`;
    if (r === wbRoundsCount) name = 'Winners Finals';
    else if (r === wbRoundsCount - 1 && wbRoundsCount > 2) name = 'Winners Semifinals';

    rounds.push({
      id: `round-${tournamentId}-wb-${r}`,
      tournament_id: tournamentId,
      round_number: r,
      name,
      stage: 'winners',
    });
  }

  // 2. Create Losers Bracket Rounds
  for (let r = 1; r <= lbRoundsCount; r++) {
    let name = `Losers Round ${r}`;
    if (r === lbRoundsCount) name = 'Losers Finals';
    else if (r === lbRoundsCount - 1) name = 'Losers Semifinals';

    rounds.push({
      id: `round-${tournamentId}-lb-${r}`,
      tournament_id: tournamentId,
      round_number: wbRoundsCount + r,
      name,
      stage: 'losers',
    });
  }

  // 3. Create Grand Finals Round
  const gfRoundNumber = totalRoundsCount;
  rounds.push({
    id: `round-${tournamentId}-gf`,
    tournament_id: tournamentId,
    round_number: gfRoundNumber,
    name: 'Grand Finals',
    stage: 'grand_finals',
  });

  // Build Winners Bracket Matches
  const wbMatchesMap = new Map<number, TournamentMatch[]>();
  for (let r = 1; r <= wbRoundsCount; r++) {
    const matchCount = Math.pow(2, wbRoundsCount - r);
    const roundId = rounds[r - 1].id;
    const rMatches: TournamentMatch[] = [];

    for (let m = 1; m <= matchCount; m++) {
      const match: TournamentMatch = {
        id: `match-${tournamentId}-wb-r${r}-m${m}`,
        tournament_id: tournamentId,
        round_id: roundId,
        round_number: r,
        match_number: m,
        stage: 'winners',
        player1_score: 0,
        player2_score: 0,
        status: 'scheduled',
        is_bye: false,
        updated_at: new Date().toISOString(),
      };
      rMatches.push(match);
    }
    wbMatchesMap.set(r, rMatches);
  }

  // Build Losers Bracket Matches
  const lbMatchesMap = new Map<number, TournamentMatch[]>();
  for (let r = 1; r <= lbRoundsCount; r++) {
    const exponent = wbRoundsCount - 1 - Math.floor((r + 1) / 2);
    const matchCount = Math.max(1, Math.pow(2, exponent));
    const roundId = rounds[wbRoundsCount + r - 1].id;
    const rMatches: TournamentMatch[] = [];

    for (let m = 1; m <= matchCount; m++) {
      const match: TournamentMatch = {
        id: `match-${tournamentId}-lb-r${r}-m${m}`,
        tournament_id: tournamentId,
        round_id: roundId,
        round_number: wbRoundsCount + r,
        match_number: m,
        stage: 'losers',
        player1_score: 0,
        player2_score: 0,
        status: 'scheduled',
        is_bye: false,
        updated_at: new Date().toISOString(),
      };
      rMatches.push(match);
    }
    lbMatchesMap.set(r, rMatches);
  }

  // Build Grand Finals Matches (GF1 and GF Reset)
  const gfRoundId = rounds[rounds.length - 1].id;
  const gfMatch: TournamentMatch = {
    id: `match-${tournamentId}-gf-1`,
    tournament_id: tournamentId,
    round_id: gfRoundId,
    round_number: gfRoundNumber,
    match_number: 1,
    stage: 'grand_finals',
    player1_score: 0,
    player2_score: 0,
    status: 'scheduled',
    is_bye: false,
    updated_at: new Date().toISOString(),
  };

  const gfResetMatch: TournamentMatch = {
    id: `match-${tournamentId}-gf-reset`,
    tournament_id: tournamentId,
    round_id: gfRoundId,
    round_number: gfRoundNumber,
    match_number: 2,
    stage: 'reset',
    player1_score: 0,
    player2_score: 0,
    status: 'scheduled',
    is_bye: false,
    updated_at: new Date().toISOString(),
  };

  // Wire Winners Bracket progression
  for (let r = 1; r < wbRoundsCount; r++) {
    const currentMatches = wbMatchesMap.get(r) || [];
    const nextMatches = wbMatchesMap.get(r + 1) || [];

    for (let m = 0; m < currentMatches.length; m++) {
      const match = currentMatches[m];
      const nextIdx = Math.floor(m / 2);
      match.next_match_id = nextMatches[nextIdx]?.id;
      match.next_match_slot = (m % 2 === 0 ? 1 : 2) as 1 | 2;
    }
  }

  // WB Finals winner goes to Grand Finals (Slot 1)
  const wbFinalsMatches = wbMatchesMap.get(wbRoundsCount) || [];
  if (wbFinalsMatches.length > 0) {
    wbFinalsMatches[0].next_match_id = gfMatch.id;
    wbFinalsMatches[0].next_match_slot = 1;
  }

  // Wire Losers Bracket progression
  for (let r = 1; r < lbRoundsCount; r++) {
    const currentMatches = lbMatchesMap.get(r) || [];
    const nextMatches = lbMatchesMap.get(r + 1) || [];

    for (let m = 0; m < currentMatches.length; m++) {
      const match = currentMatches[m];
      if (r % 2 === 1) {
        match.next_match_id = nextMatches[m]?.id;
        match.next_match_slot = 2;
      } else {
        const nextIdx = Math.floor(m / 2);
        match.next_match_id = nextMatches[nextIdx]?.id;
        match.next_match_slot = (m % 2 === 0 ? 1 : 2) as 1 | 2;
      }
    }
  }

  // LB Finals winner goes to Grand Finals (Slot 2)
  const lbFinalsMatches = lbMatchesMap.get(lbRoundsCount) || [];
  if (lbFinalsMatches.length > 0) {
    lbFinalsMatches[0].next_match_id = gfMatch.id;
    lbFinalsMatches[0].next_match_slot = 2;
  }

  // Wire Drop-down from Winners Bracket to Losers Bracket
  const wbR1 = wbMatchesMap.get(1) || [];
  const lbR1 = lbMatchesMap.get(1) || [];
  for (let m = 0; m < wbR1.length; m++) {
    const lbIdx = Math.floor(m / 2);
    if (lbR1[lbIdx]) {
      wbR1[m].loser_match_id = lbR1[lbIdx].id;
      wbR1[m].loser_match_slot = (m % 2 === 0 ? 1 : 2) as 1 | 2;
    }
  }

  // WB R2 -> LB R2
  const wbR2 = wbMatchesMap.get(2) || [];
  const lbR2 = lbMatchesMap.get(2) || [];
  for (let m = 0; m < wbR2.length; m++) {
    if (lbR2[m]) {
      wbR2[m].loser_match_id = lbR2[m].id;
      wbR2[m].loser_match_slot = 1;
    }
  }

  // WB Finals loser -> LB Finals
  if (wbFinalsMatches.length > 0 && lbFinalsMatches.length > 0) {
    wbFinalsMatches[0].loser_match_id = lbFinalsMatches[0].id;
    wbFinalsMatches[0].loser_match_slot = 1;
  }

  // Populate WB Round 1 with initial players and handle BYEs
  const numByes = bracketSlots - numPlayers;
  let playerIdx = 0;

  for (let m = 0; m < wbR1.length; m++) {
    const match = wbR1[m];
    const p1 = seededPlayers[playerIdx++];
    match.player1_id = p1?.id;
    match.player1 = p1;

    if (m < numByes) {
      match.is_bye = true;
      match.status = 'finished';
      match.winner_id = p1?.id;
      match.winner = p1;

      if (match.next_match_id) {
        const nextMatch = wbMatchesMap.get(2)?.find((nm) => nm.id === match.next_match_id);
        if (nextMatch) {
          if (match.next_match_slot === 1) {
            nextMatch.player1_id = p1?.id;
            nextMatch.player1 = p1;
          } else {
            nextMatch.player2_id = p1?.id;
            nextMatch.player2 = p1;
          }
        }
      }
    } else {
      const p2 = seededPlayers[playerIdx++];
      match.player2_id = p2?.id;
      match.player2 = p2;
    }
  }

  // Flatten all matches
  for (let r = 1; r <= wbRoundsCount; r++) {
    matches.push(...(wbMatchesMap.get(r) || []));
  }
  for (let r = 1; r <= lbRoundsCount; r++) {
    matches.push(...(lbMatchesMap.get(r) || []));
  }
  matches.push(gfMatch, gfResetMatch);

  return { rounds, matches };
}

/**
 * Swiss Standings Calculation Engine
 * Calculates rank, match points, win/draw/loss records, game differentials, and Buchholz tiebreakers
 */
export function calculateSwissStandings(
  players: Profile[],
  matches: TournamentMatch[]
): SwissStanding[] {
  const standingsMap = new Map<string, SwissStanding>();

  players.forEach((p) => {
    standingsMap.set(p.id, {
      player_id: p.id,
      player: p,
      rank: 0,
      match_points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      matches_played: 0,
      game_differential: 0,
      buchholz: 0,
      opponents: [],
    });
  });

  matches.forEach((m) => {
    if (m.status !== 'finished' || !m.player1_id) return;

    const p1 = standingsMap.get(m.player1_id);
    const p2 = m.player2_id ? standingsMap.get(m.player2_id) : undefined;

    if (m.is_bye && p1) {
      p1.wins += 1;
      p1.match_points += 3;
      p1.matches_played += 1;
      p1.game_differential += 2;
      return;
    }

    if (p1 && p2 && m.player2_id) {
      p1.matches_played += 1;
      p2.matches_played += 1;
      p1.opponents.push(m.player2_id);
      p2.opponents.push(m.player1_id);

      p1.game_differential += m.player1_score - m.player2_score;
      p2.game_differential += m.player2_score - m.player1_score;

      if (m.player1_score > m.player2_score) {
        p1.wins += 1;
        p1.match_points += 3;
        p2.losses += 1;
      } else if (m.player2_score > m.player1_score) {
        p2.wins += 1;
        p2.match_points += 3;
        p1.losses += 1;
      } else {
        p1.draws += 1;
        p2.draws += 1;
        p1.match_points += 1;
        p2.match_points += 1;
      }
    }
  });

  const standings = Array.from(standingsMap.values());
  standings.forEach((entry) => {
    entry.buchholz = entry.opponents.reduce((acc, oppId) => {
      const opp = standingsMap.get(oppId);
      return acc + (opp ? opp.match_points : 0);
    }, 0);
  });

  standings.sort((a, b) => {
    if (b.match_points !== a.match_points) return b.match_points - a.match_points;
    if (b.buchholz !== a.buchholz) return b.buchholz - a.buchholz;
    if (b.game_differential !== a.game_differential) return b.game_differential - a.game_differential;
    return b.wins - a.wins;
  });

  standings.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  return standings;
}

/**
 * Swiss Tournament Initial Generator
 * Creates the tournament rounds structure and Round 1 pairings
 */
export function generateSwissTournament(
  tournamentId: string,
  players: Profile[],
  options: { randomize?: boolean } = {}
): GeneratedBracket {
  if (players.length < 2) {
    throw new Error('A tournament requires at least 2 players to generate a Swiss bracket.');
  }

  let seeded = [...players];
  if (options.randomize) {
    for (let i = seeded.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [seeded[i], seeded[j]] = [seeded[j], seeded[i]];
    }
  }

  const numPlayers = seeded.length;
  const totalRounds = Math.max(3, Math.ceil(Math.log2(numPlayers)));

  const rounds: TournamentRound[] = [];
  for (let r = 1; r <= totalRounds; r++) {
    rounds.push({
      id: `round-${tournamentId}-swiss-${r}`,
      tournament_id: tournamentId,
      round_number: r,
      name: `Swiss Round ${r}`,
      stage: 'swiss',
    });
  }

  const matches: TournamentMatch[] = [];
  const round1Id = rounds[0].id;
  const isOdd = numPlayers % 2 !== 0;
  const pairCount = Math.floor(numPlayers / 2);

  for (let i = 0; i < pairCount; i++) {
    const p1 = seeded[i * 2];
    const p2 = seeded[i * 2 + 1];
    matches.push({
      id: `match-${tournamentId}-swiss-r1-m${i + 1}`,
      tournament_id: tournamentId,
      round_id: round1Id,
      round_number: 1,
      match_number: i + 1,
      stage: 'swiss',
      player1_id: p1.id,
      player1: p1,
      player2_id: p2.id,
      player2: p2,
      player1_score: 0,
      player2_score: 0,
      status: 'scheduled',
      is_bye: false,
      updated_at: new Date().toISOString(),
    });
  }

  if (isOdd) {
    const byePlayer = seeded[numPlayers - 1];
    matches.push({
      id: `match-${tournamentId}-swiss-r1-m${pairCount + 1}`,
      tournament_id: tournamentId,
      round_id: round1Id,
      round_number: 1,
      match_number: pairCount + 1,
      stage: 'swiss',
      player1_id: byePlayer.id,
      player1: byePlayer,
      player2_id: undefined,
      player1_score: 2,
      player2_score: 0,
      winner_id: byePlayer.id,
      winner: byePlayer,
      status: 'finished',
      is_bye: true,
      updated_at: new Date().toISOString(),
    });
  }

  return { rounds, matches };
}

/**
 * Generate Next Swiss Round Pairings
 * Dynamically pairs competitors with similar records while preventing rematches
 */
export function generateNextSwissRoundPairings(
  tournamentId: string,
  nextRoundNumber: number,
  players: Profile[],
  existingMatches: TournamentMatch[]
): TournamentMatch[] {
  const standings = calculateSwissStandings(players, existingMatches);
  const roundId = `round-${tournamentId}-swiss-${nextRoundNumber}`;
  const alreadyPaired = new Set<string>();
  const newMatches: TournamentMatch[] = [];
  let matchNumber = 1;

  const playedOpponentsMap = new Map<string, Set<string>>();
  const receivedByes = new Set<string>();

  players.forEach((p) => playedOpponentsMap.set(p.id, new Set<string>()));
  existingMatches.forEach((m) => {
    if (m.is_bye && m.player1_id) {
      receivedByes.add(m.player1_id);
    } else if (m.player1_id && m.player2_id) {
      playedOpponentsMap.get(m.player1_id)?.add(m.player2_id);
      playedOpponentsMap.get(m.player2_id)?.add(m.player1_id);
    }
  });

  const unpaired = [...standings];

  if (unpaired.length % 2 !== 0) {
    let byeIndex = unpaired.length - 1;
    while (byeIndex >= 0 && receivedByes.has(unpaired[byeIndex].player_id)) {
      byeIndex--;
    }
    if (byeIndex < 0) byeIndex = unpaired.length - 1;

    const byeEntry = unpaired.splice(byeIndex, 1)[0];
    alreadyPaired.add(byeEntry.player_id);

    newMatches.push({
      id: `match-${tournamentId}-swiss-r${nextRoundNumber}-mBYE`,
      tournament_id: tournamentId,
      round_id: roundId,
      round_number: nextRoundNumber,
      match_number: matchNumber++,
      stage: 'swiss',
      player1_id: byeEntry.player_id,
      player1: byeEntry.player,
      player1_score: 2,
      player2_score: 0,
      winner_id: byeEntry.player_id,
      winner: byeEntry.player,
      status: 'finished',
      is_bye: true,
      updated_at: new Date().toISOString(),
    });
  }

  while (unpaired.length > 0) {
    const p1Entry = unpaired.shift()!;
    const p1Id = p1Entry.player_id;

    let opponentIdx = -1;
    for (let i = 0; i < unpaired.length; i++) {
      const candidateId = unpaired[i].player_id;
      if (!playedOpponentsMap.get(p1Id)?.has(candidateId)) {
        opponentIdx = i;
        break;
      }
    }

    if (opponentIdx === -1) opponentIdx = 0;

    const p2Entry = unpaired.splice(opponentIdx, 1)[0];

    newMatches.push({
      id: `match-${tournamentId}-swiss-r${nextRoundNumber}-m${matchNumber}`,
      tournament_id: tournamentId,
      round_id: roundId,
      round_number: nextRoundNumber,
      match_number: matchNumber++,
      stage: 'swiss',
      player1_id: p1Entry.player_id,
      player1: p1Entry.player,
      player2_id: p2Entry.player_id,
      player2: p2Entry.player,
      player1_score: 0,
      player2_score: 0,
      status: 'scheduled',
      is_bye: false,
      updated_at: new Date().toISOString(),
    });
  }

  return newMatches;
}

/**
 * Round Robin Tournament Generator
 * Creates an all-play-all schedule using Berger round-robin rotation
 */
export function generateRoundRobinTournament(
  tournamentId: string,
  players: Profile[]
): GeneratedBracket {
  if (players.length < 2) {
    throw new Error('A tournament requires at least 2 players to generate a Round Robin schedule.');
  }

  const list: (Profile | null)[] = [...players];
  const isOdd = list.length % 2 !== 0;
  if (isOdd) list.push(null);

  const n = list.length;
  const numRounds = n - 1;
  const matchesPerRound = n / 2;

  const rounds: TournamentRound[] = [];
  const matches: TournamentMatch[] = [];

  for (let r = 1; r <= numRounds; r++) {
    rounds.push({
      id: `round-${tournamentId}-rr-${r}`,
      tournament_id: tournamentId,
      round_number: r,
      name: `Round ${r}`,
      stage: 'group',
    });
  }

  let currentRotation = [...list];

  for (let r = 1; r <= numRounds; r++) {
    const roundId = rounds[r - 1].id;
    let matchInRound = 1;

    for (let i = 0; i < matchesPerRound; i++) {
      const p1 = currentRotation[i];
      const p2 = currentRotation[n - 1 - i];

      if (!p1 && !p2) continue;

      if (!p1 && p2) {
        matches.push({
          id: `match-${tournamentId}-rr-r${r}-m${matchInRound++}`,
          tournament_id: tournamentId,
          round_id: roundId,
          round_number: r,
          match_number: matchInRound,
          stage: 'group',
          player1_id: p2.id,
          player1: p2,
          player1_score: 2,
          player2_score: 0,
          winner_id: p2.id,
          winner: p2,
          status: 'finished',
          is_bye: true,
          updated_at: new Date().toISOString(),
        });
      } else if (p1 && !p2) {
        matches.push({
          id: `match-${tournamentId}-rr-r${r}-m${matchInRound++}`,
          tournament_id: tournamentId,
          round_id: roundId,
          round_number: r,
          match_number: matchInRound,
          stage: 'group',
          player1_id: p1.id,
          player1: p1,
          player1_score: 2,
          player2_score: 0,
          winner_id: p1.id,
          winner: p1,
          status: 'finished',
          is_bye: true,
          updated_at: new Date().toISOString(),
        });
      } else if (p1 && p2) {
        matches.push({
          id: `match-${tournamentId}-rr-r${r}-m${matchInRound++}`,
          tournament_id: tournamentId,
          round_id: roundId,
          round_number: r,
          match_number: matchInRound,
          stage: 'group',
          player1_id: p1.id,
          player1: p1,
          player2_id: p2.id,
          player2: p2,
          player1_score: 0,
          player2_score: 0,
          status: 'scheduled',
          is_bye: false,
          updated_at: new Date().toISOString(),
        });
      }
    }

    const fixed = currentRotation[0];
    const rest = currentRotation.slice(1);
    rest.unshift(rest.pop()!);
    currentRotation = [fixed, ...rest];
  }

  return { rounds, matches };
}

/**
 * Universal Match Progression Engine
 * Advances winners to next matches, routes losers in Double Elimination,
 * and handles Grand Finals resets smoothly.
 */
export function advanceMatchWinner(
  matches: TournamentMatch[],
  matchId: string,
  player1Score: number,
  player2Score: number
): TournamentMatch[] {
  if (player1Score < 0 || player2Score < 0) {
    throw new Error('Match scores cannot be negative.');
  }

  if (player1Score === player2Score) {
    throw new Error('A winner must be decided (scores cannot be tied).');
  }

  const updatedMatches = matches.map((m) => ({ ...m }));
  const targetMatch = updatedMatches.find((m) => m.id === matchId);

  if (!targetMatch) {
    throw new Error(`Match ${matchId} not found.`);
  }

  if (!targetMatch.player1_id || !targetMatch.player2_id) {
    throw new Error('Cannot finish a match without two assigned players.');
  }

  const winnerId = player1Score > player2Score ? targetMatch.player1_id : targetMatch.player2_id;
  const winnerPlayer = player1Score > player2Score ? targetMatch.player1 : targetMatch.player2;

  const loserId = player1Score > player2Score ? targetMatch.player2_id : targetMatch.player1_id;
  const loserPlayer = player1Score > player2Score ? targetMatch.player2 : targetMatch.player1;

  targetMatch.player1_score = player1Score;
  targetMatch.player2_score = player2Score;
  targetMatch.winner_id = winnerId;
  targetMatch.winner = winnerPlayer;
  targetMatch.status = 'finished';
  targetMatch.updated_at = new Date().toISOString();

  // 1. Advance Winner
  if (targetMatch.next_match_id) {
    const nextMatch = updatedMatches.find((m) => m.id === targetMatch.next_match_id);
    if (nextMatch) {
      if (targetMatch.next_match_slot === 1) {
        nextMatch.player1_id = winnerId;
        nextMatch.player1 = winnerPlayer;
      } else {
        nextMatch.player2_id = winnerId;
        nextMatch.player2 = winnerPlayer;
      }

      if (nextMatch.player1_id && nextMatch.player2_id && nextMatch.status === 'scheduled') {
        nextMatch.status = 'scheduled';
      }
    }
  }

  // 2. Route Loser (for Double Elimination)
  if (targetMatch.loser_match_id) {
    const loserMatch = updatedMatches.find((m) => m.id === targetMatch.loser_match_id);
    if (loserMatch) {
      if (targetMatch.loser_match_slot === 1) {
        loserMatch.player1_id = loserId;
        loserMatch.player1 = loserPlayer;
      } else {
        loserMatch.player2_id = loserId;
        loserMatch.player2 = loserPlayer;
      }

      if (loserMatch.player1_id && loserMatch.player2_id && loserMatch.status === 'scheduled') {
        loserMatch.status = 'scheduled';
      }
    }
  }

  // 3. Grand Finals Reset Logic
  if (targetMatch.stage === 'grand_finals') {
    const resetMatch = updatedMatches.find((m) => m.stage === 'reset');
    if (resetMatch) {
      if (winnerId === targetMatch.player2_id) {
        // Losers Bracket champion won GF1 -> activate Reset Match!
        resetMatch.player1_id = targetMatch.player1_id;
        resetMatch.player1 = targetMatch.player1;
        resetMatch.player2_id = targetMatch.player2_id;
        resetMatch.player2 = targetMatch.player2;
        resetMatch.status = 'scheduled';
      } else {
        // Winners Bracket champion won GF1 -> clean finish
        resetMatch.status = 'cancelled';
      }
    }
  }

  return updatedMatches;
}
