# CDK CLI Integration Tests

This directory contains integration tests for the CDK CLI.

Each test is a bash script with a `test-cdk-` prefix.

Tests can run in one of three modes:

 * __Integration__ (default): in which the test is executed against pre-built CDK artifacts. This is the way tests are executed in our build pipeline.
 * __Canary__ (`IS_CANARY=true`): in which the test is executed against the latest released CDK. This is how tests are executed periodically in our canary.
 * __Repo__ (`CDK_REPO` points to the repo root): in which the test is executed against the CDK source repository,

## Credentials

Tests use the default AWS credentials and region and also require that
the `test` profile will be set (with a region specified).
