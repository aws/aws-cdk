# The Box API — Lazy Values with Stack Trace Capture

## Status

Accepted

## Context

The CDK uses the `Lazy` API to defer value computation until synthesis time. This is essential for L2 constructs that need to accumulate state after construction (e.g., adding policy statements to a role, adding ingress rules to a security group) and feed that state into L1 (CloudFormation) resource properties.

While `Lazy` works well for deferred evaluation, it has a significant limitation: **it cannot capture meaningful stack traces**. A `Lazy` token captures its stack trace at the point where the `Lazy.string(...)` / `Lazy.list(...)` call is made — typically inside the L2 constructor. This means that when a user later calls a method like `role.addToPolicy(...)`, the stack trace associated with the resulting CloudFormation property points back to the L2 constructor, not to the user's code that actually caused the change. This makes it very difficult to diagnose which line of user code is responsible for a particular property value in the synthesized template.

We need a mechanism that:

1. Defers value resolution like `Lazy` does.
2. Captures stack traces at the point where values are **mutated**, not where the deferred value is created.
3. Propagates those stack traces through derived/computed values so that a single mutation can be traced across all CloudFormation properties it affects.

## Decision

We introduce the **Box API** (`Box.fromValue`, `Box.fromArray`, `Box.combine`) as a replacement for `Lazy` in L2 constructs. Boxes are mutable, observable containers that implement `IResolvable` (and thus participate in CDK token resolution) while capturing stack traces at the correct points in time.

### Box Types

- **`Box.fromValue<A>(value)`** — A read/write box holding a single value. Calling `set(newValue)` replaces the value and captures a new stack trace at the call site.
- **`Box.fromArray<A>(values)`** — An array box. Supports `push(item)` in addition to `set(newArray)`. Each `push` captures its own stack trace.
- **`Box.combine(boxes, fn)`** — A read-only derived box that combines multiple boxes through a function. It collects and merges stack traces from all source boxes, ordered by a global sequence number.
- **`box.derive(fn)`** — A read-only computed box that transforms the value of a single source box. It inherits the source's stack traces.

### How Boxes Replace Lazy

Where an L2 previously used `Lazy`, it now creates a `Box` and passes it into the L1 via `Token.asString(box)`, `Token.asList(box)`, or `Token.asNumber(box.derive(...))`. Because `Box` implements `IResolvable`, the CDK token system resolves it at synthesis time just like a `Lazy` token.

The key difference is that when the L2 exposes a mutating method (e.g., `addStatement`, `addIngressRule`), the mutation goes through `box.set(...)` or `box.push(...)`, which captures the stack trace **at that call site** — pointing directly at the user's code.

**Before (Lazy):**

```ts
class MyL2 extends Resource {
  private readonly _statements: PolicyStatement[] = [];

  constructor(scope: Construct, id: string) {
    super(scope, id);
    new CfnResource(this, 'Resource', {
      // Stack trace captured HERE (constructor), not useful
      policyDocument: Lazy.any({ produce: () => this.renderPolicy() }),
    });
  }

  addStatement(stmt: PolicyStatement) {
    this._statements.push(stmt); // No stack trace captured
  }
}
```

**After (Box):**

```ts
@noBoxStackTraces
class MyL2 extends Resource {
  private readonly _statements: IArrayBox<PolicyStatement>;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this._statements = Box.fromArray([]);

    new CfnResource(this, 'Resource', {
      policyDocument: Token.asAny(this._statements.derive(stmts => this.renderPolicy(stmts))),
    });
  }

  addStatement(stmt: PolicyStatement) {
    this._statements.push(stmt); // Stack trace captured HERE — user's code
  }
}
```

### Stack Trace Collection Is Conditional

Stack traces are only captured when `CDK_DEBUG` is set to a truthy value (`1`, `on`, `true`). This avoids the performance cost of `Error.captureStackTrace` in production usage. When debug mode is off, boxes still function correctly as deferred values — they just don't record traces.

### The `@noBoxStackTraces` Decorator

We do **not** want to capture stack traces for box mutations that happen inside L2 constructors. The constructor is internal CDK code — it sets up initial/default values that are not interesting to the user. If we captured traces there, the metadata would be polluted with stack traces pointing at CDK internals rather than user code.

The `@noBoxStackTraces` class decorator solves this by wrapping the constructor to disable box stack trace collection for its duration:

```ts
@noBoxStackTraces
class MyL2 extends Resource {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // IBox.set() / IBox.push() calls here do NOT capture stack traces
    this.myBox = Box.fromValue('default');
    this.myBox.set('initial value'); // No trace captured
  }

  // Box mutations outside the constructor DO capture stack traces
  updateValue(v: string) {
    this.myBox.set(v); // Trace captured here
  }
}
```

Internally, the decorator calls `Box.disableStackTraceCollection()` before `super(...)` and `Box.enableStackTraceCollection()` in a `finally` block after construction completes. All L2 constructs that use Boxes should apply this decorator.

