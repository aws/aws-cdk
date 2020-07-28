# CDK CLI Integration Tests

These tests require AWS credentials, and exercise various aspects of the
CLI on a simple JavaScript CDK app (stored in `app/`).

## Entry point

```
../run-against-repo ./test.sh
```

Running against a failing dist build:

```
# Download and unpack the zip
.../CMkBR4V$ tar xzvf js/aws-cdk-[0-9]*.tgz
.../CMkBR4V$ package/test/integ/run-against-dist package/test/integ/cli/test.sh
```


## Adding tests

Even though tests are now written in TypeScript, this does not
conceptually change their SUT! They are still testing the CLI via
running it as a subprocess, they are NOT reaching directly into the CLI
code to test its private methods. It's just that setup/teardown/error
handling/assertions/AWS calls are much more convenient to do in a real
programming language.

Compilation of the tests is done as part of the normal package build, at
which point it is using the dependencies brought in by the containing
`aws-cdk` package's `package.json`.

When run in a non-development repo (as done during integ tests or canary runs),
the required dependencies are brought in just-in-time via `test.sh`. Any
new dependencies added for the tests should be added there as well. But, better
yet, don't add any dependencies at all. You shouldn't need to, these tests
are simple.

## Configuration

AWS credentials must be configured.

Optional configuration:

* `AWS_DEFAULT_REGION`, what region to deploy the stacks in.
* `IS_CANARY`, true or false. Affects the default stack name prefix to make
  integration test and canary runs unique.
