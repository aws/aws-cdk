# Facades and Traits Design Guidelines

Facades are resource-specific standalone classes that provide integrations
between a resource and external consumers. Traits are service-agnostic contracts
that describe a capability any resource can have. Together, they enable
permission grants, metrics, reflections, and other cross-resource features to
work uniformly across L1, L2, and imported constructs.

For an overview of how Facades and Traits relate to Mixins, see the
[Design Guidelines](./DESIGN_GUIDELINES.md#mixins-facades-and-traits) and the
[design document](../design/mixins-facades-traits.md).

## Facades

Facades are resource-specific simplified interfaces that provide integrations
for a resource with external consumers. The defining characteristic is
directionality: a Facade serves an *external consumer*, not the target resource.
For example, `BucketGrants` exists to serve the grantee (a role that needs
access), not the bucket.

Key characteristics:

- **Standalone classes** — not part of the construct hierarchy.
- **Always specific to one resource type** — `BucketGrants`, not `Grants`.
- **Static factory method** — e.g., `BucketGrants.fromBucket(bucket)`.
- **Accept the resource reference interface** (`IBucketRef`) — enabling use with
  both L1 and L2 constructs and imported resources.
- **Exposed as properties on the construct interface** — for first-party Facades
  in `aws-cdk-lib`, e.g., `readonly grants: BucketGrants`. This provides
  convenient access on L2 constructs.
- **Non-mutating on the target** — a Facade reads the resource's ARN/id and
  emits IAM/policy resources elsewhere. Calling the factory method multiple
  times is safe.
- **Third-party extensible** — because they only depend on the resource
  reference interface, anyone can create Facades without modifying
  `aws-cdk-lib`. Third-party Facades are used via the static factory method
  directly (e.g., `MyCustomGrants.fromBucket(bucket)`) since they cannot be
  added to the construct interface.

### When to Use Facades

Facades are appropriate when:

- The feature serves an *external consumer*, not the target resource (e.g., IAM
  permissions serve the grantee, CloudWatch metrics serve the operator).
- The feature should work with both L1 and L2 constructs.
- The feature is not *about* the target resource's own behavior.
- The feature is specific to a particular resource type.

Facades are _not_ appropriate when:

- The feature modifies the target resource's own behavior or lifecycle (use a
  Mixin). For example, enabling versioning on a bucket is about the bucket, not
  an external consumer.
- The feature advertises a service-agnostic capability that many resources share
  (use a Trait interface, but a Facade may *consume* that Trait).

### Existing Facades

- **Grants** — IAM permission helpers. Handwritten or auto-generated from
  `grants.json`. Examples: `BucketGrants`, `TopicGrants`, `QueueGrants`,
  `TableGrants`, `KeyGrants`.
- **Reflections** — Derive state from the L1 construct tree using shared
  reflection helpers (`ConstructReflection`, `PropertyReflection`).
  Example: `BucketReflection`.

