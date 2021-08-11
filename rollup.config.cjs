const typescript = require('@rollup/plugin-typescript');
const { clean } = require('@open-tech-world/rollup-plugin-clean');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: './lib/index.esm.js',
      format: 'esm',
    },
    {
      file: './lib/index.cjs',
      format: 'cjs',
    },
  ],
  plugins: [clean('lib/*'), typescript({ tsconfig: './tsconfig.json' })],
  external: ['@open-tech-world/es-cli-styles'],
};
