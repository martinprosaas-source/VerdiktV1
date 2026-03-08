import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Problem } from '../components/Problem';
import { HowItWorks } from '../components/HowItWorks';
import { Features } from '../components/Features';
import { ForWho } from '../components/ForWho';
import { Testimonials } from '../components/Testimonials';
import { Pricing } from '../components/Pricing';
import { FAQ } from '../components/FAQ';
import { AskAI } from '../components/AskAI';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';
import { SplashScreen } from '../components/SplashScreen';

export const Landing = () => {
    return (
        <SplashScreen>
            <div className="min-h-screen bg-background text-zinc-400 font-sans selection:bg-emerald-500/30 selection:text-emerald-400 transition-colors duration-300">
                <Navbar />
                {/* 1. Hero + Social Proof */}
                <Hero />
                {/* 2. Problème - Agiter la douleur */}
                <Problem />
                {/* 3. Comment ça marche - 3 étapes simples */}
                <HowItWorks />
                {/* 4. Features - Bento grid détaillé */}
                <Features />
                {/* 5. Pour qui - Les personas */}
                <ForWho />
                {/* 6. Témoignages - Preuve sociale */}
                <Testimonials />
                {/* 7. Pricing - Les offres */}
                <Pricing />
                {/* 8. FAQ - Lever les objections */}
                <FAQ />
                {/* 9. Ask AI + CTA Final */}
                <AskAI />
                {/* 10. Footer */}
                <Footer />
                {/* Scroll to top button */}
                <ScrollToTop />
            </div>
        </SplashScreen>
    );
};
