// @ts-check

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

module.exports = {
  semi: true,
  singleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  plugins: [
    require.resolve('@ianvs/prettier-plugin-sort-imports'),
    require.resolve('prettier-plugin-tailwindcss'),
  ],
  tailwindConfig: './libs/client/tailwind-preset/tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'cva'],

  importOrder: ['<THIRD_PARTY_MODULES>', '', '^@your-props/(.*)$', '', '^[./]'],
  importOrderTypeScriptVersion: '5.0.0',
};
