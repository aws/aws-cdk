# Regression & breaking-change rules

## Input validation

**[REG-VALIDATION-FALSE-POSITIVE] (BLOCKING)** — New validation in a stable module that rejects a value
CDK accepts today, meaning input that deploys successfully; an over-strict check turns a working stack
into one that stops synthesizing. Confirm the real constraint against the authoritative AWS service docs
before you raise it. See
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do)
for new validation on existing constructs.
- **Detection:** for each new rejection, name one concrete input that deployed before
  the PR and is rejected after.

**[REG-INPUT-VALIDATION] (RECOMMENDED)** — Missing input validation: the CDK never validates a
configuration property, letting an invalid value through.
- **Tier:** BLOCKING when the unvalidated value flows into a working stack and breaks its update.

**[REG-CFN-TYPE-LEAK] (RECOMMENDED)** — A change to an existing public API that newly exposes an L1
property type (`CfnFoo.BarProperty`) anywhere, or a `Cfn*` type in a method, a class member, or a struct
other than the construct's `<Name>Props`, breaking or coupling existing consumers to CloudFormation. (The
same leak on a *brand-new* L2 surface is not a regression — outside your scope.) See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design).

## Token handling

**[REG-TOKEN-UNRESOLVED-GUARD] (BLOCKING)** — A check or manipulation on an unresolved token (a value that
is actually a `Ref`/`Fn::` at synth) emits invalid CloudFormation or throws for users passing that token.
Guard with `Token.isUnresolved()` before validating or comparing. See
[`AGENTS.md § Token Safety`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#token-safety) and the
[CDK Tokens guide](https://docs.aws.amazon.com/cdk/v2/guide/tokens.html).
- **Boolean props:** tokens encode only as string, number or string list (`Token.asString`/`asNumber`/
  `asList`; there is no `asBoolean`), so a `boolean`-typed prop cannot hold an unresolved token, and a
  missing guard on it is not a finding.

## JSII cross-language compatibility

A change that compiles in TypeScript can still break another language's bindings; see the
[jsii TypeScript restrictions guide](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/).

**[REG-JSII-SIGNATURE-CHANGE] (BLOCKING)** — Parameters of the same type that change order in a public
function, method, or constructor in a stable module: existing positional calls still compile and pass each
argument to the wrong parameter.

**[REG-JSII-STRUCT-LAST] (BLOCKING)** — A positional parameter placed after a struct argument (a data
interface: no `I` prefix, `readonly`-only props). jsii turns the struct into keyword/named arguments in
Python, Java, C#, and Go, so any parameter after a struct breaks the generated bindings — even an optional one
TypeScript accepts. Fix: move the new field into the struct as an optional `readonly` property.
Grounded in [`jsii spec § Structs`](https://aws.github.io/jsii/specification/2-type-system/#structs).

**[REG-JSII-INTERFACE-NAMING] (BLOCKING)** — A data-only interface (only `readonly` properties) named with
the `I` prefix that callers are meant to pass as data (a props or options object), not a type
classes implement: jsii generates it as a behavioral interface instead of a struct. See
[`jsii § Naming › Interfaces`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#interfaces).

**[REG-JSII-UNSUPPORTED-TS] (BLOCKING)** — A generic method in the public surface: jsii erases its type
parameter to `any` in the target languages. See
[`jsii § Mapped Types`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#typescript-mapped-types).

**[REG-JSII-TYPE-MOVE] (BLOCKING)** — An exported function or const in a stable module moved to another
submodule: existing imports of it break.

**[REG-JSII-INHERITANCE] (BLOCKING)** — A `protected` member of a base class in a stable module made
`public`: existing C# subclasses that override it break. See
[`jsii § Member Visibility`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#member-visibility).

**[REG-JSII-DEPENDENCY-EXPOSURE] (BLOCKING)** — A file with non-jsii imports exported from the main entry
point. See
[`jsii § non-jsii dependencies`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#non-jsii-dependencies).

**[REG-JSII-NO-UNION] (RECOMMENDED)** — A union type in a method parameter, a return type, a class property,
or any struct other than a construct's `<Name>Props`; use an enum-like class, separate props, or factory
methods. See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design).

**[REG-JSII-NO-FLUENT] (RECOMMENDED)** — A public method that returns `this` for chaining. Ask for the
props-based shape, or for a written justification. See
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do).

## Undefined runtime behavior

**[REG-UNDEFINED-BEHAVIOR] (RECOMMENDED)** — Any other runtime-behavior risk that fits no other family: a
logic refactor that changes what the code does on an edge case, or a shared base-class/helper side effect
(an extra `CfnCondition`, a token-keyed cache) that flows into every consumer of that method. A change
that only stops an input or configuration that never deployed or never worked is not this finding; one
that also changes what working code does is.
- **Tier:** BLOCKING when it reaches every consumer or fails an existing stack's update.

## Library stability & breaking changes

**[REG-STABILITY-GATE] (BLOCKING)** — A breaking change to a stable library (`aws-cdk-lib`). The one
legitimate stable break is an existing API that was a bug *blocking* the feature (nobody could use it),
recorded in `allowed-breaking-changes.txt` at the repo root. A break with an entry there is not a finding
when the API was unusable before the change; an entry the PR itself adds does not by itself exempt the
break. Confirm the module's stability from its `package.json` before you raise a break. See
[`CONTRIBUTING.md § Breaking Changes`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#breaking-changes),
[`§ API surface changes`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#api-surface-changes)
and
[`AGENTS.md § PR Conventions`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#pr-conventions).

**[REG-API-SURFACE-BREAK] (BLOCKING)** — A change in a stable module that makes existing programs fail to
compile: renaming or removing a public class/method/property, adding a required property (or changing
optional→required / nullable→non-nullable on an input), or removing a return property (or changing
non-nullable→nullable on a return), or removing an enum member. See
[`AGENTS_CONSTRUCT_DESIGN.md § Backward Compatibility & Deprecation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#backward-compatibility--deprecation)
for the no-break requirement; [`CONTRIBUTING.md § API surface changes`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#api-surface-changes)
for the enumerated compile-break cases and the `allowed-breaking-changes.txt` exclusion mechanism.

**[REG-BEHAVIOR-BREAK] (BLOCKING)** — A change in a stable module that alters CloudFormation synthesis
without a compile error: an update that cannot be applied, a change that causes service interruption or
data loss (replacement of a stateful resource), or a change to the **logical ID of a stateful
resource**. See
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do)
for the construct-ID/logical-ID→data-loss rule; [`CONTRIBUTING.md § Behavior changes`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#behavior-changes)
for which template changes are breaking.

**[REG-BEHAVIOR-CHANGE-NO-FLAG] (RECOMMENDED)** — A change to the observable behavior of an existing API in a
stable module, such as a changed default, with no feature flag. See
[`AGENTS.md § Feature Flags`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#feature-flags).

**[REG-BREAKING-CHANGE-CALLOUT] (RECOMMENDED)** — A breaking change in an experimental module (an `-alpha`
suffix and `"stability": "experimental"` in `package.json`). The finding asks whether the break can be
avoided and, when the PR body lacks it, for an explicit `BREAKING CHANGE:` callout (before the `---` line).
For a mitigation, prefer opt-in via a new API element (add it and mark the old one `@deprecated` with
a descriptive error) over a feature flag, whose effects are non-local. See
[`CONTRIBUTING.md § Breaking Changes`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#breaking-changes)
and [`AGENTS.md § PR Conventions`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#pr-conventions).
