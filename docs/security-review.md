# BabyBudget — contrôles de sécurité à réaliser avant fusion

Ce fichier documente les constats issus d'une **inspection en lecture seule** du projet Supabase le 18 novembre 2026. Il ne constitue pas une migration appliquée.

## RLS — tables de l'application

Les tables `public.expenses`, `public.profiles`, `public.settings` et `public.categories` ont RLS activé, avec des politiques SELECT/INSERT/UPDATE/DELETE limitant le propriétaire à `auth.uid() = user_id`. Les requêtes de l'application doivent néanmoins exiger une session et filtrer par `user_id`.

### Contrôle fonctionnel indispensable

Dans **une base de test isolée**, créer deux comptes distincts A et B, quelques dépenses, profils et paramètres pour chacun. Tester en lecture et écriture que A ne voit/modifie/supprime jamais les lignes de B, qu'une requête anonyme renvoie zéro donnée privée et que la déconnexion invalide les parcours privés. Ne jamais exécuter ce scénario sur des données clients réelles.

## Avertissements Supabase Security Advisor

Les fonctions `public.fill_category_user_id()`, `public.fill_expense_user_id()`, `public.fill_profile_user_id()` et `public.fill_settings_user_id()` sont signalées comme `SECURITY DEFINER` exécutables par les rôles externes. Vérifier leur implémentation et leur usage effectif dans les triggers avant de restreindre leurs droits. Un script **facultatif, non exécuté** figure dans `docs/security-hardening-review.sql`.

Documentation : https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable

## À vérifier avant production

- Vérification des flux inscription, connexion, réinitialisation de mot de passe, déconnexion.
- Vérification des opérations CRUD sur dépenses et catégories, budgets par enfant, export CSV.
- Vérification du compte Supabase Auth et de la fonction d'effacement de compte.
- Sauvegarde Supabase vérifiable distincte des ZIP GitHub/StackBlitz.
- Variables Vercel de Preview isolées de la base de production avant tout test écrivant des données.
- Responsable de traitement, sous-traitants, transferts internationaux et délais de conservation RGPD confirmés.
