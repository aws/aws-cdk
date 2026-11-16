# Construct Implementation Patterns — Grants, Metrics, Events, IAM & More

> Implementation rules for cross-cutting construct patterns. Read this when implementing grants, metrics, events, connections, IAM integration, or other standard L2 patterns. For design decisions (mixins, facades, traits, API shape), see [AGENTS_CONSTRUCT_DESIGN.md](./AGENTS_CONSTRUCT_DESIGN.md).

---

## Mixin Implementation

### File Conventions

- You MUST name source files after the target resource: `mixins/bucket.ts` not `mixins/versioning.ts`
- You MUST colocate multiple mixins for the same resource in the same file

### Project Structure & Exports

- You MUST place mixins for stable services in `lib/mixins/` within their service module
- You MUST include `.jsiirc.json` and `index.ts` barrel files in the mixins directory
- You MUST add `export * as mixins from './mixins'` to the service `lib/index.ts`
- You MUST include the mixins subpath in `package.json` exports

### `supports()` and `applyTo()` Pattern

- You MUST implement `supports(construct)` as a type guard using the generated `CfnFoo.isCfnFoo()` static method — not `instanceof`:
  ```ts
  supports(construct: IConstruct): construct is CfnBucket {
    return CfnBucket.isCfnBucket(construct);
  }
  ```
- You MUST implement `applyTo(construct)` with the L1 property mutations

### Mixin Validation

- You MUST validate mixin inputs in three phases:
  1. **Constructor** — validate all input properties, throw for invalid combinations
  2. **`applyTo()`** — validate pre-conditions on the target construct, throw for unrecoverable failures
  3. **Deferred via `node.addValidation()`** — for conditions resolved later in the app lifecycle
- You SHOULD collect multiple errors and throw them as a group

### Mixin Merge Strategy

- You SHOULD use `CfnPropsMixin` (`core/lib/helpers-internal/cfn-props-mixin.ts`) with `PropertyMergeStrategy` (`core/lib/mixins/property-merge-strategy.ts`) instead of modifying properties directly:
  - `combine()` (deep merge, default) — for most cases
  - `override()` — for non-mergeable properties like tags

### Refactoring L2 Properties into Mixins

- When extracting an existing L2 property into a mixin:
  1. Create the mixin following naming/file conventions
  2. Refactor the L2 to call `this.with(new MyMixin())`
  3. Keep the L2 property for backward compatibility (delegating to the mixin internally)
  4. Verify the synthesized CloudFormation output is identical before and after

### Mixin Testing

- You MUST write unit tests for every mixin covering:
  - Correct resource type support
  - Rejection of unrelated constructs
  - Expected CloudFormation output
  - Validation failure on unmet preconditions
  - Deferred precondition setting
  - Singleton provider sharing
  - Provider sharing with equivalent L2 property
  - Retrospective application to L2
- Always use `.with()` in tests, not `mixin.applyTo()` directly
- Include an integration test mirroring the L2 test but using `CfnResource` with `.with(new mixin())`

### Mixin README Documentation

- You MUST include a `## Mixins` section in the service module's README documenting each mixin with a brief description and usage example showing both L1 and L2 application

---

## Static Type Check

- You MUST use `Symbol.for('@aws-cdk/aws-{service}.{Foo}')` and `Object.defineProperty` — not `instanceof`:
  ```ts
  public static isFoo(x: any): x is Foo {
    return x !== null && typeof x === 'object' && Symbol.for('@aws-cdk/aws-{service}.{Foo}') in x;
  }
  ```

---

## Abstract Base Class

- You SHOULD implement an abstract `FooBase` for each resource that implements the full construct interface with resource attributes as abstract properties
- Keep it internal (not exported)
- Use it to implement `from{Attribute}` import methods via ad-hoc local classes

---

## Import Method Implementation

- You MUST validate that input does not contain unresolved tokens (via `Token.isUnresolved`) before parsing in `from*` methods
- When implementing `fromLookup` methods via context providers, prefer `fromResourceAttributes()` over `fromResourceName()` to avoid reconstructing ARNs with the wrong environment

