import { describe, it, expect } from 'vitest';
import { store } from '../services/store';

describe('Store and Snapshot Consistency', () => {
  it('returns identical snapshot references if store is not mutated', () => {
    const snap1 = store.getSnapshot();
    const snap2 = store.getSnapshot();
    expect(snap1).toBe(snap2); // Referential equality is essential for useSyncExternalStore
  });

  it('contains valid snapshot properties', () => {
    const snap = store.getSnapshot();
    expect(Array.isArray(snap.games)).toBe(true);
    expect(Array.isArray(snap.profiles)).toBe(true);
    expect(Array.isArray(snap.tournaments)).toBe(true);
    expect(Array.isArray(snap.matches)).toBe(true);
  });
});
