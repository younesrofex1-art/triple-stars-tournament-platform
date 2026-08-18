import { describe, it, expect } from 'vitest';
import { store } from '../services/store';

describe('Store and Snapshot Consistency', () => {
  it('returns identical snapshot references if store is not mutated', () => {
    const snap1 = store.getSnapshot();
    const snap2 = store.getSnapshot();
    expect(snap1).toBe(snap2); // Referential equality is essential for useSyncExternalStore
  });

  it('produces new snapshot reference when store is updated', () => {
    const snap1 = store.getSnapshot();
    store.updateRegistrationStatus('reg-0', 'paid', 'checked_in');
    const snap2 = store.getSnapshot();
    expect(snap1).not.toBe(snap2);
  });
});
