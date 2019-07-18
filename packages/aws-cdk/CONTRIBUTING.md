## Running the tests

Unit tests are automatically run as part of the regular build. Integration tests
aren't run automatically since they have nontrivial requirements to run.

**CLI integration tests**

CLI tests will exercise a number of common CLI scenario's, deploying actual
stacks. To run, preload your shell with AWS credentials run run:

```
npm run integ-cli
```

**Init template integration tests**

Init template tests will initialize and compile the init templates that the
CLI ships with. They require a machine that has all developer tools available
that the CDK supports (Java, .NET and Python), and require that all CDK
packages have been built. To run:

```
npm run integ-init
```

These two sets of integration tests have 3 running modes:

- Developer mode, when called through `npm run`. Will use the source tree.
- Integration test, when called from a directory with the build artifacts
  (the `dist` directory).
- Canaries, when called with `IS_CANARY=true`. Will use the build artifacts
  up on the respective package managers.
