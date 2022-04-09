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

project.compileTask.prependExec(`tsc --version`)

// Ensure `npm run build` behaves the same as in other packages. Failure to do
// so results in re-generating the `package.json` with `version: 0.0.0` which
// undoes the work of `align-versions.sh` and breaks jsii integration tests.
// This can be removed if the `@aws-cdk/node-bundle` is moved out of this mono
// repository.
project.buildTask._locked = false; // <-- !HAXX! there is (understandably) not API to unlock...
project.buildTask.reset();
project.buildTask.prependSpawn(project.compileTask);

// needed for CLI tests to run
project.testTask.prependSpawn(project.compileTask);

// needed to conform to the repo build scripts
// note we don't need to compile because the test task does that
const buildAndTest = project.addTask('build+test');
buildAndTest.spawn(project.testTask);

project.addFields({ private: true });

project.synth();
