const { typescript } = require('projen');
const project = new typescript.TypeScriptProject({
  name: '@aws-cdk/node-bundle',
  github: false,
  devDeps: [
    '@types/madge',
    '@types/license-checker',
  ],
  deps: [
    'esbuild',
    'madge',
    'license-checker',
    'yargs',
    'fs-extra',
    'shlex',
  ],
  bin: {
    'node-bundle': '../lib/cli.js',
  },

  // required by projen even though 'github' is false.
  defaultReleaseBranch: 'main',
});
project.synth();