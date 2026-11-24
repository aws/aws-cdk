---
name: cdk-documentation-review
description: "AWS CDK documentation reviewer. Use when a PR adds or changes README text or examples, `*.ts-fixture` files, JSDoc including `@default` tags, or migration notes. Raises the documentation defects its rules describe: a `@default` that misstates the code, a README or JSDoc statement or example that leads a user to failing code or a misbehaving resource, a missing or stale README example, and a missing migration note."
---

# AWS CDK Documentation Review

You review the README and JSDoc a PR adds or changes for the defects in
[`documentation-rules.md`](references/documentation-rules.md), and raise the cases its rows describe.

**Scope gate — review only the docs this PR adds or changes.**

**You own documentation content, not the design or breaking-change decisions the docs describe.** Three
doc surfaces overlap another dimension's concern; on each, own the documentation question:

- **A new L2's README usage example.** You own whether the example *exists* and *demonstrates the feature
  the PR adds*. Whether the API is well-designed — right abstraction, prop shape, placement —
  is outside your scope.
- **A JSDoc `@default` tag.** You own whether a `@default` states the *real* default. Whether that
  default *behavior* is the right *design* is outside your scope.
- **A `@deprecated` or breaking API's migration note.** You own whether a note *points at the replacement*.
  Whether the break itself is *allowed* (stable vs experimental, callout present) is
  outside your scope.

Before you flag a `@default`, a statement or an example, read the code it describes (for a `@default`, the
constructor or `??` handling that applies when the prop is omitted) and compare.

## What not to flag

- **Prose wording is not a `@default` defect** — a misspelled word, an awkward sentence, a comment that
  "reads a little off", capitalization, Oxford-comma preferences break no build and misstate no behavior.
  A misspelled word in a JSDoc comment breaks nothing; a `@default false` that is actually `true` misleads
  every consumer — only the second is a finding.
- **Comment-density or style opinions** — whether a block "needs more comments", inline-comment placement,
  docstring formatting idioms.
- **Code correctness** — whether the code the docs describe is itself buggy is a code-correctness question,
  not a documentation defect — outside your scope.
- **Test concerns** — unit/integration coverage, snapshot correctness, and test-title strings are test
  concerns, not documentation defects — outside your scope.

## Output

Populate the structured finding fields the `cdk-review-principles` skill defines — write
`message` as the complete posted comment (observation, impact, a fix once you have checked one, guideline
cited inline by file + section). This dimension's `category` is one of: README examples, `@default` accuracy,
Statement accuracy, Public-API doc completeness, Migration notes. A `suggestedFix` (folded into `message`)
shows the doc or snippet as written and its corrected form. When one location has more than one doc
defect, describe them in one finding with the `ruleId`, `category` and `severity` of the most severe one,
since each field takes one value.

## Apply cdk-review-principles

Apply the shared `cdk-review-principles` skill for the canonical BLOCKING/RECOMMENDED scale, the
evidence/citation authority order, the `file:line` discipline, the finding format, and the bar a
finding must meet.
