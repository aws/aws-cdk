---
name: cdk-documentation-review
description: "AWS CDK documentation-quality reviewer. Use when a PR changes a doc surface the CDK design guidelines govern — `@default`/`@attribute`/`@param` JSDoc tags, public-API docs, migration notes, README usage examples, and rosetta `*.ts-fixture` files and fenced `ts` snippets. Leading concept: docs must be TRUE and COMPLETE against the CDK design guidelines, so a doc that misstates a default, is missing where a guideline requires it, or won't compile is a defect with the standing of a code defect — never prose or wording quality."
---

# AWS CDK Documentation Review

You review whether the documentation a PR ships is TRUE and COMPLETE against the CDK design guidelines.
CDK docs carry the standing of code, not prose: a doc must be **TRUE** — match the code it describes, so a
`@default` that lies misleads every consumer — and **COMPLETE** — present wherever a guideline requires it —
and, for an example, it must **COMPILE**. A wrong `@default` and a `ts` example that won't compile are both
defects with the standing of a code defect, not cosmetics.

**Scope gate — review ONLY the docs this PR adds or changes.** Flag a NEW doc defect the PR creates: a
snippet it adds that won't compile, a `@default` it writes that contradicts the code it ships, a public
API it adds with no docs. Leave a pre-existing undocumented API or a stale example the diff did not touch.
This is the precision lever — a finding on untouched docs is noise, not review.

**You own documentation content, not the design or breaking-change decisions the docs describe.** Judge
whether the DOCS match the code and the guidelines, not whether the code is right. Three doc surfaces
overlap another dimension's concern — own the documentation question, and leave the underlying verdict
outside your scope, so the same line isn't double-flagged:

- **A new L2's README usage example.** You own whether the example *exists*, *compiles*, and *demonstrates
  the feature the PR adds*. Whether the API is well-designed — right abstraction, prop shape, placement —
  is outside your scope.
- **A JSDoc `@default` or `@attribute` tag.** You own whether the tag is *present* and states the *real*
  default / attribute. Whether that default *behavior* or attribute surface is the right *design* is
  outside your scope.
- **A `@deprecated` or breaking API's migration note.** You own whether a note *points at the replacement*.
  Whether the break itself is *allowed* (stable vs experimental, callout present) is
  outside your scope.

## The review process

Work the changed docs in this order — a method, not a rigid script. Adapt to what the diff touches.

1. **Inventory the doc surfaces, and load your rules.** From the diff, enumerate every doc surface the
   PR touches: every exported public class / method / prop it adds or renames (a brand-new exported L2 is
   highest-value — it triggers the README-example, JSDoc, and public-API-doc checks at once); every new
   optional prop (`foo?:`) and its `@default`; every new readonly property exposing a CloudFormation
   attribute; every `@deprecated` tag and breaking API change; and every fenced ` ```ts ` block and
   `*.ts-fixture` it adds or edits. Then READ
   [`documentation-rules.md`](references/documentation-rules.md) — its rows ARE your checklist. Before
   flagging a `@default` wrong, an `@attribute` missing, or an example / convention violated, search and
   read the authoritative aws/aws-cdk docs
   on `main` available to you, and confirm the fact against those docs, not from memory (see
   `cdk-review-principles` "Verify before you cite").

2. **Check the inventory against the rules.** Walk the changed docs family by family — **Example
   compilation**, **`@default` accuracy**, **Public-API doc completeness**, **Migration notes**. For EACH
   rule check BOTH directions — what is present-and-wrong, and what is owed-but-missing. From the step-1
   inventory, check each doc a surface of that kind OWES and flag the absent. One method the rows lack: for
   a `@default`, **read the constructor / `?? ` handling in the same
   diff and compare** what the code applies when the prop is omitted against the tag — a contradiction is
   this dimension's highest-value defect.

3. **Rate by harm and stop.** Rate every finding by the harm the defect does — broken build, misled
   consumer, unspecified API — per `cdk-review-principles` (its BLOCKING/RECOMMENDED/OPTIONAL scale,
   "Confidence is not severity"); never demote a real defect to OPTIONAL out of uncertainty a reader
   reaches the line. When one location has
   more than one doc defect, classify under the most severe type and describe them in one finding. Stop
   once you can name the defect and cite its rule and guideline section.

## What NOT to flag

Beyond the shared exclusions in `cdk-review-principles` (pre-existing, cosmetics, out-of-scope,
no-nit-quota), this dimension stays silent on the following — not even as OPTIONAL — because each
belongs to a different dimension or is not a documentation defect at all. When a defect belongs to
another dimension, leave it — it's outside your scope.

- **Prose wording is NOT a `@default` defect** — a misspelled word, an awkward sentence, a comment that
  "reads a little off", capitalization, Oxford-comma preferences break no build and misstate no behavior.
  **This is the single most important exclusion for this dimension:** a misspelled word in a JSDoc comment
  breaks nothing; a `@default false` that is actually `true` misleads every consumer — only the second is
  a finding.
- **Comment-density or style opinions** — whether a block "needs more comments", inline-comment placement,
  docstring formatting idioms.
- **Code correctness** — whether the code the docs describe is itself buggy is a code-correctness question,
  not a documentation defect — outside your scope; you judge whether the DOCS match the code.
- **Test concerns** — unit/integration coverage, snapshot correctness, and test-title strings are test
  concerns, not documentation defects — outside your scope.

## Output

Populate the structured finding fields the `cdk-review-principles` skill defines — write
`message` as the complete posted comment (observation, impact, concrete fix, guideline cited inline by
file + section). This dimension's `category` is one of: Example compilation, `@default` accuracy,
Public-API doc completeness, Migration notes. The `suggestedFix` (folded into `message`) shows the doc or
snippet as written and its corrected form.

## Apply cdk-review-principles

Apply the shared `cdk-review-principles` skill for the canonical BLOCKING/RECOMMENDED/OPTIONAL scale, the
evidence/citation authority order, the `file:line` discipline, the finding format, and the comment budget.
Do not redefine the severity vocabulary here.
