import { useSyncExternalStore } from 'react';
import { store, StoreSnapshot } from '../services/store';

export function useRealtimeStore(): StoreSnapshot {
  return useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot(),
    () => store.getSnapshot()
  );
}

export function useTournamentData(tournamentIdOrSlug: string) {
  const state = useRealtimeStore();

  const tournament = state.tournaments.find(
    (t) => t.id === tournamentIdOrSlug || t.slug === tournamentIdOrSlug
  );
  const matches = tournament
    ? state.matches.filter((m) => m.tournament_id === tournament.id)
    : [];
  const rounds = tournament
    ? state.rounds.filter((r) => r.tournament_id === tournament.id)
    : [];
  const registrations = tournament
    ? state.registrations.filter((r) => r.tournament_id === tournament.id)
    : [];

  return { tournament, matches, rounds, registrations };
}

