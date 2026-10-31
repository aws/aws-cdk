# Test coverage rules — the lookup

Rows are grouped by family — unit tests, then integration tests. See the `cdk-review-principles`
skill for the shared lookup convention: the
BLOCKING → RECOMMENDED → OPTIONAL sort within a family, the conditional-severity encoding, the
`(doc-absent detail)` marker, and links referencing `main`.

## Unit tests

**[TEST-UNIT-NO-ASSERTION] (BLOCKING)** — A non-asserting test — the path runs but nothing asserts the outcome that matters:
no assertion, `Match.anyValue()`, a whole-template snapshot, a bare "does not throw", a return-value-only
(`statementAdded === false`) or count-only assertion, a `toContain` on a shared prefix, a no-op statement
(`tablePolicy;`), or a test named for a behavior it never exercises. A merged PR already covers ≥95% of its changed lines, so a green Codecov
check proves the lines *ran*, never that anything *asserted* their outcome. See
[`AGENTS.md § Unit Tests`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#unit-tests) for the `Match`
rules and
[`CONTRIBUTING.md § Addressing Code Coverage Gaps`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#addressing-code-coverage-gaps)
for the patch bar.
- **Conditional (doc-absent detail):** down-tier RECOMMENDED when the core outcome is asserted elsewhere
  and only a facet is loose.
- **Detection method (doc-absent detail):** ask **if I broke the behavior this test covers, would this
  test turn red?** If not, it is a non-asserting test — it raised the Codecov number without proving anything.
  Close it by asserting the specific property/value with `Match.objectLike` (or `objectEquals` /
  `arrayWith`); reserve `Match.stringLikeRegexp()` for genuinely non-deterministic parts. Before calling
  an assertion vacuous, read what it actually compares against: for example, `addWarningV2` appends
  `[ack: <id>]` to the message, so matching on the id is a real assertion.

  ```ts
  // NON-ASSERTING: runs the new prop path, asserts nothing that would catch a wrong value
  test('supports versioning', () => {
    new Bucket(stack, 'B', { versioned: true });
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: Match.anyValue(),   // passes even if Status is wrong / absent
    });
  });
  // MEANINGFUL: asserts the exact outcome the change is responsible for
  test('versioning sets Status=Enabled', () => {
    new Bucket(stack, 'B', { versioned: true });
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: { Status: 'Enabled' },
    });
  });
  ```

**[TEST-UNIT-FLAG-STATE] (BLOCKING)** — A feature-flag-gated behavior tested in only one state, or a new
optional prop that changes a default with no backward-compat test locking the old default in. Both
reachable states need a test: a regression in the state existing apps rely on (flag off / old default)
ships with the suite still green. See
[`AGENTS.md § Feature Flags`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#feature-flags) for the
flag mechanics and
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do)
for the backward-compat-validation rule: input that previously deployed successfully MUST gate behind a
flag — both states then owe coverage.
- **Conditional (doc-absent detail):** down-tier RECOMMENDED when only the new state is untested and the
  preserved old default IS covered.
- **Detection method (doc-absent detail):** if the diff touches `FeatureFlags.of(this).isEnabled(...)` or
  adds a flag in `cx-api`, two behaviors are reachable (flag on / flag off) and both need a test. BLOCKING
  when the untested state is the one existing apps depend on — a regression there breaks deployed stacks
  with the suite green.

**[TEST-UNIT-MISSING-REGRESSION] (RECOMMENDED)** — A behavior this PR adds for its users ships with no
test that would fail if it regressed: the feature's main effect on the synthesized template (the property
it renders, the grant it adds, the resource it creates), or a non-obvious computation it performs. Judge
at the level of the feature, not of each `if` arm. See
[`CONTRIBUTING.md § Step 3: Work your Magic`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#step-3-work-your-magic).
The testing skill's "What NOT to flag" lists what does not owe a test; it overrides this rule.

**[TEST-UNIT-TOKEN-GUARD] (RECOMMENDED)** — The PR adds a `Token.isUnresolved()` guard (skipping a
validation or a string manipulation for deploy-time values), and no test passes an unresolved token through
it. Without the test, a later edit that drops the guard breaks every user passing a `Ref` or `Fn::` value.
See [`AGENTS.md § Token Safety`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#token-safety).

## Integration tests

**[TEST-INTEG-MISSING-REQUIRED] (BLOCKING)** — An integ test the gate marked owed (a feature/fix, a
previously-unused CFN resource or property, a cross-service integration, a new supported version, or a
Custom Resource) is absent with no valid exemption. See
[`AGENTS.md § Integration Tests`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#integration-tests) and
[`INTEGRATION_TESTS.md § When are Integration Tests Required`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md#when-are-integration-tests-required)
for the required-scenario list,
[`CONTRIBUTING.md § Integration Tests`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#integration-tests)
for the feat/fix default, and the `pr-linter/exempt-integ-test` label in
[`prlint/constants.ts`](https://github.com/aws/aws-cdk/blob/main/tools/@aws-cdk/prlint/constants.ts) for
the exempt terminal.
- **Exemption heuristic (doc-absent detail):** a simple property pass-through (a value threaded straight
  to an L1 with no new behavior) is the canonical exemption — **but** a pass-through exposing a
  previously-unused or untested CFN property is NOT exempt; that case requires a test and takes precedence
  over the pass-through intuition.
- **Conditional (doc-absent detail):** down-tier RECOMMENDED when a unit test already asserts the change's
  synthesized-template effect and only the owed integ test is absent (a coverage-depth gap, not shipped
  damage — ask for the integ test or the exempt label, do not block).

**[TEST-INTEG-DANGEROUS-SNAPSHOT] (BLOCKING)** — The committed `*.snapshot` change hides a dangerous
template change presented as a benign refresh. The snapshot IS the synthesized CloudFormation template, so
a snapshot diff is a template diff, not a "regenerated snapshot." See
[`INTEGRATION_TESTS.md § What are CDK Integration Tests`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md#what-are-cdk-integration-tests)
for the snapshot-as-template fact and
[`CONTRIBUTING.md § Behavior changes`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#behavior-changes)
for the breaking-change rule.
- **Dangerous-diff signatures (doc-absent detail):** BLOCKING when hidden in a "benign" refresh — name the
  specific template line (resource logical ID + property) and the consequence:
  - **Stateful-resource replacement** — a replacement-triggering property changed on a stateful resource
    (`AWS::RDS::DBInstance`, `AWS::DynamoDB::Table`, `AWS::S3::Bucket`, `AWS::EFS::FileSystem`,
    `AWS::Elasticache::*`). CloudFormation deletes and recreates; data is lost.
  - **Logical-ID change of a stateful resource** — the resource's logical key in `Resources` changed (often
    via a construct-path/id change). CloudFormation treats it as delete + create → data loss.
  - **IAM widening** — a statement's `Action`/`Resource` broadened (`s3:GetObject` → `s3:*`, a specific ARN
    → `"*"`), a new `Allow`, or a trust-policy principal opened up. IAM design in
    production code is outside your scope, but flag it here when the *snapshot diff* reveals the widening as a benign refresh.
  - **Removal/retention-policy weakening** — `DeletionPolicy` / `UpdateReplacePolicy` moving `Retain` →
    `Delete` (or dropped) on a stateful resource.
- **Snapshot-reading budget (doc-absent detail):** do NOT read the whole `*.snapshot/` directory — it is
  large auto-generated output. Focus on the `integ.*.ts` file and SCAN the template diff only for the
  signatures above; skip `manifest.json`, `tree.json`, and asset files — they carry no review value. The
  goal is catching a dangerous template change hiding in the regeneration, not auditing generated bytes.
- **Mechanical churn is OUT OF SCOPE (doc-absent detail):** tooling-driven, no semantic template change —
  asset hashes, CDK version strings / `aws:cdk:version` metadata, bootstrap/synthesizer boilerplate
  (`CDKMetadata`, `BootstrapVersion` SSM lookups), pure metadata / ordering churn (`aws:cdk:path`,
  key-order, `Rules`/`Parameters` reshuffles with no property change). Rule of thumb: if no resource's
  type, logical ID, or real property value changed, the diff is mechanical — do not flag it, and do not
  wave one through because "snapshots always change."

**[TEST-INTEG-STALE-SNAPSHOT] (BLOCKING)** — The diff shows a changed `integ.*.ts` and its companion
`*.snapshot/`, but the snapshot does not reflect the test change (or a brand-new `integ.*.ts` arrives with
no `*.snapshot/` at all). The snapshot IS the synthesized template, so a test change that alters synthesis
must change the snapshot too; when it does not, the committed snapshot no longer proves the test deploys.

```
# FLAG only when the .ts change alters synthesis (new or changed resources, props or stacks)
# and the snapshot the diff shows does not reflect it
packages/.../test/integ.my-feature.ts           (changed)
packages/.../test/integ.my-feature.js.snapshot/  (unchanged — no companion update)

# DO NOT FLAG a .ts edit that cannot alter synthesis (comment, rename, reorder,
# import or formatting change) — it correctly produces a byte-identical snapshot
```

See
[`INTEGRATION_TESTS.md § What are CDK Integration Tests`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md#what-are-cdk-integration-tests)
for the snapshot-as-template fact and
[`CONTRIBUTING.md § Integration Tests`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#integration-tests)
for the regenerate-via-real-deploy rule.

**[TEST-INTEG-CONSTRUCT-MISUSE] (RECOMMENDED)** — A new integ test not using the
`@aws-cdk/integ-tests-alpha` `IntegTest` pattern (no `testCases`, or a stack that never reaches an
`IntegTest`), or a snapshot hand-edited or produced with `cdk-integ --dry-run` (regenerated from synthesis
without a real deploy) instead of by a real deploy — so it no longer proves the template deploys. See
[`AGENTS.md § Integration Tests`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#integration-tests) for
the `IntegTest`/`testCases` pattern,
[`CONTRIBUTING.md § Integration Tests`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#integration-tests)
for the no-`--dry-run` hard rule, and the
[`IntegTest` construct](https://github.com/aws/aws-cdk/blob/main/packages/@aws-cdk/integ-tests-alpha/lib/test-case.ts).
- **Placement (doc-absent detail):** don't false-flag a correctly-placed test. Stable modules' integ tests
  live in `@aws-cdk-testing/framework-integ/test/MODULE/test/integ.*.ts`; alpha modules
  (`@aws-cdk/<service>-alpha`) keep theirs in the alpha package's own `test/` dir, NOT in `framework-integ`.
  An alpha test in its own `test/` dir is placed correctly.

**[TEST-INTEG-WEAK-ASSERTION] (RECOMMENDED)** — A deploy-only test where a cross-service, Custom-Resource,
code-bundling, or complex-IAM/networking change owes a deploy-time assertion. Independently, a verification
scaffold that never verifies — a `CfnOutput` declared or an `awsApiCall` set up with no `ExpectedResult`
asserting on it — is abandoned verification: dead test code claiming a check it never makes. Flag it
whether or not the change's category owed an assertion. See
[`INTEGRATION_TESTS.md § Assertions`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md#assertions)
for the assertion-owed cases and the `awsApiCall` → `ExpectedResult` API. Also assert the
**negative/failure path**: when the PR adds behavior that should DENY or reject, assert the denial (a
`403`/error `ExpectedResult`), not only the success path.
- **Calibration (doc-absent detail):** a single-property that just renders into the template does NOT owe
  a deploy-time assertion — a successful deploy validates it.

**[TEST-INTEG-REDUNDANT] (OPTIONAL)** — N resources created to exercise N enum values when one reconfigured
resource, or the enum threaded through, gives the same synthesized-template coverage. One resource usually
suffices to prove the enum renders. See
[`INTEGRATION_TESTS.md § New L2 Constructs`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md#new-l2-constructs)
and
[`§ Existing L2 Constructs`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md#existing-l2-constructs)
for the coverage shape a new/existing L2 owes.
- **Conditional (doc-absent detail):** up-tier RECOMMENDED when the multiplication is large.
- **Module-norm technique (doc-absent detail):** when judging over-/under-testing, compare against 2-3
  similar integ tests in the same module (stable in
  `@aws-cdk-testing/framework-integ/test/MODULE/test/integ.*.ts`, alpha in the alpha package's own
  `test/`) and cite them as evidence — a test far heavier than its peers likely warrants simplification;
  one far lighter for a comparable feature may be under-testing.
