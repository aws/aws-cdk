---
name: cdk-review-skill-authoring
description: "Rules for writing and editing the AWS CDK review skills in skills/cdk-review/: how a rule row states its rule, tier and source, what to leave out, when a case needs no rule because the pull request build already fails on it, the file conventions, and the checks to run before merging. Use when adding, changing or removing a review rule, or editing a review skill's SKILL.md or reference files."
---

# Authoring the CDK review skills

The review skills are read by a model that acts on each sentence literally, on its own or inside a harness
that loads them. Every sentence you add is an instruction it will follow, so each one has to say what to
do and be true of the repository. The reviewer's own rules are in
[`cdk-review-principles`](https://github.com/aws/aws-cdk/blob/main/skills/cdk-review/cdk-review-principles/SKILL.md);
link them rather than restate them.

## Write a rule row

A row is `**[ID] (TIER)** — the case.` followed by a link to the guide section that backs it.

- **State the rule, the tier and the link.** Name the case and its tier, and leave the rest to the linked
  section. A row that retells the guide gives the reviewer a second wording to reconcile with the one it
  reads, and the copy drifts when the guide changes.

  ```markdown
  Before: `GUIDE.md § Section` calls this "a consistency rule" and lists X, Y and Z as breaking.
  After:  Removing X is breaking. See [`GUIDE.md § Section`](https://github.com/aws/aws-cdk/blob/main/GUIDE.md#section).
  ```

- **Set the tier from the harm the guide's rule states, and give a case with two tiers one row in the form
  the file already uses**, as the principles' severity section describes
  ([Severity](https://github.com/aws/aws-cdk/blob/main/skills/cdk-review/cdk-review-principles/SKILL.md#severity--rate-by-the-harm-it-does-when-it-triggers)).
- **Point at another rule only when the row cannot be applied without it.** A reader can take the pointer
  as an instruction to raise both.
- **Keep a rule's ID when you change its text.** Findings and other rows refer to a rule by its ID.
- **Keep rows grouped by family under the file's `##` headings, ordered by tier within a family, most
  severe first.** Move a row when its tier changes.
- **Link aws-cdk files at `https://github.com/aws/aws-cdk/blob/main/...`.** `scripts/check-skills.js`
  checks those links and their anchors; a link pinned to a commit is not checked.

## Decide whether a case needs a rule

- **Give no rule to a case a required pull request check already fails on.** The author sees that failure
  before a reviewer does. Two checks are required: `build` runs `build.sh` (each package's `cdk-build`,
  that is the jsii compiler with `--Werr`, eslint, pkglint, markdownlint and awslint, then
  `scripts/check-api-compatibility.sh`) and `scripts/run-rosetta.sh`; `validate-pr` runs the pull request
  linter in `tools/@aws-cdk/prlint`, which checks a feature's or fix's tests, integration tests and README,
  and the breaking-change notes. Keep in the rule only what passes them and still breaks a user.
- **Probe a case by making it in a package and running `yarn build` and `yarn compat` in that package's
  folder** (the `AGENTS.md` quick reference lists the build commands).
- **Check what the checks cannot see.** The compatibility check compares only APIs already released in a
  stable package, so a change to an alpha module or to an API added since the last release passes it. A
  key the pull request adds to `allowed-breaking-changes.txt` silences that check, and a
  `pr-linter/exempt-*` label switches off the matching linter check.
- **Add a sentence only for a class of findings**: one shown across several pull requests, or one a
  repository guide requires. A single review comment is not a class.
- **Fix the row that produced a wrong finding** instead of adding a list of what not to flag.
- **Add an example only when a rule is hard to apply without one**, keep it generic, and never take it from
  a single comment.

## Write each instruction

- **Lead with the trigger or the action, one instruction per sentence**, and give the reason when only you
  know it.
- **Keep one home per rule and one term per concept.** When you change a rule, search `skills/` for every
  other sentence that states it, and bring each in line or remove it.
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
- **Leave the rule on when a finding carries a fix to the principles**
  ([Make each finding land](https://github.com/aws/aws-cdk/blob/main/skills/cdk-review/cdk-review-principles/SKILL.md#make-each-finding-land));
  a row's `Fix:` names the change for that rule only.
- **Make each skill read correctly on its own and agree with any harness that loads it.** Where a harness
  instructs on the same point, say the same thing or say nothing.
- **Leave other dimension skills and their rule IDs out of a skill.** Name `cdk-review-principles` when you
  apply it.

## Add a skill

- **Put a skill in `skills/cdk-review/` only if it belongs with the review skills.** The install commands
  in [`skills/cdk-review/README.md`](https://github.com/aws/aws-cdk/blob/main/skills/cdk-review/README.md)
  install every skill in that folder.
- **Give it a folder, a `SKILL.md` and a row in its group's `README.md` index.** `scripts/check-skills.js`
  reports what the name, frontmatter and index need.
- **Write the description to say what the skill does and when to use it**, as the
  [Agent Skills specification](https://agentskills.io/specification) asks. The description is what
  selects the skill.

## Check the change

Run from the repository root, in bash:

1. `node scripts/check-skills.js`: 0 errors and 0 warnings. It checks frontmatter, names, each group's
   `README.md` index, and links and anchors into the repository.
2. Every rule ID the skills mention resolves to a row. This prints the ones that do not:

   ```bash
   defined=$(grep -rhoE '\*\*\[[A-Z]+(-[A-Z0-9]+)+\] \(' skills | grep -oE '[A-Z]+(-[A-Z0-9]+)+' | sort -u)
   prefixes=$(cut -d- -f1 <<< "$defined" | sort -u | paste -sd'|' -)
   grep -rhoE "\b($prefixes)(-[A-Z0-9]+)+(-\*)?" skills | grep -v '\*$' | sort -u | comm -13 <(echo "$defined") -
   ```

3. Run the changed skill on pull requests the change was not written from, several times each, and
   compare the totals of its findings with what maintainers asked for on those pull requests, before you
   merge.
