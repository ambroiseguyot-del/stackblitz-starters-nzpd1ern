import './globals.css';
import Navbar from '../components/Navbar'; // On importe ton composant Navbar

export const metadata = {
  title: 'BabyBudget',
  description: 'Gérez le budget de votre bébé',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {/* On place la Navbar ici pour qu'elle soit visible sur TOUTES les pages */}
        <Navbar /> 
        
        {/* Le contenu de chaque page s'affichera ici */}
        {children}
      </body>
    </html>
  );
}