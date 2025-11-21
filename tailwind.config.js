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
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    DEFAULT: '#6366f1',
                    foreground: '#ffffff',
                },
                secondary: {
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                },
                accent: {
                    400: '#fbbf24',
                    600: '#d97706',
                },
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0a0a0a',
                },
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: {
                    DEFAULT: 'var(--card)',
                    foreground: 'var(--card-foreground)',
                },
                muted: {
                    DEFAULT: 'var(--muted)',
                    foreground: 'var(--muted-foreground)',
                },
                border: 'var(--border)',
                sidebar: {
                    DEFAULT: 'var(--sidebar)',
                    foreground: 'var(--sidebar-foreground)',
                    border: 'var(--sidebar-border)',
                    accent: 'var(--sidebar-accent)',
                    'accent-foreground': 'var(--sidebar-accent-foreground)',
                },
                destructive: 'var(--destructive)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
