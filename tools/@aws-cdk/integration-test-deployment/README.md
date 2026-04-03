# CDK Integration Test Deployment

A tool for running AWS CDK integration tests against changed snapshots using AWS Atmosphere for environment allocation.

## Overview

This tool automatically detects changed integration test snapshots in the CDK repository and runs them against real AWS environments managed by Atmosphere. It ensures that CDK changes don't break existing functionality by testing them in isolated AWS accounts.

This tool is used by two workflows:
- [Integration Test Deployment](../../../.github/workflows/integration-test-deployment.yml) - Label-triggered with manual approval
- [Integration Test Deployment (Auto)](../../../.github/workflows/integration-test-deployment-auto.yml) - Auto-triggered on CDK team approval (shadow mode)

## Features

- **Automatic Change Detection**: Filters through the changed files to detect the integration tests
- **Preflight Check**: Validates that the PR is approved by a CDK team member before running tests
- **AWS Environment Management**: Integrates with AWS Atmosphere for temporary AWS account allocation
- **Isolated Testing**: Each test run gets its own AWS environment with proper credentials
- **Cleanup**: Automatically releases AWS resources after test completion

## Prerequisites

Authenticating to assume atmosphere role through OIDC token.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CDK_ATMOSPHERE_ENDPOINT` | AWS Atmosphere service endpoint |
| `CDK_ATMOSPHERE_POOL` | AWS account pool name for allocation |
| `CDK_ATMOSPHERE_OIDC_ROLE` | IAM role ARN for OIDC authentication |
| `CDK_ATMOSPHERE_BATCH_SIZE` | (Optional) Number of tests to run in parallel |
| `TARGET_BRANCH_COMMIT` | Base branch commit SHA for diff |
| `SOURCE_BRANCH_COMMIT` | PR head commit SHA for diff |
| `GITHUB_TOKEN` | (Optional) GitHub token for preflight check |
| `GITHUB_REPOSITORY` | (Optional) Repository in format `owner/repo` |
| `PR_NUMBER` | (Optional) Pull request number |

## Preflight Check

When GitHub context is provided (`GITHUB_TOKEN`, `GITHUB_REPOSITORY`, `PR_NUMBER`), the tool performs a preflight check before running integration tests:

1. **Snapshot Changes**: Verifies the PR contains `.snapshot` file changes
2. **Authorization**: Checks if the PR is approved by a CDK team member (`@aws/aws-cdk-team`)

If the preflight check fails, the tool exits gracefully without running tests. This prevents unnecessary test runs on PRs that haven't been reviewed by the CDK team yet.

## Development 

```bash
# Directory of the tool
cd tools/@aws-cdk/integration-test-deployment/

# Install dependencies
yarn install

# Build
yarn build

# Run tests
yarn test
```

## Usage

```bash
# Set required environment variables
export CDK_ATMOSPHERE_ENDPOINT="https://your-atmosphere-endpoint"
export CDK_ATMOSPHERE_POOL="your-pool-name"

# Run the tool
yarn --cwd tools/@aws-cdk/integration-test-deployment/ integration-test-deployment
```

## Deployment Options

This tool supports two deployment modes:

### 1. Atmosphere Mode (CI/CD)
Uses AWS Atmosphere to automatically provision temporary AWS credentials and isolated test environments. This mode requires special OIDC permissions and is primarily used in CI/CD pipelines.

**Limitations**: Cannot be run locally due to Atmosphere's authentication requirements.

### 2. Local Mode (Development)
Run the `deployIntegrationTests` function directly using your own AWS credentials. This allows local testing against your AWS account.

**Requirements**: Valid AWS credentials must be provided via function parameters

## How It Works

1. **Change Detection**: Scans Git diff for modified `integ.*.js` files
2. **Environment Allocation**: Requests temporary AWS account from Atmosphere
3. **Test Execution**: Runs `yarn integ-runner` with allocated AWS credentials
4. **Cleanup**: Releases AWS environment regardless of test outcome
5. **Result**: Exits with success/failure based on test results


## License

Apache-2.0