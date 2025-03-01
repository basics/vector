import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    { builder: 'mkdist', input: './src', pattern: ['**/*.js'], format: 'cjs', loaders: ['js'], ext: 'cjs' },
    { builder: 'mkdist', input: './src', pattern: ['**/*.js'], format: 'esm', loaders: ['js'], ext: 'js' }
  ],
  declaration: true,
  clean: true,
  externals: [],
  rollup: {
    esbuild: {
      target: 'esnext'
    },
    emitCJS: false,
    cjsBridge: true
  }
});
