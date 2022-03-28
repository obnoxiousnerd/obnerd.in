import sass from 'sass';
import { build as esbuild } from 'esbuild';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { watch } from 'chokidar';

const buildSass = async () => {
  const compiled = sass.compile('_public/main.scss');
  if (!existsSync('dist')) await mkdir('dist');
  await writeFile('dist/main.css', compiled.css);
};

const runEsbuild = async () => {
  await esbuild({
    entryNames: '_public/index.ts',
    bundle: true,
    minify: true,
    outfile: 'dist/index.js',
  });
};

const build = async () => {
  const start = Date.now();
  await buildSass();
  await runEsbuild();
  const end = Date.now();
  console.log(`Compiled in ${end - start}ms`);
};

if (process.argv[2] === 'prod') {
  await build();
} else {
  watch(['_public/**/*']).once('ready', build).on('change', build);
}
