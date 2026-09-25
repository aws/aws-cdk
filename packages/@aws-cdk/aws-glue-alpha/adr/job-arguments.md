# Glue Job Arguments

## Status

accepted

## Context

Every Glue job resource (`AWS::Glue::Job`) accepts a `DefaultArguments` map — a
flat `string → string` dictionary of `--flag`/value pairs that Glue passes to the
job script on every run. Some of these arguments are ordinary user configuration
(`--additional-python-modules`, `--enable-glue-datacatalog`, `--TempDir`, …), but
others are the wire form of features the CDK L2 models with strongly-typed props.

The L2 job constructs therefore populate `DefaultArguments` from two sources:

1. **Construct-managed arguments** — derived by the construct from typed props or
   from the job class itself. Examples:
   - `continuousLogging` → `--enable-continuous-cloudwatch-log`,
     `--continuous-log-logGroup`, `--continuous-log-logStreamPrefix`,
     `--continuous-log-conversionPattern`, `--enable-continuous-log-filter`
   - `enableMetrics` → `--enable-metrics`
   - `enableObservabilityMetrics` → `--enable-observability-metrics`
   - `sparkUI` → `--enable-spark-ui`, `--spark-event-logs-path`
   - `extraJars` / `extraJarsFirst` / `extraPythonFiles` / `extraFiles` →
     `--extra-jars`, `--user-jars-first`, `--extra-py-files`, `--extra-files`
   - `className` → `--class` (Scala only)
   - the job language itself → `--job-language`
   - `librarySet` → `library-set` (Python Shell only)
2. **`defaultArguments`** — the untyped escape-hatch map the user supplies directly,
   for arguments the L2 does *not* model.

The two sources can collide. Before this decision, the collision was resolved
silently and inconsistently across job types:

- `SparkJob` / `PythonShellJob` merged as `{ ...managed, ...userDefaultArguments }`,
  so the user value won — a user could pass
  `defaultArguments: { '--enable-continuous-cloudwatch-log': 'false' }` and silently
  turn off a secure default.
- `RayJob` merged the other way, so the construct value won — a user's
  `defaultArguments` entry for a managed key was silently dropped.

Both behaviors are footguns: one weakens the construct's secure/observable defaults
without warning, the other ignores explicit user input without warning. Because Glue
enables continuous CloudWatch logging by default and that data can contain sensitive
runtime values (SQL, row data, stack traces), the "user silently wins" case is also a
security concern.

Separately, Glue itself reserves a handful of argument keys for its own internal use
(`--debug`, `--mode`, `--JOB_NAME`, `--endpoint`). These are never valid user input on
any job type.

## Constraints

- `DefaultArguments` is a single flat map on the L1; there is no separate channel to
  distinguish "managed" from "user" keys once they are merged. Whatever the L2 does,
  it must produce one merged map.
- Which keys are managed varies by job type: `--class` exists only for Scala jobs,
  `library-set` only for Python Shell, `--enable-spark-ui` only for Spark, and so on.
  A single global list would either over-reject (block a key that is a legitimate
  escape hatch for a job type that doesn't manage it — e.g. `--extra-py-files` on a
  job with no `extraPythonFiles` prop) or under-reject.
- Argument keys can be tokens (e.g. produced by `CfnJson`) that only resolve at
  deploy time. String comparison cannot see through them at synthesis.
- The set of managed keys must not be tied to the set the construct *happens to emit*
  for a given configuration: a prop that turns a feature off (`enableMetrics:
  false`) emits nothing, but the key is still construct-managed and must stay reserved.

## Decision

**A managed argument has exactly one way to be configured: its typed prop.** Passing a
construct-managed or Glue-reserved key through `defaultArguments` throws a
`ValidationError` at synthesis time rather than silently winning or being dropped.
`defaultArguments` remains the escape hatch for every argument the L2 does not model.

### Data flow

There is a single sink for every construct-managed argument — the base-class method:

```ts
protected setManagedArgument(key: string, value?: string): void
```

It records `key` in the reserved set and, when `value !== undefined`, emits it. A
subclass calls it once per managed key, passing `undefined` when the feature is off or
unset — the key is reserved either way. Subclasses do not build local argument maps, so
this is the *only* way to emit a managed argument: declaration and emission happen in the
same call, and the reserved set therefore cannot drift from what is emitted.

Each job subclass, in its constructor:

1. Registers its managed arguments through `setManagedArgument` — directly, or through
   the shared helpers `setupContinuousLogging` (all job types),
   `nonExecutableCommonArguments` and `setupExtraCodeArguments` (Spark), and its own
   `executableArguments` (`--job-language`; plus `--class` for Scala, `library-set` for
   Python Shell).
2. Calls the base-class method:

   ```ts
   protected mergeDefaultArguments(
     defaultArguments?: { [key: string]: string },
   ): { [key: string]: string }
   ```

   which validates the user-supplied `defaultArguments` against the accumulated reserved
   set and returns the merged map, passed as `DefaultArguments` on the `CfnJob`.

