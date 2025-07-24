# CDK Projects Issue Sync

This tool helps maintain the GitHub project board by automatically updating custom fields with issue creation and update dates. This includes addressing the limitation where GitHub Projects doesn't automatically track when issues were last meaningfully updated.

## Features

- Synchronize individual issues metadata with the project board
- Batch synchronize all issues metadata in a project

## Prerequisites

- Node.js and npm/yarn
- GitHub Token with access to the AWS CDK repository and the project board.

## Environment Variables

The tool requires the following environment variables:

- `GITHUB_TOKEN`: GitHub personal access token
- `PROJECT_NUMBER`: The GitHub project number
- `ISSUE_NUMBER`: Required when syncing a single issue

## Installation

```bash
# Clone the repository (if not already done)
git clone https://github.com/aws/aws-cdk.git
cd aws-cdk/tools/@aws-cdk/project-sync

# Install dependencies
yarn install
```

## Usage

### Sync a Single Issue

```bash
# Set required environment variables
export GITHUB_TOKEN=secret_github_token
export ISSUE_NUMBER=12345

# Run the sync
yarn run build && node bin/issue-sync.js
```

### Sync All Issues in a Project

```bash
# Set required environment variables
export GITHUB_TOKEN=secret_github_token
export PROJECT_NUMBER=302  # Optional, defaults to 302

# Run the sync for all issues
yarn issue-sync-all
```

## How It Works

1. The tool fetches issue details from GitHub using the GraphQL API
2. For each issue, it:
   - Determines if the issue is part of the specified project
   - Extracts issue metadata including creation and update date
   - Updates the corresponding custom fields in the GitHub Project with those dates.

## Development

### Build
```bash
# Build the project
yarn build
```

### Test

#### Snapshots
This package uses snapshots of the API requests to test against. These snaphsots are generated via:

```
yarn run gen-snapshots
```

Which runs the scripts defined in `test/snapshots/generate.js`.

#### Run tests

```
yarn test
```

## License

Apache-2.0
