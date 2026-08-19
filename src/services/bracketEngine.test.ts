import { describe, it, expect } from 'vitest';
import {
  generateSingleEliminationBracket,
  generateDoubleEliminationBracket,
  generateSwissTournament,
  generateNextSwissRoundPairings,
  calculateSwissStandings,
  generateRoundRobinTournament,
  advanceMatchWinner,
  getNextPowerOfTwo,
} from './bracketEngine';
import { Profile } from '../types';

const createMockPlayer = (id: string, username: string): Profile => ({
  id,
  username,
  display_name: username,
  email: `${username}@triplestars.ma`,
  wins: 0,
  losses: 0,
  championships: 0,
  total_prize_money: 0,
  points: 0,
  is_disabled: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

describe('Bracket Engine Logic', () => {
  it('correctly calculates next power of two', () => {
    expect(getNextPowerOfTwo(2)).toBe(2);
    expect(getNextPowerOfTwo(3)).toBe(4);
    expect(getNextPowerOfTwo(7)).toBe(8);
    expect(getNextPowerOfTwo(12)).toBe(16);
    expect(getNextPowerOfTwo(16)).toBe(16);
    expect(getNextPowerOfTwo(31)).toBe(32);
  });

  describe('Single Elimination Format', () => {
    it('generates an 8-player single elimination bracket with 3 rounds and 7 matches', () => {
      const players = Array.from({ length: 8 }, (_, i) =>
        createMockPlayer(`p-${i + 1}`, `Player_${i + 1}`)
      );

      const { rounds, matches } = generateSingleEliminationBracket('tourney-8', players);

      expect(rounds).toHaveLength(3);
      expect(rounds[0].name).toBe('Quarter Finals');
      expect(rounds[1].name).toBe('Semi Finals');
      expect(rounds[2].name).toBe('Final');

      expect(matches).toHaveLength(7);

      const round1 = matches.filter((m) => m.round_number === 1);
      expect(round1).toHaveLength(4);
      round1.forEach((m) => {
        expect(m.player1_id).toBeDefined();
        expect(m.player2_id).toBeDefined();
        expect(m.is_bye).toBe(false);
      });
    });

    it('handles non-power of two player counts (12 players) with 4 BYEs', () => {
      const players = Array.from({ length: 12 }, (_, i) =>
        createMockPlayer(`p-${i + 1}`, `Player_${i + 1}`)
      );

      const { rounds, matches } = generateSingleEliminationBracket('tourney-12', players);

      expect(rounds).toHaveLength(4);
      expect(matches).toHaveLength(15);

      const round1Matches = matches.filter((m) => m.round_number === 1);
      expect(round1Matches).toHaveLength(8);

      const byeMatches = round1Matches.filter((m) => m.is_bye);
      expect(byeMatches).toHaveLength(4);

      byeMatches.forEach((m) => {
        expect(m.status).toBe('finished');
        expect(m.winner_id).toBe(m.player1_id);

        const round2Match = matches.find((rm) => rm.id === m.next_match_id);
        expect(round2Match).toBeDefined();
        if (m.next_match_slot === 1) {
          expect(round2Match?.player1_id).toBe(m.player1_id);
        } else {
          expect(round2Match?.player2_id).toBe(m.player1_id);
        }
      });
    });

    it('advances winner correctly when match is completed', () => {
      const players = Array.from({ length: 4 }, (_, i) =>
        createMockPlayer(`p-${i + 1}`, `Player_${i + 1}`)
      );

      const { matches } = generateSingleEliminationBracket('tourney-4', players);
      const round1Matches = matches.filter((m) => m.round_number === 1);
      const firstMatch = round1Matches[0];

      const updated = advanceMatchWinner(matches, firstMatch.id, 2, 1);
      const updatedFirst = updated.find((m) => m.id === firstMatch.id)!;

      expect(updatedFirst.status).toBe('finished');
      expect(updatedFirst.player1_score).toBe(2);
      expect(updatedFirst.player2_score).toBe(1);
      expect(updatedFirst.winner_id).toBe(firstMatch.player1_id);

      const finalMatch = updated.find((m) => m.id === firstMatch.next_match_id)!;
      if (firstMatch.next_match_slot === 1) {
        expect(finalMatch.player1_id).toBe(firstMatch.player1_id);
      } else {
        expect(finalMatch.player2_id).toBe(firstMatch.player1_id);
      }
    });

    it('rejects invalid match completion requests', () => {
      const players = Array.from({ length: 4 }, (_, i) =>
        createMockPlayer(`p-${i + 1}`, `Player_${i + 1}`)
      );
      const { matches } = generateSingleEliminationBracket('tourney-4', players);
      const firstMatch = matches[0];

      expect(() => advanceMatchWinner(matches, firstMatch.id, -1, 2)).toThrow(
        'Match scores cannot be negative.'
      );

      expect(() => advanceMatchWinner(matches, firstMatch.id, 2, 2)).toThrow(
        'A winner must be decided (scores cannot be tied).'
      );
    });
  });

  describe('Double Elimination Format', () => {
    it('generates a complete Double Elimination bracket with Winners, Losers, and Grand Finals for 8 players', () => {
      const players = Array.from({ length: 8 }, (_, i) =>
        createMockPlayer(`p-${i + 1}`, `Player_${i + 1}`)
      );

      const { rounds, matches } = generateDoubleEliminationBracket('de-8', players);

      // 3 WB rounds + 4 LB rounds + 1 GF round = 8 rounds
      expect(rounds.length).toBe(8);

      const wbMatches = matches.filter((m) => m.stage === 'winners');
      const lbMatches = matches.filter((m) => m.stage === 'losers');
      const gfMatches = matches.filter((m) => m.stage === 'grand_finals' || m.stage === 'reset');

      expect(wbMatches.length).toBe(7); // 4 + 2 + 1
      expect(lbMatches.length).toBe(6); // 2 + 2 + 1 + 1
      expect(gfMatches.length).toBe(2); // GF1 + GF Reset

      // Check loser routing on WB Round 1 matches
      const wbR1 = wbMatches.filter((m) => m.round_number === 1);
      wbR1.forEach((m) => {
        expect(m.loser_match_id).toBeDefined();
        expect(m.loser_match_slot).toBeDefined();
      });
    });

    it('routes loser to Losers Bracket and winner to Winners Bracket when match is finished', () => {
      const players = Array.from({ length: 4 }, (_, i) =>
        createMockPlayer(`p-${i + 1}`, `Player_${i + 1}`)
      );

      const { matches } = generateDoubleEliminationBracket('de-4', players);
      const wbR1Match = matches.find((m) => m.stage === 'winners' && m.round_number === 1)!;

      const updated = advanceMatchWinner(matches, wbR1Match.id, 2, 0);

      const winnerMatch = updated.find((m) => m.id === wbR1Match.next_match_id)!;
      const loserMatch = updated.find((m) => m.id === wbR1Match.loser_match_id)!;

      // Winner should be in WB Finals
      if (wbR1Match.next_match_slot === 1) {
        expect(winnerMatch.player1_id).toBe(wbR1Match.player1_id);
      } else {
        expect(winnerMatch.player2_id).toBe(wbR1Match.player1_id);
      }

      // Loser should be in LB Round 1
      if (wbR1Match.loser_match_slot === 1) {
        expect(loserMatch.player1_id).toBe(wbR1Match.player2_id);
      } else {
        expect(loserMatch.player2_id).toBe(wbR1Match.player2_id);
      }
    });

    it('activates Grand Finals Reset match if Losers Bracket Champion beats Winners Bracket Champion', () => {
      const players = [createMockPlayer('p-1', 'WB_Champ'), createMockPlayer('p-2', 'LB_Champ')];
      const gf1Match = {
        id: 'gf-1',
        tournament_id: 'de-test',
        round_id: 'r-gf',
        round_number: 3,
        match_number: 1,
        stage: 'grand_finals' as const,
        player1_id: 'p-1',
        player1: players[0],
        player2_id: 'p-2',
        player2: players[1],
        player1_score: 0,
        player2_score: 0,
        status: 'scheduled' as const,
        is_bye: false,
        updated_at: new Date().toISOString(),
      };
      const gfResetMatch = {
        id: 'gf-reset',
        tournament_id: 'de-test',
        round_id: 'r-gf',
        round_number: 3,
        match_number: 2,
        stage: 'reset' as const,
        player1_score: 0,
        player2_score: 0,
        status: 'scheduled' as const,
        is_bye: false,
        updated_at: new Date().toISOString(),
      };

      // Player 2 (LB Champ) wins GF1 2 - 1 against Player 1
      const updated = advanceMatchWinner([gf1Match, gfResetMatch], 'gf-1', 1, 2);

      const resetResult = updated.find((m) => m.id === 'gf-reset')!;
      expect(resetResult.status).toBe('scheduled');
      expect(resetResult.player1_id).toBe('p-1');
      expect(resetResult.player2_id).toBe('p-2');
    });
  });

  describe('Swiss Format Engine', () => {
    it('generates Swiss tournament with initial round 1 pairings and rounds structure', () => {
      const players = Array.from({ length: 8 }, (_, i) =>
        createMockPlayer(`p-${i + 1}`, `Player_${i + 1}`)
      );

      const { rounds, matches } = generateSwissTournament('swiss-8', players);

      expect(rounds.length).toBe(3); // log2(8) = 3
      expect(matches.length).toBe(4); // 4 pairings in round 1
      matches.forEach((m) => {
        expect(m.stage).toBe('swiss');
        expect(m.player1_id).toBeDefined();
        expect(m.player2_id).toBeDefined();
      });
    });

    it('correctly calculates Swiss standings including match points, differential, and Buchholz tiebreakers', () => {
      const p1 = createMockPlayer('p-1', 'Alice');
      const p2 = createMockPlayer('p-2', 'Bob');
      const p3 = createMockPlayer('p-3', 'Charlie');
      const p4 = createMockPlayer('p-4', 'David');

      const matches = [
        {
          id: 'm1',
          tournament_id: 'sw-1',
          round_id: 'r1',
          round_number: 1,
          match_number: 1,
          player1_id: 'p-1',
          player1: p1,
          player2_id: 'p-2',
          player2: p2,
          player1_score: 2,
          player2_score: 0,
          winner_id: 'p-1',
          status: 'finished' as const,
          is_bye: false,
          updated_at: '',
        },
        {
          id: 'm2',
          tournament_id: 'sw-1',
          round_id: 'r1',
          round_number: 1,
          match_number: 2,
          player1_id: 'p-3',
          player1: p3,
          player2_id: 'p-4',
          player2: p4,
          player1_score: 2,
          player2_score: 1,
          winner_id: 'p-3',
          status: 'finished' as const,
          is_bye: false,
          updated_at: '',
        },
      ];

      const standings = calculateSwissStandings([p1, p2, p3, p4], matches);

      expect(standings[0].player_id).toBe('p-1'); // 3 pts, diff +2
      expect(standings[0].match_points).toBe(3);
      expect(standings[0].game_differential).toBe(2);

      expect(standings[1].player_id).toBe('p-3'); // 3 pts, diff +1
      expect(standings[1].match_points).toBe(3);
      expect(standings[1].game_differential).toBe(1);

      expect(standings[2].player_id).toBe('p-4'); // 0 pts, diff -1
      expect(standings[3].player_id).toBe('p-2'); // 0 pts, diff -2
    });

    it('generates Next Swiss Round pairings matching top records and avoiding prior rematches', () => {
      const players = Array.from({ length: 4 }, (_, i) =>
        createMockPlayer(`p-${i + 1}`, `Player_${i + 1}`)
      );

      const existingMatches = [
        {
          id: 'm1',
          tournament_id: 'sw-1',
          round_id: 'r1',
          round_number: 1,
          match_number: 1,
          player1_id: 'p-1',
          player1: players[0],
          player2_id: 'p-2',
          player2: players[1],
          player1_score: 2,
          player2_score: 0,
          winner_id: 'p-1',
          status: 'finished' as const,
          is_bye: false,
          updated_at: '',
        },
        {
          id: 'm2',
          tournament_id: 'sw-1',
          round_id: 'r1',
          round_number: 1,
          match_number: 2,
          player1_id: 'p-3',
          player1: players[2],
          player2_id: 'p-4',
          player2: players[3],
          player1_score: 2,
          player2_score: 1,
          winner_id: 'p-3',
          status: 'finished' as const,
          is_bye: false,
          updated_at: '',
        },
      ];

      const r2Matches = generateNextSwissRoundPairings('sw-1', 2, players, existingMatches);

      expect(r2Matches).toHaveLength(2);
      // Winner p-1 should play Winner p-3 in Round 2
      const winnersMatch = r2Matches.find(
        (m) =>
          (m.player1_id === 'p-1' && m.player2_id === 'p-3') ||
          (m.player1_id === 'p-3' && m.player2_id === 'p-1')
      );
      expect(winnersMatch).toBeDefined();

      // Loser p-2 should play Loser p-4 in Round 2
      const losersMatch = r2Matches.find(
        (m) =>
          (m.player1_id === 'p-2' && m.player2_id === 'p-4') ||
          (m.player1_id === 'p-4' && m.player2_id === 'p-2')
      );
      expect(losersMatch).toBeDefined();
    });
  });

  describe('Round Robin Format Engine', () => {
    it('generates all-play-all schedule for 4 players across 3 rounds', () => {
      const players = Array.from({ length: 4 }, (_, i) =>
        createMockPlayer(`p-${i + 1}`, `Player_${i + 1}`)
      );

      const { rounds, matches } = generateRoundRobinTournament('rr-4', players);

      expect(rounds).toHaveLength(3);
      expect(matches).toHaveLength(6); // 4 * 3 / 2 = 6 matches total

      // Check each player plays exactly 3 matches
      players.forEach((p) => {
        const playerMatches = matches.filter(
          (m) => m.player1_id === p.id || m.player2_id === p.id
        );
        expect(playerMatches.length).toBe(3);
      });
    });
  });
});
