import Link from 'next/link';
import BlogArticleFrame from '../../../components/BlogArticleFrame';

const sources = [
  { organization: 'Service-Public', title: 'Congé parental d’éducation à temps plein, règles pour les salariés privés, juin 2026', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2280' },
  { organization: 'Service-Public', title: 'Congé parental d’éducation à temps partiel, juin 2026', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2332' },
  { organization: 'CAF', title: 'Barème PreParE au 1er avril 2026', url: 'https://www.caf.fr/sites/default/files/medias/911/Partenaires/Actualit%C3%A9s%20partenaires/Guide%20des%20prestations%202026.pdf' },
  { organization: 'Service-Public', title: 'PreParE : conditions, périodes d’assurance et durée du droit, juin 2026', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F32485' },
  { organization: 'Service-Public', title: 'Congé supplémentaire de naissance depuis le 1er juillet 2026', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F39685' },
  { organization: 'Service-Public', title: 'Crédit d’impôt pour frais de garde hors domicile, avril 2026', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F8' },
  { organization: 'Urssaf', title: 'Simulateur CMG emploi direct et reste à charge', url: 'https://www.urssaf.fr/accueil/outils-documentation/simulateurs/calculer-reste-a-charge-cmg-pe.html' },
  { organization: 'Service-Public', title: 'Maintien de la mutuelle durant le congé parental : règles', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F13478' },
];

const hypotheses = [
  { mode: 'Reprise à temps plein', income: '2 100 €', benefit: '0 €', childcare: '450 €', extras: '120 €', subtotal: '1 530 €' },
  { mode: 'Congé parental à temps plein', income: '0 €', benefit: '459,69 €', childcare: '0 €', extras: '0 €', subtotal: '459,69 €' },
  { mode: 'Reprise à 80 %', income: '1 680 €', benefit: '171,42 €', childcare: '270 €', extras: '90 €', subtotal: '1 491,42 €' },
];

export default function CongeParentalOuReprise2026() {
  return <BlogArticleFrame
    category="Revenus & congés"
    title="Congé parental ou reprise du travail : quelle solution est la plus rentable en 2026 ?"
    introduction="Salaire perdu, PreParE, garde d’enfant, fiscalité et nouveau congé de naissance : une méthode pour comparer les scénarios financiers sans oublier la carrière ni la trésorerie."
    updated="20 novembre 2026"
    readTime="12 min"
    sources={sources}
  >
    <div className="bb-blog-highlight">
      <strong>L’essentiel</strong>
      <p>La reprise du travail est souvent plus rémunératrice sur le plan strictement mensuel, mais le <strong>coût net de garde</strong>, les transports, la fiscalité et les aides peuvent changer l’écart. Un <strong>temps partiel</strong> peut parfois rapprocher les deux scénarios. En 2026, il faut aussi distinguer le <strong>congé parental d’éducation</strong>, la prestation <strong>PreParE</strong> et le <strong>congé supplémentaire de naissance</strong> instauré à partir du 1er juillet 2026 : ces dispositifs n’ont ni les mêmes durées ni les mêmes indemnisations.</p>
    </div>

    <h2>1. Ne confondez pas congé parental et indemnisation CAF</h2>
    <p>Le <strong>congé parental d’éducation</strong> est un dispositif de droit du travail. Il permet, sous conditions, de suspendre son contrat ou de réduire son temps de travail pour s’occuper d’un enfant. En cas de congé parental à temps plein, l’employeur ne verse pas de salaire pour la période non travaillée, sauf texte conventionnel ou accord plus favorable. En cas de congé à temps partiel, le salaire rémunère la quotité travaillée.</p>
    <p>La <strong>PreParE</strong> est une prestation distincte versée par la CAF ou la MSA aux parents éligibles qui cessent ou réduisent leur activité. Elle n’est ni automatique ni équivalente au dernier salaire. Il faut notamment remplir des conditions d’activité antérieure et de situation familiale. <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F32485" rel="noopener noreferrer" target="_blank">Service-Public détaille les conditions applicables en juin 2026</a>.</p>
    <p>Enfin, les congés de maternité, paternité, accueil de l’enfant et adoption disposent de régimes propres. Les considérer comme du congé parental classique conduit à de mauvais calculs. Pour une simulation, commencez par identifier le statut exact du parent : salarié du privé, fonctionnaire, indépendant ou autre.</p>

    <h2>2. Combien verse la PreParE en 2026 ?</h2>
    <p>Selon le <a href="https://www.caf.fr/professionnels/offres-et-services/accompagnement-des-allocataires/bareme-prestation-partagee-d-education-de-l-enfant" rel="noopener noreferrer" target="_blank">barème CAF au 1er avril 2026</a>, les montants mensuels de la PreParE de droit commun sont les suivants :</p>
    <div className="bb-blog-table-wrap">
      <table>
        <caption>Barème national CAF depuis le 1er avril 2026, sous réserve d’ouverture et de durée des droits</caption>
        <thead><tr><th>Activité du parent</th><th>PreParE mensuelle</th><th>Attention</th></tr></thead>
        <tbody>
          <tr><td>Activité totalement interrompue</td><td>459,69 €</td><td>Ce n’est pas un salaire de remplacement</td></tr>
          <tr><td>Temps partiel jusqu’à 50 %</td><td>297,17 €</td><td>Conditions de quotité et de droits</td></tr>
          <tr><td>Temps partiel supérieur à 50 % et jusqu’à 80 %</td><td>171,42 €</td><td>Éligibilité à vérifier</td></tr>
        </tbody>
      </table>
    </div>
    <p>La PreParE majorée obéit à des conditions différentes, notamment liées à la composition familiale, et ne doit pas être substituée aux montants courants pour un premier enfant. Les arrondis éditoriaux peuvent différer d’un centime entre la CAF et Service-Public : retenez le barème applicable à votre notification.</p>
    <h3>Premier enfant : une durée de versement plus courte qu’on ne le croit</h3>
    <p>Pour un <strong>couple avec un premier enfant</strong>, le droit PreParE est généralement limité à <strong>six mois par parent</strong>, dans la limite du premier anniversaire de l’enfant, sous réserve des conditions. Le congé parental au sens du Code du travail peut, lui, durer plus longtemps : il ne faut pas projeter 459,69 € par mois pendant trois ans. Pour un premier enfant, les huit trimestres requis sont appréciés sur une période de référence de deux ans selon les règles du régime général ; demandez une vérification individuelle à la CAF.</p>
    <p>Un point de trésorerie souvent oublié : la prestation n’est pas nécessairement due dès la première journée de congé. Vérifiez le premier mois plein pris en compte, les délais de dossier et les dates de versement avant de construire votre calendrier familial.</p>

    <h2>3. La nouvelle option 2026 : le congé supplémentaire de naissance</h2>
    <p>Depuis le <strong>1er juillet 2026</strong>, un <strong>congé supplémentaire de naissance</strong> indemnisé est ouvert, sous conditions, aux parents d’enfants nés à compter du 1er janvier 2026, en complément des congés existants. Chaque parent peut choisir un ou deux mois, simultanément ou successivement, avec possibilité de fractionnement selon les règles applicables.</p>
    <p>Pour les salariés éligibles, <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F39685" rel="noopener noreferrer" target="_blank">Service-Public indique une indemnisation de 70 % du salaire net le premier mois et 60 % le second</a>, dans la limite du plafond réglementaire de référence. Les pourcentages ne permettent pas d’estimer exactement les droits sans connaître le salaire retenu et les plafonds.</p>
    <p>Pour un enfant né entre le <strong>1er janvier et le 30 juin 2026</strong>, ce congé doit être pris entre le <strong>1er juillet 2026 et le 31 mars 2027</strong>. Pour une naissance à partir du 1er juillet 2026, le délai est de neuf mois après la naissance. Des conditions de prise des congés précédents et de prévenance de l’employeur s’appliquent.</p>
    <p><strong>Attention au cumul :</strong> l’indemnisation du congé supplémentaire de naissance et la PreParE ne se cumulent pas librement pour les mêmes périodes. Avant de les additionner dans un budget, vérifiez la règle de cumul applicable à votre dossier. Le congé supplémentaire de naissance peut être financièrement plus intéressant que la PreParE sur une courte période, mais le choix dépend des droits effectivement ouverts.</p>

    <h2>4. Calculer le vrai gain financier d'une reprise</h2>
    <p>Pour savoir si reprendre le travail est plus intéressant, il ne suffit pas de comparer le salaire net à la PreParE. Il faut soustraire <strong>les dépenses supplémentaires causées par la reprise</strong> et ajouter, séparément, les aides effectivement confirmées. Les variables à considérer sont le coût de garde après CMG ou tarification PSU, le transport, les repas professionnels, les éventuels frais de remplacement et les effets fiscaux.</p>
    <p>La formule pédagogique est la suivante : <strong>contribution mensuelle du scénario = salaire net effectivement perçu + prestations confirmées − coût mensuel de garde après aides − frais supplémentaires liés au travail</strong>. Si le foyer comporte deux parents, comparez la variation du parent concerné en maintenant les autres revenus constants. Les dépenses courantes de l’enfant, qui existent dans tous les scénarios, ne doivent pas être comptées deux fois.</p>
    <h3>Exemple chiffré : trois scénarios pour un même foyer</h3>
    <p>Supposons qu’un parent perçoive <strong>2 100 € nets mensuels</strong> à temps plein. La simulation suppose un coût mensuel de garde <em>déjà net d’aides</em> de 450 € en reprise complète, de 270 € à 80 %, et des frais professionnels supplémentaires de 120 € ou 90 €. Les prestations PreParE ne sont retenues que <strong>si le parent remplit réellement les conditions</strong>. L’autre revenu du foyer est supposé constant.</p>
    <div className="bb-blog-table-wrap">
      <table>
        <caption>Simulation illustrative, avant effets de l’impôt sur le revenu, des droits retraite et des avantages employeur</caption>
        <thead><tr><th>Scénario</th><th>Salaire</th><th>PreParE hypothétique</th><th>Garde</th><th>Frais travail</th><th>Contribution</th></tr></thead>
        <tbody>
          {hypotheses.map(row => <tr key={row.mode}><td>{row.mode}</td><td>{row.income}</td><td>{row.benefit}</td><td>{row.childcare}</td><td>{row.extras}</td><td><strong>{row.subtotal}</strong></td></tr>)}
        </tbody>
      </table>
    </div>
    <p className="bb-blog-caveat">Exemple inventé pour illustrer le calcul, pas des niveaux de salaire ou de garde moyens en France. Le montant mensuel de PreParE repris du barème CAF reste soumis aux conditions individuelles ; les autres chiffres sont des hypothèses. La PreParE n’est pas garantie pendant douze mois et l’option temps partiel dépend des conditions légales et du contrat de travail.</p>
    <p>Dans cet exemple, la reprise à temps plein laisse <strong>1 070,31 € de contribution supplémentaire par mois</strong> par rapport au congé parental indemnisé à temps plein. Le passage à 80 % aboutit à une contribution <strong>38,58 € plus faible</strong> qu’à temps plein, avant les effets fiscaux et sociaux. L’écart serait très différent si la garde coûtait davantage, si un grand-parent pouvait aider, si le revenu était différent ou si aucune PreParE n’était due.</p>

    <h2>5. Intégrer l'impôt et le crédit d'impôt de garde</h2>
    <p>Le <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F8" rel="noopener noreferrer" target="_blank">crédit d’impôt pour frais de garde hors domicile</a> peut être égal à 50 % des dépenses de garde éligibles après déduction des aides, dans la limite de <strong>3 500 € de dépenses annuelles par enfant</strong>, soit <strong>1 750 € de crédit maximum</strong> dans le cas général. Ce crédit est régularisé selon le calendrier fiscal : ne le traitez pas comme un remboursement automatique immédiat de chaque facture.</p>
    <p>En changeant son temps de travail, le foyer peut aussi changer son revenu imposable et ses droits sociaux. Un calcul sérieux doit donc comparer le <strong>revenu disponible annuel du ménage</strong>, et pas uniquement le salaire net d’un mois. Pour un foyer fiscal commun, le taux marginal d’imposition d’un parent seul ne représente pas nécessairement l’économie d’impôt réelle du couple.</p>
    <p>Si le parent est salarié, examinez aussi les effets sur les primes conditionnées à l’activité, l’intéressement, les titres-restaurant, les jours de RTT, les droits à pension et la complémentaire santé. Les règles de maintien de la mutuelle pendant un congé parental à temps plein dépendent notamment de la situation du contrat et des engagements employeur.</p>

    <h2>6. Temps plein, 80 %, 50 % : comment choisir ?</h2>
    <h3>Le temps plein maximise généralement le salaire courant</h3>
    <p>Il peut rester financièrement avantageux si le salaire dépasse nettement le coût de garde et les frais de travail. Mais des horaires très longs, des trajets contraignants ou une garde peu fiable peuvent générer d’autres coûts indirects. Il faut également se demander si les deux parents souhaitent et peuvent partager les tâches familiales.</p>
    <h3>Le temps partiel peut offrir un compromis</h3>
    <p>Un passage à 80 % doit être calculé sur le revenu net réel, avec les primes et éventuels effets de seuil. Il ne suffit pas de multiplier mécaniquement le salaire net par 0,8 pour obtenir une fiche de paie exacte. Une garde d’enfant à 80 % peut également ne pas coûter exactement 80 % d’un contrat à temps plein. Faites établir une simulation de paie et un nouveau devis de garde.</p>
    <h3>Le congé parental à temps plein privilégie le temps familial, avec un coût d’opportunité</h3>
    <p>Outre le salaire non perçu, estimez les effets sur l’épargne, la carrière, les primes, les droits retraite et la reprise d’emploi. Il ne s’agit pas d’attribuer une valeur monétaire à la présence auprès de son enfant, mais d’identifier clairement les compromis qu'implique la décision.</p>

    <h2>7. Une méthode de décision sur douze mois</h2>
    <ol>
      <li><strong>Demandez une simulation de paie :</strong> temps plein, 80 %, 50 %, éventuelles primes et couverture sociale.</li>
      <li><strong>Vérifiez votre droit individuel à PreParE :</strong> durée, montant et début effectif du versement.</li>
      <li><strong>Examinez le congé supplémentaire de naissance :</strong> naissance éligible, délai, indemnisation et non-cumul.</li>
      <li><strong>Comparez deux solutions de garde :</strong> heures nécessaires, CMG estimé par l’Urssaf, frais annexes et fermetures.</li>
      <li><strong>Intégrez l’impôt sur une année complète :</strong> crédit d’impôt, évolution des revenus imposables et décalage de trésorerie.</li>
      <li><strong>Mesurez les conséquences à long terme :</strong> maintien de l’emploi, progression professionnelle, retraite, épargne et disponibilité familiale.</li>
      <li><strong>Gardez une marge de sécurité :</strong> testez la décision avec une facture de garde plus élevée ou un versement d’aide retardé.</li>
    </ol>
    <p>Le <Link href="/budget">simulateur de budget BabyBudget</Link> permet de préparer les postes de dépenses. Pour comparer plus précisément deux solutions de garde, lisez notre guide <Link href="/blog/creche-ou-assistante-maternelle-2026">crèche ou assistante maternelle en 2026</Link>.</p>

    <h2>Questions fréquentes</h2>
    <h3>Mon employeur me paie-t-il pendant un congé parental ?</h3>
    <p>En congé parental d’éducation à temps plein, le salaire n’est normalement pas versé pendant la période non travaillée, sauf accord, convention ou dispositions particulières. La PreParE est une prestation CAF distincte, soumise à conditions.</p>
    <h3>Puis-je prendre un congé parental jusqu’aux trois ans de mon enfant ?</h3>
    <p>Le droit à congé parental et la durée d’indemnisation PreParE ne sont pas identiques. Le congé peut être renouvelable dans les limites légales, tandis que la prestation peut cesser bien plus tôt, surtout pour un premier enfant.</p>
    <h3>La PreParE peut-elle être versée en même temps que le nouveau congé de naissance ?</h3>
    <p>Les règles de non-cumul s’appliquent. Ne construisez pas un budget en ajoutant les deux montants pour le même mois sans validation des organismes compétents.</p>
    <h3>Quel scénario est le plus rentable ?</h3>
    <p>Il faut comparer les revenus disponibles et les dépenses réelles pour chaque scénario. Le résultat de l’exemple ci-dessus ne vaut ni recommandation individuelle ni simulation de droits. La décision inclut aussi les préférences familiales et les objectifs de carrière.</p>

    <div className="bb-blog-highlight bb-blog-highlight-green">
      <strong>Passer du calcul à l'organisation familiale</strong>
      <p>Retrouvez nos <Link href="/blog/aides-caf-bebe-2026">repères sur les aides CAF</Link>, puis suivez l’évolution de votre budget avec <Link href="/signup">votre espace BabyBudget gratuit</Link>. Les projections doivent être mises à jour si vos revenus, votre garde ou vos droits changent.</p>
    </div>
  </BlogArticleFrame>;
}
