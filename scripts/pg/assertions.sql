DO $$
BEGIN
 IF (SELECT count(*) FROM pg_policies WHERE schemaname='public'
  AND roles='{authenticated}')<>16 THEN
  RAISE EXCEPTION 'Expected 16 authenticated policies'; END IF;
 IF EXISTS(
 SELECT 1 FROM pg_class WHERE relnamespace='public'::regnamespace
 AND relname IN ('expenses','profiles','settings','categories')
 AND (has_table_privilege('anon',oid,'TRUNCATE')
 OR has_table_privilege('authenticated',oid,'TRUNCATE')
 OR has_table_privilege('anon',oid,'TRIGGER')
 OR has_table_privilege('authenticated',oid,'TRIGGER'))) THEN
  RAISE EXCEPTION 'Unsafe client ACLs'; END IF;
 IF (SELECT count(*) FROM public.expenses WHERE is_recurring=true
 AND recurrence_id IS NOT NULL)<>2 THEN RAISE EXCEPTION 'Wrong backfill'; END IF;
 IF EXISTS(SELECT 1 FROM public.expenses WHERE is_recurring=false
 AND recurrence_id IS NOT NULL) THEN RAISE EXCEPTION 'One-off row backfilled'; END IF;
 IF (SELECT count(*) FROM pg_constraint
  WHERE conname IN ('expenses_user_id_fkey','profiles_user_id_fkey',
  'settings_user_id_fkey','categories_user_id_fkey') AND confdeltype='c')<>4
 THEN RAISE EXCEPTION 'Missing ON DELETE CASCADE'; END IF;
END $$;
SELECT set_config('request.jwt.claim.role','service_role',false);
INSERT INTO public.expenses(user_id,child_name,category,label,amount,date,is_recurring,recurring_day,recurrence_id)
SELECT user_id,child_name,category,label,amount,'2026-11-30',true,30,recurrence_id
FROM public.expenses WHERE user_id='11111111-1111-4111-8111-111111111111' AND is_recurring LIMIT 1;
SELECT set_config('request.jwt.claim.role','',false);
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',false);
DO $$
BEGIN
 IF (SELECT count(*) FROM public.expenses)<>3 THEN RAISE EXCEPTION 'RLS SELECT isolation'; END IF;
END $$;
INSERT INTO public.expenses(user_id,child_name,category,label,amount,date,is_recurring,recurring_day,recurrence_id)
VALUES ('22222222-2222-4222-8222-222222222222','Enfant A','Garde','Crèche',50,'2026-11-30',true,30,
'33333333-3333-4333-8333-333333333333');
DO $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.expenses
 WHERE recurrence_id='33333333-3333-4333-8333-333333333333'
 AND user_id='11111111-1111-4111-8111-111111111111')
 THEN RAISE EXCEPTION 'Forged ownership not corrected'; END IF;
END $$;
DO $$
BEGIN
 BEGIN
  INSERT INTO public.expenses(child_name,category,label,amount,date,is_recurring,recurring_day,recurrence_id)
  VALUES('Enfant A','Garde','Crèche',50,'2026-11-29',true,29,
  '33333333-3333-4333-8333-333333333333');
  RAISE EXCEPTION 'Duplicate allowed';
 EXCEPTION WHEN unique_violation THEN NULL;
 END;
END $$;
DO $$
BEGIN
 BEGIN
  UPDATE public.expenses SET user_id='22222222-2222-4222-8222-222222222222'
  WHERE recurrence_id='33333333-3333-4333-8333-333333333333';
  RAISE EXCEPTION 'Cross-owner reassignment allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $$;
DO $$
BEGIN
 IF EXISTS(SELECT 1 FROM public.expenses
 WHERE user_id='22222222-2222-4222-8222-222222222222')
 THEN RAISE EXCEPTION 'RLS leaked another user'; END IF;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','',false);
DELETE FROM auth.users WHERE id='11111111-1111-4111-8111-111111111111';
DO $$
DECLARE t text; n integer;
BEGIN
 FOREACH t IN ARRAY ARRAY['expenses','profiles','settings','categories'] LOOP
  EXECUTE format('SELECT count(*) FROM public.%I WHERE user_id=$1',t)
    INTO n USING '11111111-1111-4111-8111-111111111111'::uuid;
  IF n<>0 THEN RAISE EXCEPTION 'Orphan in %',t; END IF;
  EXECUTE format('SELECT count(*) FROM public.%I WHERE user_id=$1',t)
    INTO n USING '22222222-2222-4222-8222-222222222222'::uuid;
  IF n<>1 THEN RAISE EXCEPTION 'User B data missing in %',t; END IF;
 END LOOP;
END $$;
