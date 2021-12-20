import { build } from 'esbuild';
import browserslistToEsbuild from 'browserslist-to-esbuild';

const inputs = [
  { src: './src/index.js', name: 'basics.vector', target: '' },
  { src: './src/operator.js', name: 'basics.vector.operator' },
  { src: './src/adapter/playcanvas.js', name: 'basics.vector.adapter.playcanvas'}
];

const defaultOptions = {
  bundle: true,
  minify: true,
  sourcemap: true,
  treeShaking: true,
  target: browserslistToEsbuild(),
  mainFields: ['module', 'main'],
  outbase: 'src'
};

inputs.forEach((item) => {
  build({
    ...defaultOptions,
    entryPoints: [item.src],
    format: 'iife',
    globalName: item.name,
    outdir: './build/iife',
  }).catch(() => global.process.exit(1));

  build({
    ...defaultOptions,
    entryPoints: [item.src],
    format: 'esm',
    splitting: true,
    outdir: './build/esm/',
    outExtension: { '.js': '.mjs' }
  }).catch(() => global.process.exit(1));

  build({
    ...defaultOptions,
    entryPoints: [item.src],
    format: 'cjs',
    outdir: './build/cjs/',
    outExtension: { '.js': '.cjs' }
  }).catch(() => global.process.exit(1));
});

