---
name: cdk-review-principles
description: "Shared foundation every CDK review-dimension skill applies — how a finding takes BLOCKING or RECOMMENDED from the rule it cites, including a rule's Tier line; when a defect is a finding; how to verify a fact before posting; which sources to cite and in what order; when to offer a fix; the bar a finding must meet to be posted; the reviewer's tone; what no dimension flags; and the fields each finding carries, including its rule ID and cited source. Apply whenever conducting a CDK PR review, rating a finding's severity, deciding whether something is a finding at all, or turning a finding into a posted comment."
---

# Review Principles

## Severity

A finding takes the tier of the rule it cites: the tier in the rule's header, or the tier its Tier
line gives when that line's condition holds.

- **BLOCKING** — must be fixed before merge.
- **RECOMMENDED** — should be fixed before merge.

The `severity` field takes one of these two words.

- **Confidence is not severity.** Keep the rule's tier even when you are unsure the path is
  reached.
- **Politeness is not severity.** Keep the tier however the comment is worded: a BLOCKING
  finding raised as a gentle question — "Can we scope this to a specific ARN?" — is still
  BLOCKING.

## When a defect is a finding

- **No harm, no finding.** Clean code reports nothing. A change that merely *mentions* IAM,
  encryption, or a secret is not a finding; a concrete new harm is. Turning a non-finding into
  a low-severity finding is the most common way a review posts findings it should not. A defect
  is a finding only when you can name its harm: something that breaks, a security boundary that
  opens, a permission or default wider than the code needs, a maintainability cost, or a trap
  a later reader would act on.
- **Only harm this PR introduces.** Review what the diff adds or changes. A pre-existing
  wildcard the PR merely moved does zero *new* harm → not a finding.

## Verification

Before you post, confirm the fact the finding turns on: whether an attribute, mode, default or
enum value is real for the service, or how the service behaves, by searching and reading the
authoritative AWS documentation available to you; what CDK's own API does, by reading that code;
and what CDK's testing or README guidance says, by reading that guide. Post only what you have read, and cite
the page you read in `reference`. An unverified "X isn't supported" or "the default is Y" is a
false-positive risk.

## Evidence

Cite at least one source for every non-trivial finding, strongest authority first: AWS
documentation (service behavior) → CDK source code (precedent, linked by file + line) → CDK
design guidelines (`docs/DESIGN_GUIDELINES.md`, `docs/AGENTS_CONSTRUCT_DESIGN.md`,
`docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md`) → CloudFormation resource specification
(property/enum correctness) → linked issue / PR discussion (customer context) → existing tests
(behavioral expectations). When the code and the AWS documentation disagree, report the
disagreement and cite both.

## Suggested fix

Offer a fix once you have checked it: a code example, or a question framing a specific
alternative ("What do you think about scoping this to the bucket ARN?"). You have checked a
fix when you have read that what it uses exists at the reviewed commit and that the code
depending on what it changes still fits it, because an unchecked fix can break where it is
applied. Without a checked fix, report the problem and its evidence and leave `suggestedFix`
null. A fix you suggest follows the same guides as the code under review.

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
- **Release-tooling / monorepo markers** — `0.0.0` workspace or alpha versions, `V2NEXT`
  changelog placeholders, maturity banners; flag one only if you have verified the specific
  value is actually wrong.

## Sources

Public aws/aws-cdk `main` guidance:

- [`AGENTS.md`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md) — the agent-facing
  repo guide; its rules name their own harm.
- [`CONTRIBUTING.md`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md) — PR
  conventions and breaking-change guidance.
- [`docs/DESIGN_GUIDELINES.md`](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md),
  and the agent-optimized
  [`docs/AGENTS_CONSTRUCT_DESIGN.md`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md)
  / [`docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md) — CDK API design conventions.
