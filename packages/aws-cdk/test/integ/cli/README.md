# CDK CLI Integration Tests

These tests require AWS credentials, and exercise various aspects of the
CLI on a simple JavaScript CDK app (stored in `app/`).

## Entry point

```
./test.sh
```

## Configuration

AWS credentials must be configured.

Optional configuration:

* `AWS_DEFAULT_REGION`, what region to deploy the stacks in.
* `STACK_NAME_PREFIX`, used to run multiple instances of these tests in the
  same account side-by-side without them stepping on each other. Using
  a unique name on every run is risky since the account may overflow with
  stacks if cleanup happens to fail. Defaults based on the value of `IS_CANARY`
  if not supplied.
* `IS_CANARY`, true or false. Affects the default stack name prefix to make
  integration test and canary runs unique.
