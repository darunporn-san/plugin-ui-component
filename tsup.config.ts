import { defineConfig } from 'tsup';
import type { Options } from 'tsup';
import * as path from 'path';

const config: Options = {
  entry: ['src/index.ts'],
  dts: {
    // Skip generating declaration files for now to work around the SweetAlert2 issue
    entry: 'src/index.ts',
    resolve: false,
  },
  format: ['esm', 'cjs'],
  minify: true,
  sourcemap: true,
  clean: true,
  tsconfig: './tsconfig.json',
  outDir: 'dist',
  target: 'es2020',
  external: ['react', 'react-dom'],
  // Split output files for better tree-shaking
  splitting: true,
  // Configure esbuild for better TypeScript support
  esbuildOptions: (options) => {
    options.alias = {
      ...options.alias,
      '@': path.resolve(__dirname, 'src'),
    };
  },
};

export default defineConfig(config);