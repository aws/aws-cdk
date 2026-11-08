# Regression & breaking-change rules — the lookup

Rows group by defect family (input validation, token handling, JSII cross-language compatibility,
undefined runtime behavior, library stability & breaking changes). See the `cdk-review-principles`
skill for the shared lookup convention: the
BLOCKING → RECOMMENDED → OPTIONAL sort within a family, the conditional-severity encoding, the
`(doc-absent detail)` marker, and links referencing `main`.

## Input validation

**[REG-VALIDATION-FALSE-POSITIVE] (BLOCKING)** — New validation must not reject a value CDK accepts today;
an over-strict check turns a working stack into one that stops synthesizing. Confirm the real constraint
against the authoritative AWS service docs before rating.
- **Detection (doc-absent detail):** for every new `throw` / rejection / bound / regex, name one concrete
  input that was valid before the PR and is rejected after (a negative-vs-preserved-valid comparison).
  Signals: an **over-narrow regex** (a new `if (!/^[a-z]+$/.test(props.name)) throw …` rejecting a
  hyphenated, numeric, or uppercase name the construct previously synthesized); an **off-by-one / too-tight
  bound** (a new min/max/length narrower than the service's real limit); an **enum-membership check
  omitting a live value** (a new allowlist / `switch`-with-throw missing a value the construct synthesizes
  today); a **newly-required prop or non-null assertion** on a prop that was optional or defaulted,
  breaking callers that relied on the old default. A check that only tightens against genuinely-invalid
  input is an improvement, not a regression; a validation that only worsens the error message on an
  already-invalid input rejects no previously-valid value — at most OPTIONAL. A new validation that also
  skips `Token.isUnresolved()` false-rejects any token-valued input — pair this with
  [REG-TOKEN-UNRESOLVED-GUARD].

**[REG-INPUT-VALIDATION] (RECOMMENDED)** — Missing input validation: the CDK never validates a
configuration property, letting an invalid value through. *(Conditional — BLOCKING when the unvalidated
value flows into a working stack and breaks its update.)*
- **The three failure modes (doc-absent detail):** an unvalidated value can **fail at deployment**
  (CloudFormation rejects the configuration), **create a misconfigured resource** (created but does not
  work as expected), or be **silently ignored** (no error, but the property has no effect).

**[REG-CFN-TYPE-LEAK] (RECOMMENDED)** — A change to an EXISTING public API that newly exposes an
L1/CFN-layer type where it did not before, breaking or coupling existing consumers to CloudFormation. (The
same leak on a *brand-new* L2 surface is not a regression — outside your scope.) See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design)
(`awslint:props-no-cfn-types`). Apply it with the false-positive scan in [REG-VALIDATION-FALSE-POSITIVE].

## Token handling

