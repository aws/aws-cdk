---
name: cdk-review-skill-authoring
description: "Rules for writing and editing the AWS CDK review skills in skills/cdk-review/: how a rule row states its rule, tier and source, what to leave out, when a case needs no rule because the pull request build already fails on it, the file conventions, and the checks to run before merging. Use when adding, changing or removing a review rule, or editing a review skill's SKILL.md or reference files."
---

# Authoring the CDK review skills

The review skills are read by a model that acts on each sentence literally, on its own or inside a harness
that loads them. Every sentence you add is an instruction it will follow, so each one has to say what to
do and be true of the repository. The reviewer's own rules are in
[`cdk-review-principles`](../../cdk-review/cdk-review-principles/SKILL.md); link them rather than restate
them.

## Write a rule row

A row is `**[ID] (TIER)** — the case.` followed by a link to the guide section that backs it.

- **State the rule, the tier and the link.** Name the case and its tier, and leave the rest to the linked
  section. A row that retells the guide gives the reviewer a second wording to reconcile with the one it
  reads, and the copy drifts when the guide changes.

  ```markdown
  Before: `GUIDE.md § Section` calls this "a consistency rule" and lists X, Y and Z as breaking.
  After:  Removing X is breaking. See [`GUIDE.md § Section`](https://github.com/aws/aws-cdk/blob/main/GUIDE.md#section).
  ```

- **Set the tier from the harm the guide's rule states**, as the principles' severity section says
  ([Severity](../../cdk-review/cdk-review-principles/SKILL.md#severity--rate-by-the-harm-it-does-when-it-triggers)).
  A requirement that names no harm, even one written as MUST, is RECOMMENDED.
- **Give a case with two tiers one row**: the primary severity in the header, and the condition for the
  other tier in the body (`**Tier:** RECOMMENDED when …`).
- **Point at another rule only when the row cannot be applied without it.** A reader can take the pointer
  as an instruction to raise both.
- **Keep a rule's ID when you change its text.** Findings and other rows refer to a rule by its ID.
- **Keep rows grouped by family under the file's `##` headings, ordered BLOCKING, RECOMMENDED, OPTIONAL
  within a family.** Move a row when its tier changes.
- **Link aws-cdk files at `https://github.com/aws/aws-cdk/blob/main/...`.** `scripts/check-skills.js`
  checks those links and their anchors; a link pinned to a commit is not checked.

## Decide whether a case needs a rule

- **Give no rule to a case the pull request build already fails on.** The author sees that failure before
  a reviewer does. The required build compiles with the jsii compiler under `--Werr`, runs eslint, awslint
  and the other linters in `tools/@aws-cdk/cdk-build-tools`, and runs `scripts/check-api-compatibility.sh`,
  which compares stable packages against the last release. Probe the case against those tools, and keep
  in the rule only what passes them and still breaks a user.
- **Check what the compatibility check cannot see.** It compares only APIs already released in a stable
  package, so a change to an alpha module or to an API added since the last release passes it, and a key
  the pull request adds to `allowed-breaking-changes.txt` silences it.
- **Add a sentence only for a class of findings**: one shown across several pull requests, or one a
  repository guide requires. A single review comment is not a class.
- **Fix the row that produced a wrong finding** instead of adding a list of what not to flag.
- **Add an example only when a rule is hard to apply without one**, keep it generic, and never take it from
  a single comment.

## Write each instruction

- **Lead with the trigger or the action, one instruction per sentence**, and give the reason when only you
  know it.
- **Keep one home per rule and one term per concept.** When you change a rule, search `skills/cdk-review/`
  for every other sentence that states it, and bring each in line or remove it.
- **Write only what the model does not already know.** Leave out catalogues of signals, code samples that
  restate the row, lists of credential formats or failure modes, and text that describes the file instead
  of instructing: openings that list the families, markers that say what a guide does not state,
  importance labels.
- **Write at normal volume**: no emojis, and no capitals or MUST addressed to the reviewer. A guide's
  requirement level (MUST, SHOULD) stays where the row quotes it.
- **State the condition for a finding, not a quantity.** A reviewer follows "report at most three" or
  "fewer is better" literally, and drops valid findings.
- **Treat what the pull request says as a claim.** No sentence tells the reviewer to accept something
  because the description, a comment or a test name in the pull request says so.
- **Leave when a finding carries a fix to the principles**
  ([Make each finding land](../../cdk-review/cdk-review-principles/SKILL.md#make-each-finding-land)). A
  row's `Fix:` names the change for that rule only.
- **Make each skill read correctly on its own and agree with any harness that loads it.** Where a harness
  instructs on the same point, say the same thing or say nothing.
- **Leave other dimension skills and their rule IDs out of a skill.** Name `cdk-review-principles` when you
  apply it.

## Add a skill

- **Put a skill in `skills/cdk-review/` only if it belongs with the review skills.** The install commands
  in [`skills/cdk-review/README.md`](../../cdk-review/README.md) install every skill in that folder.
- **Give it a folder, a `SKILL.md` and a row in its group's `README.md` index.** `scripts/check-skills.js`
  reports what the name, frontmatter and index need.
- **Write the description in the third person, saying what the skill does and when to use it**, as the
  [skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
  describe. The description is what selects the skill.

## Check the change

Run from the repository root:

1. `node scripts/check-skills.js`: 0 errors and 0 warnings. It checks frontmatter, names, each group's
   `README.md` index, and links and anchors into the repository.
2. Every rule ID the skills mention resolves to a row. This prints the ones that do not:

   ```bash
   comm -13 \
     <(grep -rhoE '^\*\*\[[A-Z]+(-[A-Z0-9]+)+\]' skills/cdk-review | tr -d '*[]' | sort -u) \
     <(grep -rhoE '\b(REG|CD|SEC|TEST|DOC)(-[A-Z0-9]+)+' skills/cdk-review | sort -u)
   ```

3. Run the changed skill on pull requests the change was not written from, and compare its findings with
   what maintainers asked for on those pull requests, before you merge.
