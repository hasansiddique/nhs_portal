const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.5' }],
        xl: ['20px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
      },
      colors: {
        primary: 'var(--primary-color3)',
        background: 'var(--bg-section)',
        foreground: 'var(--primary-color2)',
        input: '#4B5768',
        accent: 'var(--primary-color5)',
        'accent-foreground': 'var(--primary-color2)',
        destructive: '#DF4949',
        'destructive-foreground': '#fff',
        ring: 'var(--primary-color3)',
      },
    },
  },
  plugins: [],
};
