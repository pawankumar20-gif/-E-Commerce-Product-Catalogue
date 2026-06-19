/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Royal Theme
        primary: '#1A237E', // Royal Navy
        secondary: '#0D47A1', // Sapphire
        accent: '#D4AF37', // Royal Gold
        dark: '#0A0A14', // Deepest Navy
        light: '#F4F6F9', // Clean White-ish
        pearl: '#FFFFFF',
        charcoal: '#1A1A24',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1A237E 0%, #0D47A1 100%)',
        'gradient-accent': 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
        'gradient-premium': 'radial-gradient(circle at top right, #FFFFFF 0%, #F4F6F9 100%)',
      },
      backdropBlur: {
        xl: '20px',
      }
    },
  },
  plugins: [],
}
