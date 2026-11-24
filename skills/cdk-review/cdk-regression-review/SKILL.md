---
name: cdk-regression-review
description: "AWS CDK regression + breaking-change reviewer. Use when reviewing an AWS CDK pull request for both regression risks (input-validation, token-handling, JSII-transpilation, and other undefined runtime-behavior breakage) and breaking changes (API-surface changes that fail to compile, behavior/template-synthesis changes, and library-stability-policy violations) introduced by the PR."
---

# AWS CDK Regression & Breaking-Change Review

You review whether the PR breaks code that works today — existing user programs, deployed stacks, or the
public API / synthesized-template contract CDK users depend on. You own two overlapping families:
**regression risk** (undefined runtime behavior — input validation, tokens, JSII transpilation, logic
side effects) and **breaking change** (an API-surface or behavior break gated by library stability).

**Scope gate — review only risks this PR introduces.** Point to the changed line that creates the risk.
Judge the implementation: a well-meant bug fix, added validation, or optimization can still introduce a
regression or a break.

**You own regression + breaking-change, including JSII.** A change that breaks a non-TypeScript binding is
yours — it breaks the existing cross-language surface. (A defect in another dimension is outside your
scope — see `cdk-review-principles`.)

## The review process

Work the changed surface rules-first. Adapt it to what the diff touches.

1. **Orient and load your rules.** Name the public surface the PR changes. Establish first whether its
   module is stable or experimental, since the breaking-change rows rate by it. Read
   [`regression-rules.md`](references/regression-rules.md): its rows are your checklist. Then confirm a
   removed enum member, a vanished API, or a binding-breaking signature by reading the code, and a
   CloudFormation or service fact the finding turns on against the CloudFormation and AWS documentation
   available to you — not from memory (see `cdk-review-principles` "Verify before you cite").

2. **Check the diff against the rules.** For each rule check both directions: what is present and
   violating, and what is owed but missing. The owed-but-missing scan catches an omission the changed
   lines don't show. Enumerate what the change owes; flag each owed item that is absent.

3. **Rate by harm and stop.** Rate every finding by the harm when its mechanism triggers, per
   `cdk-review-principles` (its severity scale, "Confidence is not severity") — rate a concrete regression
   or break at that harm even when you doubt it fires. Stop once you can name the mechanism and cite its
   rule.

## What not to flag

- **Performance and dependency-range opinions** — a micro-optimization or performance opinion with no
  measured regression; a dependency-range bump (`glob ^7 → ^11`) unless you can show it raises a floor
  CDK ships against and thereby breaks existing consumers.

## Output

Populate the structured finding fields the `cdk-review-principles` skill defines. Write
`message` as the complete posted comment: observation, impact, a fix when you have one, guideline cited
inline by file + section. This dimension's `category` is one of: Input validation, Token issues,
JSII-related risks, Undefined regressions, API Surface Change, Behavior Change.

## Apply cdk-review-principles

Apply the shared `cdk-review-principles` skill for the canonical BLOCKING/RECOMMENDED/OPTIONAL severity
scale, the baseline-vs-excellence distinction, the evidence and citation authority order, the `file:line`
discipline, the finding format, and the bar a finding must meet.
