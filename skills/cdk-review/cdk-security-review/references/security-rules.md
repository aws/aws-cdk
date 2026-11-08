# Security rules — the lookup

Rows are grouped by defect family (IAM least-privilege, network & resource access, secrets &
credentials, secure defaults). See the `cdk-review-principles` skill for the
shared lookup convention (the BLOCKING → RECOMMENDED → OPTIONAL sort within a family, the
conditional-severity encoding, the `(doc-absent detail)` marker, and links referencing `main`).

The repo Security Rules these distill live at
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules) —
the primary security citation.

## IAM least-privilege

**[SEC-IAM-WILDCARD-RESOURCE] (BLOCKING)** — A `Resource: "*"` (or an ARN far broader than the
resource the code touches) where a scoped ARN exists. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).

**[SEC-IAM-WILDCARD-ACTION-ALL] (BLOCKING)** — An all-services action wildcard (`Action: "*"`), even
on a scoped resource. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).
- **Doc-absent detail:** `"*"` grants every action of every service against that resource — including
  destructive and policy-rewriting actions (`DeleteTable`, `PutResourcePolicy`) — so a scoped resource
  does not contain the exposure. This is strictly broader than a single-service `service:*` and is an
  open door, not a hardening gap.

**[SEC-IAM-CONFUSED-DEPUTY-SERVICE] (BLOCKING)** *(conditional — RECOMMENDED when the path is not yet
reachable)* — Missing confused-deputy condition (`aws:SourceAccount`/`aws:SourceArn`) on a
cross-*service* trust policy (a trusted `ServicePrincipal`). See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).
- **Doc-absent detail:** BLOCKING if it opens a currently-reachable confused-deputy path, RECOMMENDED
  if it is a defense-in-depth gap on a not-yet-reachable path. These keys are the control for a trusted
  *service*, not for a trusted external account (see SEC-IAM-CONFUSED-DEPUTY-ACCOUNT).

**[SEC-IAM-REFACTOR-SCOPE-DROP] (BLOCKING)** *(conditional — RECOMMENDED when the dropped scoping
guards a not-yet-reachable path)* — A refactor that drops scoping is a real exposure, not a no-op: when
converting `PolicyStatement`s to grants you MUST preserve conditions, effect, and principals. See
[`AGENTS_CONSTRUCT_IMPLEMENTATION.md § Grants`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md#grants).
- **Doc-absent detail:** a moved statement that loses a `Condition`, flips `Effect`, or widens a
  `Principal` while "just moving code" is a finding — this is the highest-value refactor signal and the
  source does not frame it as a review target.

**[SEC-IAM-DEFAULT-WILDCARD] (BLOCKING)** *(conditional — RECOMMENDED when bounded)* — An optional prop
that defaults to a wildcard when omitted (an `iamResources?` defaulting to `['*']`, a default `'*'` id):
the *default* is the exposure, because forgetting the prop silently grants broad access. Prefer
requiring the prop. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules) and
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design).

**[SEC-IAM-WILDCARD-ACTION-SERVICE] (RECOMMENDED)** — A full-service action wildcard (`service:*`) on an
otherwise correctly-scoped resource is a hardening gap, not an open door. Suffix wildcards
(`s3:GetObject*`) are acceptable — **do NOT flag them.** See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).

