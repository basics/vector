import { build } from 'esbuild';
import browserslistToEsbuild from 'browserslist-to-esbuild';

build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: browserslistToEsbuild(),
  outfile: './build/out.js',
}).catch(() => global.process.exit(1));
