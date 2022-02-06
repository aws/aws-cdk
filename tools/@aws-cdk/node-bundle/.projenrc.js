const { typescript } = require('projen');
const project = new typescript.TypeScriptProject({
  name: '@aws-cdk/node-bundle',
  github: false,
  devDeps: ['@types/madge'],
  deps: ['esbuild', 'madge', 'chalk', 'shlex'],

  // required by projen even though 'github' is false.
  defaultReleaseBranch: 'main',
});
project.synth();