The same Facade pattern can be applied to other feature areas (metrics,
helpers, resource creation) as described in the
[Design Guidelines](./DESIGN_GUIDELINES.md#construct-interface).

### Naming

#### Class Names

Facade class names must be prefixed with the resource they target:

| Resource | Facade | ✓/✗ |
| --- | --- | --- |
| `CfnBucket` / `Bucket` | `BucketGrants` | ✓ |
| `CfnTopic` / `Topic` | `TopicGrants` | ✓ |
| `CfnBucket` / `Bucket` | `BucketReflection` | ✓ |
| `CfnBucket` / `Bucket` | `Grants` | ✗ |
| `CfnBucket` / `Bucket` | `S3Grants` | ✗ |

#### File Names

Facade source files are named `{resource}-{feature}.ts` in the service
module's `lib/` directory:

| Facade | File | ✓/✗ |
| --- | --- | --- |
| `BucketGrants` | `lib/bucket-grants.ts` | ✓ |
| `BucketReflection` | `lib/bucket-reflection.ts` | ✓ |
| `BucketGrants` | `lib/grants.ts` | ✗ |
| `BucketGrants` | `lib/mixins/bucket-grants.ts` | ✗ |

### Project Structure

Facades live alongside their resource in the service module's `lib/` directory.
Grants classes that are auto-generated from `grants.json` are placed in a
generated file. Trait factory registrations live in
`lib/private/default-traits.ts`.

```text
aws-cdk-lib/
  aws-s3/
    lib/
      bucket-grants.ts         # BucketGrants (handwritten, complex logic)
      bucket-reflection.ts     # BucketReflection
      bucket.ts                # Bucket L2 construct
      index.ts                 # barrel export
      private/
        default-traits.ts      # Trait factory registrations for S3
  aws-sns/
    grants.json                # auto-generation input
    lib/
      sns-grants.generated.ts  # TopicGrants (generated, simple logic)
```

### Implementation Pattern

Every Facade follows the same structural pattern:

1. A **static factory method** accepting `IFooRef` (the minimal reference
   interface with identifiers like ARN and name)
2. A **private constructor** storing the resource reference and any discovered
   traits, if applicable
3. **Public methods** serving external consumers

```ts
export class MyResourceFacade {
  public static fromMyResource(resource: IMyResourceRef): MyResourceFacade {
    return new MyResourceFacade(resource);
  }

  private constructor(
    private readonly resource: IMyResourceRef,
  ) {}

  public read(grantee: IGrantable): Grant {
    // Implementation serves the external consumer (grantee),
    // not the target resource
  }
}
```

For grant-specific implementation details (IAM action selection, resource ARN
scoping, `grants.json` auto-generation, KMS key permissions), see the
[Design Guidelines — Grants](./DESIGN_GUIDELINES.md#grants).

### Exposing Facades on the Construct Interface

Facades are exposed as readonly properties on the construct interface:

```ts
export interface IChannel extends IResource, IChannelRef {
  /** Grants IAM resource policy to the role used to write to MediaPackage V2 Channel */
  readonly grants: ChannelGrants;
}
```

The L2 base class instantiates the Facade:

```ts
export abstract class ChannelBase extends Resource implements IChannel {
  public readonly grants: ChannelGrants = ChannelGrants.fromChannel(this);
}
```

For backward compatibility, existing `grantRead()`, `grantWrite()` etc.
methods on L2 constructs remain but must delegate to the Facade internally.
New grant methods must not be added directly on resource interfaces.

### Enforced Rules (awslint)

| Rule | Description |
| --- | --- |
| `no-grants` | Grant methods (`grantXxx()`) must not be added directly to resource interfaces; use a companion `{Resource}Grants` class instead. |

## Traits

Traits are service-agnostic contracts that describe a capability any resource
can have. They enable Facades to discover capabilities of resources without
requiring a full L2 implementation. A Trait consists of:

1. A **trait interface** that describes a capability (e.g.,
   `IResourceWithPolicyV2` describes "this resource has a resource policy").
2. A **trait factory** that wraps an L1 resource into an object implementing the
   trait interface (e.g., `IResourcePolicyFactory` produces
   `IResourceWithPolicyV2`).

Trait factories are registered per CloudFormation resource type in a static
registry. When a Facade encounters a resource, it looks up the registry to
discover capabilities.

### When to Use Traits

Traits are appropriate when:

- A resource has a capability that Facades need to discover dynamically (e.g.,
  "this resource has a resource policy", "this resource is encrypted with a KMS
  key").
- You are building a Facade that needs to work with L1 constructs and must
  discover capabilities at runtime.
- You are adding support for a new CloudFormation resource type to an existing
  Facade (register a factory for the new type).
- The capability is shared across multiple resource types (service-agnostic).

Traits are _not_ appropriate when:

- The capability is specific to a single Facade and does not need to be
  discovered dynamically (implement it directly in the Facade).
- The feature modifies the resource itself (use a Mixin).
- The feature is user-facing (Traits are rarely user-facing — they are
  implementation details consumed by Facades).

### Current Traits

| Trait Interface | Factory Interface | Registry | Purpose |
| --- | --- | --- | --- |
| `IResourceWithPolicyV2` | `IResourcePolicyFactory` | `ResourceWithPolicies` | Resource policy manipulation |
| `IEncryptedResource` | `IEncryptedResourceFactory` | `EncryptedResources` | KMS key grants |

### Registering a Trait

Each trait has a two-layer registry architecture:

- **`DefaultPolicyFactories` / `DefaultEncryptedResourceFactories`** — a global
  static map of CloudFormation resource type → factory instance. This is the
  *default* set of factories shipped with `aws-cdk-lib`. Service modules
  register their factories here at module load time via `.set()`. This is where
  library authors add new factory registrations.
- **`ResourceWithPolicies` / `EncryptedResources`** — the *runtime lookup*
  class that Facades call (e.g., `ResourceWithPolicies.of(resource)`). It first
  walks up the construct tree looking for scope-specific overrides (registered
  via `.register()`), then falls back to the defaults above. This is what
  Facades consume — you do not register here unless you are a CDK user
  overriding a default.

In short: **library authors register in `DefaultPolicyFactories`** (via
`.set()`); **Facades consume via `ResourceWithPolicies`** (via `.of()`);
**CDK users override via `ResourceWithPolicies.register()`** for
scope-specific customization.

To add support for a new CloudFormation resource type to an existing trait,
implement the factory and register it in the service module's
`lib/private/default-traits.ts`:

```ts
class MyResourcePolicyFactory implements IResourcePolicyFactory {
  forResource(resource: CfnResource): IResourceWithPolicyV2 {
    if (!CfnMyResource.isCfnMyResource(resource)) {
      throw new Error(`Expected CfnMyResource, got ${resource.node.path}`);
    }
    return new CfnMyResourceWithPolicy(resource);
  }
}

class CfnMyResourceWithPolicy implements IResourceWithPolicyV2 {
  public readonly env: ResourceEnvironment;

  constructor(private readonly resource: CfnMyResource) {
    this.env = resource.env;
  }

  public addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult {
    // Create or append to the resource's policy
    return { statementAdded: true, policyDependable: this.resource };
  }
}

// Register as default factory — runs at module load time
DefaultPolicyFactories.set('AWS::MyService::MyResource', new MyResourcePolicyFactory());
```

After registration, any Facade that uses `ResourceWithPolicies.of(resource)`
automatically discovers and uses the factory when it encounters a `CfnResource`
of that type.

CDK users can also override or extend the default trait factories for
their own applications using `ResourceWithPolicies.register()`:

```ts
ResourceWithPolicies.register(scope, 'AWS::MyService::MyResource', new CustomFactory());
```

This allows users to provide trait support for resource types that CDK does not
yet cover, or to customize behavior for a specific scope.

### Consuming Traits in Facades

Facades use the registry classes to discover Traits:

```ts
export class MyResourceGrants {
  public static fromMyResource(resource: IMyResourceRef): MyResourceGrants {
    return new MyResourceGrants(
      resource,
      EncryptedResources.of(resource),
      ResourceWithPolicies.of(resource),
    );
  }

  private constructor(
    private readonly resource: IMyResourceRef,
    private readonly encryptedResource?: IEncryptedResource,
    private readonly policyResource?: IResourceWithPolicyV2,
  ) {}

  public read(grantee: IGrantable): Grant {
    const result = this.policyResource
      ? Grant.addToPrincipalOrResource({ /* ... */ resource: this.policyResource })
      : Grant.addToPrincipal({ /* ... */ });

    this.encryptedResource?.grantOnKey(grantee, 'kms:Decrypt');
    return result;
  }
}
```

### Trait Interface Requirements

When implementing trait interfaces, ensure:

- `env: ResourceEnvironment` is always provided (required by
  `IEnvironmentAware`).
- Factory `forResource()` must validate the resource type and throw if it
  does not match.

## Testing

Every Facade and Trait factory should have unit tests covering:

- Works with L1 constructs (via the static factory method).
- Works with L2 constructs (via the construct interface property).
- Works with imported (unowned) resources.

Integration tests for the service module should cover the Facade functionality
as part of broader resource deployment verification.

## User-Facing API

Users interact with Facades through the construct interface or the static
factory method:

```ts
// Via L2 construct interface
const bucket = new s3.Bucket(this, 'Bucket');
bucket.grants.read(role);

// Via static factory on L1 construct
const cfnBucket = new s3.CfnBucket(this, 'Bucket');
s3.BucketGrants.fromBucket(cfnBucket).read(role);
```

Combining Facades with Mixins for a full L2-like experience on L1 constructs:

```ts
// Configure with Mixins (inward-looking)
const bucket = new s3.CfnBucket(this, 'Bucket')
  .with(new s3.mixins.BucketVersioning())
  .with(new s3.mixins.BucketBlockPublicAccess());

// Grant access with a Facade (outward-looking)
s3.BucketGrants.fromBucket(bucket).read(role);
```

## README Documentation

Each service module with Facades should document them in the README with: 

- A brief description of what the Facade provides.
- A usage code example showing both L1 and L2 usage.
