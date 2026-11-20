---
name: cdk-review-principles
description: "Shared foundation every CDK review-dimension skill applies — the harm-based severity scale (BLOCKING/RECOMMENDED/OPTIONAL), evidence + citation authority order, exact file:line, the concrete-fix rule, the is-it-a-finding gate, the 7-comment cap, review tone, the shared what-NOT-to-flag exclusions, the finding-output contract (ruleId + reference fields), and the rules-lookup convention. Apply whenever conducting a CDK PR review, rating a finding's severity, deciding whether something is a finding at all, or turning a finding into a posted comment."
---

# Review Principles

The shared base every CDK review-dimension skill (`cdk-regression-review`,
`cdk-security-review`, `cdk-testing-review`, `cdk-documentation-review`, `cdk-construct-design-review`) applies, so
these rules never drift. A dimension skill decides *what* it flags and how to calibrate
it; it never redefines anything below.

## Severity — rate by the harm it does when it triggers

Ask one question of every finding: **if this ships and the code path is reached, what
breaks, and how badly?** That answer sets the tier — not the wording, not how confident
you are it triggers. Three tiers, keyed to the *kind* of harm:

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
- **OPTIONAL** — a small, real defect with a cheap fix: a doc comment that states something
  false, a leftover debug statement, a typo in a public name. Preferences (a different name,
  a tidier grouping, "consider") are not OPTIONAL findings; they are not findings.

A finding's `severity` field takes exactly one of these three words —
`BLOCKING` / `RECOMMENDED` / `OPTIONAL` — and there is no second vocabulary. If a source
you ported used a High/Medium/Low, Critical/Major/Minor, or P0/P1/P2 palette, map it onto
these three by harm and drop the palette.

### Is it a finding at all?

Most of what a reviewer *could* say is not worth saying. Every comment costs the author
time, and a wrong or unnecessary comment costs more than a missed nit. Post a finding only
when all of these hold:

- **It is true, and you checked.** You read the code the claim depends on: the definition
  of the class or function you say is misused, the callers, the existing tests, the rosetta
  fixture, the CI result. "There is no test for X" means you searched the test files for X.
  If the author could refute the comment by pointing at a line you did not read, do not post
  it. If you cannot verify a claim, drop it — do not post it as a question or at a lower
  severity.
- **It happens with realistic use of this PR's code.** Not "if a future change…", "if AWS
  adds a field…", "when a second variant is added…", or an exotic setup nobody uses. Those
  are speculation; the change does not have to defend against them.
- **It is introduced by this PR.** A pre-existing problem the diff merely moved is not a
  finding.
- **It asks for a specific change to the code.** If your conclusion is "this is fine", "no
  change required", "either is defensible", "confirm this is intentional", or "mention it
  in the PR description", there is no finding — do not post it.
- **It has not already been discussed.** If this point was raised on the PR before (by you
  or by a human), do not raise it again. If the author answered a comment, accept the answer
  unless you have new evidence. Never ask the author to undo something an earlier review
  comment asked for.

Never suggest:

- **Catching, swallowing or falling back from errors** to make code "defensive". A broken
  invariant or a malformed input must fail loudly; hiding it is a bug.
- **A feature flag for a change that cannot break an existing deployment.** Flags are for
  changes that alter what deployed stacks get in a way users may depend on.
- **More validation, warnings or tests "for safety"** without a realistic failure they
  prevent.

When the finding is that the change violates a rule in the aws-cdk repo's own guides
(`AGENTS.md`, `CONTRIBUTING.md`, the `docs/AGENTS_*` guides), let the rule's own stated
harm set the tier: a rule naming data loss or an open boundary is damage → BLOCKING; a
rule stated as a preference is decay → RECOMMENDED. Cite the rule by file + section and
quote it, so the author sees the authority.

Keep **baseline** harm (correctness, security, compliance — must fix) separate from
**excellence** framing (design that takes a change from correct to better). Excellence is
not a fourth tier: grade it on the harm scale like any finding, competing for the same
comment budget. Never report one piece of code as both a must-fix and a design nicety —
that double-counts it.

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
  discussion (customer context) → existing tests (behavioral expectations). Skip a citation
  only for an obvious typo or unused import. **Verify before you cite:** never post from
  memory. When a finding turns on how CDK code behaves (a constructor signature, what
  `addWarningV2` renders, what a fixture declares, whether a lint rule fires), read that
  code in the repo. When it turns on how an AWS service behaves (a limit, a default, an
  allowed value), read the AWS documentation and cite the page in `reference`. Service
  documentation is sometimes wrong or incomplete; when the PR says the author tested the
  service's behavior, do not contradict them from documentation alone.
- **A concrete fix** — a code example, or a question framing a specific alternative
  ("What do you think about scoping this to the bucket ARN?"). Always offer a direction
  out; never just point at the problem.

Write it in a reviewer's voice: prefer "we" over "you should"; stay direct but not harsh
on blocking issues ("this needs to change because…", not "this is wrong"); and drop
"obviously" and "simply". Keep it short: state the problem, why it matters, and the fix.

## Keep the review to a tight, high-harm set

Post **at most 7 comments per review**, and fewer is better. Zero comments is the right
result for a clean PR. Keep every `BLOCKING` finding; then the highest-harm `RECOMMENDED`
findings; add `OPTIONAL` ones only if the total stays within budget.

A finding becomes a posted comment only when it is (1) tied to a specific line, (2)
actionable, and (3) significant enough to stand alone. Keep high-level observations,
positive notes, and clusters of nits in the review summary, not the posted comments.

See [`references/pr-comment-format.md`](references/pr-comment-format.md) for the
structured finding fields and how to write each one before you generate findings.

## What NOT to flag — the shared exclusions

Every dimension skill applies these exclusions on top of its own dimension-specific
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
- **Choices the guidelines leave open** — when the guidelines allow more than one shape
  (an enum or an enum-like class, a required or an optional physical name), or the same
  module already uses the author's choice, the author's choice stands.
- **Process paperwork** — asking the author to add a justification to the PR description,
  a changelog note, or a comment explaining a decision. (The `BREAKING CHANGE:` callout and
  the integ-test exemption label are required by PR tooling and are not paperwork.)

Each dimension skill's own `## What NOT to flag` lists only its dimension-specific
carve-outs; it applies these in addition.

## Rules-lookup convention

Each dimension skill keeps its detailed rules in a `references/*-rules.md` lookup. Every
lookup shares one shape so they never drift: rows grouped by family, sorted
BLOCKING → RECOMMENDED → OPTIONAL within each family, `[id]`s stable. A conditional
severity is ONE rule — the row header carries the primary severity, the body states when it
up- or down-tiers. A row marked `(doc-absent detail)` carries reviewer calibration the source
doc does not state, kept in full. All aws/aws-cdk links reference `main`.

## Sources

Public aws/aws-cdk `main` guidance these principles cite:

- [`AGENTS.md`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md) — the agent-facing
  repo guide; its rules name their own harm (quoted in the severity worked examples above).
- [`CONTRIBUTING.md`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md) — PR
  conventions and breaking-change guidance.
- [`docs/DESIGN_GUIDELINES.md`](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md),
  and the agent-optimized
  [`docs/AGENTS_CONSTRUCT_DESIGN.md`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md)
  / [`docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md) — CDK API design conventions.
