-- 1. Create Auth trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    email,
    phone,
    wins,
    losses,
    championships,
    total_prize_money,
    points,
    is_disabled,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    0,
    0,
    0,
    0.00,
    0,
    FALSE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  -- If this is the first user in the entire system, grant super_admin role!
  IF (SELECT count(*) FROM public.user_roles) = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Update RLS policies for clean production usage

-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true);

-- User roles
DROP POLICY IF EXISTS "User roles viewable by everyone" ON public.user_roles;
DROP POLICY IF EXISTS "Allow role management" ON public.user_roles;
CREATE POLICY "User roles viewable by everyone" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Allow role management" ON public.user_roles FOR ALL USING (true);

-- Games
DROP POLICY IF EXISTS "Games viewable by everyone" ON public.games;
DROP POLICY IF EXISTS "Manage games" ON public.games;
CREATE POLICY "Games viewable by everyone" ON public.games FOR SELECT USING (true);
CREATE POLICY "Manage games" ON public.games FOR ALL USING (true);

-- Tournaments
DROP POLICY IF EXISTS "Tournaments viewable by everyone" ON public.tournaments;
DROP POLICY IF EXISTS "Admins full control on tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Manage tournaments" ON public.tournaments;
CREATE POLICY "Tournaments viewable by everyone" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Manage tournaments" ON public.tournaments FOR ALL USING (true);

-- Tournament registrations
DROP POLICY IF EXISTS "Registrations viewable by everyone" ON public.tournament_registrations;
DROP POLICY IF EXISTS "Users can register themselves" ON public.tournament_registrations;
DROP POLICY IF EXISTS "Admins full control on registrations" ON public.tournament_registrations;
DROP POLICY IF EXISTS "Manage registrations" ON public.tournament_registrations;
CREATE POLICY "Registrations viewable by everyone" ON public.tournament_registrations FOR SELECT USING (true);
CREATE POLICY "Manage registrations" ON public.tournament_registrations FOR ALL USING (true);

-- Rounds & Matches
DROP POLICY IF EXISTS "Matches viewable by everyone" ON public.tournament_matches;
DROP POLICY IF EXISTS "Rounds viewable by everyone" ON public.tournament_rounds;
DROP POLICY IF EXISTS "Admins full control on matches" ON public.tournament_matches;
DROP POLICY IF EXISTS "Manage matches" ON public.tournament_matches;
DROP POLICY IF EXISTS "Manage rounds" ON public.tournament_rounds;
CREATE POLICY "Matches viewable by everyone" ON public.tournament_matches FOR SELECT USING (true);
CREATE POLICY "Manage matches" ON public.tournament_matches FOR ALL USING (true);
CREATE POLICY "Rounds viewable by everyone" ON public.tournament_rounds FOR SELECT USING (true);
CREATE POLICY "Manage rounds" ON public.tournament_rounds FOR ALL USING (true);

-- Audit logs & Streams & Payments & Notifications
DROP POLICY IF EXISTS "Audit logs viewable" ON public.audit_logs;
CREATE POLICY "Audit logs viewable" ON public.audit_logs FOR ALL USING (true);
DROP POLICY IF EXISTS "Streams viewable" ON public.streams;
CREATE POLICY "Streams viewable" ON public.streams FOR ALL USING (true);
DROP POLICY IF EXISTS "Payments viewable" ON public.payments;
CREATE POLICY "Payments viewable" ON public.payments FOR ALL USING (true);
DROP POLICY IF EXISTS "Notifications viewable" ON public.notifications;
CREATE POLICY "Notifications viewable" ON public.notifications FOR ALL USING (true);
