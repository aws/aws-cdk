# Construct design rules

## Feature placement & abstraction

**[CD-IFOO-NO-FEATURE-METHODS] (BLOCKING)** — A feature method or a config-mutation method added to the
resource interface `IFoo`, other than a factory method that creates a new resource (`add{Bar}`) or a method
[`AGENTS_CONSTRUCT_DESIGN.md § Standard Interface Extensions`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#standard-interface-extensions)
requires on the interface; features belong on Facades. See
[`AGENTS_CONSTRUCT_DESIGN.md § Construct Interface (IFoo)`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#construct-interface-ifoo)
and [`§ Configuration Mutation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#configuration-mutation).

**[CD-LAYER-MODEL] (BLOCKING)** — An L2 hides CloudFormation (no `Cfn*`/`Token` in its surface),
provides an escape hatch to the L1, and exposes the full service surface (no hard-coded choice the service
exposes). See
[`AGENTS.md § Architecture — The Layer Model`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#architecture--the-layer-model).

**[CD-FEATURE-PLACEMENT] (RECOMMENDED)** — Implement a new feature as a building block (Mixin /
CfnPropsMixin / Facade / Trait) first, and only as an L2 method if none fits. See
[`AGENTS_CONSTRUCT_DESIGN.md § Feature Placement Decision`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#feature-placement-decision)
for the first-match-wins table and
[`AGENTS.md § L2 Building Blocks`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#l2-building-blocks)
for each block.

## Design Guidelines conformance

**[CD-PROPS-SHAPE] (BLOCKING)** — Props are flat by default, concise and strongly typed. See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design).
- **Tier:** RECOMMENDED for props valid only together that are left as separate props (one nested object),
  and for props that exclude each other (factory methods or an enum-like class). See
  [`AGENTS_CONSTRUCT_DESIGN.md § Property Structure`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#property-structure-flat-vs-nested).

**[CD-SECRET-VALUE] (BLOCKING)** — A prop named `password`, or carrying a token or secret, is typed
`SecretValue`, so a plaintext secret can't pass through the API. See
[`AGENTS_CONSTRUCT_DESIGN.md § Secrets`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#secrets).

**[CD-NAMING] (BLOCKING)** — Name the resource and its props in official AWS/CloudFormation terminology,
and derive its resource interface name (`IFoo`). See
[`AGENTS_CONSTRUCT_DESIGN.md § Property Naming`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#property-naming).

**[CD-ATTRIBUTES] (BLOCKING)** — Expose every CloudFormation attribute as a type-name-prefixed opaque
token. See
[`AGENTS_CONSTRUCT_DESIGN.md § Resource Attributes`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#resource-attributes).

**[CD-CONSTRUCT-ANATOMY] (BLOCKING)** — Extend only `Resource`/`Construct`/`{Foo}Base`. See
[`AGENTS_CONSTRUCT_DESIGN.md § Base Classes & Inheritance`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#base-classes--inheritance).

**[CD-FROM-METHODS] (BLOCKING)** — A resource construct without a static `from{Attribute}` method, or with
an ARN and no `fromFooArn`; a `from*` method defined on a class other than the resource construct; a
`from*` method that changes the identifier it is given. See
[`AGENTS_CONSTRUCT_DESIGN.md § Import (from*) Methods`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#import-from-methods).

**[CD-REMOVAL-POLICY] (BLOCKING)** — A new stateful resource (database, table, bucket) that lacks a
`removalPolicy?` prop. See
[`AGENTS_CONSTRUCT_DESIGN.md § Stateful/Stateless & Removal Policy`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#statefulstateless--removal-policy).

**[CD-TAGS] (BLOCKING)** — An L2 that implements `ITaggable`/`ITaggableV2` or exposes a `TagManager`. See
[`AGENTS_CONSTRUCT_DESIGN.md § Tags`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#tags).
- **Tier:** RECOMMENDED for a new L2 of a taggable resource with no `tags` prop, or one that does not pass
  `props.tags` to the L1.

**[CD-BACKWARD-COMPAT] (BLOCKING)** — Design the new surface so it won't force a future break: no
`@deprecated` props in a newly introduced interface, keep detail types `@internal`, and correct later by
deprecate-and-add (`FooV2`), not mutate. See
[`AGENTS_CONSTRUCT_DESIGN.md § Backward Compatibility & Deprecation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#backward-compatibility--deprecation).
- **Tier:** RECOMMENDED for an implementation-detail type left exported instead of `@internal`.
- **Tier:** RECOMMENDED for a `@deprecated` prop in a newly introduced interface.

**[CD-STATEFUL-REPLACEMENT-RISK] (RECOMMENDED)** — A new L2 prop on a stateful resource that maps to a
CloudFormation property requiring replacement, whose JSDoc does not say that changing it replaces the
resource. See
[CloudFormation § Update behaviors — Replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement)
for the update-behavior classes and
[`AGENTS_CONSTRUCT_DESIGN.md § Stateful/Stateless & Removal Policy`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#statefulstateless--removal-policy)
for the stateful classification.

**[CD-AWSLINT-SUPPRESSION] (RECOMMENDED)** — Flag every `awslint.exclude` entry the diff adds or broadens,
and ask for a stated justification in the PR description or an adjacent comment. A suppression turns off an
awslint rule that enforces a design guideline at build time, so an unjustified one silently drops that
guardrail. See
[`CONTRIBUTING.md § awslint`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#awslint) for the
build-time enforcement and
[`awslint README § Saving State`](https://github.com/aws/aws-cdk/blob/main/packages/awslint/README.md#saving-state)
for the `exclude` mechanism.
- **Tier:** BLOCKING when the suppressed rule backs a MUST-level guideline.

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

**[CD-POLYMORPHISM-OVER-BOOLEAN] (RECOMMENDED)** — Model behavioral variation through polymorphism, not a
boolean flag. See
[`AGENTS_CONSTRUCT_DESIGN.md § Polymorphism over Booleans`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#polymorphism-over-booleans).

**[CD-TYPE-REUSE] (RECOMMENDED)** — Reuse an existing type across modules when semantically equivalent
rather than declaring a parallel one. See
[`AGENTS_CONSTRUCT_DESIGN.md § Type Reuse`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#type-reuse).

**[CD-PREFER-DEFAULT] (RECOMMENDED)** — Prefer inferring a sensible default over raising an error: error
only when no default exists or the user gave an explicitly contradictory config. See
[`AGENTS.md § Error Handling`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#error-handling).

## Anti-patterns

**[CD-SPECULATIVE-ABSTRACTION] (BLOCKING)** — A speculative abstraction, such as an unused base class,
generic interface or option added for the future: API surface that cannot be removed and has no consumer
today. See
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do).

**[CD-DEAD-CODE] (BLOCKING)** — Commented-out code, dead code or an `eslint-disable` directive in the
public surface. See
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do).

**[CD-CONSTRUCT-ID-CHANGE] (BLOCKING)** — A construct ID changed. See
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do).
- **Tier:** RECOMMENDED in an experimental (`-alpha`) module.

**[CD-PREFER-ADDITIONS] (RECOMMENDED)** — Prefer additions over modification — design so the next
capability lands additively. See
[`AGENTS_CONSTRUCT_DESIGN.md § Factory Methods for Secondary Resources`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#factory-methods-for-secondary-resources).
