import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['_public/index.ts', '_public/graph.ts'],
  format: ['esm'],
  esbuildOptions: (options) => {
    options.outdir = 'dist';
    return options;
  },
  legacyOutput: true,
  minify: true,
});
