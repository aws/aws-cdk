# Documentation review rules

## README examples

**[DOC-README-STALE-SNIPPET] (RECOMMENDED)** — A public API changed (prop/method/construct
added/renamed, signature changed) but the module README not updated to match. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes).

**[DOC-EXAMPLE-COMPILES-NO-DEMO] (RECOMMENDED)** — A snippet that compiles but never sets the prop the
PR adds, or hides the feature in a fixture, so it documents nothing the PR introduced. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes)
(the simple-example-per-use-case requirement; use `nofixture` to surface setup in the doc).

## `@default` accuracy

**[DOC-DEFAULT-WRONG] (BLOCKING)** — A `@default` whose stated value or behavior contradicts what the
code actually does when the prop is omitted (e.g. `@default false` on a prop the constructor defaults to
`true`). This ships a false statement about real behavior to every consumer. See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design) for the
`@default` format rule and
[`AGENTS_CONSTRUCT_DESIGN.md § Default Behavior`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#default-behavior)
for the default behavior the tag documents.

## Statement accuracy

**[DOC-STATEMENT-WRONG] (RECOMMENDED)** — A statement or example in a README or JSDoc that the PR adds or
changes, other than a `@default` tag, that a user who relies on it turns into code that fails to synthesize
or deploy, or into a resource that behaves other than the text says; a true statement that leaves something
out is not this rule.
- **Tier:** BLOCKING when following it loses data or opens a security boundary.

## Public-API doc completeness

**[DOC-README-MISSING-EXAMPLE] (BLOCKING)** — A new L2 construct (or substantial new feature) with no
README usage example. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes).
- **Tier:** RECOMMENDED for a new prop on an existing construct with no README mention, and for a new mixin
  with no `## Mixins` README entry.

## Migration notes

**[DOC-MIGRATION-NOTE-MISSING] (RECOMMENDED)** — A `@deprecated` tag (or a breaking change to an
experimental module) with no migration note pointing at the replacement API. See
[`AGENTS_CONSTRUCT_DESIGN.md § Backward Compatibility & Deprecation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#backward-compatibility--deprecation).