---

## Grants

### Grants Class Pattern

- You MUST implement grant methods in a standalone Grants class (e.g., `TopicGrants`) with a `static from{Resource}()` factory accepting the reference interface
- Expose as a `grants` property on the construct:
  ```ts
  // In BucketGrants
  public static fromBucket(bucket: IBucketRef): BucketGrants { ... }

  // On Bucket
  public get grants() { return BucketGrants.fromBucket(this); }
  ```
- You MUST NOT add new grant methods directly on resource interfaces — existing ones are retained for backward compatibility only

### `grants.json` Auto-Generation

- You SHOULD use the `grants.json` file at the module root to auto-generate Grants classes (see `aws-sqs/grants.json` for example)
- Specify: `isEncrypted` (KMS key support), `hasResourcePolicy` (resource policy statements), `keyActions` (KMS key permissions), `arnFormat` (specific ARN patterns)
- You MUST implement manually when grant logic requires combining multiple `Grant` instances or additional parameters

### Grants Implementation Details

- You MUST ensure unique SIDs when the same grant method may be called multiple times (include target identifier)
- You MUST preserve all statement properties (conditions, effect, principals) when converting PolicyStatements to grants
- You SHOULD sort IAM action lists lexicographically

---

## CloudWatch Metrics

- Metric name strings MUST exactly match official AWS metric names (case-sensitive) and be placed at the correct resource scope
- Default statistics SHOULD follow metric type conventions: Count→Sum, Latency→Average, Gauge→Average
- Method names SHOULD be user-friendly when official acronyms are obscure

---

## CloudWatch Events

- Each `onXxx` method returns a `cloudwatch.EventRule`

---

## IAM Integration

### Role Integration

- Set `grantPrincipal` to the role or `ImportedResourcePrincipal`
- `addToRolePolicy(statement)` MUST no-op with a permission notice for unowned constructs

### Resource Policy Integration

- Encapsulate the resource-specific mechanism behind the `addToResourcePolicy` uniform API
- Add a permission notice for unowned resources where CloudFormation cannot add policies independently

---

## Integration Pattern

- Implement integration interfaces in a single secondary module named `aws-{service}-{integration}`

---

## Stateful/Stateless & Removal Policy

- Apply removal policy to the underlying CFN resource via `resource.applyRemovalPolicy(props.removalPolicy)`

---

## L1/L2 Mapping

- You MUST verify L2-to-L1 property type compatibility before adding L2 props
- You MUST NOT expose L2 props that cannot render to the underlying CFN resource
- Private helpers SHOULD return L2 types — only the final rendering step references L1 types
- When fixing replacement issues, you MUST identify ALL replacement-triggering properties
- You MUST NOT override explicit user prop values when setting conditional defaults — always check `props.value === undefined` before applying a default. User-provided values take precedence unconditionally
- You MUST verify the target module doesn't already depend on the current module before adding cross-module imports — circular dependencies cause build failures and are not caught until compile time

### Resource Name Generation

- You MUST use `this.physicalName` (via `ResourceProps.physicalName`) and `this.getResourceNameAttribute()` to wire resource names — do not use `Lazy.string`
- You MUST NOT use resource attributes (Tokens) in hash calculations for physical names

---

## Type-Safe Units

- You MUST use the built-in `Size` (`core/lib/size.ts`) and `Duration` (`core/lib/duration.ts`) classes instead of manual arithmetic — use static factories to create values (e.g., `Size.mebibytes(512)`, `Duration.minutes(5)`) and conversion methods to extract them (e.g., `size.toBytes()`, `duration.toSeconds()`)

---

## Warning & Error ID Stability

- Warning and error IDs passed to `Annotations.addWarningV2()` are part of the public API contract
- Changing them is a breaking change because consumers may reference them for suppression or filtering

---

## Consistent Validation Across Service Types

- When adding validation for a feature that exists across multiple service types (e.g., timeout limits, name constraints), you MUST apply the same validation to ALL applicable types — inconsistent validation confuses users and creates silent correctness gaps
