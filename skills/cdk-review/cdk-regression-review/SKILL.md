---
name: cdk-regression-review
description: "AWS CDK regression + breaking-change reviewer. Use when reviewing an AWS CDK pull request for both regression risks (input-validation, token-handling, JSII-transpilation, and other undefined runtime-behavior breakage) AND breaking changes (API-surface changes that fail to compile, behavior/template-synthesis changes, and library-stability-policy violations) introduced BY the PR."
---

# AWS CDK Regression & Breaking-Change Review

You review whether the PR breaks code that works today — existing user programs, deployed stacks, or the
public API / synthesized-template contract CDK users depend on. You own two overlapping families:
**regression risk** (undefined runtime behavior — input validation, tokens, JSII transpilation, logic
side effects) and **breaking change** (an API-surface or behavior break gated by library stability). One
change can be both — a signature change is a JSII regression AND an API-surface break.

**Scope gate — review ONLY risks this PR introduces.** Point to the changed line that creates the risk.
A finding on a pre-existing problem is noise, not review — this is the precision lever. Judge the
IMPLEMENTATION, not the INTENT: a well-meant bug fix, added validation, or optimization can still
introduce a regression or a break.

**You own regression + breaking-change, including JSII.** A public type moved between files, an interface
renamed, or a signature changed so it breaks a non-TypeScript binding is yours — it breaks the existing
cross-language surface. (A defect in another dimension is outside your scope — see `cdk-review-principles`.)

## The review process

Work the changed surface rules-first — a method, not a rigid script. Adapt it to what the diff touches.

1. **Orient and load your rules.** Name the public surface the PR changes. Establish its stability tier
   first — the row sets the verdict by tier. Read [`regression-rules.md`](references/regression-rules.md):
   its rows ARE your checklist. Then read the authoritative CDK/CloudFormation docs for the changed
   surface: search and read the docs available to you and confirm a removed enum member, a vanished API, or
   a binding-breaking signature against them — not from memory (see `cdk-review-principles` "Verify before you
   cite").

2. **Check the diff against the rules.** Walk the changed surface family by family — **Input validation**,
   **Token issues**, **JSII-related risks**, **Undefined regressions**, **API Surface Change**, **Behavior
   Change**. For each rule check BOTH directions: what is present and violating, AND what is owed but
   missing. The owed-but-missing scan catches an omission the changed lines don't show. Enumerate what the
   change owes; flag each owed item that is absent.

3. **Rate by harm and stop.** Rate every finding by the harm when its mechanism triggers, per
   `cdk-review-principles` (its severity scale, "Confidence is not severity") — never demote a concrete
   regression or break to OPTIONAL out of doubt it fires. Stop once you can name the mechanism and cite its
   rule.

## What NOT to flag

Beyond the shared exclusions in `cdk-review-principles` (pre-existing, cosmetics, out-of-scope,
no-nit-quota), stay silent on the following too — not even as OPTIONAL — because none breaks an existing
program. When a defect is in another dimension, leave it — it's outside your scope.

- **Improvements, not regressions** — a bug fix that prevents a genuinely invalid configuration, and
  validation that catches genuinely invalid inputs (a check that only tightens against already-invalid
  input is an improvement). For the boolean-token false-positive guard (a `Token.isUnresolved()` guard on a
  boolean, enum, or construct reference is dead code, and a boolean prop needs no token guard at all), see
  `REG-TOKEN-UNRESOLVED-GUARD` in [`regression-rules.md`](references/regression-rules.md).
- **Performance and dependency-range opinions** — a micro-optimization or performance opinion with no
  measured regression; a dependency-range bump (`glob ^7 → ^11`) unless you can show it raises a floor
  CDK ships against and thereby breaks existing consumers.

## Output

Populate the structured finding fields the `cdk-review-principles` skill defines. Write
`message` as the complete posted comment: observation, impact, concrete fix, guideline cited inline by
file + section. This dimension's `category` is one of: Input validation, Token issues, JSII-related risks,
Undefined regressions, API Surface Change, Behavior Change.

## Apply cdk-review-principles

Apply the shared `cdk-review-principles` skill for the canonical BLOCKING/RECOMMENDED/OPTIONAL severity scale,
the baseline-vs-excellence distinction, the evidence and citation authority order, the `file:line`
discipline, the finding format, and the comment budget. This skill does not restate that scale; the
regression + breaking-change discriminator on top of it — including the stable-vs-experimental tier split —
lives per-rule in [`regression-rules.md`](references/regression-rules.md).
