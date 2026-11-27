---
name: cdk-review-skill-authoring
description: "Practices for writing and editing the AWS CDK review skills in skills/cdk-review/: what backs a rule, how a rule states its case, scope, tier and ID, which cases a rule covers, where a rule sits, how to add a skill, and how to check a change before merging. Use when adding, changing or removing a review rule, adding a review skill, or editing a review skill's SKILL.md or reference files."
---

# Authoring the CDK review skills

A model applies each sentence of the review skills as written, so each sentence says what the reviewer does
or which case to raise, and is true of the repository. Link the shared rules in
[`cdk-review-principles`](https://github.com/aws/aws-cdk/blob/main/skills/cdk-review/cdk-review-principles/SKILL.md)
where a skill relies on them.

## What backs a rule

- **Rest each rule** on a guide line, or on a class of findings seen across several pull requests.
- **Follow the guide.** Where a guide is wrong or two guides disagree, fix the guide in its own change and
  then cite it; a rule's exceptions are the ones its guide states.
- **Read the library and merged pull requests** for how a case is treated today before you set or raise its
  tier.

## Write a rule

- **Write a row** as `**[ID] (TIER)** — the case. See [guide § section](link).`, with a
  `- **Tier:** TIER when …` (or `for …`) line under it for a second tier.
- **State a design standard** as the standard, and a specific defect as its case.
- **Make each condition** one the reviewer can confirm from the pull request's title, files and diff, the
  package's `package.json`, the linked guide or the service's documentation, in terms the guides, the code or
  the principles define.
- **Scope a rule** as its guide is scoped, for example to stable modules, and define a term several rules
  share once, in the principles.
- **Take the tier** from the guide line the rule rests on: BLOCKING for a MUST or MUST NOT in capitals,
  RECOMMENDED otherwise. Set another tier for a case the rule states, once you have read how the library
  treats that case. A Tier line names a second case the reviewer can tell apart from the header's.
- **Name the case in the ID.** When the case changes, change the ID and every mention of it; when the words
  change and the case stays, keep the ID.
- **Say what the fix has to respect** where a wrong fix is the risk.
- **Point to the
  [comment format](https://github.com/aws/aws-cdk/blob/main/skills/cdk-review/cdk-review-principles/references/pr-comment-format.md)**
  for what a finding's comment holds; a rule states its case.
- **Link aws-cdk files** at `https://github.com/aws/aws-cdk/blob/main/...`, which `scripts/check-skills.js`
  checks, anchors included.
- **Split the cases with the build and the pull request linter**
  ([`prlint/lint.ts`](https://github.com/aws/aws-cdk/blob/main/tools/@aws-cdk/prlint/lint.ts)): they own the
  cases they fail, and a rule covers the cases they pass. Count a linter check as failing a case when it
  decides from the title's type and the changed files alone.
- **Put each rule in the dimension that owns it**, once, as its row: the case, the tier, any Tier line or fix
  note, and the link to its guide where it has one.
- **Use plain words** at normal volume: terms the guides, the code or the principles define, sentence case for
  instructions, `MUST` where it names a guide's level, and the noun or "either"/"neither" where a pronoun or a
  slash could be read two ways.

## Add a skill

- **Put a review skill in `skills/cdk-review/`** and any other skill in its own group folder: the install
  commands in [`skills/cdk-review/README.md`](https://github.com/aws/aws-cdk/blob/main/skills/cdk-review/README.md)
  install every skill in that folder.
- **Give it a folder, a `SKILL.md` and a row in its group's `README.md` index**; `scripts/check-skills.js`
  reports what the name, frontmatter and index need. Write the description to say what the skill does and
  when to use it, as the [Agent Skills specification](https://agentskills.io/specification) asks.

## Check a change

- **Read every fact** a sentence states in its source (the guide, the linter's code, the package) before
  you write it.
- **Run** from the repository root, in bash, `node scripts/check-skills.js` (0 errors and 0 warnings) and
  this, which prints each rule ID the skills mention whose row is missing:

  ```bash
  defined=$(grep -rhoE '\*\*\[[A-Z]+(-[A-Z0-9]+)+\] \(' skills | grep -oE '[A-Z]+(-[A-Z0-9]+)+' | sort -u)
  prefixes=$(cut -d- -f1 <<< "$defined" | sort -u | paste -sd'|' -)
  grep -rhoE "\b($prefixes)(-[A-Z0-9]+)+(-\*)?" skills | grep -v '\*$' | sort -u | comm -13 <(echo "$defined") -
  ```

- **Test the change** with an independent read, then with reviews of real pull requests. On pull requests
  the wording was tuned on, a difference is evidence where the reviewer's own text shows the rule deciding,
  and is run-to-run variation elsewhere; confirm the result on pull requests new to the wording, against the
  current skills. One review of one pull request is one observation.
- **Take a wrong outcome to its cause** when the reviewer followed the text and still reached it: fix the
  guide, or report it to what runs the skills, and keep the skill's text as it is.
