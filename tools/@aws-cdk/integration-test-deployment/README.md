# CDK Deployment Integration Test

A tool for running AWS CDK integration tests against changed snapshots using AWS Atmosphere for environment allocation.

## Overview

This tool automatically detects changed integration test snapshots in the CDK repository and runs them against real AWS environments managed by Atmosphere. It ensures that CDK changes don't break existing functionality by testing them in isolated AWS accounts.

This tool is used by the [deployment integration test workflow](../../../.github/workflows/codebuild-pr-deployment-integ.yml).

## Features

- **Automatic Change Detection**: Uses Git diff to identify modified integration test files
- **AWS Environment Management**: Integrates with AWS Atmosphere for temporary AWS account allocation
- **Isolated Testing**: Each test run gets its own AWS environment with proper credentials
- **Cleanup**: Automatically releases AWS resources after test completion

## Prerequisites

Assuming an IAM role authorized by the Atmosphere system is required to run this tool.

## Environment Variables

| Variable | Description
|----------|-------------
| `CDK_ATMOSPHERE_ENDPOINT` | AWS Atmosphere service endpoint
| `CDK_ATMOSPHERE_POOL` | AWS account pool name for allocation

## Usage

```bash
# Set required environment variables
export CDK_ATMOSPHERE_ENDPOINT="https://your-atmosphere-endpoint"
export CDK_ATMOSPHERE_POOL="your-pool-name"

# Run the tool
node bin/deployment.js
```

## How It Works

1. **Change Detection**: Scans Git diff for modified `integ.*.js` files
2. **Environment Allocation**: Requests temporary AWS account from Atmosphere
3. **Test Execution**: Runs `yarn integ-runner` with allocated AWS credentials
4. **Cleanup**: Releases AWS environment regardless of test outcome
5. **Result**: Exits with success/failure based on test results

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode
npm run watch
```

## License

Apache-2.0