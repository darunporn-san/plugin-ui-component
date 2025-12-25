import { defineConfig } from 'tsup';
import type { Options } from 'tsup';
import * as path from 'path';

// Common packages that are likely to be in the host application
const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'date-fns',
  'lucide-react',
  'react-hook-form',
];

const config: Options = {
  entry: ['src/index.ts'],
  dts: {
    resolve: true,
    // Only generate types for the ESM build
    entry: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  minify: 'terser',
  sourcemap: false, // Disable sourcemaps in production
  clean: true,
  tsconfig: './tsconfig.json',
  outDir: 'dist',
  target: 'es2020',
  external,
  // Enable better tree-shaking and code splitting
  splitting: true,
  // Minify identifiers for production
  minifyIdentifiers: true,
  // Minify syntax
  minifySyntax: true,
  // Minify whitespace
  minifyWhitespace: true,
  // Configure esbuild for better TypeScript support and optimization
  esbuildOptions: (options) => {
    options.alias = {
      ...options.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    // Enable tree-shaking
    options.treeShaking = true;
    // Enable minification
    options.minify = true;
  },
};

export default defineConfig(config);
