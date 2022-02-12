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
    'node-bundle': 'bin/node-bundle',
  },

  // required by projen even though 'github' is false.
  defaultReleaseBranch: 'main',
});

project.gitignore.exclude('.vscode/');

// needed for CLI tests to run
project.testTask.prependSpawn(project.compileTask);
project.synth();