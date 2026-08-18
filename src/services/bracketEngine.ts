import { Profile, TournamentMatch, TournamentRound } from '../types';

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
 * Pure Single Elimination Bracket Generation Engine
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
    // Fisher-Yates shuffle
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
    });
  }

  // Pre-generate empty matches for all rounds to build next_match links cleanly
  // Round 1 has bracketSlots / 2 matches, Round 2 has bracketSlots / 4, etc.
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
        player1_id: undefined,
        player2_id: undefined,
        player1_score: 0,
        player2_score: 0,
        winner_id: undefined,
        status: 'scheduled',
        is_bye: false,
        updated_at: new Date().toISOString(),
      };

      // Link to next round match if not Final
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

  // Flatten matches in round order
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

    // Check if player 2 gets a BYE
    if (m < numByes) {
      // Player 1 gets a BYE! Match finishes automatically
      match.is_bye = true;
      match.status = 'finished';
      match.winner_id = p1?.id;
      match.winner = p1;

      // Advance winner to Round 2 immediately
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
 * Winner Advancement Engine: Process match completion and advance winner to next match
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

  targetMatch.player1_score = player1Score;
  targetMatch.player2_score = player2Score;
  targetMatch.winner_id = winnerId;
  targetMatch.winner = winnerPlayer;
  targetMatch.status = 'finished';
  targetMatch.updated_at = new Date().toISOString();

  // If there's a next match, advance winner
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

      // If both players are now ready, update status if scheduled
      if (nextMatch.player1_id && nextMatch.player2_id && nextMatch.status === 'scheduled') {
        nextMatch.status = 'scheduled';
      }
    }
  }

  return updatedMatches;
}
