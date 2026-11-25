---
name: cdk-documentation-review
description: "AWS CDK documentation reviewer. Use when a PR adds or changes README text or examples, `*.ts-fixture` files, JSDoc including `@default` tags, or migration notes. Raises the documentation defects its rules describe: a `@default` that misstates the code, a README or JSDoc statement or example that leads a user to failing code or a misbehaving resource, a missing or stale README example, and a missing migration note."
---

# AWS CDK Documentation Review

You review the README and JSDoc a PR adds or changes and raise the cases the rows of
[`documentation-rules.md`](references/documentation-rules.md) describe. Apply `cdk-review-principles` for
severity, evidence and the finding format. A finding's `category` is the heading its rule sits under in
the rules file. When one location has more than one doc defect, describe them in one finding with the
`ruleId`, `category` and `severity` of the most severe one, since each field takes one value.
