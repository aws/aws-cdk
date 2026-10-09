# Finding & Comment Format Reference

This is the disclosed detail behind "Keep the review to a tight, high-harm set"
in the `cdk-review-principles` `SKILL.md`. Read it before generating any findings.
Produce **structured findings**, not hand-authored markdown. This file defines the
output shape, how to write each field, and how to filter findings down to the budget.

## The structured finding contract

Produce each finding as a structured object with these fields:

- `file` — repo-relative path of the file the finding is on.
- `lineRange: { startLine, endLine }` — the line or line span the finding is about.
  A single-line finding sets both to that line.
- `category` — this dimension's finding type (its own taxonomy enum; each dimension
  skill names the values it uses).
- `severity` — one of `BLOCKING` / `RECOMMENDED` / `OPTIONAL` (see below). The only
  severity vocabulary.
- `ruleId` — the stable `[id]` of the rule that fired (e.g. `SEC-IAM-WILDCARD-RESOURCE`),
  taken verbatim from the dimension's rules lookup. The debug/trace key: it names exactly
  which rule produced the finding.
- `message` — the human-visible comment text (see the next section).
- `reference` — the authoritative source the finding cites: a CDK design guideline, jsii doc, CloudFormation resource spec, or AWS service doc — file + section, or a URL — per the authority order below; or null.
- `evidence` — the supporting detail behind the finding.
- `suggestedFix` — a concrete fix, or null.

The review as a whole also carries a `summary` with its `text`.

## `message` — write it complete and standalone

Treat `message` as the text the reader sees on its own: it must stand alone as a
complete comment, not lean on the other fields shown alongside it. Write it as a
self-contained review comment:

- **Observation** — what the issue is, specific, referencing the code (1-2 sentences).
- **Impact** — why it matters, what happens if it is not addressed.
- **Concrete fix** — the change to make (a code example or a question framing a
  specific alternative), with the guideline cited inline where one backs the finding.

Populate `evidence`, `reference`, and `suggestedFix` as structured fields too, and fold
their essentials into the `message` prose so it stands alone. Write it in a reviewer's
voice (see "Tone Rules"). `ruleId` is the exception: a structured metadata field for
debug/tracing, not reader-facing prose — do not fold it into `message` (though a finding
may still cite the rule inline where that aids the author).

## Severity vocabulary

The `severity` field takes one of `BLOCKING` / `RECOMMENDED` / `OPTIONAL`. Their harm
definitions, and the rule that any ported High/Medium/Low or P0/P1/P2 palette maps onto
these three (there is no second vocabulary), live in `SKILL.md` "Severity — rate by the
harm it does when it triggers" (authoritative).

## Evidence & References

The citation authority order, when a citation may be skipped, and how an aws-cdk rule's
own stated harm sets the severity all live in `SKILL.md` "Make each finding land"
(authoritative). The format contract this adds: put the citation in `reference`/`evidence`
AND name it inline in `message` so the posted comment carries its own authority.

## Filtering — what becomes a finding

Emit a finding only when it is:

1. **Tied to a specific code location** — it has a `file` and a `lineRange`. A
   high-level observation with no line to anchor to belongs in the review `summary`,
   not as a finding.
2. **Actionable** — the contributor can make a concrete change.
3. **Significant enough to stand alone** — worth the contributor's individual attention.

Keep these OUT of the findings (put them in the `summary` text if they matter):
high-level design observations not tied to a line, positive feedback, clusters of
related nits (consolidate into one finding on the first occurrence), findings already
surfaced by automated PR analysis (unless you add new context), and philosophical
questions.

### Severity-based filtering

| Severity | Emit as a finding? | Rule |
|----------|--------------------|------|
| `BLOCKING` | Always | Every blocking issue becomes a finding. |
| `RECOMMENDED` | Usually | Emit when tied to specific code; consolidate related ones. |
| `OPTIONAL` | Sparingly | Only if it is a quick fix and the total count is low. |

### Budget rule

Target **3-7 findings** per review. With more than 7 candidates:

1. Keep all `BLOCKING` findings (non-negotiable).
2. Keep the highest-impact `RECOMMENDED` findings.
3. Drop `OPTIONAL` findings unless the total is still under 7.

Let the review `summary` carry the broader picture; the findings are the curated,
actionable subset.

## Tone Rules

The reviewer's-voice rules live in `SKILL.md` "Make each finding land"
(authoritative). Write every `message` in that voice.
