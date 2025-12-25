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
  'sweetalert2',
];

const config: Options = {
  entry: ['src/index.ts'],
  dts: {
    resolve: true,
    entry: 'src/index.ts',
  },
  format: ['esm'], // Only ESM for smaller bundle size
  minify: 'terser',
  sourcemap: false,
  clean: true,
  tsconfig: './tsconfig.json',
  outDir: 'dist',
  target: 'es2020',
  external: [...external, ...Object.keys(require('./package.json').peerDependencies || {})],
  splitting: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  // Configure esbuild for better TypeScript support and optimization
  esbuildOptions: (options) => {
    options.alias = {
      ...options.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    // Enable tree-shaking and minification
    options.treeShaking = true;
    options.minify = true;
    options.define = {
      'process.env.NODE_ENV': '"production"',
    };
    // Enable better code splitting
    options.splitting = true;
  },
};

export default defineConfig(config);
