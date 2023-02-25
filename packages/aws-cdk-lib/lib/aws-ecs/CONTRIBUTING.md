# Contributing to the AWS ECS and AWS ECS Patterns modules

Hiya! Thanks for your interest in contributing to the ECS modules! The [ECS
Developer Experience](https://github.com/orgs/aws/teams/aws-ecs-devx) team
currently owns the following construct libraries:

- [@aws-cdk/aws-ecs](https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/aws-ecs):
  the main construct library for AWS ECS
- [@aws-cdk/aws-ecs-patterns](https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/aws-ecs-patterns):
  a set of simplified, higher-level constructs based on common container-based
application architectures. Great for first-time container developers!
- [@aws-cdk-containers/ecs-service-extensions](https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk-containers/ecs-service-extensions):
  a set of ECS constructs that promote best practices for container
infrastructure by using composable add-ons, such as load balancers and sidecar
containers used for tracing and metric logging. More suitable for advanced
container configuration.

## Find something to work on

Issues related to ECS, ECS Patterns, and ECS Service extensions are tracked on
our public [project board](https://github.com/aws/aws-cdk/projects/2).

If you want to contribute a specific feature or fix you have in mind, check our
[in-flight work](https://github.com/aws/aws-cdk/projects/2#column-8268897) or
[open pull requests](https://github.com/aws/aws-cdk/projects/2#column-11918985)
to see if someone else is already working on it. If an issue has someone
assigned to it in our "In Progress" column, that means they are actively
working on it. Otherwise, any unassigned issue is up for grabs!

If an issue doesn't exist for your feature/fix, please create one using the
appropriate [issue
template](https://github.com/aws/aws-cdk/tree/main/.github/ISSUE_TEMPLATE).

If you're simply looking for any issue to work on, explore our [Backlog of
issues](https://github.com/aws/aws-cdk/projects/2#column-8114389) on the public
project board and find something that piques your interest.  If you are looking
for your first contribution, the ['good first issue'
label](https://github.com/aws/aws-cdk/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
will be of help.

### Let us know what you're working on!
Once you've chosen to work on an existing issue, please **add a comment to
indicate that you are starting work on it!** This will help us assign the
issue to you and keep track of issues being actively worked on, to avoid
duplicate effort.

### Include a design if you can!
For larger features, your contribution is far more likely to be accepted if you:
1. let us know you are working on it!
2. include a design document.

Examples of past designs for the ECS module can be found in under the
[design](https://github.com/aws/aws-cdk/tree/main/design/aws-ecs) directory.

## Breaking Changes
See guidance on breaking changes in the [Contributing Guide](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#breaking-changes).
