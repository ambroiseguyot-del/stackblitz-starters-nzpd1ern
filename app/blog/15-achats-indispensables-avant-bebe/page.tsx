import Link from 'next/link';
import BlogArticleFrame from '../../../components/BlogArticleFrame';

const sources = [
  { organization: 'Assurance Maladie', title: 'Comment bien coucher un bébé ? Recommandations de couchage sûr', url: 'https://www.ameli.fr/assure/sante/bons-gestes/bebe/coucher-bebe' },
  { organization: 'Assurance Maladie', title: 'Comment donner le bain à un bébé ?', url: 'https://www.ameli.fr/assure/sante/bons-gestes/bebe/donner-bain-bebe' },
  { organization: 'Assurance Maladie', title: 'La santé de bébé du retour à domicile au sixième mois', url: 'https://www.ameli.fr/assure/sante/enfants/bebe-sante' },
  { organization: 'DGCCRF', title: 'Articles de puériculture : les clés pour choisir des produits sûrs, 2026', url: 'https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/articles-de-puericulture-les-cles-pour-choisir-des-produits-surs' },
  { organization: 'Service-Public', title: 'Siège auto et ceinture : règles de transport des enfants, novembre 2026', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F628' },
  { organization: 'Sécurité routière', title: 'Module officiel : choisir et installer un siège auto adapté', url: 'https://modules.securite-routiere.gouv.fr/module_siege_auto.html' },
  { organization: 'Ameli', title: 'Bien préparer un biberon et éviter les brûlures', url: 'https://www.ameli.fr/assure/sante/bons-gestes/bebe/preparer-biberon' },
  { organization: 'DGCCRF', title: 'Vérifier les rappels de produits de puériculture sur RappelConso', url: 'https://rappel.conso.gouv.fr/' },
];

const essentialItems = [
  { title: '1. Un lit adapté et stable', detail: 'Un berceau ou un lit à barreaux conforme, monté selon la notice, suffit. Vérifiez l’état du sommier, des fixations et l’absence de pièces manquantes. Pour un lit d’occasion, contrôlez les normes, dimensions et éventuels rappels. Un canapé, une nacelle non conçue pour le sommeil ou un siège-auto ne remplacent pas un véritable couchage sûr.' },
  { title: '2. Un matelas ferme, parfaitement ajusté', detail: 'Le matelas doit être adapté aux dimensions du lit, ferme et sans espace susceptible de coincer l’enfant. Un drap-housse bien tendu suffit pour le recouvrir. Un surmatelas moelleux, un réducteur de lit ou un coussin de positionnement n’apportent aucun bénéfice justifiant les risques supplémentaires.' },
  { title: '3. Une ou deux gigoteuses à la bonne taille', detail: 'Prévoyez une gigoteuse adaptée à la taille de votre bébé et à la température de la chambre, plus éventuellement une seconde pour les lessives. Pendant le sommeil, évitez oreillers, couettes, couvertures, tours de lit et peluches dans le lit. Les recommandations Ameli privilégient le couchage sur le dos sur un matelas ferme.' },
  { title: '4. Des bodies faciles à ouvrir', detail: 'Quelques bodies adaptés à la saison et à la taille de naissance sont plus utiles qu’une grande collection de tenues compliquées. Les ouvertures croisées facilitent parfois les changes. Constituez un petit stock, puis ajustez après avoir constaté la taille réelle du bébé et le rythme des lessives.' },
  { title: '5. Des pyjamas et une tenue de sortie', detail: 'Les pyjamas pratiques font partie des vêtements les plus portés. Prévoyez de quoi assurer une rotation raisonnable après les régurgitations et les changes, mais reportez l’achat de nombreuses tailles futures. Une tenue adaptée à la saison pour les sorties suffit au départ.' },
  { title: '6. Des couches et un kit de change', detail: 'Achetez un petit stock de couches de la taille annoncée, des lingettes ou des carrés de coton selon vos préférences, un produit nettoyant adapté et une surface de change stable. Les tailles évoluent rapidement. Une table à langer coûteuse n’est pas indispensable si une installation sûre et facile à surveiller existe déjà.' },
  { title: '7. Une baignoire ou une solution de bain sécurisée', detail: 'Choisissez une solution permettant de soutenir le bébé sans risque de glissade et de rester toujours à portée de main. Un thermomètre de bain est utile : Ameli recommande une eau à 37 °C maximum. Ne laissez jamais un nourrisson seul dans l’eau, même quelques secondes et même avec un support.' },
  { title: '8. Deux ou trois serviettes et des langes', detail: 'Les serviettes douces, les langes lavables et les petits textiles absorbants ont de multiples usages : toilette, protection d’épaule, petits accidents du quotidien. Inutile d’en acheter des dizaines. Privilégiez des tissus faciles à laver et n’utilisez pas un lange comme couverture libre dans le lit.' },
  { title: '9. Un moyen de nourrir bébé adapté à votre choix', detail: 'En cas d’allaitement, des vêtements pratiques et quelques accessoires utiles peuvent suffire ; un tire-lait n’est pas un achat automatique. Avec un lait infantile, prévoyez les biberons adaptés, le matériel de nettoyage et l’alimentation conseillée. Le lait maternel ou les préparations infantiles répondent à des règles d’hygiène précises : suivez les conseils officiels et médicaux.' },
  { title: '10. Un thermomètre corporel fiable', detail: 'C’est un petit achat utile pour évaluer une éventuelle fièvre et communiquer une mesure au professionnel de santé. Choisissez un thermomètre adapté à l’âge et utilisez-le selon la notice. N’accumulez pas les appareils connectés prétendant diagnostiquer automatiquement des maladies.' },
  { title: '11. Un siège-auto homologué si vous prenez la voiture', detail: 'Choisissez un dispositif homologué, compatible avec la taille de l’enfant et avec votre véhicule, installé selon les instructions. La norme R129 classe les sièges par taille. Le dos à la route reste la référence de sécurité pour un petit bébé ; n’installez jamais une coque dos à la route devant un airbag actif. Si aucun déplacement automobile n’est prévu, cet achat peut attendre.' },
  { title: '12. Une poussette ou un porte-bébé adapté à vos trajets', detail: 'Ce n’est pas nécessairement les deux. Si vous vivez en ville, vérifiez l’encombrement dans l’ascenseur, le poids, les freins et le pliage. Pour le portage, contrôlez la notice, la position respiratoire et l’âge admis. Un produit bien adapté à vos habitudes vaut mieux qu’un équipement « tout-en-un » très coûteux mais rarement utilisé.' },
  { title: '13. Un espace d’éveil au sol', detail: 'Un tapis ferme et propre posé au sol, dans un environnement surveillé, permet de laisser le bébé bouger librement durant l’éveil. Les jouets simples et adaptés à son âge peuvent être introduits progressivement. Il n’est pas nécessaire d’acheter immédiatement une arche électronique ou plusieurs grands centres d’activité.' },
  { title: '14. Une petite trousse d’hygiène', detail: 'Elle peut comprendre du sérum physiologique, des compresses ou du coton adapté et un nécessaire simple pour les ongles selon l’âge. Demandez conseil à la sage-femme ou au pédiatre pour les produits à utiliser, leurs indications et les gestes appropriés. Une armoire complète de produits cosmétiques n’est pas nécessaire.' },
  { title: '15. Un sac de sortie fonctionnel', detail: 'Un sac déjà disponible, pouvant contenir quelques couches, une tenue, un lange et le nécessaire d’alimentation, remplit la fonction d’un sac à langer spécialisé. Une petite pochette étanche peut suffire pour le change. L’important est de disposer rapidement du matériel utile lors des trajets.' },
];

export default function AchatsIndispensablesAvantBebe() {
  return <BlogArticleFrame
    category="Équipement & économies"
    title="Les 15 achats indispensables avant l’arrivée de bébé (et ceux à éviter)"
    introduction="Une checklist réaliste pour préparer la naissance sans suracheter : les équipements vraiment utiles, les accessoires facultatifs et les précautions de sécurité."
    updated="20 novembre 2026"
    readTime="12 min"
    sources={sources}
  >
    <div className="bb-blog-highlight">
      <strong>La règle qui fait économiser</strong>
      <p>On peut accueillir un bébé sans acheter quinze équipements chers. La liste ci-dessous regroupe <strong>quinze besoins pratiques</strong>, dont plusieurs se satisfont avec des objets déjà possédés ou empruntés. Certains articles — siège-auto, biberons ou poussette — sont <strong>conditionnels à votre mode de vie</strong>. Pour le couchage et le transport, la sécurité passe avant les économies.</p>
    </div>

    <h2>1. Avant d’acheter : distinguez trois catégories</h2>
    <p>Les magasins de puériculture présentent souvent l’équipement comme un ensemble indissociable. En pratique, une famille doit d’abord assurer le sommeil, l’alimentation, l’hygiène, l’habillement et le déplacement éventuel de l’enfant. L’important est de disposer d’une solution sûre pour chaque besoin, pas d’acheter toutes les déclinaisons d’un produit.</p>
    <p>Classez les objets en <strong>essentiels dès la naissance</strong>, <strong>utiles plus tard</strong> et <strong>facultatifs</strong>. Avant de choisir, faites l’inventaire de ce qui a été offert, prêté ou récupéré. Comparez le coût complet : prix, consommables, entretien, durée d’usage et revente éventuelle.</p>
    <div className="bb-blog-table-wrap">
      <table>
        <caption>Grille de décision avant la naissance, sans prix marchand inventé</caption>
        <thead><tr><th>Décision</th><th>Exemples</th><th>Quand décider ?</th></tr></thead>
        <tbody>
          <tr><td>Priorité immédiate</td><td>Couchage sûr, vêtements, change, alimentation</td><td>Avant le retour à domicile</td></tr>
          <tr><td>Selon le mode de vie</td><td>Siège-auto, poussette, portage, biberons</td><td>Selon trajets et alimentation choisis</td></tr>
          <tr><td>Après observation</td><td>Chaise haute, grand parc, nombreux jouets, robot de cuisine</td><td>Quand le besoin apparaît</td></tr>
        </tbody>
      </table>
    </div>

    <h2>2. Les 15 achats ou solutions à prévoir</h2>
    <p>Ces éléments sont décrits par leur <strong>fonction</strong>, sans imposer de marque, de nombre de pièces universel ou de prix prétendument moyen. Les besoins peuvent varier selon le logement, la saison, l’allaitement et les habitudes de transport.</p>
    {essentialItems.map(item => <section key={item.title}>
      <h3>{item.title}</h3>
      <p>{item.detail}</p>
    </section>)}
    <p>Pour les règles de sommeil, consultez directement <a href="https://www.ameli.fr/assure/sante/bons-gestes/bebe/coucher-bebe" rel="noopener noreferrer" target="_blank">les consignes de couchage Ameli</a>. Pour le transport automobile, reportez-vous à <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F628" rel="noopener noreferrer" target="_blank">Service-Public (mise à jour novembre 2026)</a>. Les accessoires de bain et autres articles de puériculture doivent toujours être utilisés dans leurs limites prévues par le fabricant.</p>

    <h2>3. Les achats souvent inutiles ou à reporter</h2>
    <h3>Le tour de lit, le cale-bébé et les coussins de positionnement</h3>
    <p>Il ne s’agit pas seulement d’accessoires facultatifs. <strong>Ils sont déconseillés dans le couchage du nourrisson</strong> car ils peuvent gêner la respiration ou favoriser l’enfouissement. Écartez-les de la liste de naissance et gardez le lit dégagé.</p>
    <h3>Un grand stock de vêtements taille naissance</h3>
    <p>Vous ne connaissez pas toujours la taille exacte ni la vitesse de croissance de l’enfant. Quelques tenues fonctionnelles, puis des achats ciblés après la naissance, évitent les vêtements jamais portés. Profitez des dons et des échanges, tout en vérifiant l’état des fermetures et la présence éventuelle de petits éléments détachables.</p>
    <h3>Un chauffe-biberon, un stérilisateur et un robot multifonction systématiques</h3>
    <p>Ils peuvent être pratiques dans certains foyers, mais ne sont pas automatiquement nécessaires. Selon Ameli, un biberon peut être proposé à température ambiante lorsque cela convient ; il faut respecter les règles de préparation et ne pas utiliser le micro-ondes pour réchauffer le lait. Lavez soigneusement le matériel. Pour la diversification, des ustensiles domestiques peuvent parfois suffire.</p>
    <h3>Des chaussures pour un nouveau-né</h3>
    <p>Un bébé qui ne marche pas n’a pas besoin de chaussures destinées à la marche. Des chaussettes ou chaussons souples adaptés à la saison peuvent suffire pour le confort. Reportez cet achat et choisissez plus tard selon le développement de votre enfant.</p>
    <h3>De nombreux jouets électroniques et une chambre très équipée</h3>
    <p>Parler, chanter, montrer un livre et proposer du mouvement libre sont déjà des activités d’éveil. L’accumulation de jouets lumineux n’est pas une condition du développement. Une commode familiale stable, une petite bibliothèque existante ou un panier peuvent remplacer des meubles spécialisés.</p>
    <h3>Le babyphone haut de gamme « indispensable »</h3>
    <p>Son utilité dépend surtout de la configuration du logement et de la distance entre les pièces. Dans un petit appartement, il peut être inutile. Évitez d'interpréter les fonctionnalités de surveillance connectée comme un substitut aux consignes de sommeil et de surveillance humaine.</p>

    <h2>4. Neuf, occasion ou prêt : où économiser sans prendre de risque ?</h2>
    <p>Pour les vêtements, les langes, les livres et de nombreux accessoires lavables, l’occasion peut être économiquement pertinente. Pour les équipements de sécurité, le raisonnement change. La <a href="https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/articles-de-puericulture-les-cles-pour-choisir-des-produits-surs" rel="noopener noreferrer" target="_blank">DGCCRF recommande de vérifier les notices, la solidité, les systèmes de verrouillage, les marquages et l’état des produits de puériculture</a>.</p>
    <p>Un siège-auto d’occasion dont l’historique est incertain peut avoir subi un choc non visible. Avant une réutilisation, il faut connaître son origine, son état et ses conditions d’installation. Une poussette d’occasion exige la même attention aux freins, roues, harnais et verrouillages. Pour un matelas, inspectez fermeté, propreté, ajustement et absence de déformation.</p>
    <p>Vérifiez aussi les références des équipements dans <a href="https://rappel.conso.gouv.fr/" rel="noopener noreferrer" target="_blank">RappelConso</a>. L’absence de rappel ne dispense pas de contrôler l’état et la conformité de l’objet. Un achat neuf n’est pas non plus une garantie absolue : lisez les avertissements et respectez les limites d’utilisation.</p>

    <h2>5. Comment fixer son budget sans prétendre connaître les prix de toutes les familles ?</h2>
    <p>Un prix dépend de la marque, de la taille, des fonctionnalités, de la région et du marché de l’occasion. Plutôt que de présenter un panier national fictif comme « le coût réel », utilisez une <strong>enveloppe par besoin</strong> et comparez trois offres réellement accessibles au moment de l’achat.</p>
    <div className="bb-blog-table-wrap">
      <table>
        <caption>Exemple de répartition d’un budget d’équipement de 900 € — hypothèse pédagogique, non prix constatés</caption>
        <thead><tr><th>Enveloppe</th><th>Montant fictif</th><th>Décision à documenter</th></tr></thead>
        <tbody>
          <tr><td>Couchage et textiles</td><td>240 €</td><td>Lit/matelas, linge et gigoteuses</td></tr>
          <tr><td>Transport et déplacements</td><td>390 €</td><td>Selon voiture, poussette ou portage</td></tr>
          <tr><td>Change, bain et hygiène</td><td>130 €</td><td>Essentiels et consommables initiaux</td></tr>
          <tr><td>Habits et alimentation</td><td>90 €</td><td>Premières tailles, choix d'alimentation</td></tr>
          <tr className="bb-blog-total"><td>Réserve d’ajustement</td><td>50 €</td><td>Dépense non anticipée</td></tr>
          <tr className="bb-blog-total"><td>Total hypothétique</td><td>900 €</td><td>À adapter à votre situation</td></tr>
        </tbody>
      </table>
    </div>
    <p className="bb-blog-caveat">Il ne s’agit pas d’une estimation statistique ni d’un relevé de prix de novembre 2026. Ce tableau montre seulement une méthode de répartition. Si vous n’avez pas de voiture, l’enveloppe transport peut être réaffectée ; si vous empruntez un lit ou une poussette sûrs, elle peut diminuer. Certaines dépenses courantes (couches et lait) continueront ensuite chaque mois.</p>

    <h2>6. Une checklist raisonnable pour les dernières semaines</h2>
    <ol>
      <li><strong>Vérifier l’endroit où dormira bébé :</strong> lit stable, matelas ferme, gigoteuse adaptée, sans objets souples.</li>
      <li><strong>Préparer le retour à domicile :</strong> couchage, couches, quelques vêtements lavés, serviettes, solution de toilette.</li>
      <li><strong>Préparer les déplacements réellement prévus :</strong> siège-auto si trajet automobile, installation vérifiée avant le jour J.</li>
      <li><strong>Organiser l’alimentation :</strong> équipement adapté au projet et conseils de l’équipe médicale, plutôt que matériel acheté par automatisme.</li>
      <li><strong>Conserver la trésorerie :</strong> différer les achats de confort jusqu’à ce qu’un besoin réel apparaisse.</li>
      <li><strong>Garder notices et références :</strong> pour les consignes d’utilisation, les contrôles de sécurité et les éventuels rappels.</li>
    </ol>
    <p>Vous pouvez répartir les dépenses dans <Link href="/signup">votre espace BabyBudget</Link> et garder une catégorie pour l’équipement de naissance, séparée des dépenses qui se répéteront chaque mois. Pour projeter la suite, consultez <Link href="/blog/cout-bebe-premiere-annee">notre guide du coût de la première année</Link>.</p>

    <h2>Questions fréquentes</h2>
    <h3>Faut-il acheter tout le matériel avant l’accouchement ?</h3>
    <p>Non. Anticipez les besoins immédiats et les équipements de sécurité indispensables à vos premiers trajets ; le reste peut souvent être acheté plus tard, après avoir constaté les besoins réels de votre enfant.</p>
    <h3>Un siège-auto d’occasion est-il une bonne économie ?</h3>
    <p>Seulement si vous pouvez vérifier son historique, l’absence de choc, la conformité, la notice et la compatibilité avec votre véhicule. En cas d’incertitude, ne faites pas de compromis sur ce point.</p>
    <h3>Une chambre séparée est-elle nécessaire dès la naissance ?</h3>
    <p>Non. Ameli recommande que le bébé dorme dans la chambre des parents pendant les premiers mois, dans son propre couchage, sans partage du lit parental. L’aménagement d’une chambre complète peut donc attendre.</p>
    <h3>Que mettre sur une liste de naissance ?</h3>
    <p>Privilégiez des produits réellement utiles, des tailles futures avec modération, des articles lavables et des contributions à des achats identifiés. Évitez les accessoires de couchage déconseillés et les équipements dont vous ne connaissez pas encore l’usage.</p>
    <div className="bb-blog-highlight bb-blog-highlight-green">
      <strong>Et après les achats de naissance ?</strong>
      <p>Une fois les premiers équipements réunis, le budget dépend surtout des dépenses régulières et du mode de garde. Comparez <Link href="/blog/creche-ou-assistante-maternelle-2026">crèche et assistante maternelle</Link> avant de décider quel montant mensuel réserver.</p>
    </div>
  </BlogArticleFrame>;
}
