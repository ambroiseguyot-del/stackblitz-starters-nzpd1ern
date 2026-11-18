# Baby Budget 2.0 — Check-list de sécurité avant ouverture à d'autres familles

## Constat sur le backend existant (lecture seule, 18 novembre 2026)

- Les quatre tables `expenses`, `profiles`, `settings`, `categories` ont RLS activé et les politiques sont restreintes aux propriétaires.
- La fonction Edge `process-recurring` existe déjà ; `verify_jwt=true` et la tâche `process-recurring-daily` est planifiée tous les jours à 00:00 UTC.
- **Défaut critique** dans la fonction actuellement déployée : elle accepte un JWT utilisateur valide, mais traite ensuite les dépenses de **tous les utilisateurs** avec une clé de service privilégiée. Un utilisateur authentifié ne doit pas pouvoir déclencher un traitement global.
- **Défaut de déduplication** dans la fonction actuellement déployée : elle exclut la dépense originale lors du contrôle du mois et traite plusieurs anciens enregistrements servant de modèles. Risques de doublons et de traitement répétitif.
- La fonction `delete-user` existe déjà, mais ne contrôle pas les erreurs de chaque suppression de table.
- Les versions corrigées sont fournies sous `supabase/functions/process-recurring/index.ts` et `supabase/functions/delete-user/index.ts` ; **elles ne sont pas déployées et n'ont pas été exécutées sur les données réelles**.

## Conditions de publication

1. Vérifier que la tâche Cron utilise le JWT de `SUPABASE_SERVICE_ROLE_KEY` depuis Vault, sans révéler cette clé au client.
2. Déployer la fonction corrigée en dehors des heures critiques, après sauvegarde et recette sur un environnement non productif autorisé.
3. Vérifier qu'un JWT utilisateur normal reçoit HTTP 401 sur `process-recurring`. Vérifier qu'un appel Cron légitime est autorisé, sans exposition de secrets.
4. Avec deux utilisateurs de test A/B, vérifier qu'aucun compte n'accède aux dépenses d'un autre. Tester ajout, édition, suppression, export, désactivation de récurrence et suppression du compte.
5. Vérifier les doublons de récurrence. La version corrigée évite les doublons séquentiels ; **une contrainte d'unicité en base** est préférable pour une garantie en cas d'appels concurrents.
6. Vérifier les flux de récupération de mot de passe, emails d'inscription, anti-abus et confirmation d'email.
7. Confirmer que `contact@babybudget.fr` reçoit des messages et que la politique de confidentialité est conforme à la configuration réelle.
8. Tester le responsive iPhone, Safari, navigation clavier, contraste et mode sombre.
9. Effectuer une sauvegarde PostgreSQL vérifiée. Les ZIP de code ne sauvegardent pas les données Supabase.
10. Ne pas fusionner cette branche avant le feu vert utilisateur et les contrôles ci-dessus.

## Contraintes budgétaires

Aucune branche Supabase payante, aucune ressource supplémentaire et aucun abonnement ne doivent être créés sans accord explicite. Les mises à jour de code et la prévisualisation GitHub/Vercel utilisent les intégrations existantes, sous réserve des quotas de l'abonnement actuel.

## Limites connues

La version interface propose une reconduction **manuelle et confirmée** des échéances pour éviter les doublons en attendant le durcissement du traitement automatique. Le partage des données d'un même foyer entre plusieurs comptes ne doit pas être activé sans un nouveau modèle d'autorisation RLS testé ; des familles distinctes peuvent chacune créer leur compte personnel dès que la recette de sécurité est validée.
