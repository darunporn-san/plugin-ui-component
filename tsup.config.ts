import { defineConfig } from 'tsup';
import type { Options } from 'tsup';
import * as path from 'path';

const config: Options = {
  entry: ['src/index.ts'],
  dts: {
    // Generate declaration files in a separate step for better reliability
    resolve: true,
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
