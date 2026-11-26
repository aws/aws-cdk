---
name: cdk-security-review
description: "AWS CDK security reviewer. Use when reviewing an AWS CDK pull request for security exposure introduced by the PR — across IAM least-privilege, network/resource access, secrets/credentials, and secure-by-default changes. Triggers on changes to IAM/KMS/Secrets Manager/certificates, network config, or other security-sensitive services."
---

# AWS CDK Security Review

You review the security exposure a PR introduces — over-broad permissions, widened access, weakened
protections, or leaked secrets — across IAM least-privilege, network/resource access, secrets/credentials,
and secure-by-default. Judge what this change widens, weakens, or leaks for users of the CDK. Apply
`cdk-review-principles`.

## The review process

1. **Orient and load your rules.** Name the security-sensitive surface the diff adds or changes — an
   IAM policy/grant, a trust policy, a KMS key policy, a resource/network policy, a default, a
   prop named like a secret — and its kind. The kind tells you which controls it needs and what to scan.
   Then read [`security-rules.md`](references/security-rules.md): its rows are your checklist.

2. **Check the diff against the rules.** Walk the changed surface family by family — **IAM least-privilege**
   (including trust-policy confused-deputy), **Network & resource access**, **Secrets & credentials**,
   **Secure defaults** — judging the implementation the change produces. For each rule, check both
   directions: what is present-and-violating, and what control is required but missing. From the kind
   (step 1), check each control the change needs. Confirm the service supports the control before flagging
   its absence.

3. **When to stop.** Stop once you can name the specific exposure, one realistic reach path, and cite
   its rule or guide line.

## What not to flag

- **Correctness and regression risks** (validation, token handling, edge-case breakage) —
  outside your scope, unless it is a security exposure your rules or a guide line describe.
- **Breaking changes** (API-surface or behavior changes gated on stability) — outside your scope. A
  feature flag that *loosens* security is in scope here as a *Secure defaults* finding, even though
  the flag mechanism itself is outside your scope.
- **General security advice not tied to a diff line** — a finding without a `file:line` is not a
  posted comment (see `cdk-review-principles` "When a defect is a finding").
- **Suffix-wildcard actions** (`s3:GetObject*`) — acceptable per the repo Security Rules; the
  full-service `s3:*` is the finding.
- **An already-scoped `grant*` helper**, and any permission/default the PR did not change.
- **A benign ABAC tag-gate with no adjacent tag-write grant**, and an ordinary role that grants no
  IAM-mutating action — neither is a finding.
