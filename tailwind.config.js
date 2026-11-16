/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#0B1017',
          900: '#101722',
          800: '#141D29',
          700: '#1A2532',
        },
        warm: {
          bg: '#F5F3EE',
          card: '#FFFFFF',
          secondary: '#EDEAE2',
          ink: '#252A2A',
          slate: '#69716D',
          'slate-strong': '#525955',
          sage: '#66877B',
          'sage-strong': '#4A685D',
          'sage-hover': '#3D574E',
          'sage-tint': '#E4ECE8',
          champagne: '#B99B70',
          'champagne-ink': '#785E37',
          border: '#E3DED3',
          divider: '#E8E4DC',
        },
        titanium: {
          400: '#8B99AB',
          300: '#A7B2C0',
          200: '#CBD5E1',
          100: '#F3F2ED',
        },
        accent: {
          cyan: '#45D6E6',
          amber: '#D5B477',
          champagne: '#D5B477',
          emerald: '#22C55E',
        },
      },
      fontFamily: {
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      transitionDuration: {
        editorial: '180ms',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
