---
name: cdk-review-principles
description: "Shared foundation every CDK review-dimension skill applies — how a finding takes BLOCKING or RECOMMENDED from the rule it cites, including a rule's Tier line; when a defect is a finding; how to verify a fact before posting and which source to cite for it; when to offer a fix; the bar a finding must meet to be posted; the reviewer's tone; what no dimension flags; and the fields each finding carries, including its rule ID and cited source. Apply whenever conducting a CDK PR review, rating a finding's severity, deciding whether something is a finding at all, or turning a finding into a posted comment."
---

# Review Principles

## Severity

A finding takes the tier of the rule it cites: the tier in the rule's header, or the tier its Tier
line gives when that line's condition holds.

- **BLOCKING** — must be fixed before merge.
- **RECOMMENDED** — should be fixed before merge.

The `severity` field takes one of these two words. Keep the rule's tier when you are unsure the
path is reached, and however the comment is worded.

## When a defect is a finding

A defect is a finding when you can state its impact and the PR introduces it:

- **Impact** — what goes wrong for a user or a maintainer if it ships. Judge what the change
  does, whatever topic it touches.
- **Introduced by this PR** — it is in what the diff adds or changes; code the PR only moved
  counts as unchanged.

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

## Findings must meet the bar

A finding is posted, at its tier, when it meets the posting conditions below, and only then.
The number of findings is not a target: there is none to reach and none to stay under, and
zero comments is the right result for a PR with nothing wrong. A count would choose findings
by number rather than by merit.

A finding becomes a posted comment only when it is (1) tied to a specific line, (2)
actionable, and (3) significant enough to stand alone. Keep high-level observations,
positive notes, and clusters of minor points in the review summary.

Spend the review on what the build cannot see. The PR's build already fails on what its
compiler and linters check, such as a public API with no docstring or an optional props
property with no `@default` (see
[`CONTRIBUTING.md § awslint`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#awslint)).

See [`references/pr-comment-format.md`](references/pr-comment-format.md) for the
structured finding fields and how to write each one before you generate findings.

## What not to flag

- **Cosmetics** — typos, comment/docstring wording, whitespace, formatting, naming
  preferences, idiom choices, test-title / `test.each` label strings. A misspelled comment
  breaks nothing.
- **A defect none of your rules describes** — raise only what one of your rules describes.

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
