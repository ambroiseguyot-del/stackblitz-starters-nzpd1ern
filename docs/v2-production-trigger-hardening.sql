-- Baby Budget 2.0 security hardening. No existing user records are changed.
-- The regular app user's owner is always supplied by auth.uid().
-- Only the verified service_role JWT may preserve an explicit owner during scheduled inserts.
CREATE OR REPLACE FUNCTION public.fill_expense_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();
  ELSIF COALESCE(auth.jwt()->>'role', current_setting('request.jwt.claim.role', true)) = 'service_role'
    AND NEW.user_id IS NOT NULL THEN
    -- Existing authorized Cron/Edge Function inserts on behalf of a family.
    NULL;
  ELSE
    RAISE EXCEPTION 'authenticated owner required for expense creation'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

-- These functions are for internal BEFORE INSERT triggers only, not direct Data API RPC calls.
REVOKE EXECUTE ON FUNCTION public.fill_expense_user_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fill_profile_user_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fill_settings_user_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fill_category_user_id() FROM PUBLIC, anon, authenticated;