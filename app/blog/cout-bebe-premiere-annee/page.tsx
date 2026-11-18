import Link from 'next/link';
import BlogArticleFrame from '../../../components/BlogArticleFrame';

const sources = [
  { organization: 'Insee', title: 'Enquête Budget de famille : objectif et champ statistique', url: 'https://www.insee.fr/fr/information/7652980' },
  { organization: 'Insee', title: 'Lancement de l’enquête Budget de famille 2026', url: 'https://www.insee.fr/fr/information/8719834' },
  { organization: 'CAF', title: 'Aides et démarches concernant la petite enfance', url: 'https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance' },
  { organization: 'Urssaf', title: 'Calculateur du reste à charge pour le CMG emploi direct', url: 'https://www.urssaf.fr/accueil/outils-documentation/simulateurs/calculer-reste-a-charge-cmg-pe.html' },
  { organization: 'Service-Public', title: 'Devenir parent : démarches et aides financières', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F16225' },
];

const sample = [
  { name: 'Couches et change', perMonth: 45, description: 'Achats de produits de change' },
  { name: 'Alimentation', perMonth: 70, description: 'Lait, diversification ou besoins spécifiques' },
  { name: 'Vêtements', perMonth: 30, description: 'Renouvellement des tailles' },
  { name: 'Santé et hygiène', perMonth: 25, description: 'Produits non remboursés et soins du quotidien' },
  { name: 'Équipement', perMonth: 55, description: 'Provision pour les achats ponctuels' },
  { name: 'Éveil et sorties', perMonth: 20, description: 'Livres, jouets et activités' },
];
const total = sample.reduce((sum, row) => sum + row.perMonth, 0);

export default function CoutBebePremiereAnnee() {
  return <BlogArticleFrame
    category="Budget & dépenses"
    title="Combien coûte un bébé la première année ? Construire un budget réaliste"
    introduction="Couches, alimentation, équipement, frais de garde : découvrez comment estimer le coût de la première année sans confondre exemples de budget et moyennes statistiques officielles."
    updated="18 novembre 2026"
    readTime="8 min"
    sources={sources}
  >
    <div className="bb-blog-highlight">
      <strong>Ce qu’il faut savoir avant de chiffrer</strong>
      <p>Il n’existe pas un montant mensuel unique représentant le coût de tous les bébés. Les dépenses dépendent notamment du mode de garde, des achats neufs ou d’occasion, de l’alimentation, du logement et des aides perçues. Nous présentons ici une <strong>méthode de calcul</strong> et un <strong>exemple entièrement illustratif</strong>, pas une « moyenne nationale » officielle.</p>
    </div>

    <h2>1. Distinguer les dépenses de démarrage et le budget mensuel</h2>
    <p>Une grande partie des achats survient avant la naissance ou pendant les premiers mois : couchage, poussette, siège-auto, vêtements et petit matériel. Ces achats ne se répètent pas tous les mois. Les additionner à un budget récurrent sans les distinguer peut donner une vision erronée du coût de la première année.</p>
    <p>Commencez donc par deux enveloppes : <strong>l’équipement initial</strong> d’une part, et <strong>les dépenses mensuelles</strong> d’autre part. Ajoutez une réserve pour les dépenses imprévues. Les frais de garde méritent une enveloppe séparée, car ils varient fortement selon la situation.</p>
    <h3>Avant la naissance : inventorier avant d’acheter</h3>
    <p>Classez les achats en trois groupes : indispensables dès le départ, utiles plus tard et facultatifs. Pour chaque équipement, comparez le neuf, l’occasion et la possibilité d’emprunter. Pour les équipements de sécurité, notamment le siège-auto, vérifiez systématiquement l’état, l’historique et la conformité.</p>

    <h2>2. Exemple de budget mensuel détaillé</h2>
    <p>Voici une simulation librement construite pour expliquer la méthode. <strong>Ces montants ne proviennent pas d’une enquête représentative ni d’un barème de prix.</strong> Ils servent uniquement à montrer comment répartir ses propres dépenses.</p>
    <div className="bb-blog-table-wrap">
      <table>
        <caption>Exemple fictif d’un budget mensuel, hors mode de garde</caption>
        <thead><tr><th>Poste</th><th>Hypothèse mensuelle</th><th>Ce que l’enveloppe recouvre</th></tr></thead>
        <tbody>
          {sample.map(row => (
            <tr key={row.name}>
              <td>{row.name}</td><td>{row.perMonth} €</td><td>{row.description}</td>
            </tr>
          ))}
          <tr className="bb-blog-total"><td>Total de l’exemple</td><td>{total} €/mois</td><td>Hors frais de garde et aides sociales</td></tr>
        </tbody>
      </table>
    </div>
    <p>Dans cet exemple, les 55 € d’équipement sont une <em>provision</em> pour les achats ponctuels : ce n’est pas nécessairement un achat de 55 € chaque mois. Sur douze mois, <strong>{total} € × 12 = {total * 12} €</strong>, à condition de supposer, à des fins de simulation, les mêmes dépenses tous les mois.</p>
    <p className="bb-blog-caveat">Exemple fictif et non prévision individualisée. Le coût réel peut être inférieur ou supérieur. Le budget de garde, les dépenses exceptionnelles, les aides et la fiscalité ne sont pas intégrés.</p>

    <h2>3. Le mode de garde peut transformer le budget familial</h2>
    <p>Crèche, assistante maternelle, garde à domicile ou organisation familiale : le coût dépend du nombre d’heures, de la commune, du revenu du foyer, du contrat de garde et des aides éventuelles.</p>
    <p>Pour comparer les solutions, ne retenez pas seulement un tarif horaire. Prenez en compte les heures réellement facturées, les repas, les indemnités, les congés, les frais de transport et, le cas échéant, les cotisations et obligations d’employeur.</p>
    <p>Pour l’emploi direct, le calcul du <strong>CMG a changé depuis septembre 2025</strong>. Le <a href="https://www.urssaf.fr/accueil/outils-documentation/simulateurs/calculer-reste-a-charge-cmg-pe.html" target="_blank" rel="noopener noreferrer">simulateur officiel de l’Urssaf</a> est la bonne référence pour estimer le reste à charge avant fiscalité.</p>
    <p>Une fois votre reste à charge estimé, vous pouvez l’ajouter à <Link href="/budget">votre simulation Baby Budget</Link>. Notre outil ne détermine pas automatiquement vos droits : il vous permet de travailler avec les montants que vous avez vérifiés.</p>

    <h2>4. Les dépenses changent avec l’âge</h2>
    <h3>Les premiers mois : l’installation</h3>
    <p>Le budget peut être marqué par les achats initiaux et l’organisation du quotidien. L’alimentation dépend du choix et des possibilités d’allaitement ou de lait infantile. Inutile d’acheter toutes les tailles de vêtements dès le départ.</p>
    <h3>Vers la diversification alimentaire</h3>
    <p>L’évolution de l’alimentation peut modifier la répartition entre lait, courses alimentaires et petit matériel. Le montant réel dépendra des habitudes du foyer et des besoins de l’enfant, et non d’une progression automatique.</p>
    <h3>À l’arrivée d’un mode de garde</h3>
    <p>Le passage en crèche ou auprès d’une assistante maternelle peut avoir un effet beaucoup plus important sur le budget que les petits achats du quotidien. Prévoyez une transition avec plusieurs scénarios plutôt qu’un seul chiffre.</p>

    <h2>5. Préparer la trésorerie familiale sur douze mois</h2>
    <p>Un budget annuel doit tenir compte du <strong>moment où l’argent sort réellement</strong>. Une dépense d’équipement réglée en janvier n’équivaut pas à douze petites dépenses réparties dans l’année. Pour conserver une épargne de sécurité, identifiez les mois de dépenses élevées.</p>
    <ol>
      <li><strong>Répertoriez les frais déjà connus :</strong> achats d’équipement, mensualités de garde, abonnements, assurances éventuelles.</li>
      <li><strong>Définissez des enveloppes flexibles :</strong> couches, alimentation, habillement, santé et loisirs.</li>
      <li><strong>Ajoutez les aides confirmées :</strong> sans les supposer acquises avant notification. Consultez notre <Link href="/blog/aides-caf-bebe-2026">guide des aides CAF 2026</Link>.</li>
      <li><strong>Prévoyez un scénario plus coûteux :</strong> garde plus importante, équipement non anticipé ou diminution des revenus.</li>
      <li><strong>Actualisez le suivi :</strong> comparez les dépenses réellement engagées aux hypothèses, mois après mois.</li>
    </ol>
    <div className="bb-blog-highlight bb-blog-highlight-green">
      <strong>Une méthode simple avec Baby Budget</strong>
      <p>Ajoutez vos dépenses par enfant, renseignez les échéances régulières et consultez vos <Link href="/signup">analyses personnalisées</Link> une fois connecté. Les prévisions sont des estimations construites sur votre historique : elles doivent être ajustées pour les changements futurs que le logiciel ne connaît pas encore.</p>
    </div>

    <h2>6. Peut-on parler d’un « coût moyen d’un bébé » ?</h2>
    <p>L’Insee étudie les dépenses des ménages à travers l’<a href="https://www.insee.fr/fr/information/7652980" rel="noopener noreferrer" target="_blank">enquête Budget de famille</a>. Cette enquête aide à comprendre la structure de la consommation des foyers. Elle ne fournit pas, à elle seule, une facture universelle qu’il suffirait d’appliquer à chaque enfant.</p>
    <p>Attribuer une part des dépenses du logement, des transports ou de l’alimentation commune à un bébé nécessite des conventions méthodologiques. C’est pourquoi les comparaisons entre articles internet sont parfois très différentes, même lorsqu’elles paraissent présenter des chiffres « officiels ».</p>
    <p>Pour décider combien épargner ou dépenser, votre <strong>budget propre</strong> est généralement plus pertinent qu’une moyenne isolée du contexte.</p>

    <h2>Questions fréquentes</h2>
    <h3>Combien prévoir avant la naissance ?</h3>
    <p>Faites la liste des équipements nécessaires et des achats déjà disponibles, puis demandez des devis ou comparez des prix réellement proposés. Prévoir une enveloppe par objet est plus fiable qu’un total unique trouvé dans un article.</p>
    <h3>Les aides CAF réduisent-elles automatiquement le budget ?</h3>
    <p>Non. Elles dépendent de conditions individuelles. Pour éviter de surestimer le revenu disponible, partez de zéro pour les aides non confirmées et utilisez les simulateurs des organismes compétents.</p>
    <h3>Comment anticiper les mois de dépenses élevées ?</h3>
    <p>Enregistrez les dépenses régulières, puis ajoutez séparément les achats exceptionnels à leur date probable. Vérifiez que votre budget et votre épargne restent suffisants même dans un scénario moins favorable.</p>
  </BlogArticleFrame>;
}
