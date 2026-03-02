# PROMPT CURSOR — LANDING PAGE AGORA AI (VERSION FINALE)

## RÉFÉRENCE DESIGN OBLIGATOIRE

Inspire-toi FORTEMENT de ces landing pages :
- **Linear.app** — Minimalisme, typographie parfaite, animations subtiles
- **Raycast.com** — Dark mode élégant, micro-interactions
- **Vercel.com** — Clarté, whitespace, hiérarchie visuelle
- **Resend.com** — Simplicité, focus sur le message

**CE QUE JE NE VEUX PAS** :
- Cards avec bordures grises moches
- Boutons "Bootstrap-style" génériques
- Templates Tailwind UI copié-collé
- Gradients arc-en-ciel criards
- Icônes Lucide balancées sans design
- Testimonials avec avatars ronds génériques
- Quoi que ce soit qui ressemble à un side-project

---

## DIRECTION ARTISTIQUE

### Mode : Dark Premium + Emerald Accent

**Pourquoi Emerald** : Le vert = "go", validation, décision prise. C'est le seul choix cohérent pour un produit qui dit "arrêtez de débattre, décidez". Différenciant car quasi personne ne l'utilise en B2B SaaS.

### Palette complète

```css
/* ========== ACCENT — EMERALD ========== */
--accent: #10b981;           /* Emerald 500 - Principal */
--accent-light: #34d399;     /* Emerald 400 - Hover states */
--accent-dark: #059669;      /* Emerald 600 - Pressed states */
--accent-muted: #065f46;     /* Emerald 800 - Backgrounds subtils */

/* Glows & Gradients */
--accent-glow: rgba(16, 185, 129, 0.15);
--accent-glow-strong: rgba(16, 185, 129, 0.25);
--accent-gradient: linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%);
--accent-gradient-subtle: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%);

/* ========== BACKGROUNDS ========== */
--bg-primary: #050505;       /* Noir profond - fond principal */
--bg-elevated: #0a0a0a;      /* Légèrement plus clair - sections alternées */
--bg-card: #0f0f0f;          /* Cards */
--bg-card-hover: #141414;    /* Cards hover */
--bg-input: #0a0a0a;         /* Inputs */

/* ========== BORDERS ========== */
--border-subtle: rgba(255, 255, 255, 0.05);
--border-default: rgba(255, 255, 255, 0.08);
--border-hover: rgba(255, 255, 255, 0.12);
--border-accent: rgba(16, 185, 129, 0.3);
--border-accent-strong: rgba(16, 185, 129, 0.5);

/* ========== TEXT ========== */
--text-primary: #fafafa;     /* Titres, texte important */
--text-secondary: #a1a1aa;   /* Body text */
--text-tertiary: #71717a;    /* Texte discret */
--text-accent: #34d399;      /* Liens, highlights */

/* ========== EFFECTS ========== */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.5);
--shadow-accent: 0 4px 20px rgba(16, 185, 129, 0.25);
--shadow-accent-lg: 0 8px 40px rgba(16, 185, 129, 0.3);
```

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#050505',
        card: '#0f0f0f',
        accent: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
          muted: '#065f46',
        }
      },
      boxShadow: {
        'accent': '0 4px 20px rgba(16, 185, 129, 0.25)',
        'accent-lg': '0 8px 40px rgba(16, 185, 129, 0.3)',
        'glow': '0 0 60px rgba(16, 185, 129, 0.15)',
      }
    }
  }
}
```

---

## TYPOGRAPHIE

### Font : Inter (avec config premium)

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-rendering: optimizeLegibility;
```

### Hiérarchie

```css
/* Hero Headline */
.hero-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.0;
}

/* Section Titles */
.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

/* Subtitles */
.subtitle {
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Body */
.body {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* Overline / Label */
.label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
}
```

---

## COMPOSANTS UI

### Button Primary (Le plus important)

```jsx
<button className="
  relative group
  inline-flex items-center justify-center
  px-6 py-3.5
  text-sm font-semibold text-black
  bg-gradient-to-b from-emerald-400 to-emerald-500
  hover:from-emerald-300 hover:to-emerald-400
  rounded-full
  shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_16px_rgba(16,185,129,0.3)]
  hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_30px_rgba(16,185,129,0.4)]
  transition-all duration-300 ease-out
  transform hover:-translate-y-0.5
">
  <span className="relative z-10">Rejoindre la beta</span>
  <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
</button>
```

### Button Secondary

