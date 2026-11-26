# Security rules

The repo Security Rules these distill live at
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules) —
the primary security citation.

## IAM least-privilege

**[SEC-IAM-WILDCARD-RESOURCE] (BLOCKING)** — A `Resource: "*"` (or an ARN far broader than the
resource the code touches) where a scoped ARN exists, including when it is the default of an optional
prop. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).

**[SEC-IAM-WILDCARD-ACTION-ALL] (BLOCKING)** — An all-services action wildcard (`Action: "*"`), even
on a scoped resource. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).

**[SEC-IAM-CONFUSED-DEPUTY-SERVICE] (BLOCKING)** — Missing confused-deputy condition
(`aws:SourceAccount`/`aws:SourceArn`) on a cross-*service* trust policy (a trusted `ServicePrincipal`). See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).
- **Tier:** RECOMMENDED when the path is not yet reachable.

**[SEC-IAM-REFACTOR-SCOPE-DROP] (BLOCKING)** — A refactor that drops scoping, such as a conversion from
`PolicyStatement`s to grants that drops a condition, an effect or a principal. See
[`AGENTS_CONSTRUCT_IMPLEMENTATION.md § Grants`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md#grants).
- **Tier:** RECOMMENDED when the dropped scoping guards a not-yet-reachable path.

**[SEC-IAM-WILDCARD-ACTION-SERVICE] (RECOMMENDED)** — A full-service action wildcard (`service:*`) on an
otherwise correctly-scoped resource grants more than the code needs but opens no security boundary.
Suffix wildcards (`s3:GetObject*`) are acceptable. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).

**[SEC-IAM-HANDROLLED-POLICY] (RECOMMENDED)** — A hand-rolled `PolicyStatement`/`addToPolicy` where a
`grant*` helper exists: the helper already computes the least-privilege action set (and matching KMS
`keyActions` for encrypted resources). See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules)
for the grant-helper MUST and
[`AGENTS_CONSTRUCT_IMPLEMENTATION.md § grants.json Auto-Generation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md#grantsjson-auto-generation)
for the grant's field semantics.
- **Tier:** BLOCKING when it grants a wildcard or a set broader than the helper.
- **Over-broad grants:** a `grant*` helper or an AWS-managed policy that grants actions the code path does
  not use, where a narrower grant or a scoped `PolicyStatement` would serve, is also a finding.

**[SEC-IAM-CONFUSED-DEPUTY-ACCOUNT] (RECOMMENDED)** — Missing `sts:ExternalId` condition on
cross-*account* trust to a customer/partner (external) account — an `assumedBy`
`AccountPrincipal`/`ArnPrincipal` for an account outside your org. `ExternalId` is the third-party
control. See
[`DESIGN_GUIDELINES.md § Roles`](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md#roles).
- **Tier:** BLOCKING when the path is currently reachable.

**[SEC-KMS-VIASERVICE] (RECOMMENDED)** — Missing `kms:ViaService` on an otherwise-scoped KMS grant
(defense-in-depth gap). See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).

**[SEC-IAM-PERMBOUNDARY] (RECOMMENDED)** — Missing `permissionsBoundary` on an IAM-*provisioning* role.
A role whose `inlinePolicies`/`managedPolicies` grant IAM-mutating actions (`iam:CreateRole`,
`iam:PutRolePolicy`, `iam:AttachRolePolicy`, or `iam:PassRole` on `Resource: '*'`) can mint or
re-permission other roles; a `permissionsBoundary` caps what those minted roles may do
(privilege-escalation containment). See
[`AGENTS_CONSTRUCT_DESIGN.md § IAM Role Integration`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#iam-role-integration).

**[SEC-IAM-ABAC-TAGWRITE] (RECOMMENDED)** — Tag-based access control (ABAC) without tag-write
separation. When a `PolicyStatement` gates access on `aws:ResourceTag`/`aws:PrincipalTag`/
`aws:RequestTag`, an adjacent grant of `Tag*`/`Untag*` on the tagged resource lets the same principal
rewrite the governing tag and self-grant. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).

**[SEC-IAM-OVERBROAD-PRINCIPAL] (RECOMMENDED)** — A role `assumedBy` an `AccountRootPrincipal()` (or a
cross-account root) where a specific `ServicePrincipal` suffices. See
[`DESIGN_GUIDELINES.md § Roles`](https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md#roles).
- **Tier:** BLOCKING when it opens a security boundary.

## Network & resource access

**[SEC-NET-PUBLIC-RESOURCE] (BLOCKING)** — A code path that makes a resource public (or widens a
resource policy's principal/action set beyond what the feature requires) where the secure default is
private is a concrete exposure. See
[`AGENTS_CONSTRUCT_DESIGN.md § IAM Resource Policy Integration`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#iam-resource-policy-integration).

**[SEC-NET-PUBLIC-NO-WARNING] (RECOMMENDED)** — Public access introduced without the mandated
synthesis-time `Annotations.of(construct).addWarningV2()` warning. See
[`AGENTS.md § Security Rules`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#security-rules).
- **Tier:** BLOCKING when it ships public access.

## Secrets & credentials

**[SEC-SECRET-LITERAL] (BLOCKING)** — A literal credential or sensitive value (access key, password, API
key, private key, bearer token) in the diff — in code or in a value that lands in the synthesized
template. `SecretValue` defers resolution and keeps plaintext out of source and templates; a
`Token`-typed prop bypasses that. See
[`AGENTS_CONSTRUCT_DESIGN.md § Secrets`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#secrets).

**[SEC-SECRET-IN-MAP] (BLOCKING)** — A value that is itself a credential, judged by the value and not the
key name, nested in a `Record<string, string>` map (a Lambda/ECS `environment`, CFN Include parameters, or a
similar map prop) is the same BLOCKING finding, even though the map's prop is named `environment`.
The value still lands in the template, recoverable via `cloudformation:GetTemplate` /
`lambda:GetFunctionConfiguration`. See
[`AGENTS_CONSTRUCT_DESIGN.md § Secrets`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#secrets).

## Secure defaults

**[SEC-DEFAULT-FLIP] (BLOCKING)** — A default changed to be less secure when the PR introduces it:
encryption moved from on- to off-by-default (or a default encryption key removed), a default TLS/security
policy downgraded, a secure-private default now defaulting to public/open, or a security control
(security-signal logging, a validation, a block-public-access setting) disabled by default. See
[`AGENTS_CONSTRUCT_DESIGN.md § Default Behavior`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#default-behavior).

**[SEC-DEFAULT-FLAG-LOOSENS] (BLOCKING)** — A new/changed feature flag whose enabled behavior *loosens*
trust or permissions (widens a policy, opens access, weakens a default) is a *Secure defaults* finding
here — even though the flag mechanism is otherwise a breaking-change concern outside this dimension. See
[`AGENTS.md § Feature Flags`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#feature-flags).
- **Detection:** suspect a flag whose `unconfiguredBehavesLike`/`recommendedValue` defaults
  existing apps to the *looser* behavior rather than the old (tighter) one.
