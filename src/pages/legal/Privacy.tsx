import { Lock } from 'lucide-react';
import { LegalLayout } from './LegalLayout';

export const Privacy = () => (
    <LegalLayout
        title="Politique de confidentialité"
        subtitle="Nous traitons vos données avec soin. Cette page détaille quelles données nous collectons, pourquoi, et comment vous pouvez les contrôler."
        lastUpdated="Mars 2026"
        icon={<Lock className="w-6 h-6" />}
    >
        <h2>1. Responsable du traitement</h2>
        <p>M&amp;A Labs LLC, 312 W 2nd St, Unit #A9362, Casper, WY 82601, USA — <a href="mailto:contact@verdikt.dev">contact@verdikt.dev</a></p>

        <h2>2. Données collectées</h2>
        <p>Lors de l'utilisation de Verdikt, les données suivantes peuvent être collectées :</p>
        <ul>
            <li>Informations de compte : email, nom, prénom</li>
            <li>Données d'utilisation : décisions créées, votes, arguments, commentaires</li>
            <li>Données techniques : adresse IP, type de navigateur, logs d'accès</li>
        </ul>

        <h2>3. Finalités du traitement</h2>
        <ul>
            <li>Fourniture et amélioration du service Verdikt</li>
            <li>Génération de synthèses IA à partir de vos décisions</li>
            <li>Communication liée au compte (notifications, invitations)</li>
            <li>Lutte contre la fraude et sécurité du service</li>
        </ul>

        <h2>4. Base légale</h2>
        <p>Les traitements reposent sur l'exécution contractuelle (art. 6.1.b RGPD) et, le cas échéant, votre consentement explicite ou notre intérêt légitime.</p>

        <h2>5. Durée de conservation</h2>
        <p>Vos données sont conservées pendant toute la durée de votre abonnement actif, puis supprimées ou anonymisées dans un délai de 90 jours suivant la clôture du compte.</p>

        <h2>6. Sous-traitants et transferts</h2>
        <p>Verdikt fait appel à des sous-traitants pour opérer le service :</p>
        <ul>
            <li><strong>Supabase</strong> (base de données &amp; authentification) — <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a> — <a href="https://supabase.com/dpa" target="_blank" rel="noopener noreferrer">DPA</a></li>
            <li><strong>Vercel</strong> (hébergement) — <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a> — <a href="https://vercel.com/legal/dpa" target="_blank" rel="noopener noreferrer">DPA</a></li>
            <li><strong>Anthropic</strong> (synthèses IA) — <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a></li>
        </ul>
        <p>Certains transferts ont lieu hors de l'UE (États-Unis), encadrés par les Clauses Contractuelles Types (CCT) de la Commission européenne.</p>

        <h2>7. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition au traitement</li>
            <li>Droit de limitation du traitement</li>
        </ul>
        <p>Pour exercer ces droits : <a href="mailto:contact@verdikt.dev">contact@verdikt.dev</a></p>
        <p>Vous pouvez également introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a></p>

        <h2>8. Cookies</h2>
        <p>Verdikt utilise uniquement des cookies strictement nécessaires au fonctionnement du service (session d'authentification, préférences de langue). Aucun cookie publicitaire n'est déposé.</p>

        <h2>9. Contact</h2>
        <p><a href="mailto:contact@verdikt.dev">contact@verdikt.dev</a></p>
    </LegalLayout>
);