```jsx
<button className="
  inline-flex items-center justify-center
  px-6 py-3.5
  text-sm font-medium text-white/90
  bg-white/5
  hover:bg-white/10
  border border-white/10
  hover:border-white/20
  rounded-full
  transition-all duration-200
">
  Voir la démo
</button>
```

### Card Premium

```jsx
<div className="
  relative group
  p-6 rounded-2xl
  bg-white/[0.02]
  border border-white/[0.05]
  hover:border-emerald-500/20
  hover:bg-emerald-500/[0.02]
  transition-all duration-500 ease-out
">
  {/* Glow on hover */}
  <div className="
    absolute -inset-px rounded-2xl
    bg-gradient-to-b from-emerald-500/10 to-transparent
    opacity-0 group-hover:opacity-100
    transition-opacity duration-500
    pointer-events-none
  " />
  
  {/* Content */}
  <div className="relative z-10">
    {/* Icon */}
    <div className="
      w-10 h-10 mb-4
      flex items-center justify-center
      rounded-lg
      bg-emerald-500/10
      text-emerald-400
    ">
      {/* Lucide icon here */}
    </div>
    
    <h3 className="text-lg font-semibold text-white mb-2">
      Titre feature
    </h3>
    
    <p className="text-sm text-zinc-400 leading-relaxed">
      Description de la feature qui explique la valeur.
    </p>
  </div>
</div>
```

### Badge

```jsx
<span className="
  inline-flex items-center gap-2
  px-3 py-1.5
  text-xs font-medium
  text-emerald-400
  bg-emerald-500/10
  border border-emerald-500/20
  rounded-full
">
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
  </span>
  Beta ouverte
</span>
```

---

## STRUCTURE DES SECTIONS

### 1. NAVBAR

```jsx
<nav className="
  fixed top-0 left-0 right-0 z-50
  px-6 py-4
  bg-[#050505]/80
  backdrop-blur-xl
  border-b border-white/5
">
  <div className="max-w-6xl mx-auto flex items-center justify-between">
    {/* Logo */}
    <a href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
        <span className="text-black font-bold text-sm">A</span>
      </div>
      <span className="text-white font-semibold text-lg">Agora</span>
    </a>
    
    {/* Links */}
    <div className="hidden md:flex items-center gap-8">
      <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Fonctionnalités</a>
      <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
    </div>
    
    {/* CTA */}
    <button className="px-4 py-2 text-sm font-medium text-black bg-emerald-500 hover:bg-emerald-400 rounded-full transition-colors">
      Rejoindre la beta
    </button>
  </div>
</nav>
```

---

### 2. HERO

```jsx
<section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden">
  {/* Background gradient */}
  <div className="absolute inset-0 bg-[#050505]">
    {/* Gradient orb top */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
    {/* Grid pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
  </div>
  
  <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
    {/* Badge */}
    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
      </span>
      Beta ouverte — Places limitées
    </div>
    
    {/* Headline */}
    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
      <span className="text-zinc-400">Arrêtez de débattre.</span>
      <br />
      <span className="text-white">Commencez à décider.</span>
    </h1>
    
    {/* Subtitle */}
    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
      L'IA qui transforme vos réunions de 3 heures en 15 minutes d'action.
      <br className="hidden md:block" />
      Structure. Synthèse. Décision.
    </p>
    
    {/* CTAs */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
      <button className="px-8 py-4 text-base font-semibold text-black bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 rounded-full shadow-[0_0_32px_rgba(16,185,129,0.3)] hover:shadow-[0_0_48px_rgba(16,185,129,0.4)] transition-all duration-300">
        Rejoindre la beta →
      </button>
      <button className="px-8 py-4 text-base font-medium text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all duration-200">
        Voir la démo
      </button>
    </div>
    
    {/* Social proof */}
    <p className="text-sm text-zinc-500">
      Déjà <span className="text-zinc-300 font-medium">50+ équipes</span> sur la waitlist
    </p>
  </div>
</section>
```

---

### 3. SECTION PROBLÈME

