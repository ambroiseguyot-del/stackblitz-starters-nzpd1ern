-- BabyBudget audited hardening — PROPOSITION NON EXECUTEE.
-- This migration mutates existing data to backfill recurrence_id; verify PostgreSQL backup and
-- test A/B accounts / rollback on a disposable copy before approving production.
BEGIN;
SET LOCAL lock_timeout = '5s';

-- Baseline-compatible checks, before any writing:
DO $preflight$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='expenses' AND column_name='recurrence_id'
  ) THEN
    RAISE EXCEPTION 'Audit migration already applied: do not run a second historical backfill';
  END IF;
  IF EXISTS (
    WITH active_keys AS (
      SELECT DISTINCT user_id, lower(btrim(child_name)) AS child_key,
        lower(btrim(coalesce(category,''))) AS category_key,
        lower(btrim(coalesce(label,''))) AS label_key
      FROM public.expenses
      WHERE is_recurring IS TRUE AND user_id IS NOT NULL
    )
    SELECT 1
    FROM public.expenses e
    JOIN active_keys k ON e.user_id=k.user_id
      AND lower(btrim(e.child_name))=k.child_key
      AND lower(btrim(coalesce(e.category,'')))=k.category_key
      AND lower(btrim(coalesce(e.label,'')))=k.label_key
    WHERE e.date IS NOT NULL
    GROUP BY e.user_id,k.child_key,k.category_key,k.label_key,date_trunc('month',e.date::timestamp)
    HAVING count(*)>1
  ) THEN
    RAISE EXCEPTION 'Existing same-name occurrences share a month: reconcile before recurrence_id backfill';
  END IF;
  IF EXISTS (SELECT 1 FROM public.expenses WHERE is_recurring IS TRUE AND
             (user_id IS NULL OR date IS NULL OR recurring_day IS NULL)) THEN
    RAISE EXCEPTION 'Incomplete active recurrence rows require review before migration';
  END IF;
END $preflight$;

ALTER TABLE public.expenses ADD COLUMN recurrence_id uuid;
-- Backfill all historical entries of an existing recurring label group, preserving the
-- original app's grouping semantics. The preflight fails on same-month conflicts.
-- This is a one-time compatibility mapping; future rules use stable client-generated IDs.
WITH active_keys AS MATERIALIZED (
  SELECT DISTINCT user_id, lower(btrim(child_name)) AS child_key,
    lower(btrim(coalesce(category,''))) AS category_key,
    lower(btrim(coalesce(label,''))) AS label_key
  FROM public.expenses
  WHERE is_recurring IS TRUE AND user_id IS NOT NULL
),
numbered AS MATERIALIZED (
  SELECT user_id, child_key, category_key, label_key, gen_random_uuid() AS recurrence_id
  FROM active_keys
)
UPDATE public.expenses e
SET recurrence_id = n.recurrence_id
FROM numbered n
WHERE e.user_id=n.user_id
  AND lower(btrim(e.child_name))=n.child_key
  AND lower(btrim(coalesce(e.category,'')))=n.category_key
  AND lower(btrim(coalesce(e.label,'')))=n.label_key
  AND e.recurrence_id IS NULL;

ALTER TABLE public.expenses DROP CONSTRAINT expenses_recurring_day_check;
ALTER TABLE public.expenses ADD CONSTRAINT expenses_recurring_day_check
  CHECK (recurring_day BETWEEN 1 AND 31);

-- For older browser clients, inherit a same-name active rule; new clients supply a UUID.
-- The existing expenses_fill_user_id trigger runs first (alphabetical BEFORE INSERT triggers).
CREATE OR REPLACE FUNCTION public.fill_expense_recurrence_id()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $fn$
BEGIN
  IF NEW.is_recurring IS TRUE AND NEW.recurrence_id IS NULL THEN
    SELECT e.recurrence_id INTO NEW.recurrence_id
    FROM public.expenses e
    WHERE e.user_id=NEW.user_id
      AND e.is_recurring IS TRUE
      AND e.recurrence_id IS NOT NULL
      AND lower(btrim(e.child_name))=lower(btrim(NEW.child_name))
      AND lower(btrim(coalesce(e.category,'')))=lower(btrim(coalesce(NEW.category,'')))
      AND lower(btrim(coalesce(e.label,'')))=lower(btrim(coalesce(NEW.label,'')))
    ORDER BY e.date DESC NULLS LAST, e.id DESC
    LIMIT 1;
    NEW.recurrence_id := coalesce(NEW.recurrence_id, gen_random_uuid());
  END IF;
  RETURN NEW;
