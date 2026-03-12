import { FileText } from 'lucide-react';
import { LegalLayout } from './LegalLayout';

export const Terms = () => (
    <LegalLayout
        title="Conditions Générales d'Utilisation"
        subtitle="En utilisant Verdikt, vous acceptez les présentes conditions. Prenez le temps de les lire attentivement."
        lastUpdated="Mars 2026"
        icon={<FileText className="w-6 h-6" />}
    >
        <h2>1. Acceptation</h2>
        <p>En accédant à verdikt.dev, vous acceptez les présentes Conditions Générales d'Utilisation (CGU). Si vous ne les acceptez pas, veuillez ne pas utiliser le service.</p>

        <h2>2. Description du service</h2>
        <p>Verdikt est une plateforme SaaS de prise de décision collaborative permettant de structurer des votes, recueillir des arguments et obtenir des synthèses IA.</p>

        <h2>3. Accès au service</h2>
        <p>Le service est accessible depuis tout navigateur connecté à Internet. Un compte utilisateur est requis pour accéder aux fonctionnalités de l'application.</p>

        <h2>4. Données personnelles</h2>
        <p>Verdikt collecte uniquement les données nécessaires au fonctionnement du service. Consultez notre <a href="/privacy">Politique de confidentialité</a> pour plus d'informations.</p>

        <h2>5. Comptes utilisateurs</h2>
        <p>Vous êtes responsable de la confidentialité de vos identifiants de connexion. Toute activité réalisée depuis votre compte vous est attribuable.</p>

        <h2>6. Utilisation acceptable</h2>
        <p>Vous vous engagez à ne pas utiliser Verdikt pour des activités illégales, diffamatoires, ou portant atteinte aux droits de tiers.</p>

        <h2>7. Propriété intellectuelle</h2>
        <p>Verdikt et ses contenus sont la propriété de M&amp;A Labs LLC. Vous conservez la propriété des données que vous saisissez dans l'application.</p>

        <h2>8. Disponibilité du service</h2>
        <p>Verdikt s'efforce de maintenir le service disponible en continu mais ne garantit pas une disponibilité à 100 %. Des interruptions de maintenance peuvent survenir.</p>

        <h2>9. Modifications du service</h2>
        <p>Verdikt se réserve le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment.</p>

        <h2>10. Limitation de responsabilité</h2>
        <p>Dans les limites permises par la loi applicable, M&amp;A Labs LLC ne saurait être tenu responsable des dommages indirects résultant de l'utilisation du service.</p>

        <h2>11. Modification des CGU</h2>
        <p>Ces CGU peuvent être mises à jour. Les utilisateurs seront notifiés par email ou via l'interface en cas de modification substantielle.</p>

        <h2>12. Droit applicable</h2>
        <p>Les présentes CGU sont régies par le droit français. Tout litige relève de la compétence des tribunaux compétents du ressort du domicile du défendeur.</p>

        <h2>13. RGPD</h2>
        <p>Verdikt est conforme au Règlement Général sur la Protection des Données (RGPD). Vous disposez d'un droit d'accès, de rectification, de suppression, de portabilité et d'opposition sur vos données. Pour exercer ces droits, contactez <a href="mailto:contact@verdikt.dev">contact@verdikt.dev</a>. Consultez notre page <a href="/rgpd">RGPD</a> pour plus de détails.</p>

        <h2>Contact</h2>
        <p><a href="mailto:contact@verdikt.dev">contact@verdikt.dev</a></p>
    </LegalLayout>
);
