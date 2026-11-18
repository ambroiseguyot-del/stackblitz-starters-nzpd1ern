-- Proposition pour revue manuelle uniquement. NE PAS exécuter automatiquement.
-- Contrôler les définitions, propriétaires et triggers associés avant application.
-- Les fonctions triggers restent appelées par leurs triggers sans privilège EXECUTE
-- accordé aux rôles publics, mais valider ce comportement sur la base de test.
REVOKE EXECUTE ON FUNCTION public.fill_category_user_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fill_expense_user_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fill_profile_user_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.fill_settings_user_id() FROM PUBLIC, anon, authenticated;
