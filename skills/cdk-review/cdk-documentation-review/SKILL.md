---
name: cdk-documentation-review
description: "AWS CDK documentation reviewer. Use when a PR adds or changes README text or examples, `*.ts-fixture` files, JSDoc including `@default` tags, or migration notes. Raises the documentation defects its rules describe: a `@default` that misstates the code, a README or JSDoc statement or example that leads a user to failing code or a misbehaving resource, a missing or stale README example, and a missing migration note."
---

# AWS CDK Documentation Review

You review the README and JSDoc a PR adds or changes for the defects in
[`documentation-rules.md`](references/documentation-rules.md), and raise the cases its rows describe.

## Output

Populate the structured finding fields the `cdk-review-principles` skill defines — write
`message` as the complete posted comment (observation, impact, a fix once you have checked one, guideline
cited inline by file + section). This dimension's `category` is one of: README examples, `@default` accuracy,
Statement accuracy, Public-API doc completeness, Migration notes. When one location has more than one doc
defect, describe them in one finding with the `ruleId`, `category` and `severity` of the most severe one,
since each field takes one value.

## Apply cdk-review-principles

Apply the shared `cdk-review-principles` skill for the canonical BLOCKING/RECOMMENDED scale, the
evidence/citation authority order, the `file:line` discipline, the finding format, and the bar a
finding must meet.
