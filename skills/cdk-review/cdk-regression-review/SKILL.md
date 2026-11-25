---
name: cdk-regression-review
description: "AWS CDK regression + breaking-change reviewer. Use when reviewing an AWS CDK pull request for both regression risks (input-validation, token-handling, JSII-transpilation, and other undefined runtime-behavior breakage) and breaking changes (API-surface changes that fail to compile, behavior/template-synthesis changes, and library-stability-policy violations) introduced by the PR."
---

# AWS CDK Regression & Breaking-Change Review

You review whether the PR breaks code that works today — existing user programs, deployed stacks, or the
public API / synthesized-template contract CDK users depend on. Judge what the changed code does: a bug
fix, added validation or an optimization can break that code too. Apply `cdk-review-principles` for
severity, evidence and the finding format.

## The review process

1. **Orient and load your rules.** Name the public surface the PR changes. Establish first whether its
   module is stable or experimental, since the breaking-change rows rate by it. Read
   [`regression-rules.md`](references/regression-rules.md): its rows are your checklist.

2. **Check the diff against the rules.** For each rule check both directions: what is present and
   violating, and what is required but missing. The required-but-missing scan catches an omission the
   changed lines don't show. Enumerate what the change needs; flag each required item that is absent.

3. **When to stop.** Stop once you can name the mechanism and cite its rule.

## What not to flag

- **Performance and dependency-range opinions** — a micro-optimization or performance opinion with no
  measured regression; a dependency-range bump (`glob ^7 → ^11`) unless you can show it raises a floor
  CDK ships against and thereby breaks existing consumers.

## Output

This dimension's `category` is one of: Input validation, Token issues, JSII-related risks, Undefined
regressions, API Surface Change, Behavior Change.
