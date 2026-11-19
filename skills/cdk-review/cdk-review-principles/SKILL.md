---
name: cdk-review-principles
description: "Shared foundation every CDK review-dimension skill applies — the harm-based severity scale (BLOCKING/RECOMMENDED/OPTIONAL), evidence + citation authority order, exact file:line, the concrete-fix rule, the bar a finding must meet to be posted, review tone, the shared what-not-to-flag exclusions, the finding-output contract (ruleId + reference fields), and the rules-lookup convention. Apply whenever conducting a CDK PR review, rating a finding's severity, deciding whether something is a finding at all, or turning a finding into a posted comment."
---

# Review Principles

## Severity — rate by the harm it does when it triggers

Ask one question of every finding: **if this ships and the code path is reached, what
breaks, and how badly?** That answer sets the tier. Three tiers, keyed to the *kind* of
harm:

- **BLOCKING** — the harm is **damage**. Something concretely breaks: data is lost, a
  security boundary opens, a customer's stack fails or silently does the wrong thing.
  Must be fixed before merge.
  - *Replaced resources.* A PR renames a construct ID in a stable module. `AGENTS.md`
    names the harm in the rule: "MUST NOT change construct IDs — logical IDs derive from
    the full construct path; any change replaces all resources in scope, causing data
    loss." Resource replacement on a live stack is damage → BLOCKING.
  - *Open door.* A new IAM policy with `Resource: "*"` where a scoped ARN exists — the
    blast radius is the whole account → BLOCKING.
- **RECOMMENDED** — the harm is **decay**. Nothing breaks today, but the change leaves a
  hardening gap, a maintainability cost, or a latent trap that bites a later reader.
  Should be fixed before merge; does not block it.
  - *Over-grant.* `s3:*` where a scoped action set would serve. `AGENTS.md`: "SHOULD
    prefer specific IAM actions over full-service wildcards (`s3:*`)." The resource is
    still scoped, so no door opens — but the grant is wider than the code path needs →
    RECOMMENDED.
- **OPTIONAL** — the harm is **negligible**. Pure polish: a naming choice, a tidier
  grouping with identical effect.

A finding's `severity` field takes exactly one of these three words —
`BLOCKING` / `RECOMMENDED` / `OPTIONAL`.

### Calibrate the harm honestly

The tier is right only if you rate the harm honestly. Four ways it slips:

- **Confidence is not severity.** Rate by the harm *when* the path is reached, however sure
  you are that it is reached. A concrete failure mechanism is BLOCKING or RECOMMENDED by
  its blast radius. OPTIONAL means genuinely negligible harm.
- **Politeness is not severity.** A blocking issue raised as a gentle question — "Can we
  scope this to a specific ARN?" — still blocks. Rate the harm the change asserts.
- **No harm, no finding.** Clean code reports nothing. A change that merely *mentions* IAM,
  encryption, or a secret is not a finding; a concrete new harm is. Inventing a low-severity
  finding out of a non-finding is the most common way a review inflates.
- **Only harm this PR introduces.** A pre-existing wildcard the PR merely moved does zero
  *new* harm → not a finding. Rate what the diff adds.

When the finding is that the change violates a rule in the aws-cdk repo's own guides
(`AGENTS.md`, `CONTRIBUTING.md`, the `docs/AGENTS_*` guides), let the rule's own stated
harm set the tier: a rule naming data loss or an open boundary is damage → BLOCKING; a
rule stated as a preference is decay → RECOMMENDED. Cite the rule by file + section and
quote it, so the author sees the authority.

Keep **baseline** harm (correctness, security, compliance — must fix) separate from
**excellence** framing (design that takes a change from correct to better). Grade
excellence on the harm scale like any finding, against the same bar. Report one piece of
code once, as a must-fix or as a design nicety; reporting it as both double-counts it.

## Make each finding land

A correctly-rated finding still has to be actionable. Every finding carries three things:

- **An exact location** — `path/to/file.ts:L42`, or a range `path/to/file.ts:L42-L50`. A
  finding with no code location stays in the report as a high-level observation; it cannot
  become a posted line comment, since there is no line to anchor it to.
