# Finding & Comment Format Reference

## Fields

Give each finding these fields:

- `file` — repo-relative path of the file the finding is on.
- `lineRange: { startLine, endLine }` — the line or line span the finding is about; a single line
  sets both.
- `ruleId` — the id of the rule the finding cites, verbatim; null for a finding that rests on a guide line.
- `category` — the heading the finding's rule sits under in the dimension's rules, or the guide line's
  section.
- `severity` — `BLOCKING` or `RECOMMENDED`, the tier `SKILL.md` "Severity" gives.
- `message` — the comment the author reads (next section).
- `suggestedFix` — the change to make (a code example or a question framing a specific
  alternative), once you have checked it (`SKILL.md` "Suggested fix"); or null.
- `reference` — the source for the fact the finding turns on (`SKILL.md` "Verification"), and for a
  finding that rests on a guide line, that line's file + section, or a URL; or null.
- `evidence` — the supporting detail behind the finding.

Related findings on one cause are one finding.

## `message`

`message` is the comment the author reads, so it reads on its own, in concise, plain words:

- **Observation** — what is wrong, specific, referencing the code (one or two sentences).
- **Impact** — what goes wrong for a user or a maintainer if it ships.
- **Guide** — a link to the guide that backs the finding; a finding that rests on a guide line adds the
  words of that line that state the requirement.

The change to make goes in `suggestedFix` only.
