-- Seed Data for Triple Stars Gaming Hall Platform

-- Clear existing sample data
TRUNCATE public.games, public.tournaments, public.profiles CASCADE;

-- GAMES
INSERT INTO public.games (id, code, name, category, logo_url, banner_url) VALUES
('11111111-1111-1111-1111-111111111111', 'ea-fc-25', 'EA FC 25', 'Sports / Football', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80'),
('22222222-2222-2222-2222-222222222222', 'tekken-8', 'Tekken 8', 'Fighting', 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=300&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80'),
('33333333-3333-3333-3333-333333333333', 'sf6', 'Street Fighter 6', 'Fighting', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80'),
('44444444-4444-4444-4444-444444444444', 'valorant', 'Valorant', 'Tactical Shooter', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80'),
('55555555-5555-5555-5555-555555555555', 'cod-warzone', 'Call of Duty: Warzone', 'Battle Royale', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80');

-- TOURNAMENTS (Prices in MAD / DH)
INSERT INTO public.tournaments 
(id, slug, name, description, game_id, banner_url, entry_fee_mad, prize_pool_mad, max_players, format, status, location, rules, stream_url, stream_embed_url, stream_title, start_at) 
VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'triple-stars-ea-fc-25-champions-cup',
  'Triple Stars EA FC 25 Champions Cup',
  'The flagship EA FC 25 tournament at Triple Stars Gaming Hall! 16 players compete for 2,000 DH cash prize.',
  '11111111-1111-1111-1111-111111111111',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  50.00,
  2000.00,
  16,
  'single_elimination',
  'LIVE',
  'Triple Stars Gaming Hall - Arena 1',
  'Best of 3 matches. Default squad rating 85 overall. No custom tactics glitches.',
  'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1',
  'EA FC 25 Semi-Finals Live from Triple Stars',
  NOW() - INTERVAL '1 hour'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'tekken-8-iron-fist-showdown',
  'Tekken 8 Iron Fist Showdown',
  'Fast-paced Tekken 8 bracket action. Bring your stick or controller and dominate the arena.',
  '22222222-2222-2222-2222-222222222222',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
  30.00,
  1200.00,
  16,
  'single_elimination',
  'REGISTRATION_OPEN',
  'Triple Stars Gaming Hall - Station B',
  'FT3 rounds, FT2 games. Double elimination format.',
  NULL, NULL, NULL,
  NOW() + INTERVAL '2 days'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'street-fighter-6-night-brawl',
  'Street Fighter 6 Night Brawl',
  'Late night fighting game intensity. Show off your combos and claim the championship title.',
  '33333333-3333-3333-3333-333333333333',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  20.00,
  800.00,
  8,
  'single_elimination',
  'CHECK_IN',
  'Triple Stars Gaming Hall - Station C',
  'First to 3 rounds. Blind pick available upon request.',
  NULL, NULL, NULL,
  NOW() + INTERVAL '4 hours'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'valorant-5v5-triple-stars-invitational',
  'Valorant 5v5 Triple Stars Invitational',
  'Premier team tournament with big rewards for the top tactical squad.',
  '44444444-4444-4444-4444-444444444444',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  100.00,
  5000.00,
  32,
  'single_elimination',
  'REGISTRATION_OPEN',
  'Triple Stars Main Stage',
  'Standard competitive ruleset. Map veto before match.',
  NULL, NULL, NULL,
  NOW() + INTERVAL '7 days'
);
