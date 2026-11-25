# Test review rules

## Unit tests

**[TEST-UNIT-NO-ASSERTION] (BLOCKING)** — A non-asserting test — the path runs but nothing asserts the
outcome that matters — or a test named for a behavior it never exercises. See
[`AGENTS.md § Unit Tests`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#unit-tests) for the `Match`
rules.
- **Tier:** RECOMMENDED when the core outcome is asserted elsewhere
  and only a facet is loose.

**[TEST-UNIT-FLAG-STATE] (BLOCKING)** — A feature-flag-gated behavior tested in only one state, or a new
optional prop that changes a default with no backward-compat test locking the old default in. Both
reachable states need a test: a regression in the state existing apps rely on (flag off / old default)
ships with the suite still green. See
[`AGENTS.md § Feature Flags`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#feature-flags) for the
flag mechanics and
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do)
for new validation on existing constructs.
- **Tier:** RECOMMENDED when only the new state is untested and the
  preserved old default is covered.

**[TEST-UNIT-MISSING-REGRESSION] (RECOMMENDED)** — A behavior the PR adds that a user relies on has no test
that would fail if it broke. See
[`AGENTS.md § Unit Tests`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#unit-tests) for how to assert
the outcome.
- **Tier:** BLOCKING when the untested behavior is a security- or
  correctness-critical guardrail the change adds. Such a guardrail is a check the change adds whose silent
  failure would let a security exposure or a wrong deployment through, for example a validation that
  rejects a configuration which would otherwise deploy and be exposed or wrong. A check whose silent
  failure would only surface as a synthesis or deployment error, such as a bound on a value the service
  itself rejects, is not a guardrail: losing it delays an error the user gets anyway. Neither is any other
  behavior, however important; its missing test stays RECOMMENDED.

**[TEST-UNIT-EDGE-NEGATIVE] (RECOMMENDED)** — The happy path is tested but the boundary value, invalid
input, failure/error path, or token input the code handles is not — where regressions hide. A branch that
emits a diagnostic (`addWarningV2` / `addError` / `addInfo`) instead of throwing is also a reject arm: it
needs a `hasWarning`/`hasError` assertion, because a "does not throw" test passes while the warning silently
regresses. See
[`AGENTS.md § Unit Tests`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#unit-tests) for the
`test.each` / `"fails"`-prefix / specific-message convention,
[`assertions/README.md § Asserting Annotations`](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/assertions/README.md#asserting-annotations)
for the `hasWarning`/`hasNoWarning`/`hasError` API, and
[`AGENTS_CONSTRUCT_IMPLEMENTATION.md § Mixin Testing`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_IMPLEMENTATION.md#mixin-testing)
for a mixin's required tests.
- **Tier:** BLOCKING when the diagnostic / reject arm is a security- or
  correctness-critical guardrail the change adds, as `TEST-UNIT-MISSING-REGRESSION` defines it.

## Integration tests

**[TEST-INTEG-MISSING-REQUIRED] (BLOCKING)** — An integ test the PR needs is absent with no valid
exemption. See
[`AGENTS.md § Integration Tests`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#integration-tests) and
[`INTEGRATION_TESTS.md § When are Integration Tests Required`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md#when-are-integration-tests-required)
for the required-scenario list,
[`CONTRIBUTING.md § Integration Tests`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#integration-tests)
for the feat/fix default, and the `pr-linter/exempt-integ-test` label in
[`prlint/constants.ts`](https://github.com/aws/aws-cdk/blob/main/tools/@aws-cdk/prlint/constants.ts) for
the exempt terminal.
- **Tier:** RECOMMENDED when a unit test already asserts the change's
  synthesized-template effect and only the required integ test is absent; ask for the integ test or the exempt
  label.

**[TEST-INTEG-DANGEROUS-SNAPSHOT] (BLOCKING)** — The committed `*.snapshot` change hides a dangerous
template change presented as a benign refresh. The snapshot is the synthesized CloudFormation template, so
a snapshot diff is a template diff. See
[`INTEGRATION_TESTS.md § What are CDK Integration Tests`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md#what-are-cdk-integration-tests)
for the snapshot-as-template fact and
[`CONTRIBUTING.md § Behavior changes`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#behavior-changes)
for the breaking-change rule.
- **Also dangerous:** a widened IAM `Action`/`Resource`, a new `Allow` or a widened trust principal, and a
  `DeletionPolicy` / `UpdateReplacePolicy` moved off `Retain` or dropped on a stateful resource.
- **Snapshot reading:** skip `manifest.json`, `tree.json` and asset files; read the template diff.
- **Mechanical churn:** a diff in which no resource's type, logical ID or real property value changed is
  not this finding.

**[TEST-INTEG-STALE-SNAPSHOT] (BLOCKING)** — The diff shows a changed `integ.*.ts` and its companion
`*.snapshot/`, but the snapshot does not reflect the test change (or a brand-new `integ.*.ts` arrives with
no `*.snapshot/` at all). The snapshot is the synthesized template, so a test change that alters synthesis
must change the snapshot too; when it does not, the committed snapshot no longer proves the test deploys.
A `.ts` edit that cannot alter synthesis (a comment, rename, reorder, import or formatting change)
correctly leaves the snapshot byte-identical and is not this finding. See
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

**[TEST-INTEG-WEAK-ASSERTION] (RECOMMENDED)** — A deploy-only test where a cross-service, Custom-Resource,
code-bundling, or complex-IAM/networking change needs a deploy-time assertion. Independently, a verification
scaffold that never verifies — a `CfnOutput` declared or an `awsApiCall` set up with no `ExpectedResult`
asserting on it — is abandoned verification: dead test code claiming a check it never makes. Flag it
whether or not the change's category needed an assertion. See
[`INTEGRATION_TESTS.md § Assertions`](https://github.com/aws/aws-cdk/blob/main/INTEGRATION_TESTS.md#assertions)
for the cases that need an assertion and the `awsApiCall` → `ExpectedResult` API. Also assert the
**negative/failure path**: when the PR adds behavior that should deny or reject, assert the denial (a
`403`/error `ExpectedResult`).
