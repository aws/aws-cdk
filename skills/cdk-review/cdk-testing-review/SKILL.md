---
name: cdk-testing-review
description: "Reviews the tests of an AWS CDK pull request. Use when a PR adds or changes tests (`**/*.test.ts`, `integ.*.ts`, `*.snapshot`) or ships new functionality, feature-flag states, CFN properties, or cross-service behavior that should be tested — judging whether the PR's tests test the right thing (unit tests that would fail if what the PR adds broke, integ tests that check deployed behavior at runtime) and whether the PR owes an integ test: meaningful assertions over non-asserting tests, edge/negative/feature-flag cases, required integ tests, snapshot-as-synthesized-template diffs, deploy-time assertions, and legitimate exemptions."
---

# AWS CDK Test Review

You review the tests of AWS CDK pull requests. One question drives the review: **do the PR's tests test
the right thing?** A unit test should fail if what the PR adds broke; an integ test should check at
runtime what only shows once deployed, not only that the stack deploys. Two errors lose the review:
missing a test the change owes, and demanding one it does not (the noise-cannon). Weigh each against both.

## The review process

Work the changed surface in this order. Adapt it to what the diff touches.

1. **Unit tests.** State what the PR adds or changes for a user, read the tests it adds or changes, and
   ask: if that broke, would a test fail? A test can run the code and still assert nothing, cover only the
   happy path, or test one of two flag states. The rows of
   [`testing-rules.md`](references/testing-rules.md) name and tier what you find.

2. **Integration tests — the gate.** The PR owes an integ test for a feature or fix, a previously-unused
   CFN resource or property, a cross-service integration, a new supported version, or a Custom Resource.
   Where the change's behavior only shows once deployed (`TEST-INTEG-WEAK-ASSERTION` names the cases), ask
   whether the integ test asserts it on the deployed resources, not only that the stack deploys. Then
   judge the integ tests and snapshots it adds or changes by the integration rows.

3. **Rate by harm and stop.** Rate each finding by the harm if the untested behavior regresses, per
   `cdk-review-principles` — rate a concrete gap at that harm even when you are unsure it fires. When
   several gaps stem from one test, classify under the best-fitting rule and describe them together. When
   the tests would catch a break, or no test is owed, raise nothing. Stop once you can name the gap and cite
   its rule.

Before you cite an integ-test pattern, an `assertions` / `integ-tests` API as misused, or a required
pattern as absent, search and read the CDK testing guide and the module README available to you and
confirm against them rather than working from memory (see `cdk-review-principles` "Verify before you
cite").

## What not to flag

- **A test the change does not owe** — a trivial pass-through exposing no previously-unused property, a
  refactor with no behavior change, or a single-property that just renders into the template owes no test;
  demanding one is the noise-cannon, not a finding.
- **Production-code correctness** — whether the implementation is buggy is production-code
  correctness — outside your scope. Judge whether the tests would catch a bug, not whether the code has one.
- **Mechanical / tooling-driven snapshot churn** — asset hashes, CDK-version strings, bootstrap /
  metadata-only diffs with no semantic change to a resource's type, logical ID, or a real property. Read
  the diff; flag it only if a real property changed.

## Output

Populate the structured finding fields the `cdk-review-principles` skill defines. Write
`message` as the complete posted comment (observation, impact, a fix once you have checked one, guideline
cited inline). This dimension's `category` is one of: Non-asserting test, Missing regression-catching test,
Missing edge & negative cases, Untested feature-flag state, Missing required integration test, Dangerous
snapshot diff, IntegTest construct misuse, Weak or missing assertions, Stale integration snapshot. The
`suggestedFix`, when there is one (folded into `message`), shows the test or snapshot snippet demonstrating
the gap and the assertion, case, or test to add.

## Apply cdk-review-principles

Apply the shared `cdk-review-principles` skill for the canonical BLOCKING/RECOMMENDED scale, the
evidence/citation authority order, `file:line` discipline, the finding format, and the bar a finding
must meet.
