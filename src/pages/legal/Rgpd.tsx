import { Shield } from 'lucide-react';
import { LegalLayout } from './LegalLayout';

export const Rgpd = () => (
    <LegalLayout
        title="Conformité RGPD"
        subtitle="Notre approche de la protection des données personnelles, conforme au Règlement UE 2016/679. Transparence totale sur vos droits."
        lastUpdated="Mars 2026"
        icon={<Shield className="w-6 h-6" />}
    >
        <p>Verdikt prend la protection de vos données personnelles très au sérieux. Cette page détaille notre approche de conformité au Règlement Général sur la Protection des Données (Règlement UE 2016/679).</p>

        <h2>1. Principes appliqués</h2>
        <ul>
            <li><strong>Minimisation</strong> : nous ne collectons que les données strictement nécessaires au service</li>
            <li><strong>Transparence</strong> : vous êtes informé de l'utilisation de vos données</li>
            <li><strong>Sécurité</strong> : vos données sont chiffrées en transit (TLS) et au repos</li>
            <li><strong>Durée limitée</strong> : suppression ou anonymisation dans les 90 jours suivant la clôture du compte</li>
        </ul>

        <h2>2. Vos droits</h2>
        <p>Vous pouvez à tout moment exercer les droits suivants en nous contactant à <a href="mailto:contact@verdikt.dev">contact@verdikt.dev</a> :</p>
        <ul>
            <li><strong>Accès</strong> : obtenir une copie de vos données personnelles</li>
            <li><strong>Rectification</strong> : corriger des données inexactes</li>
            <li><strong>Effacement</strong> : demander la suppression de votre compte et de vos données</li>
            <li><strong>Portabilité</strong> : recevoir vos données dans un format structuré et lisible</li>
            <li><strong>Opposition</strong> : vous opposer à certains traitements</li>
            <li><strong>Limitation</strong> : demander la suspension du traitement</li>
        </ul>
        <p>Nous répondons à toute demande dans un délai maximum de <strong>30 jours</strong>.</p>

        <h2>3. Délégué à la protection des données (DPO)</h2>
        <p>Verdikt ne dispose pas encore d'un DPO formellement désigné. Les demandes relatives aux données sont traitées directement par le responsable de traitement.</p>
        <p>Contact : <a href="mailto:contact@verdikt.dev">contact@verdikt.dev</a></p>

        <h2>4. Sous-traitants</h2>
        <p>Nous travaillons uniquement avec des sous-traitants présentant des garanties suffisantes en matière de protection des données :</p>
        <ul>
            <li><strong>Supabase</strong> — stockage des données, authentification — conforme RGPD — <a href="https://supabase.com/dpa" target="_blank" rel="noopener noreferrer">DPA disponible</a></li>
            <li><strong>Vercel</strong> — hébergement frontend — conforme RGPD — <a href="https://vercel.com/legal/dpa" target="_blank" rel="noopener noreferrer">DPA disponible</a></li>
            <li><strong>Anthropic</strong> — traitement IA des synthèses décisionnelles — données non utilisées pour l'entraînement</li>
        </ul>

        <h2>5. Transferts hors UE</h2>
        <p>Certains de nos sous-traitants sont basés aux États-Unis. Ces transferts sont encadrés par les Clauses Contractuelles Types (CCT) approuvées par la Commission européenne, conformément à l'article 46 du RGPD.</p>

        <h2>6. Sécurité</h2>
        <ul>
            <li>Chiffrement TLS sur toutes les communications</li>
            <li>Chiffrement des données au repos (AES-256)</li>
            <li>Authentification sécurisée via Supabase Auth</li>
            <li>Accès aux données limité aux personnes habilitées (principe du moindre privilège)</li>
        </ul>

        <h2>7. Violation de données</h2>
        <p>En cas de violation de données personnelles susceptible d'engendrer un risque pour vos droits, nous nous engageons à notifier la CNIL dans les 72 heures et à vous en informer sans délai.</p>

        <h2>8. Réclamation</h2>
        <p>Vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente :</p>
        <ul>
            <li><strong>CNIL</strong> (France) : <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">cnil.fr/fr/plaintes</a></li>
        </ul>
    </LegalLayout>
);
