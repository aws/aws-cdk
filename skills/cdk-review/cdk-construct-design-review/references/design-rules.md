# Construct design rules — the lookup

Rows are grouped by defect family (feature placement & abstraction, Design Guidelines conformance,
ages-well anti-patterns). See the `cdk-review-principles` skill for the shared
lookup convention (the BLOCKING → RECOMMENDED → OPTIONAL sort within a family, the conditional-severity
encoding, the `(doc-absent detail)` marker, and links referencing `main`).

## Feature placement & abstraction

**[CD-FEATURE-PLACEMENT] (BLOCKING)** — Implement a new feature as a building block (Mixin /
CfnPropsMixin / Facade / Trait) first, and only as an L2 method if none fits. See
[`AGENTS_CONSTRUCT_DESIGN.md § Feature Placement Decision`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#feature-placement-decision)
for the first-match-wins table and
[`AGENTS.md § L2 Building Blocks`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#l2-building-blocks)
for each block.
- **Detection cue (doc-absent detail):** the "feature" to place is feature *logic* — input validation,
  auxiliary-resource creation, or computed behavior — living in L2 glue code, or a grant/metric/event
  helper implemented as a bare method rather than a building block.

**[CD-IFOO-NO-FEATURE-METHODS] (BLOCKING)** — A feature method or config-mutation method added to the
resource interface `IFoo` is a MUST violation; features belong on Facades. See
[`AGENTS_CONSTRUCT_DESIGN.md § Construct Interface (IFoo)`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#construct-interface-ifoo)
and [`§ Configuration Mutation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#configuration-mutation).
- **False-positive guard (doc-absent detail):** `grant*` methods, `from*` importers, and `add{Bar}`
  factories SHOULD be on the interface; flagging one is a false BLOCKING against a conformant design — do
  not report it.

**[CD-LAYER-MODEL] (BLOCKING)** — An L2 MUST hide CloudFormation (no `Cfn*`/`Token` in its surface),
provide an escape hatch to the L1, and expose the full service surface (no hard-coded choice the service
exposes). See
[`AGENTS.md § Architecture — The Layer Model`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#architecture--the-layer-model).

**[CD-README-DRIVEN] (RECOMMENDED)** — A new or significantly-changed L2 shipping with no README usage
example is a design miss. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes).

## Design Guidelines conformance

**[CD-PROPS-SHAPE] (BLOCKING)** — Props must be `readonly`, flat, concise, and strongly typed (construct
interfaces not ARN strings, `Duration`/`Size` not raw numbers, no `Cfn*`/`Token`). See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design).

**[CD-PROPS-DEFAULT] (BLOCKING)** — A `@default` that contradicts what the code does is a real
behavioral surprise. See
[`AGENTS_CONSTRUCT_DESIGN.md § Default Behavior`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#default-behavior).
- **Scope split (doc-absent detail):** the default *behavior* is yours; whether the tag is merely present
  or reads well is outside your scope — do not tier a routine missing tag as BLOCKING here.

**[CD-SECRET-VALUE] (BLOCKING)** — A prop named `password`, or carrying a token/secret, must be typed
`SecretValue` so a plaintext secret can't pass through the API. See
[`AGENTS_CONSTRUCT_DESIGN.md § Secrets`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#secrets).
- **Scope split (doc-absent detail):** the type choice is design (yours); whether a specific value leaks
  is outside your scope.

**[CD-NAMING] (BLOCKING)** — Name the resource and its props in official AWS/CloudFormation terminology,
and derive related type names (`FooProps`, `IFoo`). See
[`AGENTS_CONSTRUCT_DESIGN.md § Property Naming`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#property-naming).

**[CD-ATTRIBUTES] (BLOCKING)** — Expose every CloudFormation attribute as a `readonly`,
type-name-prefixed (`bucketArn`, not `arn`) opaque token. See
[`AGENTS_CONSTRUCT_DESIGN.md § Resource Attributes`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#resource-attributes).
- **Scope split (doc-absent detail):** the surface design is yours; grading the tag/`@returns` prose is
  outside your scope.

**[CD-CONSTRUCT-ANATOMY] (BLOCKING)** — Use the standard constructor and extend only
`Resource`/`Construct`/`{Foo}Base`. See
[`AGENTS_CONSTRUCT_DESIGN.md § Base Classes & Inheritance`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#base-classes--inheritance).

**[CD-FROM-METHODS] (BLOCKING)** — Give a resource at least one `from{Attribute}` importer (a resource
with an ARN MUST have `fromFooArn`), placed on the concrete class; `from*` MUST NOT transform or validate
the identifier. See
[`AGENTS_CONSTRUCT_DESIGN.md § Import (from*) Methods`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#import-from-methods).

**[CD-REMOVAL-POLICY] (BLOCKING)** — A new stateful resource (database, table, bucket) must expose a
`removalPolicy?` prop. See
[`AGENTS_CONSTRUCT_DESIGN.md § Stateful/Stateless & Removal Policy`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#statefulstateless--removal-policy).

**[CD-STATEFUL-REPLACEMENT-FOOTGUN] (BLOCKING)** — A new L2 prop mapping to a CloudFormation property whose
`UpdateType` is `Immutable` (or `Conditional`) is a replacement footgun: setting it later triggers a
CloudFormation replacement. On a stateful resource — database, table, bucket, EFS, DynamoDB, OpenSearch, EBS
volume, Secret, KMS key — that replacement destroys the user's data, so the L2 should guard the prop:
validate it, warn on change, or document the replacement risk. Verify the update behavior against the
CloudFormation resource specification before you flag. See
[CloudFormation § Update behaviors — Replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement)
for the update-behavior classes and
[`AGENTS_CONSTRUCT_DESIGN.md § Stateful/Stateless & Removal Policy`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#statefulstateless--removal-policy)
for the stateful classification.
- **Down-tier to RECOMMENDED for a stateless resource (doc-absent detail):** replacement there costs
  downtime and a new physical name/ARN, not data — a hardening gap, not damage.
- **Scope split (doc-absent detail):** flag only the *new* surface a future user mutates. A break in an
  *existing* consumer's synthesis, and the committed snapshot diff of this PR's own synth, are outside
  construct-design's scope.

**[CD-NO-L2-TAGGABLE] (BLOCKING)** — An L2 implementing `ITaggable`/`ITaggableV2` or exposing a
`TagManager` is a MUST NOT; the mandated shape is an optional `tags` prop wired to the L1 default child.
See [`AGENTS_CONSTRUCT_DESIGN.md § Tags`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#tags).

**[CD-BACKWARD-COMPAT] (BLOCKING)** — Design the new surface so it won't force a future break: no
`@deprecated` props in a newly introduced interface, keep detail types `@internal`, and correct later by
deprecate-and-add (`FooV2`), not mutate. See
[`AGENTS_CONSTRUCT_DESIGN.md § Backward Compatibility & Deprecation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#backward-compatibility--deprecation).
- **Scope split (doc-absent detail):** classifying an *existing-surface* break is outside construct-design's scope.

**[CD-AWSLINT-SUPPRESSION] (RECOMMENDED)** — Flag every `awslint.exclude` entry the diff adds or broadens,
and ask for a stated justification in the PR description or an adjacent comment. A suppression turns off an
awslint rule that enforces a design guideline at build time, so an unjustified one silently drops that
guardrail. See
[`CONTRIBUTING.md § awslint`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#awslint) for the
build-time enforcement and
[`awslint README § Saving State`](https://github.com/aws/aws-cdk/blob/main/packages/awslint/README.md#saving-state)
for the `exclude` mechanism.
- **Escalate to BLOCKING when the suppressed rule backs a MUST-level guideline (doc-absent detail):** the
  suppression there silences the exact floor the design and regression lenses trust.

**[CD-ENUMS] (RECOMMENDED)** — Model a closed known set as an `enum`, an open set as an enum-like class.
See
[`AGENTS_CONSTRUCT_DESIGN.md § Enums & Enum-Like Classes`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#enums--enum-like-classes).

**[CD-STATIC-TYPE-CHECK] (RECOMMENDED)** — Prefer a static `isFoo` over `instanceof`. See
[`AGENTS_CONSTRUCT_DESIGN.md § Static Type Check`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#static-type-check).

**[CD-ADD-FACTORY] (RECOMMENDED)** — Offer a convenience `add{Bar}(...)` factory for secondary resources,
and prefer extending an existing method over adding a new one. See
[`AGENTS_CONSTRUCT_DESIGN.md § Factory Methods for Secondary Resources`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#factory-methods-for-secondary-resources).

**[CD-STANDARD-AFFORDANCE] (RECOMMENDED)** — Add the standard `metric*`/`onXxx`/`connections`/`role`
affordance where the service supports it. See
[`AGENTS_CONSTRUCT_DESIGN.md § CloudWatch Metrics`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#cloudwatch-metrics)
and the sections following it for the signatures.
- **Auto-wired affordances (doc-absent detail):** before flagging an absence, confirm the framework
  doesn't already provide it — tagging works through `Tags.of(x).add(...)` wherever the L1 is taggable, and
  `removalPolicy`, dependencies, and metadata come from `cdk.Resource`; flagging one of these as missing is
  a false positive.

**[CD-POLYMORPHISM-OVER-BOOLEAN] (RECOMMENDED)** — Model behavioral variation through polymorphism, not a
boolean flag. See
[`AGENTS_CONSTRUCT_DESIGN.md § Polymorphism over Booleans`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#polymorphism-over-booleans).

**[CD-TYPE-REUSE] (RECOMMENDED)** — Reuse an existing type across modules when semantically equivalent
rather than declaring a parallel one. See
[`AGENTS_CONSTRUCT_DESIGN.md § Type Reuse`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#type-reuse).

**[CD-PREFER-DEFAULT] (RECOMMENDED)** — Prefer inferring a sensible default over raising an error: error
only when no default exists or the user gave an explicitly contradictory config. See
[`AGENTS.md § Error Handling`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#error-handling).
- **Application (doc-absent detail):** when two or more props jointly control one behavior, trace every
  combination (both / one / conflicting) against this ordering. Infer a value derivable from another prop
  or the service rather than require it.
- **Escalate to BLOCKING only when the same shape also breaks a cited codified mandate — cite it.**

## Ages-well anti-patterns

Each is a codified MUST NOT at
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do).

**[CD-SPECULATIVE-ABSTRACTION] (BLOCKING)** — No speculative abstraction ("do not future-proof"): an
unused base class, generic interface, or option added "for the future" is un-removable API surface with
no consumer today.

**[CD-DEAD-CODE] (BLOCKING)** — No commented-out code, dead code, or `eslint-disable` directives in the
public surface.

**[CD-CONSTRUCT-ID-CHANGE] (BLOCKING)** — A construct ID MUST NOT change.
- **Scope split (doc-absent detail):** the resulting stack break is also outside construct-design's scope.

**[CD-PREFER-ADDITIONS] (RECOMMENDED)** — Prefer additions over modification — design so the next
capability lands additively. See
[`AGENTS_CONSTRUCT_DESIGN.md § Factory Methods for Secondary Resources`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#factory-methods-for-secondary-resources).
