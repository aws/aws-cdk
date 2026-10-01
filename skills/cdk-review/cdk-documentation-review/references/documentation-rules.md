# Documentation review rules — the lookup

Rows group by defect family — the four `category` values (example compilation, `@default` accuracy,
public-API doc completeness, migration notes). See
the `cdk-review-principles` skill for the shared lookup convention (the
BLOCKING → RECOMMENDED → OPTIONAL sort within a family, the conditional-severity encoding, the
`(doc-absent detail)` marker, and links referencing `main`).

Severity across these rows is set by shipped-doc consumer impact, not by whether the build breaks: a
doc that is *wrong* or *absent* is BLOCKING; one documented but *thin* on a required facet is
RECOMMENDED.

## Example compilation

**[DOC-EXAMPLE-COMPILE] (BLOCKING)** — A README `ts` snippet, a `*.ts-fixture`, or a JSDoc `@example`
the PR adds or changes that will not compile. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes) for the
must-compile rule (`ts` code blocks verified by Rosetta); [`CONTRIBUTING.md § Documentation › Rosetta`](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#rosetta)
for the ⚠️ NOTE on not-yet-built dependencies (the false-positive guard below).
- **Detection signals (doc-absent detail):** flag it when (1) an **undeclared / unimported identifier** —
  a variable, type, or module (`bucket`, `s3`, `pipeline`) neither declared in the snippet, provided by
  the named fixture, nor imported, so rosetta cannot resolve it; (2) a **missing / wrong fixture** — a
  `fixture=` name with no matching `rosetta/<name>.ts-fixture`, a fixture the PR edited that no longer
  defines the variables its snippet consumes, or one that lost its `/// here` marker; (3) a **call to a
  non-existent / changed API** — a method, prop, or type that does not exist, or whose signature the PR
  changed, so the assembled file won't type-check; (4) a **stale API shape** — the PR changes an API but
  leaves an example on the old shape.
- **False-positive guard (doc-absent detail):** flag a snippet that is *structurally* non-compilable — it
  fails regardless of build state. Don't flag an inability to compile that stems purely from a
  not-yet-built local dependency (the ⚠️ NOTE pointer above covers why).

**[DOC-README-STALE-SNIPPET] (RECOMMENDED)** — A public API changed (prop/method/construct
added/renamed, signature changed) but the module README not updated to match. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes).
- **Escalation (doc-absent detail):** up to BLOCKING when the stale README now shows a non-compiling
  snippet — that reclassifies as an Example-compilation defect (`DOC-EXAMPLE-COMPILE`).

**[DOC-EXAMPLE-COMPILES-NO-DEMO] (RECOMMENDED)** — A snippet that compiles but never sets the prop the
PR adds, or hides the feature in a fixture, so it documents nothing the PR introduced. See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes)
(the simple-example-per-use-case requirement; use `nofixture` to surface setup in the doc).
- **Reviewer lens (doc-absent detail):** values stored in a `.ts-fixture` do NOT surface to the docs the
  user sees. So an example that compiles only because it hides everything meaningful in a fixture — showing
  the user nothing of the feature — is this gap even though it passes the build.

## `@default` accuracy

**[DOC-DEFAULT-WRONG] (BLOCKING)** — A `@default` whose stated value or behavior contradicts what the
code actually does when the prop is omitted (e.g. `@default false` on a prop the constructor defaults to
`true`). This ships a false statement about real behavior to every consumer, not a wording nit. See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design) for the
`@default` FORMAT rule and
[`AGENTS_CONSTRUCT_DESIGN.md § Default Behavior`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#default-behavior)
for why the default *behavior* is a design decision the tag documents (so a wrong `@default` often signals
a real behavioral surprise).

**[DOC-DEFAULT-MISSING] (RECOMMENDED)** — A missing `@default` on a new optional prop
(`awslint:props-default-doc`). See
[`AGENTS.md § Props Design`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#props-design).
- **Severity (doc-absent detail):** RECOMMENDED, not BLOCKING — the build DOES break (the rule is
  Error-level), but the prop and its type are still documented; only the default is absent, so the consumer
  is under-informed, not actively misled. A `@default` that is *correct* but terser than the "describe the
  behavior" ideal is at most OPTIONAL — do not confuse "terse but true" with "wrong".

## Public-API doc completeness

**[DOC-PUBLIC-API-UNDOCUMENTED] (BLOCKING)** — A new public class, method, or prop the PR adds with NO
JSDoc at all, where the guidelines require docs (`awslint:docs-public-apis`). See
[`AGENTS.md § Documentation › JSDoc`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#jsdoc).
- **Out-of-scope guard (doc-absent detail):** a missing doc on an override/implementation is NOT this
  gap — the reference docs auto-copy the base doc (`awslint:docs-no-duplicates`), so flagging it is itself
  an error.

**[DOC-README-MISSING-EXAMPLE] (BLOCKING)** — A new L2 construct (or substantial new feature) with no
README usage example — the README requirement, distinct from the `awslint:docs-public-apis` JSDoc gate
(a fully-JSDoc'd L2 still owes a README example). See
[`AGENTS.md § Module READMEs`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#module-readmes).
- **Conditional severity (doc-absent detail):** BLOCKING for a brand-new public L2 with zero usage docs.
  Down to RECOMMENDED for a new prop on an existing construct with no README mention; a new mixin with no
  `## Mixins` README entry is a RECOMMENDED completeness gap.

**[DOC-ATTRIBUTE-MISSING] (RECOMMENDED)** — A new resource-attribute property missing its `@attribute`
tag (`awslint:attribute-tag`; attribute names must begin with the type name, `bucketArn` not `arn`). See
[`AGENTS.md § Documentation › JSDoc`](https://github.com/aws/aws-cdk/blob/main/AGENTS.md#jsdoc).
- **Severity (doc-absent detail):** a completeness gap — the property is present and documented; only the
  attribute marking is absent, so the consumer is under-informed, not actively misled.

## Migration notes

**[DOC-MIGRATION-NOTE-MISSING] (RECOMMENDED)** — A `@deprecated` tag (or a breaking change to an
experimental module) with no migration note pointing at the replacement API. See
[`AGENTS_CONSTRUCT_DESIGN.md § Backward Compatibility & Deprecation`](https://github.com/aws/aws-cdk/blob/main/docs/AGENTS_CONSTRUCT_DESIGN.md#backward-compatibility--deprecation).
- **Scope split (doc-absent detail):** whether the break *exists* and is *allowed* is
  outside documentation's scope — your concern is purely whether the migration path is documented.
