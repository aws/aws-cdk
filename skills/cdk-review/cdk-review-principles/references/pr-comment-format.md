# Finding & Comment Format Reference

## The structured finding contract

Give each finding these fields:

- `file` — repo-relative path of the file the finding is on.
- `lineRange: { startLine, endLine }` — the line or line span the finding is about.
  A single-line finding sets both to that line.
- `category` — this dimension's finding type (its own taxonomy enum; each dimension
  skill names the values it uses).
- `severity` — one of `BLOCKING` / `RECOMMENDED` / `OPTIONAL`, defined in `SKILL.md` "Severity — rate
  by the harm it does when it triggers". The only severity vocabulary.
- `ruleId` — the stable `[id]` of the rule that fired, taken verbatim from the dimension's
  rules file. The debug/trace key: it names exactly which rule produced the finding.
- `message` — the human-visible comment text (see the next section).
- `reference` — the authoritative source the finding cites: a CDK design guideline, jsii doc, CloudFormation resource spec, or AWS service doc — file + section, or a URL — per the authority order in `SKILL.md` "Make each finding land"; or null.
- `evidence` — the supporting detail behind the finding.
- `suggestedFix` — a concrete fix, or null.

The review as a whole also carries a `summary` with its `text`.

## `message` — write it complete and standalone

Treat `message` as the text the reader sees on its own: it must stand alone as a
complete comment. Write it as a self-contained review comment:

- **Observation** — what the issue is, specific, referencing the code (1-2 sentences).
- **Impact** — why it matters, what happens if it is not addressed.
- **Fix, once you have checked one** — the change to make (a code example or a question framing a
  specific alternative), with the guideline cited inline where one backs the finding.

Populate `evidence`, `reference`, and `suggestedFix` as structured fields too, and fold
their essentials into the `message` prose so it stands alone. Write it in a reviewer's
voice (see `SKILL.md` "Make each finding land"). `ruleId` is the exception: a structured metadata field for
debug/tracing that stays in its own field (though a finding may still cite the rule inline
where that aids the author).

## Evidence & References

Put the citation in `reference`/`evidence` and name it inline in `message`, so the posted comment
carries its own authority.

## Filtering — what becomes a finding

Emit a finding only when it meets the posting conditions in `SKILL.md` "Findings must meet the
bar". In this format, "tied to a specific line" means it has
a `file` and a `lineRange`; a high-level observation with no line to anchor to belongs in the
review `summary`.

Keep these out of the findings (put them in the `summary` text if they matter):
high-level design observations not tied to a line, positive feedback, clusters of
related nits, findings already
surfaced by automated PR analysis (unless you add new context), and philosophical
questions.

Consolidate related findings on one cause into one.

Let the review `summary` carry the broader picture.
