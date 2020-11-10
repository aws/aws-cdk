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

Validate that previously tested functionality still works in light of recent changes to the CLI. This is done by fetching the functional tests of the previous published release, and running them against the new CLI code.

These tests run in two variations:

- **against local framework code**

  Use your local framework code. This is important to make sure the new CLI version
  will work properly with the new framework version.

  > See a concrete failure [example](https://github.com/aws/aws-cdk-rfcs/blob/master/text/00110-cli-framework-compatibility-strategy.md#remove---target-from-docker-build-command)

- **against previously release code**

  Fetches the framework code from the previous release. This is important to make sure
  the new CLI version does not rely on new framework features to provide the same functionality.

  > See a concrete failure [example](https://github.com/aws/aws-cdk-rfcs/blob/master/text/00110-cli-framework-compatibility-strategy.md#change-artifact-metadata-type-value)

You can also run just these tests by executing:

```console
yarn integ-cli-regression
```

Note that these tests can only be executed using the `run-against-dist` wrapper. Why? well, it doesn't really make sense to `run-against-repo` when testing the **previously released code**, since we obviously cannot use the repo. Granted, running **against local framework code** can somehow work, but it required a few too many hacks in the current codebase to make it seem worthwhile.

##### Implementation

The implementation of the regression suites is not trivial to reason about and follow. Even though the code includes inline comments, we break down the exact details to better serve us in maintaining it and regaining context.

Before diving into it, we establish a few key concepts:

- `CANDIDATE_VERSION` - This is the version of the code that is being built in the pipeline, and its value is stored in the `build.json` file of the packaged artifact of the repo.
- `PREVIOUS_VERSION` - This is the version previous to the `CANDIDATE_VERSION`.
- `CLI_VERSION` - This is the version of the CLI we are testing. It is **always** the same as the `CANDIDATE_VERSION` since we want to test the latest CLI code.
- `FRAMEWORK_VERSION` - This is the version of the framework we are testing. It varries between the two variation of the regression suites.
Its value can either be that of `CANDIDATE_VERSION` (for testing against the latest framework code), or `PREVIOUS_VERSION` (for testing against the previously published version of the framework code).

Following are the steps involved in running these tests:

1. Run [`./bump-candidate.sh`](../../bump-candidate.sh) to differentiate between the local version and the published version. For example, if the version in `lerna.json` is `1.67.0`, this script will result in a version `1.67.0-rc.0`. This is needed so that we can launch a verdaccio instance serving local tarballs without worrying about conflicts with the public npm uplink. This will help us avoid version quirks that might happen during the *post-release-pre-merge-back* time window.

2. Run [`./align-version.sh`](../../scripts/align-version.sh) to configure the above version in all our packages.

3. Build and Pack the repository. The produced tarballs will be versioned with the above version.

4. Run `test/integ/run-against-dist test/integ/test-cli-regression-against-latest-release.sh` (or `test/integ/test-cli-regression-against-latest-code.sh`)

5. First, the `run-against-dist` wrapper will run and:

    - Read the `CANDIDATE_VERSION` from `build.json` and export it.
    - [Launch verdaccio](./test/integ/run-against-dist#L29) to serve all local tarballs (serves the `CANDIDATE_VERSION` now)
    - [Install the CLI](./test/integ/run-against-dist#L30) using the `CANDIDATE_VERSION` version `CANDIDATE_VERSION` env variable.
    - Execute the given script.

6. Both cli regression test scripts run the same [`run_regression_against_framework_version`](./test/integ/test-cli-regression.bash#L22) function. This function accepts which framework version should the regression run against, it can be either `CANDIDATE_VERSION` or `PREVIOUS_VERSION`. Note that the argument is not the actual value of the version, but instead is just an [indirection indentifier](./test/integ/test-cli-regression.bash#L81). The function will:

    - Calculate the actual value of the previous version based on the candidate version. (fetches from github)
    - Download the previous version tarball from npm and extract the integration tests.
    - Export a `FRAMWORK_VERSION` env variable based on the caller, and execute the integration tests of the previous version.

7. Our integration tests now run and have knowledge of which framework version they should [install](./test/integ/cli/cdk-helpers.ts#L74).

That "basically" it, hope it makes sense...

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
