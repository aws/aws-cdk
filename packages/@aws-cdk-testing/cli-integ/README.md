# CDK CLI integration test
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This package contains CDK CLI integration test suites, as well as helper tools necessary to run those suites against various different distributions of the CDK (in the source repository, against a build directory, or against published releases).

> The tools and tests themselves should arguably be in different packages, but I want to prevent package proliferation. For now we'll keep them together.

## Tests

The tests themselves are in the `tests/` directory:

```text
tests/
├── cli-integ-tests
├── init-csharp
├── init-fsharp
├── init-java
├── init-javascript
├── init-python
├── init-typescript-app
├── init-typescript-lib
├── init-go
└── uberpackage
```

Each subdirectory contains one test **suite**, and in the development pipeline each suite is run individually in a CodeBuild job, all in parallel. This requires manual configuration in the pipeline: to add a new suite, first add a suite here, then add the suite to the pipeline as well. The safest strategy is to add a trivially succeeding suite first (for example, a single test with `expect(true).toBeTruthy()`), add it to the pipeline, and then write the actual tests.

Test suites are written as a collection of Jest tests, and they are run using Jest, using the code in the `lib/` directory as helpers.

### Running a test suite

You run a suite using the `bin/run-suite` tool. You must select either a version of the CLI and framework which can be `npm install`ed, or point to the root of the source tree:

```shell
# Use the given source tree
$ bin/run-suite --use-source=/path/to/repo-root <SUITE_NAME>

# Automatically determine the source tree root
$ bin/run-suite -a <SUITE_NAME>

# Run against a released version
$ bin/run-suite --use-cli-release=2.34.5 <SUITE_NAME>
```

To run a specific test, add `-t` and a substring of the test name. For example:

```shell
bin/run-suite -a cli-integ-tests -t 'load old assemblies'
```

## Tools

There are a number of tools in the `bin/` directory. They are:

```text
bin/
├── apply-patches
├── query-github
├── run-suite
├── stage-distribution
└── test-root
```

* `apply-patches`: used for regression testing. Applies patches to historical versions of the tests to fix false positive test failures.
* `query-github`: used for regression testing. Queries GitHub for previously released versions.
* `run-suite`: run one of the test suites in the `tests/` directory.
* `stage-distribution`: used for testing in the pipeline. Uploads candidate release binaries to CodeArtifact so that they can be installed using `npm install`, `pip install`, etc.
* `test-root`: return the directory containing all tests (used for applying patches).

## Regression testing

The regression testing mechanism is somewhat involved and therefore deserves its own section. The principle is not too hard to explain though:

*We run the previous version of the CLI integ tests against the new candidate release of the CLI, to make sure we didn't accidentally introduce any breaking behavior*.

This is slightly complicated by two facts:

* (1) Both the CLI and the framework may have changed, and an incompatibility may have arisen between the framework and CLI. Newer CLIs must always support older framework versions. We therefore run two flavors of the integration tests:
  * Old tests, new CLI, new framework
  * Old tests, new CLI, old framework

The testing matrix looks like this:

```text
                 OLD TESTS                             NEW TESTS

                    CLI                                   CLI
                Old    New                            Old    New
            ┌────────┬────────┐                   ┌────────┬────────┐
     F'WORK │  prev  │        │            F'WORK │        │        │
        Old │  rls   │  regr  │               Old │ (N/A)  │   ?    │
            │ integ  │        │                   │        │        │
            ├────────┼────────┤                   ├────────┼────────┤
            │        │        │                   │        │  cur   │
        New │ (N/A)  │  regr  │               New │ (N/A)  │  rls   │
            │        │        │                   │        │ integ  │
            └────────┴────────┘                   └────────┴────────┘
```

We are covering everything except "new tests, new CLI, old framework", which is not clear that it even makes sense to test because some new features may rely on framework support which will not be in the old version yet.

* (2) Sometimes, old tests will fail on newer releases when we introduce breaking changes to the framework or CLI for something serious (such as security reasons), or maybe because we had a bug in an old version that happened to pass, but now the test needs to be updated in order to pass a bugfix.

For this case we have a patching mechanism, so that in a NEW release of the tools, we include files that are copied over an OLD release of the test, that allows them to pass. For the simplest case there is a mechanism to suppress the run of a single test, so that we can skip the running of one test for one release. For more complicated cases we copy in patched `.js` source files which will replace old source files. (Patches are considered part of the *tools*, not part of the *tests*).

### Mechanism

To run the tests in a regressory fashion, do the following:

* Download the current `@aws-cdk-testing/cli-integ` artifact at `V1`.
* Determine the previous version `V0` (use `query-github` for this).
* Download the previous `@aws-cdk-testing/cli-integ` artifact at `V0`.
* From the `V1` artifact, apply the `V0` patch set.
* Run the `V0` tests with the `--framework-version` option:

```shell
# Old tests, new CLI, new framework
V0/bin/run-suite --use-cli-release=V1 --framework-version=V1 [...]

# Old tests, new CLI, old framework
V0/bin/run-suite --use-cli-release=V1 --framework-version=V0 [...]
```

### Patching

To patch a previous set of tests to make them pass with a new release, add a directory to `resources/cli-regression-patches`. The simplest method is to add a `skip-tests.txt` file:

```shell
# The version of the tests that are currently failing (V0 in the paragraph above)
export VERSION=X.Y.Z

mkdir -p resources/cli-regression-patches/v${VERSION}
cp skip-tests.txt resources/cli-regression-patches/v${VERSION}/
```

Now edit `resources/cli-regression-patches/vX.Y.Z/skip-tests.txt` and put the name of the test you want to skip on a line by itself.

If you need to replace source files, it's probably best to stick compiled `.js` files in here. `.ts` source files wouldn't compile because they'd be missing `imports`.
