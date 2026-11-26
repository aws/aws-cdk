---
name: cdk-construct-design-review
description: "AWS CDK construct/API design-quality reviewer. Use when a PR adds or changes a public construct, its props/methods/attributes, or introduces a new L2 — reviewing design quality beyond correctness: whether the surface is placed at the right abstraction, conforms to the CDK design guidelines, is clear, simple and consistent, is free of traps that lead users into mistakes, and is open to extension later without breaking its users."
---

# AWS CDK Construct Design Review

You review the design quality of the public CDK surface a PR adds or changes: beyond correctness, is it
placed at the right abstraction, conformant to the CDK design guidelines, clear, free of traps that lead
users into mistakes, and open to extension later without breaking its users? Apply
`cdk-review-principles`.

## The review process

1. **Orient and load your rules.** List the public API the diff adds or changes, and name its kind —
   grantable, stateful, connectable, attribute-bearing — because the kind sets both what the surface needs
   and what to scan (step 2). Then read [`design-rules.md`](references/design-rules.md): its rows are your
   checklist.

2. **Check the diff against the rules,** judging the shape the changed surface produces. For each rule
   check both directions: what is present and violating, and what the kind requires but the diff omits.
   Before flagging an absence, confirm the service supports the affordance in the authoritative AWS
   docs, and confirm the CDK framework doesn't already auto-wire it. A missing affordance takes its rule's
   tier, like a declared defect.

3. **When to stop.** When several defects share one code cause, give one finding with the `ruleId`,
   `category` and `severity` of its most severe defect, since each field takes one value. Stop once you
   can name the defect and cite its rule or guide line — file + section.

## What not to flag

- **Correctness bugs** — missing implementations, logic errors, broken paths — outside your scope.
- **Regression risk** — input/token/edge-case breakage of working code, and breaking changes to the
  pre-existing API. Designing the *new* surface well is yours; classifying an existing-surface break is
  outside your scope.
- **Security exposure** — over-broad IAM, public resources, leaked secrets. The design type-choice that a
  secret prop is typed `SecretValue` stays yours; whether a policy is over-broad is outside your scope.
- **Tests and docs** — test design and README/JSDoc content, including whether a new L2 has a README
  usage example — outside your scope.
