# Finding & Comment Format Reference

## Fields

Give each finding these fields:

- `file` — repo-relative path of the file the finding is on.
- `lineRange: { startLine, endLine }` — the line or line span the finding is about; a single line
  sets both.
- `ruleId` — the id of the rule the finding cites, verbatim.
- `category` — the heading the finding's rule sits under in the dimension's rules.
- `severity` — `BLOCKING` or `RECOMMENDED`, the tier of the rule (`SKILL.md` "Severity").
- `message` — the comment the author reads (next section).
- `suggestedFix` — the change to make (a code example or a question framing a specific
  alternative), once you have checked it (`SKILL.md` "Suggested fix"); or null.
- `reference` — the source for the fact the finding turns on (`SKILL.md` "Verification"): file +
  section, or a URL; or null.
- `evidence` — the supporting detail behind the finding.

Related findings on one cause are one finding.

## `message`

`message` is the comment the author reads, so it reads on its own:

- **Observation** — what is wrong, specific, referencing the code (one or two sentences).
- **Impact** — what happens if it is not addressed.
- **Guide** — the guide cited inline where one backs the finding.

The change to make goes in `suggestedFix` only.
