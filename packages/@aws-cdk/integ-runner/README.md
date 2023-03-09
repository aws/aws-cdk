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

This tool has been created to be used initially by this repo (aws/aws-cdk). Long term the goal is
for this tool to be a general tool that can be used for running CDK integration tests. We are
publishing this tool so that it can be used by the community and we would love to receive feedback
on use cases that the tool should support, or issues that prevent the tool from being used in your
library.

This tool is meant to be used with the [integ-tests](https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/integ-tests) library.

## Usage

- Run all integration tests in `test` directory

```bash
integ-runner [ARGS] [TEST...]
```

This will look for all files that match the naming convention of `/integ.*.js$/`. Each of these files will be expected
to be a self contained CDK app. The runner will execute the following for each file (app):

1. Check if a snapshot file exists (i.e. `/*.snapshot$/`)
2. If the snapshot does not exist
	2a. Synth the integ app which will produce the `integ.json` file
3. Read the `integ.json` file which contains instructions on what the runner should do.
4. Execute instructions

### Options

- `--update-on-failed` (default=`false`)
  Rerun integration tests if snapshot fails
- `--clean` (default=`true`)
  Destroy stacks after deploy (use `--no-clean` for debugging)
- `--verbose` (default=`false`)
  verbose logging, including integration test metrics
  (specify multiple times to increase verbosity)
- `--parallel-regions` (default=`us-east-1`,`us-east-2`, `us-west-2`)
  List of regions to run tests in. If this is provided then all tests will
  be run in parallel across these regions
- `--directory` (default=`test`)
  Search for integration tests recursively from this starting directory
- `--force` (default=`false`)
  Rerun integration test even if the test passes
- `--profiles`
  List of AWS Profiles to use when running tests in parallel
- `--exclude` (default=`false`)
  If this is set to `true` then the list of tests provided will be excluded
- `--from-file`
  Read the list of tests from this file
