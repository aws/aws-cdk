# Documentation review rules

## README examples

**[DOC-README-STALE-SNIPPET] (RECOMMENDED)** — A public API changed (prop/method/construct
added/renamed, signature changed) but the module README not updated to match. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes).

**[DOC-EXAMPLE-COMPILES-NO-DEMO] (RECOMMENDED)** — A snippet that compiles but never sets the prop the
PR adds, or hides the feature in a fixture, so it documents nothing the PR introduced. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes)
(the simple-example-per-use-case requirement; use `nofixture` to surface setup in the doc).
- **Reviewer lens:** values stored in a `.ts-fixture` do not surface to the docs the
  user sees. So an example that compiles only because it hides everything meaningful in a fixture — showing
  the user nothing of the feature — is this gap even though it passes the build.

## `@default` accuracy

**[DOC-DEFAULT-WRONG] (BLOCKING)** — A `@default` whose stated value or behavior contradicts what the
code actually does when the prop is omitted (e.g. `@default false` on a prop the constructor defaults to
`true`). This ships a false statement about real behavior to every consumer. See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design) for the
`@default` format rule and
[`AGENTS_CONSTRUCT_DESIGN.md § Default Behavior`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#default-behavior)
for the default behavior the tag documents.

## Public-API doc completeness

**[DOC-README-MISSING-EXAMPLE] (BLOCKING)** — A new L2 construct (or substantial new feature) with no
README usage example. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes).
- **Conditional severity:** BLOCKING for a brand-new public L2 with zero usage docs.
  Down to RECOMMENDED for a new prop on an existing construct with no README mention; a new mixin with no
  `## Mixins` README entry is a RECOMMENDED completeness gap.

## Migration notes

**[DOC-MIGRATION-NOTE-MISSING] (RECOMMENDED)** — A `@deprecated` tag (or a breaking change to an
experimental module) with no migration note pointing at the replacement API. See
[`AGENTS_CONSTRUCT_DESIGN.md § Backward Compatibility & Deprecation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#backward-compatibility--deprecation).
- **Scope split:** whether the break *exists* and is *allowed* is
  outside documentation's scope — your concern is purely whether the migration path is documented.
