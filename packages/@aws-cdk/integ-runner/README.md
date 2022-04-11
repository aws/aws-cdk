# integ-runner

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


## Overview


## Usage

- Run all integration tests in `test` directory

```bash
integ-runner [ARGS] [TEST...]
```

This will look for all files that match the naming convention of `/integ.*.ts$/`. Each of these files will be expected
to be a self contained CDK app. The runner will execute the following for each file (app):

1. Check if a snapshot file exists (i.e. `/integ.*.expected.snapshot$/`)
2. If the snapshot does not exist
	2a. Synth the integ app which will produce the `integ.json` file
3. Read the `integ.json` file which contains instructions on what the runner should do.
4. Execute instructions

### Options

- `--update-on-failed` (default=false)
  Rerun integration tests if snapshot fails
- `--clean` (default=`true`)
  Destroy stacks after deploy (use `--no-clean` for debugging)
- `--verbose` (default=`false`)
  verbose logging
- `--parallel` (default=`false`)
  Run tests in parallel across default regions
- `--parallel-regions`
  List of regions to run tests in. If this is provided then all tests will
  be run in parallel across these regions
- `--directory` (default=`test`)
  Search for integration tests recursively from this starting directory
- `--force` (default=`false`)
  Rerun integration test even if the test passes
- `--file`
  Read the list of tests from this file

Example:

```bash
integ-runner --update --parallel --parallel-regions us-east-1 --parallel-regions us-east-2 --parallel-regions us-west-2 --directory ./
```

This will search for integration tests recursively from the current directory and then execute them in parallel across `us-east-1`, `us-east-2`, & `us-west-2`.

### integ.json schema

See [@aws-cdk/cloud-assembly-schema/lib/integ-tests/schema.ts](../cloud-assembly-schema/lib/integ-tests/schema.ts)

### Defining an integration test

See the `@aws-cdk/integ-tests` module for information on how to define
integration tests for the runner to exercise.