**[SEC-IAM-HANDROLLED-POLICY] (RECOMMENDED)** *(conditional — BLOCKING when it grants a wildcard or a
set broader than the helper)* — A hand-rolled `PolicyStatement`/`addToPolicy` where a `grant*` helper
exists: the helper already computes the least-privilege action set (and matching KMS `keyActions` for
encrypted resources). See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules)
for the grant-helper MUST and
[`AGENTS_CONSTRUCT_IMPLEMENTATION.md § grants.json Auto-Generation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md#grantsjson-auto-generation)
for the grant's field semantics.
- **Doc-absent detail:** the inverse is also a finding — an over-broad grant helper (`grantFullAccess`,
  or a `grant*` including actions the code path does not need, e.g. `grantEncryptDecrypt` where only
  `kms:Decrypt` + `kms:GenerateDataKey*` are used), or an AWS-managed-policy attachment whose actions
  apply to `*` (e.g. `CloudWatchAgentServerPolicy`) where a scoped `PolicyStatement` would serve.
  Escalate to BLOCKING when a hand-rolled policy grants MORE than the corresponding `grant*`: the
  helper already computed the minimal set, so the excess is over-broad.

**[SEC-IAM-CONFUSED-DEPUTY-ACCOUNT] (RECOMMENDED)** *(conditional — BLOCKING when the path is currently
reachable)* — Missing `sts:ExternalId` condition on cross-*account* trust to a customer/partner
(external) account — an `assumedBy` `AccountPrincipal`/`ArnPrincipal` for an account outside your org.
`ExternalId` (or an inline comment stating why none is needed) is the third-party control. See
[`DESIGN_GUIDELINES.md § Roles`](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md#roles).
- **Doc-absent detail:** do NOT flag same-org / internal-Amazon cross-account trust — inside the org
  boundary the two accounts share a trust domain and `ExternalId` is not required, so flagging it floods
  false positives.

**[SEC-KMS-VIASERVICE] (RECOMMENDED)** — Missing `kms:ViaService` on an otherwise-scoped KMS grant
(defense-in-depth gap). See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).

**[SEC-IAM-PERMBOUNDARY] (RECOMMENDED)** — Missing `permissionsBoundary` on an IAM-*provisioning* role.
A role whose `inlinePolicies`/`managedPolicies` grant IAM-mutating actions (`iam:CreateRole`,
`iam:PutRolePolicy`, `iam:AttachRolePolicy`, or `iam:PassRole` on `Resource: '*'`) can mint or
re-permission other roles; a `permissionsBoundary` caps what those minted roles may do
(privilege-escalation containment). See
[`AGENTS_CONSTRUCT_DESIGN.md § IAM Role Integration`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#iam-role-integration).
- **Doc-absent detail:** gate on the IAM-mutating action set — this fires ONLY when the role grants one
  of those actions, not on ordinary roles (S3, DynamoDB, etc.), so it does not flood every role.

**[SEC-IAM-ABAC-TAGWRITE] (RECOMMENDED)** — Tag-based access control (ABAC) without tag-write
separation. When a `PolicyStatement` gates access on `aws:ResourceTag`/`aws:PrincipalTag`/
`aws:RequestTag`, an adjacent grant of `Tag*`/`Untag*` on the tagged resource lets the same principal
rewrite the governing tag and self-grant. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).
- **Doc-absent detail:** RECOMMENDED-only (defense-in-depth) — fire ONLY when BOTH halves are present; a
  benign tag-gated policy with no adjacent tag-write grant is NOT a finding.

**[SEC-IAM-OVERBROAD-PRINCIPAL] (RECOMMENDED)** *(conditional — BLOCKING when it opens access)* — A role
`assumedBy` an `AccountRootPrincipal()` (or a cross-account root) where a specific `ServicePrincipal`
suffices. See
[`DESIGN_GUIDELINES.md § Roles`](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md#roles).

**[SEC-IAM-GROUPING-NIT] (OPTIONAL)** — Failing to group related actions into one statement is a
hardening nit at most, not an exposure. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).

## Network & resource access

**[SEC-NET-PUBLIC-RESOURCE] (BLOCKING)** — A code path that makes a resource public (or widens a
resource policy's principal/action set beyond what the feature requires) where the secure default is
private is a concrete exposure. See
[`AGENTS_CONSTRUCT_DESIGN.md § IAM Resource Policy Integration`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#iam-resource-policy-integration).

**[SEC-NET-PUBLIC-NO-WARNING] (RECOMMENDED)** *(conditional — BLOCKING when it ships public access)* —
Public access introduced without the mandated synthesis-time `Annotations.of(construct).addWarningV2()`
warning. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).

## Secrets & credentials

**[SEC-SECRET-LITERAL] (BLOCKING)** — A literal credential or sensitive value (access key, password, API
key, private key, bearer token) in the diff — in code or in a value that lands in the synthesized
template. `SecretValue` defers resolution and keeps plaintext out of source and templates; a
`Token`-typed prop bypasses that. See
[`AGENTS_CONSTRUCT_DESIGN.md § Secrets`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#secrets).

**[SEC-SECRET-IN-MAP] (BLOCKING)** — A secret-shaped **value** nested in a `Record<string, string>` map
(a Lambda/ECS `environment`, CFN Include parameters, or a similar map-shaped prop) is the SAME BLOCKING
finding, even though the map's prop is named `environment`. The value still lands in the template,
recoverable via `cloudformation:GetTemplate` / `lambda:GetFunctionConfiguration`. See
[`AGENTS_CONSTRUCT_DESIGN.md § Secrets`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#secrets).
- **Doc-absent detail:** the trigger is the **value** matching a recognizable secret shape —
  `sk_live_`/`sk_test_` (Stripe), `AKIA[0-9A-Z]{16}` (AWS access key), `-----BEGIN … PRIVATE KEY-----`
  (PEM), an obvious bearer / long-hex / base64 token — **not the key name**: a secret-shaped KEY with a
  non-secret value (`PARTITION_KEY`, `SORT_KEY`, `IDEMPOTENCY_KEY`) is NOT a finding. Fix: reference the
  value via `SecretValue.secretsManager(...)` / SSM `ssmSecure` so plaintext never enters the template.

**[SEC-SECRET-TYPE] (RECOMMENDED)** — A secret-shaped prop (`password`, `*token*`) typed as a plain
`string` instead of `SecretValue` signals that embedding the secret in code/template is acceptable
(`awslint:secret-password`, `awslint:secret-token`). See
[`AGENTS_CONSTRUCT_DESIGN.md § Secrets`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#secrets).

## Secure defaults

**[SEC-DEFAULT-FLIP] (BLOCKING)** — A default changed to be less secure when the PR introduces it:
encryption moved from on- to off-by-default (or a default encryption key removed), a default TLS/security
policy downgraded, a secure-private default now defaulting to public/open, or a security control
(security-signal logging, a validation, a block-public-access setting) disabled by default. See
[`AGENTS_CONSTRUCT_DESIGN.md § Default Behavior`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#default-behavior).

**[SEC-DEFAULT-FLAG-LOOSENS] (BLOCKING)** *(conditional — RECOMMENDED when the loosening is bounded)* — A
new/changed feature flag whose enabled behavior *loosens* trust or permissions (widens a policy, opens
access, weakens a default) is a *Secure defaults* finding here — even though the flag mechanism is
otherwise a breaking-change concern outside this dimension. A flag that *tightens* is not a finding. See
[`AGENTS.md § Feature Flags`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#feature-flags).
- **Doc-absent detail:** suspect a flag whose `unconfiguredBehavesLike`/`recommendedValue` defaults
  existing apps to the *looser* behavior rather than the old (tighter) one.
