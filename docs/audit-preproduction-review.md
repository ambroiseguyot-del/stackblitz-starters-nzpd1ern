# Babybudget.fr — audit, corrections hors production (20 novembre 2026)

## Environnement observé
- GitHub main baseline: 9ef99d52eefc7b64358a1f88971ca5600f0f0ff5
- Supabase eu-central-2 Zurich; process-recurring v2 et delete-user v2 actives.
- Cron process-recurring-daily actif à 00:00 UTC.
- Contrainte actuelle recurring_day 1..28; index mensuel d'unicité absent.
- Supabase Security Advisor: protection des mots de passe compromis désactivée.
- Supabase Performance Advisor: politiques RLS à optimiser, index user_id manquants.

## Lot proposé (non déployé)
- Fail closed de l'authentification des routes privées.
- En-têtes HTTP, cache privé et page d'erreur.
- Calcul PSU crèche 2026 0,0619 % / heure, scénario 1 enfant, 160 h.
- Mots de passe nouveaux : au moins 12 caractères côté interface; harmoniser la politique Auth à la publication.
- Confidentialité : mention de l'hébergement Supabase Zurich, Suisse.
- Worker de récurrences fin de mois 29/30/31, conservation de recurring_day nominal.
- Schéma SQL proposé : colonne recurrence_id, rétroattribution aux occurrences historiques, récurrence par règle stable et non par libellé, unicité atomique (user_id, recurrence_id, mois), trigger de compatibilité clients anciens, jour 1..31 et optimisation RLS.
- Tests calendaires purement locaux inclus.

## Recette bloquante
1. N'exécuter aucun SQL/Edge Function avant sauvegarde et test isolé. Sauvegarde PostgreSQL de production vérifiée.
2. Tester JWT utilisateur => 401, Cron valide => succès, absence de clés de service côté client.
3. Tester les comptes A/B et RLS, mois courts, concurrence, suppression de compte, export et sessions.
4. Tester npm ci, node --test scripts/recurrence-regression.cjs, TypeScript, lint, build, navigation mobile.
5. Revoir SQL, conventions de récurrence, données réelles et garanties RGPD.
6. Vérifier la liaison Vercel et les quotas Hobby. Ne pas pousser vers une branche déclenchant un preview.
7. Appliquer les changements en une fenêtre de publication coordonnée uniquement après accord.

## Limites
- Deux nouvelles règles peuvent partager enfant/catégorie/libellé grâce à des recurrence_id distincts. Le rétro-remplissage des anciennes données doit cependant regrouper les libellés historiques: il échoue volontairement si un mois contient des collisions nécessitant un rapprochement manuel.
- Les corrections frontend (pagination, jour 29–31, CSV) sont incluses dans le commit de revue. La recette des flux complets et des tests d'intégration est encore requise.
- Aucun test UI ni recette SQL en base isolée exécuté, aucun déploiement réalisé.
