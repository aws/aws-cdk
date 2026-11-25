---
name: cdk-review-principles
description: "Shared foundation every CDK review-dimension skill applies — how a finding takes BLOCKING or RECOMMENDED from the rule it cites, including a rule's Tier line; when a defect is a finding; how to verify a fact before posting and which source to cite for it; when to offer a fix; and the fields each finding carries, including its rule ID and cited source. Apply whenever conducting a CDK PR review, taking a finding's tier from its rule, deciding whether something is a finding at all, or turning a finding into a posted comment."
---

# Review Principles

## Severity

A finding takes the tier of the rule it cites: the tier in the rule's header, or the tier its Tier
line gives when that line's condition holds.

- **BLOCKING** — must be fixed before merge.
- **RECOMMENDED** — should be fixed before merge.

The `severity` field takes one of these two words. A finding that rests on a guide line alone is
RECOMMENDED. A Tier line's tier applies once you have confirmed its condition; until then the lower tier
applies. The tier stays the same however the comment is worded.

## When a defect is a finding

A defect is a finding when all of these hold:

- **A rule or a guide requires it** — one of your rules states this case, or a line in a guide under
  "Sources" requires what the finding asks for, and the finding quotes that line. Cite a rule only for
  the case it states.
- **Impact** — you can state what goes wrong for a user or a maintainer if it ships: something
  fails, does the wrong thing, or costs later work. Judge the change by its effect.
- **Introduced by this PR** — it is in what the diff adds or changes; code the PR only moved counts
  as unchanged.
- **On a line** — it points at a specific line of the diff.
- **Beyond the build** — the PR's build does not already fail on it (see
  [`CONTRIBUTING.md § awslint`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#awslint)).

Raise every defect that meets these, and only those; a PR with nothing wrong gets no findings.

## Verification

Before you post, confirm the fact the finding turns on by reading its source, and cite that source
in `reference`: the AWS documentation available to you (search it) for how a service behaves, the
CloudFormation resource specification for a property or enum value, the CDK code for what the
library does, the guide for a CDK rule. When the code and the AWS documentation disagree, cite
both.

## Suggested fix

Offer a fix once you have checked that what it uses exists at the reviewed commit and that the
code depending on what it changes still fits. Otherwise report the problem and leave
`suggestedFix` null. A fix follows the same guides as the code under review.

## Finding format

The fields each finding carries and how to write its `message` are in
[`references/pr-comment-format.md`](references/pr-comment-format.md).

## Sources

Public aws/aws-cdk `main` guidance:

- [`AGENTS.md`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md) — the agent-facing
  repo guide.
- [`CONTRIBUTING.md`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md) — PR
  conventions and breaking-change guidance.
- [`docs/DESIGN_GUIDELINES.md`](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md),
  and the agent-optimized
  [`docs/AGENTS_CONSTRUCT_DESIGN.md`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md)
  / [`docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md) — CDK API design conventions.
- [`INTEGRATION_TESTS.md`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md) — when
  integration tests are required and how to write them.
