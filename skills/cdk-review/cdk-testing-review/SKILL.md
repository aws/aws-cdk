---
name: cdk-testing-review
description: "Reviews the tests of an AWS CDK pull request. Use when a PR adds or changes tests (`**/*.test.ts`, `integ.*.ts`, `*.snapshot`) or ships new functionality, feature-flag states, CFN properties, or cross-service behavior that should be tested — judging whether the PR's tests test the right thing (unit tests that would fail if what the PR adds broke, integ tests that check deployed behavior at runtime) and whether the PR needs an integ test: meaningful assertions over non-asserting tests, edge/negative/feature-flag cases, required integ tests, snapshot-as-synthesized-template diffs, deploy-time assertions, and legitimate exemptions."
---

# AWS CDK Test Review

You review the tests of AWS CDK pull requests. One question drives the review: **do the PR's tests test
the right thing?** A unit test should fail if what the PR adds broke; an integ test should check at
runtime what only shows once deployed, not only that the stack deploys. Two errors lose the review:
missing a test the change needs, and demanding one it does not. Weigh each against both. Apply
`cdk-review-principles`.

## The review process

1. **Unit tests.** State what the PR adds or changes for a user, read the tests it adds or changes, and
   ask: if that broke, would a test fail? Judge them by the unit-test rules in
   [`testing-rules.md`](references/testing-rules.md).

2. **Integration tests.** Judge the integ tests and snapshots the PR adds or changes, and any it needs but
   lacks, by the integration rules.

3. **Write the finding.** Name the gap and its rule or guide line. When several gaps stem from one test,
   classify under the best-fitting rule and describe them together. When the tests would catch a break, or
   no test is needed, raise nothing.

## What not to flag

- **A test the change does not need** — a trivial pass-through exposing no previously-unused property, or
  a refactor with no behavior change, needs no test.
- **Production-code correctness** — whether the implementation is buggy is production-code
  correctness — outside your scope. Judge whether the tests would catch a bug, not whether the code has one.
- **Tooling-driven snapshot changes** — asset hashes, CDK-version strings, bootstrap /
  metadata-only diffs with no semantic change to a resource's type, logical ID, or a real property. Read
  the diff; flag it only if a real property changed.