```jsx
<section className="py-32 bg-[#050505]">
  <div className="max-w-6xl mx-auto px-6">
    {/* Header */}
    <div className="text-center mb-16">
      <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-4">Le problème</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Le syndrome de la scale-up</h2>
      <p className="text-lg text-zinc-400">Plus vous grandissez, plus vous ralentissez.</p>
    </div>
    
    {/* Stats Grid */}
    <div className="grid md:grid-cols-3 gap-6">
      {/* Card 1 */}
      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
        <p className="text-5xl md:text-6xl font-bold text-white mb-2">15h</p>
        <p className="text-sm font-medium text-emerald-400 mb-3">par semaine</p>
        <p className="text-sm text-zinc-500 leading-relaxed">Le temps moyen perdu en réunions qui ne mènent à aucune décision.</p>
      </div>
      
      {/* Card 2 */}
      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
        <p className="text-5xl md:text-6xl font-bold text-white mb-2">58%</p>
        <p className="text-sm font-medium text-emerald-400 mb-3">des décisions</p>
        <p className="text-sm text-zinc-500 leading-relaxed">Sont basées sur des données incomplètes ou des biais non identifiés.</p>
      </div>
      
      {/* Card 3 */}
      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
        <p className="text-5xl md:text-6xl font-bold text-white mb-2">6 mois</p>
        <p className="text-sm font-medium text-emerald-400 mb-3">pour oublier</p>
        <p className="text-sm text-zinc-500 leading-relaxed">Le temps avant de refaire exactement le même débat.</p>
      </div>
    </div>
  </div>
</section>
```

---

### 4. SECTION FEATURES — BENTO GRID

```jsx
<section id="features" className="py-32 bg-[#0a0a0a]">
  <div className="max-w-6xl mx-auto px-6">
    {/* Header */}
    <div className="text-center mb-16">
      <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-4">Solution</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white">Une nouvelle façon de décider</h2>
    </div>
    
    {/* Bento Grid */}
    <div className="grid md:grid-cols-3 gap-4">
      {/* Large Card - Structuration */}
      <div className="md:col-span-2 md:row-span-2 group relative p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border border-emerald-500/20 overflow-hidden">
        <div className="relative z-10">
          <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">Structuration intelligente</h3>
          <p className="text-zinc-400 leading-relaxed max-w-md">
            L'IA transforme vos questions floues en décisions structurées. Contexte, options, critères, parties prenantes — tout est clarifié avant même de commencer.
          </p>
        </div>
        {/* Background visual */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-tl-[100px] transform translate-x-16 translate-y-16" />
      </div>
      
      {/* Card - Vote Async */}
      <div className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors duration-300">
        <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-xl bg-white/5 text-emerald-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Vote asynchrone</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">Plus besoin de bloquer 10 agendas. Chacun contribue quand il peut.</p>
      </div>
      
      {/* Card - Synthèse */}
      <div className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors duration-300">
        <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-xl bg-white/5 text-emerald-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Synthèse en temps réel</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">Voyez le consensus émerger. L'IA détecte les frictions.</p>
      </div>
      
      {/* Card - Decision Log */}
      <div className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors duration-300">
        <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-xl bg-white/5 text-emerald-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Decision Log</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">Chaque décision archivée. Qui, quoi, pourquoi, quand.</p>
      </div>
      
      {/* Card - Intégrations (large) */}
      <div className="md:col-span-2 group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors duration-300">
        <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-xl bg-white/5 text-emerald-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Intégrations natives</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">Slack, Notion, Linear, Google Calendar. Agora s'intègre là où vous travaillez déjà.</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="w-8 h-8 rounded-lg bg-white/5" />
          <div className="w-8 h-8 rounded-lg bg-white/5" />
          <div className="w-8 h-8 rounded-lg bg-white/5" />
          <div className="w-8 h-8 rounded-lg bg-white/5" />
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### 5. SECTION TESTIMONIALS

```jsx
<section className="py-32 bg-[#050505]">
  <div className="max-w-4xl mx-auto px-6">
    <div className="text-center mb-16">
      <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-4">Témoignages</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white">Ils décident mieux</h2>
    </div>
    
    {/* Featured testimonial */}
    <div className="relative p-10 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/10">
      {/* Quote mark */}
      <span className="absolute top-6 left-8 text-7xl text-emerald-500/20 font-serif">"</span>
      
      <blockquote className="relative z-10">
        <p className="text-xl md:text-2xl text-white leading-relaxed mb-8">
          On a divisé par 4 le temps passé en réunions de décision. Et paradoxalement, les décisions sont meilleures — et mieux acceptées par l'équipe.
        </p>
        <footer className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold">
            ML
          </div>
          <div>
            <p className="text-white font-medium">Marie Laurent</p>
            <p className="text-sm text-zinc-500">COO @ TechScale</p>
          </div>
        </footer>
      </blockquote>
    </div>
  </div>
