---
name: cdk-review-skill-authoring
description: "Practices for writing and editing the AWS CDK review skills in skills/cdk-review/: what backs a rule, how a rule states its case, scope, tier and ID, what to leave out, what a finding's comment holds, how to add a skill, and how to check a change before merging. Use when adding, changing or removing a review rule, adding a review skill, or editing a review skill's SKILL.md or reference files."
---

# Authoring the CDK review skills

A model applies each sentence of the review skills as written, so each sentence says what to do and is true
of the repository. Link the shared rules in
[`cdk-review-principles`](https://github.com/aws/aws-cdk/blob/main/skills/cdk-review/cdk-review-principles/SKILL.md)
rather than restate them.

## What backs a rule

- **Rest each rule** on a guide line, or on a class of findings seen across several pull requests. One
  review comment is not a class.
- **Follow the guide.** Where a guide is wrong or two guides disagree, fix the guide in its own change and
  then cite it; a rule carries no exception its guide lacks.
- **Read the library and merged pull requests** for how a case is treated today before you set or raise its
  tier.

## Write a rule

- **Write a row** as `**[ID] (TIER)** — the case. See [guide § section](link).`, with a
  `- **Tier:** TIER when …` (or `for …`) line under it for a second tier.
- **State a design standard** as the standard, and a specific defect as its case.
- **Make each condition** one the reviewer can confirm from the pull request's title, files and diff, the
  package's `package.json`, the linked guide or the service's documentation. A word the skills do not define
  is not a condition.
- **Scope a rule** as its guide is scoped, for example to stable modules, and define a term several rules
  share once, in the principles.
- **Take the tier** from the guide line the rule rests on: BLOCKING for a MUST or MUST NOT in capitals,
  RECOMMENDED otherwise. Depart from it only for a case the rule states, after reading how the library treats
  that case. A Tier line names a second case the reviewer can tell apart from the header's.
- **Name the case in the ID.** When the case changes, change the ID and every mention of it; when only the
  words change, keep the ID.
- **Say what the fix has to respect** where a wrong fix is the risk.
- **Link aws-cdk files** at `https://github.com/aws/aws-cdk/blob/main/...`; `scripts/check-skills.js`
  checks those links and anchors, not a link pinned to a commit.
- **Leave what a finding's comment holds to the
  [comment format](https://github.com/aws/aws-cdk/blob/main/skills/cdk-review/cdk-review-principles/references/pr-comment-format.md)**;
  a rule states its case, not the comment.

## Leave out

- **Leave to the build and the pull request linter**
  ([`prlint/lint.ts`](https://github.com/aws/aws-cdk/blob/main/tools/@aws-cdk/prlint/lint.ts)) a case they
  already fail. Name a linter check by what it reads, the pull request's title and files; a linter check
  that reads free text, such as a breaking-change note, does not count.
- **Keep one home.** A rule sits in the dimension that owns it; restated guide text, duplicates across
  skills, rationale and text about the file go.
- **Use plain words** at normal volume: no coined or informal terms, no capitals or MUST aimed at the
  reader, and the noun or "either"/"neither" where a pronoun or a slash can be read two ways.

## Add a skill

- **Put a skill in `skills/cdk-review/`** only if it belongs with the review skills: the install commands
  in [`skills/cdk-review/README.md`](https://github.com/aws/aws-cdk/blob/main/skills/cdk-review/README.md)
  install every skill in that folder.
- **Give it a folder, a `SKILL.md` and a row in its group's `README.md` index**; `scripts/check-skills.js`
  reports what the name, frontmatter and index need. Write the description to say what the skill does and
  when to use it, as the [Agent Skills specification](https://agentskills.io/specification) asks.

## Check a change

- **Read every fact** a sentence states in its source (the guide, the linter's code, the package) before
  you write it.
- **Run** from the repository root, in bash, `node scripts/check-skills.js` (0 errors and 0 warnings) and
  this, which prints each rule ID the skills mention that no row defines:

  ```bash
  defined=$(grep -rhoE '\*\*\[[A-Z]+(-[A-Z0-9]+)+\] \(' skills | grep -oE '[A-Z]+(-[A-Z0-9]+)+' | sort -u)
  prefixes=$(cut -d- -f1 <<< "$defined" | sort -u | paste -sd'|' -)
  grep -rhoE "\b($prefixes)(-[A-Z0-9]+)+(-\*)?" skills | grep -v '\*$' | sort -u | comm -13 <(echo "$defined") -
  ```

- **Test the change** with an independent read, then with reviews of real pull requests. On pull requests
  the wording was tuned on, count a difference only where the reviewer's own text shows the rule deciding;
  confirm the result on pull requests the wording never saw, against the current skills. One review of one
  pull request is one observation.
- **Report a wrong outcome outside the skills** when the reviewer followed the text and still reached it:
  the cause is in a guide or in what runs the skills, and more text does not fix it.
