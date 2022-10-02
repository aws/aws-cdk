# AWS CDK GitHub Actions

These workflows and actions are configured in the AWS CDK GitHub repository.

## Pull Request Triggered

### Auto Approve
[auto-approve.yml](auto-approve.yml): Approves merging PRs with the
`auto-approve` label.
Owner: Core CDK team

### PR Linter
[pr-linter.yml](pr-linter.yml): Runs `tools/@aws-cdk-prlint` on each PR to
check for correctness.
Owner: Core CDK team

### v2-main PR automation
[v2-pull-request.yml](v2-pull-request.yml): Runs `pkglint` on merge forward PRs
and commits the results.
Owner: Core CDK team

### Label Assigner
[issue-label-assign.yml](issue-label-assign.yml): Github action for automatically adding labels and/or setting assignees when an Issue or PR is opened or edited based on user-defined Area
Owner: CDK support team

### PR Labeler
[pr-labeler.yml](pr-labeler.yml): GitHub action for automatically porting triage labels from issues 
linked in the PR description to the PR.
Owner: Core CDK team

### GitHub Merit Badger
[github-merit-badger.yml](github-merit-badger.yml): GitHub action that adds 'merit badges' to pull
requests based on the users prior contributions to the CDK.
Owner: Core CDK team

## Issue Triggered

### Closed Issue Message
[closed-issue-message.yml](closed-issue-message.yml): Adds a reminder message
to issues that are closed.
Owner: CDK support team

### Label Assigner
[issue-label-assign.yml](issue-label-assign.yml): Github action for automatically adding labels and/or setting assignees when an Issue or PR is opened or edited based on user-defined Area
Owner: CDK support team

## Scheduled Actions

### Issue Lifecycle Handling
[close-stale-issues.yml](close-stale-issues.yml): Handles labeling issues and
PRs with `closing-soon`, `response-requested`, etc.
Owner: CDK support team

### Yarn Upgrader
[yarn-upgrade.yml](yarn-upgrade.yml): Upgrades yarn dependencies and creates a
patch file for downloading.
Owner: Core CDK team

### Issue Reprioritizer
[issue-reprioritization.yml](issue-reprioritization.yml): GitHub action that labels `p2`
issues as `p1` if a certain level of community engagement is met.
Owner: Core CDK team