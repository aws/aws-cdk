## Integration Tests

Unit tests are automatically run as part of the regular build. Integration tests
aren't run automatically since they have nontrivial requirements to run.

### CLI integration tests

CLI tests will exercise a number of common CLI scenarios, and deploy actual
stacks to your AWS account.

REQUIREMENTS

* All packages have been compiled.
* Shell has been preloaded with AWS credentials.

Run:

```
yarn integ-cli
```

There are two types of tests involved in the integration suite:

#### Functional

These tests simply run the local integration tests located in [`test/integ/cli`](./test/integ/cli). They test the proper deployment of stacks and in general the correctness of the actions performed by the CLI.

You can run these specifically by executing:

```console
yarn integ-cli-no-regression
```

#### Regression

Validate that previously tested functionality still works in light of recent changes to the CLI. This is done by fetching the functional tests of the latest published release, and running them against the new CLI code.

These tests run in two variations:

- **against local framework code**

  Use your local framework code. This is important to make sure the new CLI version
  will work properly with the new framework version. 

- **against latest release code**

  Fetches the framework code from the latest release. This is important to make sure
  the new CLI version does not rely on new framework features to provide the same functionality.

You can run these specifically by executing:

```console
yarn integ-cli-regression
```

### Init template integration tests

Init template tests will initialize and compile the init templates that the
CLI ships with.

REQUIREMENTS

* Running on a machine that has all language tools available (JDK, .NET Core,
  Python installed).
* All packages have been compiled.
* All packages have been packaged to their respective languages (`pack.sh`).

Run:

```
npm run integ-init
```

## Integration test modes

These two sets of integration tests have 3 running modes:

- Developer mode, when called through `npm run`. Will use the source tree.
- Integration test, when called from a directory with the build artifacts
  (the `dist` directory).
- Canaries, when called with `IS_CANARY=true`. Will use the build artifacts
  up on the respective package managers.

The integration test and canary modes are used in the CDK publishing pipeline
and the CDK canaries, respectively. You wouldn't normally need to run
them directly that way.