END;
$fn$;
DROP TRIGGER IF EXISTS expenses_set_recurrence_id ON public.expenses;
CREATE TRIGGER expenses_set_recurrence_id BEFORE INSERT ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.fill_expense_recurrence_id();
REVOKE EXECUTE ON FUNCTION public.fill_expense_recurrence_id() FROM PUBLIC, anon, authenticated;

-- User deletion must be atomic: auth.users removal cascades to owned records.
ALTER TABLE public.expenses DROP CONSTRAINT expenses_user_id_fkey;
ALTER TABLE public.expenses ADD CONSTRAINT expenses_user_id_fkey
 FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles DROP CONSTRAINT profiles_user_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_fkey
 FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.settings DROP CONSTRAINT settings_user_id_fkey;
ALTER TABLE public.settings ADD CONSTRAINT settings_user_id_fkey
 FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.categories DROP CONSTRAINT categories_user_id_fkey;
ALTER TABLE public.categories ADD CONSTRAINT categories_user_id_fkey
 FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- The RLS mechanism does not apply to TRUNCATE. The current production ACL grants
-- this destructive privilege to anon/authenticated; revoke it without affecting service_role.
REVOKE TRUNCATE, TRIGGER, REFERENCES ON TABLE
 public.expenses, public.profiles, public.settings, public.categories
 FROM PUBLIC, anon, authenticated;

-- Ensure plain one-off expenses cannot accidentally be assigned a recurrence rule.
-- New application inserts provide a UUID only for recurring expense records.
-- Preserve recurrence_id when a rule is stopped, so the latest historical row remains
-- a cancellation marker for the scheduled worker.

-- The index covers stopped entries too: a rule has at most one occurrence per month.
CREATE UNIQUE INDEX IF NOT EXISTS expenses_recurrence_month_unique
  ON public.expenses (user_id, recurrence_id, date_trunc('month',date::timestamp))
  WHERE recurrence_id IS NOT NULL AND date IS NOT NULL;
CREATE INDEX IF NOT EXISTS expenses_user_date_idx ON public.expenses(user_id,date,id);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS settings_user_id_idx ON public.settings(user_id);
CREATE INDEX IF NOT EXISTS expenses_user_recurrence_idx ON public.expenses(user_id,recurrence_id,date DESC);

ALTER TABLE public.expenses ADD CONSTRAINT expenses_active_recurrence_complete
  CHECK (is_recurring IS DISTINCT FROM TRUE OR
    (user_id IS NOT NULL AND date IS NOT NULL AND recurring_day IS NOT NULL AND recurrence_id IS NOT NULL));
ALTER POLICY user_expenses_select ON public.expenses TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY user_expenses_insert ON public.expenses TO authenticated WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY user_expenses_update ON public.expenses TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY user_expenses_delete ON public.expenses TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY user_profiles_select ON public.profiles TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY user_profiles_insert ON public.profiles TO authenticated WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY user_profiles_update ON public.profiles TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY user_profiles_delete ON public.profiles TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY user_settings_select ON public.settings TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY user_settings_insert ON public.settings TO authenticated WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY user_settings_update ON public.settings TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY user_settings_delete ON public.settings TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY user_categories_select ON public.categories TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY user_categories_insert ON public.categories TO authenticated WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY user_categories_update ON public.categories TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY user_categories_delete ON public.categories TO authenticated USING ((select auth.uid()) = user_id);
COMMIT;