**[REG-TOKEN-UNRESOLVED-GUARD] (BLOCKING)** — A check or manipulation on an unresolved token (a value that
is actually a `Ref`/`Fn::` at synth) emits invalid CloudFormation or throws for users passing that token.
Guard with `Token.isUnresolved()` before validating or comparing. For token fundamentals — the three
encodings and the `Token.asString/asList/asNumber` conversions — read the
[CDK Tokens guide](https://docs.aws.amazon.com/cdk/v2/guide/tokens.html).
- **Guard before validate:** the guard-before-validate rule — with typed string/number/list examples, the
  opaque-value `Fn.select`/`Fn.join` manipulation pattern, and the tokenized-list `.length === 1` gotcha —
  is stated at
  [`AGENTS.md § Token Safety`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#token-safety).
- **Boolean-token false-positive guard (doc-absent detail):** tokens encode only as string, number, or
  string-list (`Token.asString`/`asNumber`/`asList` — there is no `asBoolean`), so a `boolean`-typed value
  can never be an unresolved token. Do NOT flag a missing `Token.isUnresolved()` guard on a boolean prop,
  and do NOT report that a boolean "could be a token." The same fact validates the opposite finding: a
  `Token.isUnresolved()` call on a boolean, enum, or construct reference (e.g. `IKey`) is dead code — the
  guard can never be true.

## JSII cross-language compatibility

Every rule here is BLOCKING — the public surface MUST transpile cleanly to Python, Java, C#, and Go. For
the *why*, see the
[jsii TypeScript restrictions guide](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/).
A change that compiles in TypeScript can still break another language's bindings, so do NOT clear a
signature change just because TypeScript accepts it.

**[REG-JSII-SIGNATURE-CHANGE] (BLOCKING)** — For EVERY changed signature of a public function, method, or
constructor, enumerate the before→after parameter delta (count, order, types, optionality, and whether any
parameter is a struct/data interface) and check each against the matrix.
- **The signature matrix (doc-absent detail):**
  - Add an optional parameter at the end: ✅ safe ONLY if no parameter before it is a struct (data
    interface); if a struct precedes it, ❌ breaking (see [REG-JSII-STRUCT-LAST]).
  - Remove a parameter: ❌ breaking.
  - Change a parameter type: ❌ breaking.
  - Reorder parameters: ❌ breaking.
  - Convert individual params to an options object, or an options object back to individual params:
    ❌ breaking.

**[REG-JSII-STRUCT-LAST] (BLOCKING)** — A struct argument (a data interface: no `I` prefix, `readonly`-only
props) MUST be the last positional parameter. jsii explodes it into keyword/named arguments in Python,
Java, C#, and Go, so ANY parameter after a struct breaks the generated bindings — even an optional one
TypeScript accepts. Fix: move the new field INTO the struct as an optional `readonly` property.
*(doc-absent detail — the jsii spec states the primitive; this is the applied diff-review consequence.)*
Grounded in [`jsii spec § Structs`](https://aws.github.io/jsii/specification/2-type-system/#structs).

**[REG-JSII-INTERFACE-NAMING] (BLOCKING)** — A behavioral interface MUST start with the `I` prefix; a
struct (data-only interface) MUST NOT, and may hold only `readonly` properties (no methods, no mutable
properties). See
[`jsii § Naming › Interfaces`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#interfaces).

**[REG-JSII-NO-UNION] (BLOCKING)** — No union types in the public API; use an enum-like class, separate
props, or factory methods. See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design).

**[REG-JSII-NO-FLUENT] (BLOCKING)** — No fluent / method-chaining APIs that return `this` — the pattern
does not survive transpilation. See
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do).

**[REG-JSII-UNSUPPORTED-TS] (BLOCKING)** — No unsupported TypeScript in the public surface: an index
signature, a generic/parameterized type, `Pick`/`Omit`, a mapped/conditional type, or a type alias — these
are unsupported or de-sugared in the target languages. See
[`jsii § Index Signatures`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#index-signatures),
[`§ Mapped Types`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#typescript-mapped-types),
and [`§ Type Aliases`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#type-aliases).

**[REG-JSII-TYPE-MOVE] (BLOCKING)** — A public member (type, function, or const) MUST NOT move to a
different file or module. File location is part of the external contract in jsii bindings, so a move breaks
existing imports even when the symbol is unchanged. See
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do).

**[REG-JSII-MEMBER-NAME-CONFLICT] (BLOCKING)** — A class member MUST NOT share the same PascalCased name as
its declaring class — it generates invalid C#. See
[`jsii § Class Members`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#class-members).

**[REG-JSII-INHERITANCE] (BLOCKING)** — Structs extend only structs. Widening member visibility
(protected → public) is breaking. Override parameter types are invariant; return types and `readonly`
property types may be covariant. See
[`jsii § Inheritance`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#inheritance),
[`§ Covariant Overrides`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#covariant-overrides-parameter-list-changes),
and [`§ Member Visibility`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#member-visibility).

**[REG-JSII-DEPENDENCY-EXPOSURE] (BLOCKING)** — Non-jsii dependencies MUST be bundled
(`bundleDependencies`); a bundled-dependency type MUST NOT be exposed in the public API; a file with
non-jsii imports MUST NOT be exported from the main entry point. See
[`jsii § non-jsii dependencies`](https://aws.github.io/jsii/user-guides/lib-author/typescript-restrictions/#non-jsii-dependencies).

## Undefined runtime behavior

**[REG-UNDEFINED-BEHAVIOR] (RECOMMENDED)** — Any other runtime-behavior risk that fits none of the families
above: a default-value change, a logic refactor that changes what the code does on an edge case, or a
shared base-class/helper side effect (a spurious `CfnCondition`, a token-keyed cache) that flows into every
consumer of that method. *(Conditional — BLOCKING when it reaches every consumer or fails an existing
stack's update. doc-absent detail — a runtime-logic heuristic no single AWS doc frames as a review target.)*

## Library stability & breaking changes

**[REG-STABILITY-GATE] (BLOCKING)** — A breaking change to a **stable** library (`aws-cdk-lib`) is NEVER
allowed. In an **experimental** library (an `-alpha` suffix and `"stability": "experimental"` in
`package.json`) a breaking change is permitted but needs an explicit `BREAKING CHANGE:` callout. The one
legitimate stable break is an existing API that was a bug *blocking* the feature (nobody could use it),
recorded in `allowed-breaking-changes.txt` at the repo root — a break paired with an entry there is not a
finding. Confirm the module's stability from its `package.json` before rating. See
[`CONTRIBUTING.md § Breaking Changes`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#breaking-changes)
and
[`AGENTS.md § PR Conventions`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#pr-conventions).

**[REG-API-SURFACE-BREAK] (BLOCKING)** — A change that makes existing programs fail to compile: renaming or
removing a public class/method/property, adding a required property (or changing optional→required /
nullable→non-nullable on an input), or removing a return property (or changing non-nullable→nullable on a
return). *(Conditional — resolve the tier through [REG-STABILITY-GATE].)* See
[`AGENTS_CONSTRUCT_DESIGN.md § Backward Compatibility & Deprecation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#backward-compatibility--deprecation)
for the no-break mandate; [`CONTRIBUTING.md § API surface changes`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#api-surface-changes)
for the enumerated compile-break cases and the `allowed-breaking-changes.txt` exclusion mechanism.
- **Also breaking, not enumerated by the doc (doc-absent detail):** deprecating (`@deprecated`) a still-used
  STABLE API, and removing an enum member. (Moving a public member between files is its own rule —
  [REG-JSII-TYPE-MOVE].)
- **✅ NON-BREAKING guard (doc-absent detail):** adding optional input props, new methods/classes, and
  return props is additive — do NOT flag it.

**[REG-BEHAVIOR-BREAK] (BLOCKING)** — A change that alters CloudFormation synthesis without a compile
error: an update that cannot be applied, a change that causes service interruption or data loss
(replacement of a stateful resource), or a change to the **logical ID of a stateful resource**.
*(Conditional — resolve the tier through [REG-STABILITY-GATE].)* See
[`AGENTS.md § Anti-Patterns`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#anti-patterns--things-not-to-do)
for the construct-ID/logical-ID→data-loss rule; [`CONTRIBUTING.md § Behavior changes`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#behavior-changes)
for the definitional test of which template changes are breaking.
- **Also breaking, not enumerated by the doc (doc-absent detail):** a `@default` change that alters an
  existing stack's synthesized template, and a noop→real-policy change without a feature flag.
- **✅ NON-BREAKING guard (doc-absent detail):** an update that applies cleanly with no replacement and only
  additive template changes is safe — do NOT flag it.

**[REG-BREAKING-CHANGE-CALLOUT] (RECOMMENDED)** — In an experimental (`-alpha`) module, a permitted
breaking change still requires an explicit `BREAKING CHANGE:` callout in the PR body (before the `---`
line) — the *missing* callout is the finding. A permitted experimental break that ALREADY carries the
callout is at most an OPTIONAL note, not a finding *(doc-absent detail)*. For a mitigation, prefer opt-in
via a new API element (add
it and mark the old one `@deprecated` with a descriptive error) over a feature flag, whose effects are
non-local. See
[`AGENTS.md § PR Conventions`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#pr-conventions).
