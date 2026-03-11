import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(({ mode }) => {
  // Ensure .env variables are loaded correctly
  const rootEnvPath = path.resolve(__dirname, '../../../../'); // Adjust path to root
  const env = loadEnv(mode, rootEnvPath, 'VITE_'); // Only load `VITE_` prefixed variables

  return {
    root: __dirname,
    cacheDir: '../../../node_modules/.vite/libs/client/utils',

    plugins: [
      react(),
      nxViteTsPaths(),
      dts({
        entryRoot: 'src',
        tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      }),
    ],

    define: {
      'import.meta.env': Object.entries(env).reduce((acc, [key, value]) => {
        acc[key] = JSON.stringify(value);
        return acc;
      }, {} as Record<string, string>),
    },

    build: {
      outDir: '../../../dist/libs/client/utils',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      lib: {
        entry: 'src/index.ts',
        name: 'client-utils',
        fileName: 'index',
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
      },
    },
  };
});
