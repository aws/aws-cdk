# Construct design rules

## Feature placement & abstraction

**[CD-IFOO-NO-FEATURE-METHODS] (BLOCKING)** — A feature method or a config-mutation method added to the
resource interface `IFoo`, other than a factory method that creates a new resource (`add{Bar}`) or a method
[`AGENTS_CONSTRUCT_DESIGN.md § Standard Interface Extensions`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#standard-interface-extensions)
requires on the interface; features belong on Facades. See
[`AGENTS_CONSTRUCT_DESIGN.md § Construct Interface (IFoo)`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#construct-interface-ifoo)
and [`§ Configuration Mutation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#configuration-mutation).

**[CD-LAYER-MODEL] (BLOCKING)** — An L2 that exposes CloudFormation in its surface (`Cfn*`/`Token`), lacks
an escape hatch to the L1, or hard-codes a choice the service exposes. See
[`AGENTS.md § Architecture — The Layer Model`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#architecture--the-layer-model).

**[CD-FEATURE-PLACEMENT] (RECOMMENDED)** — A new feature implemented as an L2 method where a building
block (Mixin / CfnPropsMixin / Facade / Trait) fits. See
[`AGENTS_CONSTRUCT_DESIGN.md § Feature Placement Decision`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#feature-placement-decision)
for the first-match-wins table and
[`AGENTS.md § L2 Building Blocks`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#l2-building-blocks)
for each block.

**[CD-README-DRIVEN] (RECOMMENDED)** — A new or significantly-changed L2 shipping with no README usage
example is a design miss. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes).

## Design Guidelines conformance

**[CD-PROPS-SHAPE] (BLOCKING)** — A prop that is weakly typed or loosely shaped: an ARN string where a
construct interface fits, a raw number where `Duration`/`Size` fits, a `Cfn*` or `Token` type, a nested
object where flat props fit. See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design).
- **Tier:** RECOMMENDED for props valid only together that are left as separate props (one nested object),
  and for props that exclude each other (factory methods or an enum-like class). See
  [`AGENTS_CONSTRUCT_DESIGN.md § Property Structure`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#property-structure-flat-vs-nested).

**[CD-PROPS-DEFAULT] (BLOCKING)** — A `@default` that contradicts what the code does is a real
behavioral surprise. See
[`AGENTS_CONSTRUCT_DESIGN.md § Default Behavior`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#default-behavior).

**[CD-SECRET-VALUE] (BLOCKING)** — A prop named `password`, or carrying a token or secret, typed as a
plain string, so a plaintext secret can pass through the API. See
[`AGENTS_CONSTRUCT_DESIGN.md § Secrets`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#secrets).

**[CD-NAMING] (BLOCKING)** — A resource or prop named outside official AWS/CloudFormation terminology, or
a resource interface name not derived from it (`IFoo`). See
[`AGENTS_CONSTRUCT_DESIGN.md § Property Naming`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#property-naming).

**[CD-ATTRIBUTES] (BLOCKING)** — A CloudFormation attribute missing from the L2, exposed without the
type-name prefix (`arn` where `bucketArn` fits), or parsed where it is passed on as an opaque token. See
[`AGENTS_CONSTRUCT_DESIGN.md § Resource Attributes`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#resource-attributes).

**[CD-CONSTRUCT-ANATOMY] (BLOCKING)** — An L2 that extends a class other than
`Resource`/`Construct`/`{Foo}Base`. See
[`AGENTS_CONSTRUCT_DESIGN.md § Base Classes & Inheritance`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#base-classes--inheritance).

**[CD-FROM-METHODS] (BLOCKING)** — A resource without a `from{Attribute}` importer, or with an ARN and no
`fromFooArn`; an importer placed off the concrete class; a `from*` method that changes the identifier it
is given. See
[`AGENTS_CONSTRUCT_DESIGN.md § Import (from*) Methods`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#import-from-methods).

**[CD-REMOVAL-POLICY] (BLOCKING)** — A new stateful resource (database, table, bucket) that lacks a
`removalPolicy?` prop. See
[`AGENTS_CONSTRUCT_DESIGN.md § Stateful/Stateless & Removal Policy`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#statefulstateless--removal-policy).

**[CD-TAGS] (BLOCKING)** — An L2 that implements `ITaggable`/`ITaggableV2` or exposes a `TagManager`. See
[`AGENTS_CONSTRUCT_DESIGN.md § Tags`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#tags).
- **Tier:** RECOMMENDED for a new L2 of a taggable resource with no `tags` prop, or one that does not pass
  `props.tags` to the L1.

**[CD-BACKWARD-COMPAT] (BLOCKING)** — A new surface that will force a future break: a `@deprecated` prop
in a newly introduced interface, a detail type left out of `@internal`, or a later fix that mutates the
original in place of deprecate-and-add (`FooV2`). See
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

**[CD-AWSLINT-SUPPRESSION] (RECOMMENDED)** — An `awslint.exclude` entry the diff adds or broadens; the
comment asks for a stated justification in the PR description or an adjacent comment. A suppression turns
off an awslint rule that enforces a design guideline at build time, so an unjustified one silently drops
that guardrail. See
[`CONTRIBUTING.md § awslint`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#awslint) for the
build-time enforcement and
[`awslint README § Saving State`](https://github.com/aws/aws-cdk/blob/main/packages/awslint/README.md#saving-state)
for the `exclude` mechanism.
- **Tier:** BLOCKING when the suppressed rule backs a MUST-level guideline.

**[CD-ENUMS] (RECOMMENDED)** — An `enum` for an open set, or an enum-like class for a closed known set.
See
[`AGENTS_CONSTRUCT_DESIGN.md § Enums & Enum-Like Classes`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#enums--enum-like-classes).

**[CD-STATIC-TYPE-CHECK] (RECOMMENDED)** — An `instanceof` check where a static `isFoo` fits. See
[`AGENTS_CONSTRUCT_DESIGN.md § Static Type Check`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#static-type-check).

**[CD-ADD-FACTORY] (RECOMMENDED)** — A secondary resource without a convenience `add{Bar}(...)` factory,
or a new method where extending an existing one fits. See
[`AGENTS_CONSTRUCT_DESIGN.md § Factory Methods for Secondary Resources`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#factory-methods-for-secondary-resources).

**[CD-STANDARD-AFFORDANCE] (RECOMMENDED)** — A standard `metric*`/`onXxx`/`connections`/`role` affordance
missing where the service supports it. See
[`AGENTS_CONSTRUCT_DESIGN.md § CloudWatch Metrics`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#cloudwatch-metrics)
and the sections following it for the signatures.

**[CD-POLYMORPHISM-OVER-BOOLEAN] (RECOMMENDED)** — A boolean flag that switches behavior where
polymorphism fits. See
[`AGENTS_CONSTRUCT_DESIGN.md § Polymorphism over Booleans`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#polymorphism-over-booleans).

**[CD-TYPE-REUSE] (RECOMMENDED)** — A parallel type declared where an existing type in another module is
semantically equivalent. See
[`AGENTS_CONSTRUCT_DESIGN.md § Type Reuse`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#type-reuse).

**[CD-PREFER-DEFAULT] (RECOMMENDED)** — An error raised where a sensible default can be inferred; an error
fits only when no default exists or the user gave an explicitly contradictory config. See
[`AGENTS.md § Error Handling`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#error-handling).

## Anti-patterns

Each is listed at
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do).

**[CD-SPECULATIVE-ABSTRACTION] (BLOCKING)** — An unused base class, generic interface or option added for
the future: API surface that cannot be removed and has no consumer today.

**[CD-DEAD-CODE] (BLOCKING)** — Commented-out code, dead code or an `eslint-disable` directive in the
public surface.

**[CD-CONSTRUCT-ID-CHANGE] (BLOCKING)** — A construct ID changed in a stable module.

**[CD-PREFER-ADDITIONS] (RECOMMENDED)** — A change that modifies existing surface where an addition fits,
so the next capability cannot land additively. See
[`AGENTS_CONSTRUCT_DESIGN.md § Factory Methods for Secondary Resources`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#factory-methods-for-secondary-resources).
