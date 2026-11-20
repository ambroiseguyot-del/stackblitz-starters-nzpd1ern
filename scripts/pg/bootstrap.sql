CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN BYPASSRLS;
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
 SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
 SELECT jsonb_build_object('role',current_setting('request.jwt.claim.role',true))
$$;
CREATE TABLE auth.users(id uuid PRIMARY KEY);
GRANT USAGE ON SCHEMA auth TO anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION auth.uid(),auth.jwt() TO PUBLIC;
CREATE TABLE public.expenses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid CONSTRAINT expenses_user_id_fkey REFERENCES auth.users(id),
 child_name text NOT NULL, category text, label text, amount numeric(10,2) NOT NULL CHECK(amount>0),
 date date DEFAULT current_date, is_recurring boolean DEFAULT false, recurring_day int,
 CONSTRAINT expenses_recurring_day_check CHECK (recurring_day BETWEEN 1 AND 28));
CREATE TABLE public.profiles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz DEFAULT now(), name text NOT NULL,
 user_id uuid CONSTRAINT profiles_user_id_fkey REFERENCES auth.users(id));
CREATE TABLE public.settings (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), key text NOT NULL, value text NOT NULL,
 user_id uuid CONSTRAINT settings_user_id_fkey REFERENCES auth.users(id));
CREATE UNIQUE INDEX settings_key_user_unique ON public.settings(key,user_id);
CREATE TABLE public.categories (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid CONSTRAINT categories_user_id_fkey REFERENCES auth.users(id),
 name text NOT NULL, icon text NOT NULL DEFAULT '📦',
 use_defaults boolean NOT NULL DEFAULT true, created_at timestamptz DEFAULT now());
CREATE UNIQUE INDEX categories_name_user_unique ON public.categories(name,user_id);
CREATE FUNCTION public.fill_expense_user_id() RETURNS trigger
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
BEGIN
 IF auth.uid() IS NOT NULL THEN
  NEW.user_id := auth.uid();
 ELSIF COALESCE(auth.jwt()->>'role', current_setting('request.jwt.claim.role',true))='service_role'
  AND NEW.user_id IS NOT NULL THEN
  NULL;
 ELSE
  RAISE EXCEPTION 'authenticated owner required' USING ERRCODE='42501';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER expenses_fill_user_id BEFORE INSERT ON public.expenses
 FOR EACH ROW EXECUTE FUNCTION public.fill_expense_user_id();
DO $$
DECLARE t text; op text; clause text;
BEGIN
 FOREACH t IN ARRAY ARRAY['expenses','profiles','settings','categories'] LOOP
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('GRANT ALL ON public.%I TO anon,authenticated,service_role',t);
  FOREACH op IN ARRAY ARRAY['select','insert','update','delete'] LOOP
   IF op='insert' THEN clause:=' WITH CHECK (auth.uid()=user_id)';
   ELSIF op='update' THEN clause:=' USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id)';
   ELSE clause:=' USING (auth.uid()=user_id)';
   END IF;
   EXECUTE format('CREATE POLICY user_%s_%s ON public.%I FOR %s TO PUBLIC%s',t,op,t,op,clause);
  END LOOP;
 END LOOP;
END $$;
INSERT INTO auth.users(id) VALUES
 ('11111111-1111-4111-8111-111111111111'),
 ('22222222-2222-4222-8222-222222222222');
SELECT set_config('request.jwt.claim.role','service_role',false);
INSERT INTO public.expenses(user_id,child_name,category,label,amount,date,is_recurring,recurring_day) VALUES
 ('11111111-1111-4111-8111-111111111111','Enfant A','Garde','Crèche',120,'2026-10-28',true,28),
 ('22222222-2222-4222-8222-222222222222','Enfant B','Garde','Crèche',250,'2026-10-28',true,28),
 ('11111111-1111-4111-8111-111111111111','Enfant A','Loisirs','Livre',15,'2026-09-18',false,null);
INSERT INTO public.profiles(name,user_id) VALUES
 ('Enfant A','11111111-1111-4111-8111-111111111111'),
 ('Enfant B','22222222-2222-4222-8222-222222222222');
INSERT INTO public.settings(key,value,user_id) VALUES
 ('monthly_budget','600','11111111-1111-4111-8111-111111111111'),
 ('monthly_budget','700','22222222-2222-4222-8222-222222222222');
INSERT INTO public.categories(name,user_id) VALUES
 ('Garde','11111111-1111-4111-8111-111111111111'),
 ('Garde','22222222-2222-4222-8222-222222222222');
SELECT set_config('request.jwt.claim.role','',false);
