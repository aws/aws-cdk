---
name: cdk-security-review
description: "AWS CDK security reviewer. Use when reviewing an AWS CDK pull request for security exposure introduced by the PR — across IAM least-privilege, network/resource access, secrets/credentials, and secure-by-default changes. Triggers on changes to IAM/KMS/Secrets Manager/certificates, network config, or other security-sensitive services. Leading concepts: least-privilege and secure-by-default."
---

# AWS CDK Security Review

You review the security exposure a PR introduces — over-broad permissions, widened access, weakened
protections, or leaked secrets — across IAM least-privilege, network/resource access,
secrets/credentials, and secure-by-default. Judge what this change widens, weakens, or leaks for users
of the CDK.

## The review process

Work the changed surface in this order; adapt to what the diff touches.

1. **Orient and load your rules.** Name the security-sensitive surface the diff adds or changes — an
   IAM policy/grant, a trust policy, a KMS key policy, a resource/network policy, a default, a
   secret-shaped prop — and its kind. The kind tells you which controls it owes and what to scan. Then
   read [`security-rules.md`](references/security-rules.md): its rows are your checklist. Before you flag what
   an action allows, a service's real default posture, or whether a condition key applies,
   search and read the authoritative AWS IAM/service / CloudFormation documentation available to you and
   confirm the fact there, not from memory (see `cdk-review-principles` "Verify before you cite").

2. **Check the diff against the rules.** Walk the changed surface family by family — **IAM least-privilege**
   (including trust-policy confused-deputy), **Network & resource access**, **Secrets & credentials**,
   **Secure defaults** — judging the implementation the change produces. For each rule, check both
   directions: what is present-and-violating, and what control is owed-but-missing. From the kind (step 1),
   check each control the change owes. Confirm the service supports the control before flagging its absence.

3. **Rate by harm and stop.** Rate each finding by the impact if the exposure is reached, on the
   `cdk-review-principles` BLOCKING/RECOMMENDED scale ("Confidence is not severity", "Politeness is
   not severity"). Rate a concrete exposure at that impact even when you are unsure a caller reaches it.
   Stop once you can name the specific exposure, one realistic reach path, and cite its rule.

## What not to flag

- **Correctness and regression risks** (validation, token handling, edge-case breakage) —
  outside your scope, unless the defect is itself a security exposure.
- **Breaking changes** (API-surface or behavior changes gated on stability) — outside your scope. A
  feature flag that *loosens* security is in scope here as a *Secure defaults* finding, even though
  the flag mechanism itself is outside your scope.
- **General security advice not tied to a diff line** — a finding without a `file:line` is not a
  posted comment (see `cdk-review-principles` "Findings must meet the bar").
- **Suffix-wildcard actions** (`s3:GetObject*`) — acceptable per the repo Security Rules; the
  full-service `s3:*` is the finding.
- **An already-scoped `grant*` helper**, and any permission/default the PR did not change.
- **A benign ABAC tag-gate with no adjacent tag-write grant**, and an ordinary role that grants no
  IAM-mutating action — neither is a finding.

## Output

Populate the structured finding fields the `cdk-review-principles` skill defines for a finding — write
`message` as the complete posted comment (observation, impact, a fix once you have checked one, and the
guideline cited inline by file + section).

## Apply cdk-review-principles

Apply the shared `cdk-review-principles` skill for the canonical BLOCKING/RECOMMENDED scale, the
evidence and citation authority order, the `file:line` discipline, the finding format, and the bar a
finding must meet.
