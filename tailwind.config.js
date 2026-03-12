/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--bg-background) / <alpha-value>)',
                card: 'rgb(var(--bg-card) / <alpha-value>)',
                'card-hover': 'rgb(var(--bg-card-hover) / <alpha-value>)',
                primary: 'rgb(var(--text-primary) / <alpha-value>)',
                secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
                tertiary: 'rgb(var(--text-tertiary) / <alpha-value>)',
                'border-subtle': 'rgb(var(--border-subtle) / <alpha-value>)',
                accent: {
                    DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
                    light: '#34d399',
                    dark: '#059669',
                    muted: '#065f46',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'accent': '0 4px 20px rgba(16, 185, 129, 0.25)',
                'accent-lg': '0 8px 40px rgba(16, 185, 129, 0.3)',
                'glow': 'var(--shadow-glow)',
            },
            backgroundImage: {
                'accent-gradient': 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
