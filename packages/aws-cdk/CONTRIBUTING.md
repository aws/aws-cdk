## Integration Tests

Unit tests are automatically run as part of the regular build. Integration tests
aren't run automatically since they have nontrivial requirements to run.

### Three ways of running the tests

We are reusing the same set of integration tests in 3 ways. In each of
those cases, we get the code we're testing to test from a different source.

- Run them as part of development. In this case, we get the CLI
  and the framework libraries from the source repository.
- Run them as integration tests in the pipeline. In this case, we get a specific
  version of the CLI and the framework libraries from a set of candidate NPM
  packages.
- Run them continuously, as a canary. In this case, we get the latest CLI and
  the framework libraries directly from the package managers, same as an
  end user would do.

To hide the differences between these different ways of running the tests,
there are 3 scripts. They all take as command-line argument the ACTUAL test
script to run, and prepare the environment in such a way that the tests
will use the `cdk` command and the libraries from the distribution selected.

To run the CLI integ tests in each configuration:

```
$ test/integ/run-against-repo test/integ/cli/test.sh
$ test/integ/run-against-dist test/integ/cli/test.sh
$ test/integ/run-against-release test/integ/cli/test.sh
```

To run a single integ test in the source tree:

```
$ test/integ/run-against-repo test/integ/cli/test.sh -t 'SUBSTRING OF THE TEST NAME'
```

To run regression tests in the source tree:

```
$ test/integ/test-cli-regression-against-current-code.sh [-t '...']
```

Integ tests can run in parallel across multiple regions. Set the `AWS_REGIONS`
environment variable to a comma-separate list of regions:

```
$ env AWS_REGIONS=us-west-2,us-west-1,eu-central-1,eu-west-2,eu-west-3 test/integ/run-against-repo test/integ/cli/test.sh
```

Elements from the list of region will be exclusively allocated to one test at
a time. The tests will run in parallel up to the concurrency limit imposed by
jest (default of 5, controllable by `--maxConcurrency`) and the available
number of elements. Regions may be repeated in the list in which case more
than one test will run at a time in that region.

If `AWS_REGIONS` is not set, all tests will sequentially run in the one
region set in `AWS_REGION`.

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

This command runs two types of tests:

#### Functional

These tests simply run the local integration tests located in [`test/integ/cli`](./test/integ/cli). They test the proper deployment of stacks and in general the correctness of the actions performed by the CLI.

You can also run just these tests by executing:

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

You can also run just these tests by executing:

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