### Property Assignment Metadata: Connecting Boxes to CloudFormation Properties

When `CDK_DEBUG` is enabled, the CDK emits `aws:cdk:propertyAssignment` metadata entries on L1 construct nodes. Each entry contains:

- `propertyName`: The **CloudFormation** property name (e.g., `PolicyDocument`, not `policyDocument`).
- `stackTrace`: The captured stack trace from the box mutation.

This metadata allows tooling (e.g., the CDK CLI diff, IDE integrations) to show the user exactly which line of their code caused a particular CloudFormation property to change.

#### Mechanism: `PropertyAssignmentMetadataWriter`

The metadata is written during the `prepareApp` phase, which runs after all user code has executed but before final synthesis. The mechanism works as follows:

1. **During `prepareApp`**, for each `CfnResource` in the construct tree, the framework calls `writePropertyAssignmentMetadataForConstruct`. This resolves the resource's CloudFormation template output (`_toCloudFormation()`) using a special `ITokenResolver` implementation: `PropertyAssignmentMetadataWriter`.

2. **`PropertyAssignmentMetadataWriter`** extends `DefaultTokenResolver` and overrides `resolveToken`. When it encounters a token during resolution, it checks:
   - Is the token a `Box`? (via `Box.isBox(t)`)
   - Is the token at a document path matching `Resources/<logicalId>/Properties/<propertyName>`?
   - Can the CDK property name (camelCase) be mapped to a CloudFormation property name (PascalCase)?

   If all conditions are met, it calls `t.getStackTraces()` on the box and emits an `aws:cdk:propertyAssignment` metadata entry for each stack trace.

3. **Deduplication**: The writer tracks seen document paths to avoid emitting duplicate metadata if the same object is resolved multiple times.

#### CDK-to-CloudFormation Property Name Mapping

To emit the correct CloudFormation property name in metadata, each generated L1 class includes a `cfnPropertyNames` lookup table that maps camelCase CDK property names to PascalCase CloudFormation names:

```ts
// In generated L1 code (e.g., dynamodb.generated.ts)
class CfnTable extends CfnResource {
  protected readonly cfnPropertyNames: Record<string, string> = {
    attributeDefinitions: "AttributeDefinitions",
    billingMode: "BillingMode",
    tableName: "TableName",
    // ...
  };
}
```

The base `CfnResource` class exposes a `cfnPropertyName(cdkName)` method that looks up this table. During `prepareApp`, a `IPropertyNameLookupTable` adapter is created for each `CfnResource` and passed to the `PropertyAssignmentMetadataWriter`, which uses it to translate the document path's property name segment into the CloudFormation name.

#### Direct Property Setters on L1s: `traceProperty`

For cases where user code (or L2 code) directly assigns to an L1 property setter (e.g., `cfnResource.billingMode = 'PAY_PER_REQUEST'`), the generated L1 setters call `traceProperty(this.node, 'BillingMode')`. This immediately records an `aws:cdk:propertyAssignment` metadata entry with a stack trace captured at the setter call site. This complements the box-based mechanism — `traceProperty` handles direct L1 mutations, while boxes handle deferred L2 mutations.

```ts
// In generated L1 code
public set billingMode(value: string | undefined) {
  traceProperty(this.node, "BillingMode");
  this._billingMode = value;
}
```

### Data Flow Summary

```
User code                    L2 construct                 L1 construct              Synthesis
─────────                    ────────────                 ────────────              ─────────

myL2.addItem(x)  ──────►  arrayBox.push(x)                                        
                           [captures stack trace]                                   
                                    │                                               
                                    │  (wired at construction 
                                    │    via Token.asList)     
                                    ▼                                               
                              Token.asList(arrayBox)  ──►  cfnProps.items  ──►  _toCloudFormation()                                                                                       
                                                                                          │                 
                                                                                          ▼  (during prepareApp)
                                                                             PropertyAssignmentMetadataWriter
                                                                                   resolveToken()           
                                                                                          │                 
                                                                                          ▼                 
                                                                             aws:cdk:propertyAssignment     
                                                                             {                              
                                                                               propertyName: "Items",       
                                                                               stackTrace: [user's code]    
                                                                             }                              
         ```

## Consequences

- L2 constructs that use Boxes provide accurate stack traces pointing to user code, improving debuggability.
- All L2 constructs using Boxes must apply the `@noBoxStackTraces` decorator to avoid capturing irrelevant constructor traces.
- The `Lazy` API remains available and is not deprecated. Existing L2s continue to work. New L2s and migrated L2s should prefer Boxes.
- Stack trace capture has zero cost when `CDK_DEBUG` is not set.
- The `cfnPropertyNames` table in generated L1 code and the `traceProperty` calls in L1 setters are generated by the code generator and require no manual maintenance.