</section>
```

---

### 6. SECTION PRICING

```jsx
<section id="pricing" className="py-32 bg-[#0a0a0a]">
  <div className="max-w-5xl mx-auto px-6">
    <div className="text-center mb-16">
      <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-4">Pricing</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple et transparent</h2>
      <p className="text-lg text-zinc-400">Commencez gratuitement. Évoluez quand vous voulez.</p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-6">
      {/* Free */}
      <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
        <p className="text-sm font-medium text-zinc-400 mb-2">Free</p>
        <p className="text-4xl font-bold text-white mb-1">0€</p>
        <p className="text-sm text-zinc-500 mb-8">Pour découvrir</p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-3 text-sm text-zinc-400">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            1 équipe
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-400">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            5 décisions/mois
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-400">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Synthèse IA basique
          </li>
        </ul>
        <button className="w-full py-3 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors">
          Commencer
        </button>
      </div>
      
      {/* Pro - Highlighted */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-b from-emerald-500/10 to-transparent border-2 border-emerald-500/30">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold text-black bg-emerald-500 rounded-full">
          Populaire
        </div>
        <p className="text-sm font-medium text-emerald-400 mb-2">Pro</p>
        <p className="text-4xl font-bold text-white mb-1">29€<span className="text-lg font-normal text-zinc-500">/mois</span></p>
        <p className="text-sm text-zinc-500 mb-8">Pour les équipes</p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-3 text-sm text-zinc-300">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Jusqu'à 15 membres
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-300">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Décisions illimitées
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-300">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Synthèse IA avancée
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-300">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Decision Log
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-300">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Slack & Notion
          </li>
        </ul>
        <button className="w-full py-3 text-sm font-semibold text-black bg-emerald-500 hover:bg-emerald-400 rounded-full transition-colors shadow-[0_0_24px_rgba(16,185,129,0.3)]">
          Essai gratuit 14 jours
        </button>
      </div>
      
      {/* Business */}
      <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
        <p className="text-sm font-medium text-zinc-400 mb-2">Business</p>
        <p className="text-4xl font-bold text-white mb-1">99€<span className="text-lg font-normal text-zinc-500">/mois</span></p>
        <p className="text-sm text-zinc-500 mb-8">Pour scaler</p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-3 text-sm text-zinc-400">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Membres illimités
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-400">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Tout Pro inclus
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-400">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Analytics avancés
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-400">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            SSO & Admin
          </li>
          <li className="flex items-center gap-3 text-sm text-zinc-400">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Support prioritaire
          </li>
        </ul>
        <button className="w-full py-3 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors">
          Contacter l'équipe
        </button>
      </div>
    </div>
  </div>
</section>
```

---

### 7. CTA FINAL

```jsx
<section className="py-32 bg-[#050505] relative overflow-hidden">
  {/* Background glow */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
  </div>
  
  <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
      Prêt à décider plus vite ?
    </h2>
    <p className="text-lg text-zinc-400 mb-10">
      Rejoignez les équipes qui ont arrêté de perdre du temps en réunions.
    </p>
    <button className="px-10 py-4 text-base font-semibold text-black bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.35)] hover:shadow-[0_0_60px_rgba(16,185,129,0.45)] transition-all duration-300">
      Rejoindre la beta gratuitement →
    </button>
    <p className="text-sm text-zinc-500 mt-4">Pas de CB • Setup en 30 secondes</p>
  </div>
</section>
```

---

### 8. FOOTER

```jsx
<footer className="py-12 bg-[#050505] border-t border-white/5">
  <div className="max-w-6xl mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <span className="text-black font-bold text-sm">A</span>
        </div>
        <span className="text-white font-semibold">Agora</span>
      </div>
      
      {/* Links */}
      <div className="flex items-center gap-8 text-sm text-zinc-500">
        <a href="#" className="hover:text-white transition-colors">Twitter</a>
        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
      </div>
      
      {/* Copyright */}
      <p className="text-sm text-zinc-600">© 2026 Agora</p>
    </div>
  </div>
</footer>
```

---

## ANIMATIONS FRAMER MOTION

```jsx
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1]
    }
  }
};

// Utilisation sur chaque section
<motion.section
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, margin: "-100px" }}
  variants={container}
>
  <motion.div variants={item}>...</motion.div>
</motion.section>
```

---

## INSTRUCTIONS CURSOR

1. **Le code JSX est quasi complet** — assemble-le proprement dans des composants séparés
2. **Ajoute Framer Motion** sur toutes les sections
3. **Mobile first** — vérifie le responsive
4. **Le niveau de qualité** : Un designer senior doit dire "c'est propre"

**Génère le code complet et fonctionnel.**
