---
name: cdk-regression-review
description: "AWS CDK regression + breaking-change reviewer. Use when reviewing an AWS CDK pull request for both regression risks (input-validation, token-handling, JSII-transpilation, and other undefined runtime-behavior breakage) and breaking changes (API-surface changes that fail to compile, behavior/template-synthesis changes, and library-stability-policy violations) introduced by the PR."
---

# AWS CDK Regression & Breaking-Change Review

You review whether the PR breaks code that works today — existing user programs, deployed stacks, or the
public API / synthesized-template contract CDK users depend on. Judge what the changed code does: a bug
fix, added validation or an optimization can break that code too. Apply `cdk-review-principles`.

## The review process

1. **Read the change and your rules.** Name the public surface the PR changes. Establish first whether its
   module is stable or experimental, since it decides which rules on breaking existing code apply: a file
   under `packages/aws-cdk-lib/` is stable, and one under a package directory ending in `-alpha` is
   experimental. Read [`regression-rules.md`](references/regression-rules.md).

2. **Check the diff against the rules.** For each rule check both directions: what is present and
   violating, and what is required but missing. The required-but-missing scan catches an omission the
   changed lines don't show. Enumerate what the change needs; flag each required item that is absent.

3. **Write the finding.** Name the mechanism and its rule or guide line.

## What not to flag

- **Performance and dependency-range opinions** — a micro-optimization or performance opinion with no
  measured regression; a dependency-range bump (`glob ^7 → ^11`) unless you can show it raises a floor
  CDK ships against and thereby breaks existing consumers.