`setManagedArgument` declares managed keys; `mergeDefaultArguments` validates and merges
them. Each is the sole choke point for its job.

Which keys a job type reserves falls out of which `setManagedArgument` calls its
constructor makes: only Scala jobs register `--class`, only Python Shell registers
`library-set`, only Spark registers `--enable-spark-ui`, and so on. Per-job-type scoping
is automatic — there is no separate list to maintain per type.

### The reserved set

The keys a user may not set through `defaultArguments` are the union of:

- **`GLUE_RESERVED_ARGUMENTS`** — `--debug`, `--mode`, `--JOB_NAME`, `--endpoint`. Owned
  by the Glue service, reserved on every job type. This is the one static list, because
  it is external to the constructs — nothing derives it from a prop.
- **`_managedArgumentKeys`** — every key that any `setManagedArgument` call registered on
  this instance, whether or not a value was emitted for it.

### Validation rules (per user-supplied key)

For each key in `defaultArguments`:

1. If the key is an unresolved token, the conflict check is skipped (equality is
   unknowable at synth time) and a warning
   (`@aws-cdk/aws-glue-alpha:tokenJobArgumentKey`) is emitted. If it resolves to a
   managed key at deploy time, the construct-managed value wins (see merge order).
2. If the key is in **`GLUE_RESERVED_ARGUMENTS`** → throw. Glue-reserved keys are
   never emitted by the construct, so there is no construct value to reconcile against.
3. If the key is in the reserved set (`_managedArgumentKeys`):
   - If the construct actually emitted a value for that key
     (`Object.hasOwn(_managedArguments, key)`) and the supplied value is identical →
     allowed. Passing the same value the construct would produce is not
     contradictory; autocorrecting config is preferred over an error.
   - Otherwise (different value, or the construct emitted nothing because the feature
     is off) → throw.
4. Otherwise, the key is genuinely custom → allowed, flows through untouched.

`Object.hasOwn` is used deliberately instead of the `in` operator so that inherited
`Object.prototype` members (`toString`, `constructor`, `hasOwnProperty`, …) supplied as
argument keys are treated as ordinary custom keys rather than falsely matching a
managed key.

### Merge order

After validation, the result is:

```ts
return { ...defaultArguments, ...this._managedArguments };
```

Managed arguments are spread last, so they win on any residual overlap. By this point
the only overlaps that can remain are (a) exact-value matches allowed by rule 3, which
are indistinguishable either way, and (b) token keys from rule 1, for which
managed-wins is the documented and warned-about behavior.

### Related synthesis-time warnings

Two other warnings live in the same flow:

- **`@aws-cdk/aws-glue-alpha:unencryptedContinuousLogging`** — continuous logging is on
  (explicitly or by default) but no `SecurityConfiguration` is attached, so driver /
  executor logs land in an unencrypted, account-shared CloudWatch log group. We only
  warn when *no* security configuration is attached at all, because
  `ISecurityConfiguration` exposes only the name and we cannot introspect whether it
  actually configures `cloudWatchEncryption` (avoiding false positives).
- **`@aws-cdk/aws-glue-alpha:plaintextJobArgumentSecret`** — a `defaultArguments` key
  looks like a credential and holds a plaintext literal. `DefaultArguments` is emitted
  verbatim into the template; secrets belong in AWS Secrets Manager.

## Alternatives

### Invert precedence so the construct always wins

Merge as `{ ...userDefaultArguments, ...managed }` everywhere (which is what `RayJob`
already did). This is more secure than "user wins" but still silent: a user who
deliberately sets a managed key via `defaultArguments` has it dropped with no
indication. It also still leaves two channels for one setting. Rejected in favor of a
single, explicit way to express each intent.

### Derive the reserved set from the emitted arguments

Compute conflicts from the keys the construct actually emits. Attractive: adding a typed
prop reserves its key automatically, with no separate list to maintain. Rejected: it ties
the reserved set to the current configuration. A prop that turns a feature off emits no
key, so `defaultArguments` could silently re-enable it (`enableMetrics: false` +
`defaultArguments: { '--enable-metrics': '' }`). The reserved set must include keys the
construct manages even when it emits nothing for them. That is why `setManagedArgument`
records the key regardless of value.

### A per-job-type list of managed keys

Give each job type an explicit `string[]` of the keys it manages, passed to the
validation step alongside the emitted map. Correct, but it names every managed key in
two places — the emission site (inside an `enabled ? {...} : {}` expression) and the
list — which drift: adding a typed prop requires updating the list too, and a forgotten
entry silently reopens the re-enable bypass with no compile-time signal. The
`setManagedArgument` accumulator collapses the two into one call, so the key is named
once.

### One global reserved list on the base class

A single list of every managed key across all job types. Rejected because it
over-rejects: it would block, for example, `--extra-py-files` on a job type that has no
`extraPythonFiles` prop, removing a legitimate escape hatch with no typed replacement.
Managed keys must be scoped per job type.
