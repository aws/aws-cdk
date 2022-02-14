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

// needed to conform to the repo build scripts
// note we don't need to compile because the test task does that
const buildAndTest = project.addTask('build+test');
buildAndTest.spawn(project.testTask);

project.synth();