- `--disable-update-workflow` (default=`false`)
  If this is set to `true` then the [update workflow](#update-workflow) will be disabled
- `--app`
  The custom CLI command that will be used to run the test files. You can include {filePath} to specify where in the command the test file path should be inserted. Example: --app="python3.8 {filePath}".

  Use together with `--test-regex` to fully customize how tests are run, or use with a single `--language` preset to change the command used for this language.
- `--test-regex`
  Detect integration test files matching this JavaScript regex pattern. If used multiple times, all files matching any one of the patterns are detected.

  Use together with `--app` to fully customize how tests are run, or use with a single `--language` preset to change which files are detected for this language.
- `--language`
  The language presets to use. You can discover and run tests written in multiple languages by passing this flag multiple times (`--language typescript --language python`). Defaults to all supported languages. Currently supported language presets are:
  - `javascript`:
    - File RegExp: `^integ\..*\.js$`
    - App run command: `node {filePath}`
  - `typescript`:\
    Note that for TypeScript files compiled to JavaScript, the JS tests will take precedence and the TS ones won't be evaluated.
    - File RegExp: `^integ\..*(?<!\.d)\.ts$`
    - App run command: `node -r ts-node/register {filePath}`
  - `python`:
    - File RegExp: `^integ_.*\.py$`
    - App run command: `python {filePath}`
  - `go`:
    - File RegExp: `^integ_.*\.go$`
    - App run command: `go run {filePath}`

Example:

```bash
integ-runner --update-on-failed --parallel-regions us-east-1 --parallel-regions us-east-2 --parallel-regions us-west-2 --directory ./ --language python
```

This will search for python integration tests recursively from the current directory and then execute them in parallel across `us-east-1`, `us-east-2`, & `us-west-2`.

If you are providing a list of tests to execute, either as CLI arguments or from a file, the name of the test needs to be relative to the `directory`.
For example, if there is a test `aws-iam/test/integ.policy.js` and the current working directory is `aws-iam` you would provide `integ.policy.js`

```bash
integ-runner integ.policy.js
```

### Common Workflow

A common workflow to use when running integration tests is to first run the integration tests to see if there are any snapshot differences.

```bash
integ-runner
```

If there are any differences you might see an output like the output below.

```bash
integ-runner

Verifying integration test snapshots...

  eks-cluster-private-endpoint No Change!
  eks-inference No Change!
  alb-controller No Change!
  eks-oidc-provider No Change!
  eks-bottlerocket-ng No Change!
  eks-cluster No Change!
  fargate-cluster No Change!
  eks-cluster-handlers-vpc No Change!
  eks-helm-asset - Snapshot changed!
Resources
[+] Custom::AWSCDK-EKS-HelmChart Clustercharttestocichart9C188967



Snapshot Results:

Tests:    1 failed, 9 total
Error: Some snapshot tests failed!
To re-run failed tests run: integ-runner --update-on-failed
    at main (packages/@aws-cdk/integ-runner/lib/cli.js:90:15)
error Command failed with exit code 1. 
```

To re-run the integration test for the failed tests you would then run:

```bash
integ-runner --update-on-failed
```

This will run the snapshot tests and collect all the failed tests. It will then re-execute the
integration test for the failed tests and if successful, save the new snapshot.

```bash
integ-runner --update-on-failed

Verifying integration test snapshots...

  eks-cluster-private-endpoint No Change!
  eks-inference No Change!
  alb-controller No Change!
  eks-oidc-provider No Change!
  eks-bottlerocket-ng No Change!
  eks-cluster No Change!
  fargate-cluster No Change!
  eks-cluster-handlers-vpc No Change!
  eks-helm-asset - Snapshot changed!
Resources
[+] Custom::AWSCDK-EKS-HelmChart Clustercharttestocichart9C188967



Snapshot Results:

Tests:    1 failed, 9 total

Running integration tests for failed tests...

Running in parallel across: us-east-1, us-east-2, us-west-2
Running test test/integ.eks-helm-asset.js in us-east-1
  eks-helm-asset Test Succeeded!

Test Results:

Tests:    1 passed, 1 total
```

Nested stack templates are also compared as part of the snapshot. However asset hashes are ignored by default. To enable diff for asset hashes, set `diffAssets: true` of `IntegTestProps`.

#### Update Workflow

By default, integration tests are run with the "update workflow" enabled. This can be disabled by using the `--disable-update-workflow` command line option.

If an existing snapshot is being updated, the integration test runner will first deploy the existing snapshot and then perform a stack update
with the new changes. This is to test for cases where an update would cause a breaking change only on a stack update.

The `integ-runner` will also attempt to warn you if you are making any destructive changes with a message like:

```bash
!!! This test contains destructive changes !!!
    Stack: aws-cdk-lambda-1 - Resource: MyLambdaServiceRole4539ECB6 - Impact: WILL_DESTROY
    Stack: aws-cdk-lambda-1 - Resource: AliasAliasPermissionAF30F9E8 - Impact: WILL_REPLACE
    Stack: aws-cdk-lambda-1 - Resource: AliasFunctionUrlDC6EC566 - Impact: WILL_REPLACE
    Stack: aws-cdk-lambda-1 - Resource: Aliasinvokefunctionurl4CA9917B - Impact: WILL_REPLACE
!!! If these destructive changes are necessary, please indicate this on the PR !!!
```

If the destructive changes are expected (and required) then please indicate this on your PR.

##### New tests

If you are adding a new test which creates a new snapshot then you should run that specific test with `--disable-update-workflow`.
For example, if you are working on a new test `integ.new-test.js` then you would run:

```bash
integ-runner --update-on-failed --disable-update-workflow integ.new-test.js
```

This is because for a new test we do not need to test the update workflow (there is nothing to update).

### integ.json schema

See [@aws-cdk/cloud-assembly-schema/lib/integ-tests/schema.ts](../cloud-assembly-schema/lib/integ-tests/schema.ts)

### Defining an integration test

See the `@aws-cdk/integ-tests` module for information on how to define
integration tests for the runner to exercise.

### Config file

All options can be configured via the `integ.config.json` configuration file in the current working directory.

```json
{
  "maxWorkers": 10,
  "parallelRegions": [
    "eu-west-1",
    "ap-southeast-2"
  ]
}
```

Available options can be listed by running the following command:

```sh
integ-runner --help
```

To use a different config file, provide the `--config` command-line option.