- **Evidence** — cite at least one source for every non-trivial finding, strongest
  authority first: AWS documentation (service behavior) → CDK source code (precedent,
  linked by file + line) → CDK design guidelines (`docs/DESIGN_GUIDELINES.md`,
  `docs/AGENTS_CONSTRUCT_DESIGN.md`, `docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md`) →
  CloudFormation resource specification (property/enum correctness) → linked issue / PR
  discussion (customer context) → existing tests (behavioral expectations). When the code
  and the AWS documentation disagree, report the disagreement and cite both. Skip a citation
  only for pure style, an obvious typo or unused import, or a genuine question. **Verify
  before you cite:** when a finding
  turns on whether an attribute, mode, default or enum value is real for the service, or
  how the service behaves, search and read the authoritative AWS documentation available
  to you and confirm the fact against it before posting; confirm what CDK's own API does
  by reading that code, and what CDK's testing or README guidance says by reading that
  guide; post only what you have read. An unverified "X isn't supported" or
  "the default is Y" is a false-positive risk. Cite the page you read in `reference`.
- **A concrete fix** — a code example, or a question framing a specific alternative ("What
  do you think about scoping this to the bucket ARN?"). Always offer a direction out. A fix
  you suggest follows the same guides as the code under review.

Write it in a reviewer's voice: prefer "we" and "consider" over "you should"; frame
suggestions as questions where you can; stay direct and constructive on blocking issues
("this needs to change because…"); acknowledge good work; and drop "obviously" and "simply".

## Findings must meet the bar

A finding is posted, at its tier, when it meets the posting conditions below, and only then.
The number of findings is not a target: there is none to reach and none to stay under, and
zero comments is the right result for a PR with nothing wrong. A count would choose findings
by number rather than by merit.

A finding becomes a posted comment only when it is (1) tied to a specific line, (2)
actionable, and (3) significant enough to stand alone. Keep high-level observations,
positive notes, and clusters of nits in the review summary.

See [`references/pr-comment-format.md`](references/pr-comment-format.md) for the
structured finding fields and how to write each one before you generate findings.

## What not to flag — the shared exclusions

Every dimension skill applies these five exclusions on top of its own dimension-specific
carve-outs. None is a finding, at any severity:

- **Pre-existing / not introduced by this PR** — if the diff did not add or change it, the
  problem is not this PR's; do not flag it.
- **Cosmetics** — typos, comment/docstring wording, whitespace, formatting, naming
  preferences, idiom choices, test-title / `test.each` label strings. A misspelled comment
  breaks nothing.
- **Outside this dimension's scope** — a defect that belongs to a different review
  dimension is not yours to flag; each dimension reviews independently, so leave it rather
  than report it here.
- **No nit quota** — when the changed surface is clean, report nothing; never reach for a
  nit to have something to say.
- **Release-tooling / monorepo markers** — `0.0.0` workspace or alpha versions, `V2NEXT`
  changelog placeholders, maturity banners; flag one only if you have verified the specific
  value is actually wrong.

## Rules-lookup convention

Each dimension skill keeps its detailed rules in a `references/*-rules.md` lookup. Every
lookup shares one shape so they never drift: rows grouped by family, sorted
BLOCKING → RECOMMENDED → OPTIONAL within each family, `[id]`s stable. A conditional
severity is one rule — the row header carries the primary severity, the body states when it
up- or down-tiers. A row marked `(doc-absent detail)` carries reviewer calibration the source
doc does not state, kept in full. All aws/aws-cdk links reference `main`.

## Sources

Public aws/aws-cdk `main` guidance:

- [`AGENTS.md`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md) — the agent-facing
  repo guide; its rules name their own harm.
- [`CONTRIBUTING.md`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md) — PR
  conventions and breaking-change guidance.
- [`docs/DESIGN_GUIDELINES.md`](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md),
  and the agent-optimized
  [`docs/AGENTS_CONSTRUCT_DESIGN.md`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md)
  / [`docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md) — CDK API design conventions.
