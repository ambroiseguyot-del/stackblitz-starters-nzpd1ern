import Link from 'next/link';
import BlogArticleFrame from '../../../components/BlogArticleFrame';

const sources = [
  { organization: 'CAF', title: 'Barème des participations familiales des EAJE pour 2026, 15 décembre 2025', url: 'https://www.caf.fr/sites/default/files/medias/661/Espace-Partenaires/Documents-Partenaires/2026-Baremes-Participation-Famille-Eaje.pdf' },
  { organization: 'Urssaf', title: 'Coût horaire médian CMG 2026 (4,91 €) et plafonds au 1er avril 2026', url: 'https://www.urssaf.fr/accueil/actualites/actualite-reevaluation-cmg.html' },
  { organization: 'Service-Public', title: 'Complément de libre choix du mode de garde (CMG) emploi direct, règles 2026', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F39152' },
  { organization: 'Urssaf', title: 'Réforme du CMG emploi direct et exemples de calcul', url: 'https://www.urssaf.fr/accueil/actualites/evolution-cmg-ce-qui-va-changer.html' },
  { organization: 'Urssaf', title: 'Simulateur du reste à charge CMG pour particuliers employeurs', url: 'https://www.urssaf.fr/accueil/outils-documentation/simulateurs/calculer-reste-a-charge-cmg-pe.html' },
  { organization: 'Service-Public', title: 'Salaire d’une assistante maternelle, contrat et indemnités, règles 2026', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F12812' },
  { organization: 'Service-Public', title: 'Crédit d’impôt pour frais de garde hors domicile, vérifié le 15 avril 2026', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F8' },
];

const simulation = [
  { resources: '2 500 €', hours: '160 h', nursery: '247,60 €' },
  { resources: '4 000 €', hours: '160 h', nursery: '396,16 €' },
  { resources: '5 500 €', hours: '160 h', nursery: '544,72 €' },
];

export default function CrecheOuAssistanteMaternelle2026() {
  return <BlogArticleFrame
    category="Modes de garde"
    title="Crèche ou assistante maternelle : quel mode de garde coûte le moins cher en 2026 ?"
    introduction="Prix de la crèche PSU, réforme du CMG, indemnités, crédit d'impôt : une comparaison fiable exige de calculer le reste à charge réel, pas de comparer deux tarifs horaires isolés."
    updated="20 novembre 2026"
    readTime="11 min"
    sources={sources}
  >
    <div className="bb-blog-highlight">
      <strong>Réponse rapide</strong>
      <p>Pour une place en <strong>crèche collective financée par la PSU</strong>, la participation familiale découle d’un barème national fondé sur les ressources, le nombre d’enfants et les heures facturées. Pour une <strong>assistante maternelle agréée employée directement</strong>, le coût dépend du contrat et du <em>CMG emploi direct</em> calculé selon les règles applicables depuis septembre 2025. <strong>Aucune solution n’est systématiquement la moins chère.</strong> Il faut comparer les coûts nets à durée de garde identique, puis distinguer le crédit d’impôt qui intervient ultérieurement.</p>
    </div>

    <h2>1. Les deux modes de garde ne sont pas facturés de la même façon</h2>
    <p>Une crèche municipale, associative ou privée peut relever de la <strong>prestation de service unique (PSU)</strong>, versée par la CAF à l’établissement. Dans ce cas, les parents règlent une participation calculée suivant un barème national ; ce n’est pas le coût économique total de la place. Les tarifs peuvent dépendre du règlement de la structure et des heures contractuelles facturées.</p>
    <p>Chez une assistante maternelle agréée, les parents deviennent en principe <strong>particuliers employeurs</strong>. Ils négocient un contrat écrit et paient une rémunération mensualisée, les indemnités d’entretien, éventuellement les repas et les congés selon les dispositions applicables. Le CMG peut prendre en charge une partie des coûts sous conditions. La facture initiale et la charge financière après aide sont donc très différentes.</p>
    <p>Attention à la <strong>micro-crèche</strong> : certaines relèvent de la PSU, d’autres du <em>CMG structure</em>. Les calculs de cet article sur la crèche PSU ne doivent pas être transposés à toutes les micro-crèches, ni aux crèches d’entreprise hors modèle PSU. Demandez expressément à chaque établissement son régime de financement.</p>

    <h2>2. Prix d'une crèche PSU en 2026 : la formule officielle</h2>
    <p>Pour une famille avec <strong>un enfant à charge</strong> en accueil collectif PSU, le taux d’effort applicable du <strong>1er janvier au 31 décembre 2026</strong> est de <strong>0,0619 % des ressources mensuelles par heure facturée</strong>, selon le <a href="https://www.caf.fr/sites/default/files/medias/661/Espace-Partenaires/Documents-Partenaires/2026-Baremes-Participation-Famille-Eaje.pdf" target="_blank" rel="noopener noreferrer">barème CAF des établissements d’accueil du jeune enfant 2026</a>.</p>
    <p>Le plancher national de ressources en métropole est de <strong>814,62 € par mois pour 2026</strong> ; les barèmes annuels sont susceptibles d’évoluer au 1er janvier suivant. Ne prolongez pas le plancher 2026 à 2027 sans vérifier le nouveau barème. Le plafond de référence est de <strong>8 500 € par mois</strong>, mais la CAF précise que son application n’est pas toujours obligatoire : le règlement de l’établissement peut prévoir un traitement particulier au-delà du plafond.</p>
    <p><strong>Formule indicative :</strong> ressources mensuelles retenues × 0,000619 × nombre d’heures facturées. Les ressources CAF ne correspondent pas forcément au salaire net mensuel actuel : la caisse applique les ressources de référence et les règles propres au foyer. Pour 2026, vérifiez notamment la base fiscale de 2024 et les éventuelles actualisations de dossier.</p>
    <div className="bb-blog-table-wrap">
      <table>
        <caption>Simulations mathématiques pour une famille avec un enfant, accueil collectif PSU, 160 heures facturées ; hors particularités locales</caption>
        <thead><tr><th>Ressources mensuelles retenues</th><th>Heures</th><th>Participation calculée</th></tr></thead>
        <tbody>{simulation.map(row => <tr key={row.resources}><td>{row.resources}</td><td>{row.hours}</td><td>{row.nursery}</td></tr>)}</tbody>
      </table>
    </div>
    <p className="bb-blog-caveat">Ces trois chiffres sont des résultats de la formule CAF, pas des factures réelles observées, ni des moyennes nationales. Les journées d’absence, les heures facturées, le règlement de la crèche et les particularités du foyer peuvent modifier le montant dû. Pour deux enfants à charge, le taux PSU collectif 2026 est de 0,0516 %, et non 0,0619 %.</p>
    <p>Pour estimer correctement le coût, demandez à la crèche : le volume mensuel d’heures facturées, le règlement tarifaire, ce qui est fourni (repas, couches), les fermetures annuelles et les modalités de facturation des absences. Une famille qui a besoin de 45 heures par semaine ne doit pas comparer son devis à un exemple limité à 120 heures par mois.</p>

    <h2>3. Assistante maternelle : distinguer coût brut, CMG et reste à charge</h2>
    <p>Une assistante maternelle est rémunérée selon un contrat respectant la convention collective applicable. Le salaire dépend du taux horaire négocié, des heures et semaines d’accueil. Des indemnités d’entretien sont dues par jour de présence, et une indemnité de repas s’ajoute lorsqu’elle fournit les repas. Les modalités de congés payés doivent être correctement anticipées, notamment en année incomplète.</p>
    <p>Depuis <strong>septembre 2025</strong>, le <strong>CMG emploi direct</strong> est calculé en fonction des ressources, du nombre d’enfants à charge, du coût horaire de la garde et du nombre d’heures. Le coût horaire pris en compte est plafonné. L’<a href="https://www.urssaf.fr/accueil/actualites/evolution-cmg-ce-qui-va-changer.html" target="_blank" rel="noopener noreferrer">Urssaf présente les effets de la réforme</a>, dont un exemple comparatif officiel ; cet exemple dépend d’hypothèses précises et ne garantit pas le même résultat pour votre foyer.</p>
    <p>Pour 2026, l’Urssaf indique un <strong>coût horaire médian de référence de 4,91 €</strong> pour l’assistant maternel dans son calcul du CMG, revalorisé au <strong>1er avril 2026</strong> ; le plafond horaire est alors de <strong>8,09 €</strong>. <strong>Ce n’est ni un tarif imposé ni le salaire contractuel de toutes les assistantes maternelles</strong>. La prise en charge des cotisations pour l’emploi d’un assistant maternel agréé suit également des règles spécifiques.</p>
    <div className="bb-blog-highlight bb-blog-highlight-green">
      <strong>Le bon réflexe avant de signer</strong>
      <p>Renseignez votre situation dans le <a href="https://www.urssaf.fr/accueil/outils-documentation/simulateurs/calculer-reste-a-charge-cmg-pe.html" target="_blank" rel="noopener noreferrer">simulateur officiel Urssaf du reste à charge CMG</a>. Faites varier les heures, le coût horaire réel et les ressources. Vérifiez ensuite la simulation auprès de Pajemploi/CAF : un montant d’aide affiché dans un exemple public n’est pas un droit acquis.</p>
    </div>

    <div className="bb-blog-highlight">
      <strong>Une comparaison réellement publiée par l’Urssaf</strong>
      <p>Dans un <a href="https://www.urssaf.fr/accueil/actualites/evolution-cmg-ce-qui-va-changer.html" rel="noopener noreferrer" target="_blank">exemple officiel de la réforme du CMG (chiffres 2026)</a>, un couple avec <strong>deux enfants</strong>, des ressources de <strong>4 000 € mensuels</strong> et <strong>110 heures de garde</strong> obtient un reste à charge identique de <strong>227,04 €</strong> en crèche PSU et avec une assistante maternelle rémunérée au coût de référence de <strong>4,91 € par heure</strong>. Pour l’assistante maternelle, l’Urssaf présente un coût de 540,10 € et un CMG de 313,06 €. Ce cas illustre un rapprochement possible, <strong>pas l’égalité des coûts dans toutes les familles</strong>. Ces montants sont avant crédit d’impôt.</p>
    </div>
    <h2>4. Comparer les deux solutions sans se tromper de calcul</h2>
    <p>La comparaison doit porter sur <strong>le même calendrier de garde</strong> et le même besoin horaire. Prenez les mêmes dates de début et de fin, les jours effectivement travaillés, les éventuels trajets et les solutions de remplacement en cas de fermeture ou d’absence.</p>
    <div className="bb-blog-table-wrap">
      <table>
        <caption>Grille de calcul pratique : ce qu’il faut additionner ou déduire</caption>
        <thead><tr><th>Poste</th><th>Crèche PSU</th><th>Assistante maternelle</th></tr></thead>
        <tbody>
          <tr><td>Base de facturation</td><td>Heures × taux d’effort familial</td><td>Salaire mensualisé selon contrat</td></tr>
          <tr><td>Frais supplémentaires</td><td>À vérifier auprès de la structure</td><td>Entretien, repas, congés et éventuels frais prévus au contrat</td></tr>
          <tr><td>Aide CMG</td><td>Pas de CMG emploi direct à déduire de la participation PSU</td><td>CMG emploi direct personnalisé, sous conditions</td></tr>
          <tr><td>Crédit d’impôt</td><td>Potentiellement applicable aux dépenses éligibles</td><td>Potentiellement applicable aux dépenses éligibles après aides</td></tr>
          <tr><td>Organisation</td><td>Horaires, calendrier et fermetures de la structure</td><td>Horaires contractuels et remplacement en cas d’absence</td></tr>
        </tbody>
      </table>
    </div>
    <p><strong>Exemple entièrement fictif, uniquement pour montrer la méthode :</strong> si une assistante maternelle facture 760 € pour un mois (salaire et frais retenus dans notre hypothèse) et qu’une aide CMG calculée par l’organisme est de 330 €, le débours intermédiaire serait de 430 €. Une crèche PSU facturée 396 € sur ce même mois coûterait alors moins cher avant impôt. Avec un CMG individuel différent, le classement peut s’inverser. <strong>Les 760 €, 330 € et 430 € ne sont pas des tarifs ou droits officiels.</strong></p>

    <h2>5. Ne pas oublier le crédit d’impôt pour frais de garde</h2>
    <p>Pour les dépenses de garde hors domicile d’un enfant à charge de moins de six ans, le crédit d’impôt correspond en principe à <strong>50 % des dépenses éligibles</strong>, retenues dans une limite annuelle de <strong>3 500 € par enfant</strong>, soit un avantage maximal de <strong>1 750 €</strong> (hors cas de garde alternée). Ce sont les règles rappelées par <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F8" target="_blank" rel="noopener noreferrer">Service-Public, mise à jour du 15 avril 2026</a>.</p>
    <p>On ne déclare pas nécessairement toute la facture : les frais de repas ne sont pas éligibles et il faut <strong>déduire les aides liées à la garde</strong>, notamment le CMG et les contributions de l’employeur. Gardez les justificatifs de crèche et l’attestation fiscale Pajemploi de l’assistante maternelle. Le crédit d’impôt n’est pas forcément encaissé chaque mois : son versement suit la déclaration et, selon l’historique, le mécanisme d’acompte.</p>
    <p>Par exemple, pour <strong>2 400 € de frais annuels éligibles restant après aides</strong>, la moitié représente 1 200 € de crédit d’impôt, sous réserve de toutes les conditions. Il ne faut ni déduire 1 750 € automatiquement, ni mélanger cet avantage fiscal futur avec la trésorerie nécessaire pour payer les mensualités.</p>

    <h2>6. Les frais cachés qui peuvent changer le classement</h2>
    <h3>Les horaires réels et les dépassements</h3>
    <p>Un contrat à 160 heures par mois peut sembler proche de votre besoin, mais les heures en plus, les retards, les journées d’adaptation et les modalités de fermeture rendent deux devis difficiles à comparer. Demandez un exemple de facture pour un mois ordinaire et pour un mois avec congés.</p>
    <h3>Les repas, les couches et le transport</h3>
    <p>Certains établissements fournissent repas et couches, d’autres disposent de règles particulières. Une assistante maternelle peut fournir les repas contre indemnité ou demander que les parents les préparent. Ajoutez l’éventuel détour domicile-travail, ainsi que le temps passé : ce coût peut compter autant que quelques euros de différence tarifaire.</p>
    <h3>Les absences et les solutions de secours</h3>
    <p>Vérifiez les conditions en cas de maladie de l’enfant, de fermeture de la crèche, de maladie ou de congé de l’assistante maternelle. Si un parent doit manquer plusieurs jours de travail pour assurer le relais, l’incidence financière ne se lit pas sur la seule facture de garde.</p>

    <h2>7. Comment obtenir un vrai comparatif en six étapes</h2>
    <ol>
      <li><strong>Fixer votre besoin :</strong> jours, heures, trajets, date de démarrage et nombre de semaines par an.</li>
      <li><strong>Obtenir deux propositions écrites :</strong> contrat ou grille de facturation, avec les frais supplémentaires identifiés.</li>
      <li><strong>Qualifier la structure :</strong> PSU, CMG structure ou autre régime ; les calculs ne sont pas interchangeables.</li>
      <li><strong>Simuler le CMG emploi direct :</strong> uniquement pour le contrat éligible et avec les ressources de votre foyer.</li>
      <li><strong>Calculer l’avantage fiscal séparément :</strong> en retirant les aides déjà perçues de la dépense éligible.</li>
      <li><strong>Comparer deux budgets :</strong> le décaissement mensuel immédiat et le coût annuel net après fiscalité.</li>
    </ol>
    <p>Pour construire le reste de votre budget, ouvrez <Link href="/budget">le simulateur de dépenses BabyBudget</Link>. Il donne des repères indicatifs et vous permet de renseigner une aide déjà estimée ; il ne remplace pas la CAF ou l’Urssaf pour le calcul individuel de vos droits.</p>

    <h2>8. Crèche ou assistante maternelle : les questions fréquentes</h2>
    <h3>La crèche municipale est-elle toujours moins chère ?</h3>
    <p>Non. La participation PSU dépend des ressources et des heures. Selon les aides CMG, le salaire négocié et les conditions du contrat, l’assistante maternelle peut être compétitive. Comparez à partir de vos données, jamais d’un prix moyen non contextualisé.</p>
    <h3>Une crèche privée applique-t-elle toujours le barème CAF ?</h3>
    <p>Non. Le statut privé ne dit pas à lui seul si la structure relève de la PSU. Demandez explicitement le régime de financement, le contrat, les frais et les aides éventuellement mobilisables.</p>
    <h3>Peut-on cumuler CMG et crédit d’impôt ?</h3>
    <p>Oui, lorsque les conditions sont réunies, mais les sommes de CMG doivent être retirées des dépenses présentées pour le crédit d’impôt. On ne bénéficie pas deux fois d’un avantage sur la même dépense.</p>
    <h3>Quelle année de revenus sert à calculer la crèche ?</h3>
    <p>La structure applique les ressources retenues par la CAF, généralement basées sur l’année de référence N−2 avec les règles d’actualisation pertinentes. Pour une tarification 2026, faites vérifier les ressources 2024 retenues dans votre dossier.</p>
    <h3>Quel est le mode de garde à privilégier ?</h3>
    <p>Choisissez d’abord une solution sûre, disponible et compatible avec les besoins de votre enfant et vos horaires. Puis mesurez le reste à charge. Le critère financier est important, mais ne doit pas masquer la fiabilité de la garde et les conséquences professionnelles des fermetures ou des trajets.</p>

    <div className="bb-blog-highlight bb-blog-highlight-green">
      <strong>Continuer à préparer votre budget</strong>
      <p>Consultez notre <Link href="/blog/conge-parental-ou-reprise-travail-2026">comparatif congé parental ou reprise du travail</Link> pour mesurer l’effet du coût de garde sur le revenu disponible, puis notre <Link href="/blog/aides-caf-bebe-2026">guide des aides CAF 2026</Link> pour vérifier les aides possibles sans les présumer acquises.</p>
    </div>
  </BlogArticleFrame>;
}
