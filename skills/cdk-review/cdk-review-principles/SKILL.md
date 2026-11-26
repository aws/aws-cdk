---
name: cdk-review-principles
description: "Shared foundation every CDK review-dimension skill applies — how a finding takes BLOCKING or RECOMMENDED from the rule or guide line it cites, including a rule's Tier line; when a defect is a finding; which modules are stable or experimental; how to verify a fact before posting and which source to cite for it; when to offer a fix; the fields each finding carries, including its rule ID and cited source; and the guides a finding can rest on. Apply whenever conducting a CDK PR review, taking a finding's tier from its rule or guide line, deciding whether something is a finding at all, or turning a finding into a posted comment."
---

# Review Principles

## Severity

- **BLOCKING** — must be fixed before merge.
- **RECOMMENDED** — should be fixed before merge.

A finding's tier comes from what backs it:

- **A rule** — the tier in its header, or the tier of its Tier line once you have confirmed that line's
  condition.
- **A guide line alone** — BLOCKING for MUST or MUST NOT in capitals; RECOMMENDED otherwise. A line whose
  requirement one of your rules states as its case takes that rule's case, tier and Tier lines instead.

## Finding conditions

A defect is a finding when all of these hold:

- **A rule or a guide requires it** — one of your rules states this case, or a line in a guide listed
  under "Guides" requires what the finding asks for, and the finding quotes that line. Cite a rule only
  for the case it states.
- **Impact** — you can state what goes wrong for a user or a maintainer if it ships: something
  fails, does the wrong thing, or costs later work. Judge the change by its effect.
- **Introduced by this PR** — it is in what the diff adds or changes; code the PR only moved counts
  as unchanged.
- **On a line** — it points at a specific line of the diff.
- **Beyond the build** — the PR's build or PR linter does not already fail on it (see
  [`CONTRIBUTING.md § awslint`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#awslint) and
  [`prlint/lint.ts`](https://github.com/aws/aws-cdk/blob/main/tools/@aws-cdk/prlint/lint.ts)). Unless the PR
  carries the matching `pr-linter/exempt-*` label, the PR linter fails a `feat` with no README change,
  a `feat` or `fix` with no test change or with no change to an integ test or none to a snapshot, and a
  breaking change the PR declares for a stable module.

Raise every defect that meets these, and only those; a PR with nothing wrong gets no findings.

## Module stability

A module is experimental when its package's `package.json` has `"stability": "experimental"`, and stable
otherwise.

## Verification

Before you post, confirm the fact the finding turns on by reading its source, and cite that source
in `reference`: the AWS documentation available to you (search it) for how a service behaves, the
CloudFormation resource specification for a property or enum value, the CDK code for what the
library does, the guide for a CDK rule. When the code and the AWS documentation disagree, cite
both.

## Suggested fix

Offer a fix once you have checked that what it uses exists at the reviewed commit and that the
code depending on what it changes still fits. Otherwise report the problem and leave
`suggestedFix` null. A fix follows the same guides as the code under review. Keep any text in a fix
concise and easy to understand.

## Finding format

The fields each finding carries and how to write its `message` are in
[`references/pr-comment-format.md`](references/pr-comment-format.md).

## Guides

A finding can rest on a line in one of these guides:

- [`AGENTS.md`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md)
- [`CONTRIBUTING.md`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md)
- [`docs/DESIGN_GUIDELINES.md`](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md)
- [`docs/AGENTS_CONSTRUCT_DESIGN.md`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md)
- [`docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md)
- [`INTEGRATION_TESTS.md`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md)
