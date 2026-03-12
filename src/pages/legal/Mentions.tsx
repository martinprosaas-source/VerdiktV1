import { Scale } from 'lucide-react';
import { LegalLayout } from './LegalLayout';

export const Mentions = () => (
    <LegalLayout
        title="Mentions légales"
        subtitle="Informations légales relatives à l'éditeur, à l'hébergeur et à la propriété intellectuelle du service verdikt.dev."
        lastUpdated="Mars 2026"
        icon={<Scale className="w-6 h-6" />}
    >
        <p><strong>Éditeur :</strong> M&amp;A Labs LLC, société enregistrée dans l'État du Wyoming, États-Unis</p>
        <p><strong>Adresse :</strong> 312 W 2nd St, Unit #A9362, Casper, WY 82601, USA</p>
        <p><strong>Contact :</strong> <a href="mailto:contact@verdikt.dev">contact@verdikt.dev</a></p>
        <p><strong>Directeur de la publication :</strong> Martin Chevalier</p>
        <p><strong>Hébergement :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA — <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></p>

        <h2>Propriété intellectuelle</h2>
        <p>L'ensemble du contenu de verdikt.dev (textes, logos, design, code) est la propriété exclusive de M&amp;A Labs LLC. Toute reproduction, représentation, diffusion ou exploitation sans autorisation écrite préalable est strictement interdite.</p>
    </LegalLayout>
);
