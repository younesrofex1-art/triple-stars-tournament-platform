import { describe, it, expect } from 'vitest';
import {
  generateSingleEliminationBracket,
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

    // Round 1 matches
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

    expect(rounds).toHaveLength(4); // Round of 16, Quarter Finals, Semi Finals, Final
    expect(matches).toHaveLength(15);

    const round1Matches = matches.filter((m) => m.round_number === 1);
    expect(round1Matches).toHaveLength(8);

    const byeMatches = round1Matches.filter((m) => m.is_bye);
    expect(byeMatches).toHaveLength(4);

    // BYE matches should automatically be marked finished and advanced to round 2
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

    // Finish match 1 with score 2 - 1
    const updated = advanceMatchWinner(matches, firstMatch.id, 2, 1);
    const updatedFirst = updated.find((m) => m.id === firstMatch.id)!;

    expect(updatedFirst.status).toBe('finished');
    expect(updatedFirst.player1_score).toBe(2);
    expect(updatedFirst.player2_score).toBe(1);
    expect(updatedFirst.winner_id).toBe(firstMatch.player1_id);

    // Verify winner advanced to Final (Round 2) match slot
    const finalMatch = updated.find((m) => m.id === firstMatch.next_match_id)!;
    if (firstMatch.next_match_slot === 1) {
      expect(finalMatch.player1_id).toBe(firstMatch.player1_id);
    } else {
      expect(finalMatch.player2_id).toBe(firstMatch.player1_id);
    }
  });

  it('rejects invalid match completion requests (tied score or negative score)', () => {
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
